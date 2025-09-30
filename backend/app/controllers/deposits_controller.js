import errorHandler from '#exceptions/error_handler';
import { createDepositSchema } from '#validators/deposit';
import Transaction from '#models/transaction';
import DepositGateway from '#models/deposit_gateway';
import User from '#models/user';
import Currency from '#models/currency';
import processPayment from '#services/process_payments';
import { addBalance } from '#services/wallet_service';
import formatPrecision from '../utils/format_precision.js';
import exportService from '#services/export_service';
import { depositCalculation } from '#services/fees_calculation_service';
import notification_service from '#services/notification_service';
import referralService from '#services/referral_service';
export default class DepositsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await auth
                .user.related('transactions')
                .query()
                .where('type', 'deposit')
                .preload('user')
                .orderBy('id', 'desc')
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = Transaction.query()
                .where('type', 'deposit')
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('merchant');
                query.preload('agent');
            })
                .apply((scopes) => scopes.filtration({
                toSearch: input.search,
                status: input.status,
                date: input.date,
                bookmark: input.bookmark,
                method: input.method,
            }))
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async exportAdminCsv(ctx) {
        await exportService.exportData(ctx, 'admin_deposit');
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id, type: 'deposit' })
                .preload('user', (query) => query.preload('customer'))
                .first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Detail Error');
        }
    }
    async previewDeposit(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { amount } = request.qs();
            if (!amount) {
                return response.badRequest({
                    success: false,
                    message: 'Not enough data!',
                });
            }
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .preload('agent')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            const calculationData = await depositCalculation(formatPrecision(amount), user);
            if (!calculationData) {
                return response.badRequest({
                    success: false,
                    message: 'Something went wrong. Please contact with support',
                });
            }
            return response.json(calculationData);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Preview Error');
        }
    }
    async createDeposit(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { method, amount, currencyCode, country } = await request.validateUsing(createDepositSchema);
            const currency = await Currency.findBy('code', currencyCode.toUpperCase());
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            if (amount > currency.maxAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Max:) ${currency?.maxAmount}`,
                });
            }
            if (amount < currency.minAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Min:) ${currency?.minAmount}`,
                });
            }
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .preload('agent')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            if (!user.permission.deposit) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to deposit money',
                });
            }
            if (!user.kycStatus) {
                if (currency.kycLimit !== null && amount > currency.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to deposit more than ${currency.kycLimit} ${currency.code}`,
                    });
                }
            }
            const isBlackListed = await user
                .related('blackListedGateways')
                .query()
                .where({ value: method })
                .first();
            if (isBlackListed) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to use this deposit gateway. Please contact support.',
                });
            }
            const gateway = await DepositGateway.findBy({ active: true, value: method });
            if (!gateway) {
                return response.notFound({
                    success: false,
                    message: 'This payment method is not valid or inactive.',
                });
            }
            if (!gateway.allowedCountries.includes('*')) {
                if (!gateway.allowedCountries.includes(country)) {
                    return response.badRequest({
                        success: false,
                        message: 'This payment method is not valid for this country.',
                    });
                }
            }
            if (!gateway.allowedCurrencies.includes(currencyCode)) {
                return response.badRequest({
                    success: false,
                    message: 'This payment method is not valid for this currency.',
                });
            }
            const calculationData = await depositCalculation(amount, user);
            if (!calculationData) {
                return response.badRequest({
                    success: false,
                    message: 'Something went wrong. Please contact with support',
                });
            }
            const deposit = await user.related('transactions').create({
                type: 'deposit',
                from: { label: gateway?.name },
                to: { label: user.customer.name, email: user.email },
                amount: formatPrecision(amount + calculationData.fee),
                fee: formatPrecision(calculationData.fee),
                total: formatPrecision(calculationData.totalAmount),
                metaData: { country, currency: currencyCode },
                method,
                status: 'pending',
            });
            await deposit.load('user');
            await deposit.user.load('customer');
            const returnObj = await processPayment(deposit, gateway);
            if (currency.notificationLimit !== null && deposit.amount >= currency.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(deposit.id);
            }
            return response.json(returnObj);
        }
        catch (error) {
            errorHandler(error, ctx, 'Create Deposit Error');
        }
    }
    async acceptDeposit(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const deposit = await Transaction.query()
                .where({ id, type: 'deposit' })
                .preload('user')
                .first();
            if (!deposit) {
                return response.notFound({ success: false, message: 'Deposit data not found' });
            }
            if (deposit.status !== 'pending') {
                return response.badRequest({ success: false, message: 'Cannot modify finished payment' });
            }
            const metaData = JSON.parse(deposit.metaData);
            await addBalance(deposit.amount, metaData.currency, deposit.userId);
            deposit.status = 'completed';
            await deposit.save();
            await notification_service.sendDepositCompletedNotification(deposit);
            await referralService(deposit.user, 'first_deposit');
            return response.created({ success: true, message: 'Deposit accepted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Accept Deposit Error');
        }
    }
    async declineDeposit(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const deposit = await Transaction.query()
                .where({ id, type: 'deposit' })
                .preload('user')
                .first();
            if (!deposit) {
                return response.notFound({ success: false, message: 'Deposit data not found' });
            }
            if (deposit.status !== 'pending') {
                return response.badRequest({ success: false, message: 'Cannot modify finished payment' });
            }
            deposit.status = 'failed';
            await deposit.save();
            await notification_service.sendDepositFailedNotification(deposit);
            return response.created({ success: true, message: 'Deposit declined successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Declined Deposit Error');
        }
    }
}
//# sourceMappingURL=deposits_controller.js.map