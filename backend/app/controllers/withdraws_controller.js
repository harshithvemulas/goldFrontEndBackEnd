import errorHandler from '#exceptions/error_handler';
import Currency from '#models/currency';
import Transaction from '#models/transaction';
import User from '#models/user';
import Wallet from '#models/wallet';
import WithdrawMethod from '#models/withdraw_method';
import { createWithdrawSchema } from '#validators/withdraw';
import processWithdraw from '#services/process_withdraws';
import { addBalance, removeBalance } from '#services/wallet_service';
import exportService from '#services/export_service';
import { withdrawCalculation } from '#services/fees_calculation_service';
import formatPrecision from '#utils/format_precision';
import Roles from '../enum/roles.js';
import notification_service from '#services/notification_service';
export default class WithdrawsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await auth
                .user.related('transactions')
                .query()
                .where('type', 'withdraw')
                .preload('user')
                .orderBy('id', 'desc')
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async indexWithdrawMethods(ctx) {
        const { request, response } = ctx;
        try {
            const { country, currency } = request.qs();
            const data = await WithdrawMethod.query()
                .where('active', true)
                .if(currency, (query) => {
                query.andWhere('currencyCode', currency);
            })
                .orderBy('name', 'asc');
            const filteredData = data.filter((gateway) => {
                if (!country) {
                    return true;
                }
                if (gateway.countryCode === '*') {
                    return true;
                }
                return gateway.countryCode === country;
            });
            const serializeData = filteredData.map((ele) => ele.serialize({
                fields: {
                    omit: ['apiKey', 'secretKey', 'ex1', 'ex2'],
                },
            }));
            return response.json(serializeData);
        }
        catch (error) {
            errorHandler(error, ctx, 'index methods Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = Transaction.query()
                .where('type', 'withdraw')
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('merchant');
                query.preload('agent');
            })
                .apply((scopes) => scopes.filtration({
                fromSearch: input.search,
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
        await exportService.exportData(ctx, 'admin_withdraw');
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id, type: 'withdraw' })
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
    async previewWithdraw(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { method, amount } = request.qs();
            if (!method || !amount) {
                return response.badRequest({
                    success: false,
                    message: 'Not enough data!',
                });
            }
            const formatedAmount = formatPrecision(amount);
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .preload('agent')
                .preload('permission')
                .preload('kyc')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            const withdrawMethod = await WithdrawMethod.findBy({ active: true, value: method });
            if (!withdrawMethod) {
                return response.notFound({
                    success: false,
                    message: 'This method is not valid or inactive.',
                });
            }
            if (withdrawMethod.minAmount > formatedAmount) {
                return response.badRequest({
                    success: false,
                    message: `Minimum withdrawal is ${withdrawMethod.minAmount} ${withdrawMethod.currencyCode}`,
                });
            }
            if (withdrawMethod.maxAmount < formatedAmount) {
                return response.badRequest({
                    success: false,
                    message: `Maximum withdrawal is ${withdrawMethod.maxAmount} ${withdrawMethod.currencyCode}`,
                });
            }
            const calculationData = await withdrawCalculation(formatedAmount, user, withdrawMethod);
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
    async createWithdraw(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { method, amount, currencyCode, country, inputParams } = await request.validateUsing(createWithdrawSchema);
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .preload('agent')
                .preload('permission')
                .preload('kyc')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            if (!user.permission.withdraw) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to withdraw money',
                });
            }
            const isBlackListed = await user
                .related('blackListedMethods')
                .query()
                .where({ value: method })
                .first();
            if (isBlackListed) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to use this withdraw method. Please contact support.',
                });
            }
            const withdrawMethod = await WithdrawMethod.findBy({
                active: true,
                value: method,
                currencyCode: currencyCode.toLocaleUpperCase(),
            });
            if (!withdrawMethod) {
                return response.notFound({
                    success: false,
                    message: 'This method is not valid or inactive.',
                });
            }
            const calculationData = await withdrawCalculation(amount, user, withdrawMethod);
            if (!calculationData) {
                return response.badRequest({
                    success: false,
                    message: 'Something went wrong. Please contact with support',
                });
            }
            const { fee, chargedAmount, recievedAmount } = calculationData;
            if (withdrawMethod.minAmount > recievedAmount) {
                return response.badRequest({
                    success: false,
                    message: `Minimum withdrawal is ${withdrawMethod.minAmount} ${withdrawMethod.currencyCode}`,
                });
            }
            if (withdrawMethod.maxAmount < recievedAmount) {
                return response.badRequest({
                    success: false,
                    message: `Maximum withdrawal is ${withdrawMethod.minAmount} ${withdrawMethod.currencyCode}`,
                });
            }
            const currency = await Currency.findBy('code', currencyCode.toUpperCase());
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            if (recievedAmount > currency.maxAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Max:) ${currency?.maxAmount}`,
                });
            }
            if (recievedAmount < currency.minAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Min:) ${currency?.minAmount}`,
                });
            }
            if (!user.kycStatus) {
                if (currency.kycLimit !== null && chargedAmount > currency.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to withdraw more than ${currency.kycLimit} ${currency.code}`,
                    });
                }
            }
            const wallet = await Wallet.findBy({ userId: user.id, currencyId: currency.id });
            if (!wallet || wallet.balance < chargedAmount) {
                return response.badRequest({ success: false, message: 'Insufficient balance' });
            }
            const withdraw = await user.related('transactions').create({
                type: 'withdraw',
                from: { label: user.customer.name, email: user.email },
                to: { label: withdrawMethod.name },
                amount: chargedAmount,
                fee: fee,
                total: recievedAmount,
                metaData: { country, currency: currencyCode, params: inputParams },
                method: withdrawMethod.name,
                status: 'pending',
            });
            await removeBalance(chargedAmount, currencyCode, user.id);
            if (currency.notificationLimit !== null && recievedAmount >= currency.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(withdraw.id);
            }
            await notification_service.sendAgentMerchantWithdrawNotification(user, recievedAmount, currency.code, withdraw.id);
            response.json({
                success: true,
                message: 'Withdraw request created successfully',
                data: withdraw,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Create Withdraw Error');
        }
    }
    async acceptWithdraw(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const withdraw = await Transaction.query()
                .where({ id, type: 'withdraw' })
                .preload('user')
                .first();
            if (!withdraw) {
                return response.notFound({ success: false, message: 'Withdraw data not found' });
            }
            if (withdraw.status !== 'pending') {
                return response.badRequest({ success: false, message: 'Cannot modify finished payment' });
            }
            const user = await User.query().where('id', withdraw.userId).firstOrFail();
            if (user.roleId === Roles.MERCHANT || user.roleId === Roles.AGENT) {
                await processWithdraw(withdraw);
            }
            else {
                withdraw.status = 'completed';
                await withdraw.save();
            }
            await notification_service.sendWithdrawCompletedNotification(withdraw);
            return response.created({ success: true, message: 'Withdraw accepted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Accept Withdraw Error');
        }
    }
    async declineWithdraw(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const withdraw = await Transaction.query()
                .where({ id, type: 'withdraw' })
                .preload('user')
                .first();
            if (!withdraw) {
                return response.notFound({ success: false, message: 'Withdraw data not found' });
            }
            if (withdraw.status !== 'pending') {
                return response.badRequest({ success: false, message: 'Cannot modify finished payment' });
            }
            const metaData = JSON.parse(withdraw.metaData);
            await addBalance(withdraw.amount, metaData.currency, withdraw.userId);
            withdraw.status = 'failed';
            await withdraw.save();
            await notification_service.sendWithdrawFailedNotification(withdraw);
            return response.created({ success: true, message: 'Withdraw declined successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Decline Withdraw Error');
        }
    }
}
//# sourceMappingURL=withdraws_controller.js.map