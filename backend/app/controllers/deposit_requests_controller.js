import errorHandler from '#exceptions/error_handler';
import Agent from '#models/agent';
import Transaction from '#models/transaction';
import { storeRequestByAgentSchema, storeRequestSchema } from '#validators/deposit_request';
import User from '#models/user';
import Currency from '#models/currency';
import formatPrecision from '../utils/format_precision.js';
import Setting from '#models/setting';
import exportService from '#services/export_service';
import exchangeCalculations from '#services/exchange_calculations';
import { depositRequestCalculation } from '#services/fees_calculation_service';
import notification_service from '#services/notification_service';
import referralService from '#services/referral_service';
import brandingService from '#services/branding_service';
export default class DepositRequestsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = auth
                .user.related('transactions')
                .query()
                .apply((scopes) => scopes.filtration({
                toSearch: input.search,
                status: input.status,
                type: input.type,
                date: input.date,
                bookmark: input.bookmark,
                method: input.method,
            }))
                .where('type', 'in', ['deposit_request', 'direct_deposit'])
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async exportCsv(ctx) {
        await exportService.exportData(ctx, 'deposit_request');
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id })
                .andWhere('type', 'in', ['deposit_request', 'direct_deposit'])
                .preload('user')
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
    async previewRequest(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { agentId, amount } = request.qs();
            if (!agentId || !amount) {
                return response.badRequest({
                    success: false,
                    message: 'Not enough data!',
                });
            }
            const agent = await Agent.query()
                .where({ agentId })
                .preload('user', (query) => query.preload('customer'))
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'Customer data not found' });
            }
            const calculationData = await depositRequestCalculation(formatPrecision(amount), user, agent);
            if (!calculationData) {
                return response.badRequest({
                    success: false,
                    message: 'Something went wrong. Please contact with support',
                });
            }
            return response.json(calculationData);
        }
        catch (error) {
            errorHandler(error, ctx, 'Preview Request Error');
        }
    }
    async storeRequest(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { agentId, method, inputValue, amount, currencyCode, countryCode } = await request.validateUsing(storeRequestSchema);
            const agent = await Agent.query()
                .where({ agentId })
                .preload('user', (query) => query.preload('customer'))
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            if (!agent.user.status) {
                return response.badRequest({ success: false, message: 'Agent is inactive' });
            }
            if (agent.isSuspend || agent.status !== 'verified') {
                return response.badRequest({
                    success: false,
                    message: 'This agent is not at service',
                });
            }
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'Customer data not found' });
            }
            if (!user.permission.deposit) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to deposit money',
                });
            }
            const currency = await Currency.findBy('code', currencyCode.toUpperCase());
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
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
            if (currency.maxAmount !== null && amount > currency.maxAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Max:) ${currency?.maxAmount}`,
                });
            }
            if (currency.minAmount !== null && amount < currency.minAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Min:) ${currency?.minAmount}`,
                });
            }
            const calculationData = await depositRequestCalculation(amount, user, agent);
            if (!calculationData) {
                return response.badRequest({
                    success: false,
                    message: 'Something went wrong. Please contact with support',
                });
            }
            const fromData = {
                image: agent.user.customer.profileImage ?? '',
                label: agent.name ?? '',
                email: agent.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const toData = {
                image: user.customer.profileImage ?? '',
                label: user.customer.name ?? '',
                email: user.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const depositData = await auth.user.related('transactions').create({
                type: 'deposit',
                from: fromData,
                to: toData,
                amount: formatPrecision(calculationData.amount),
                fee: formatPrecision(calculationData.fee),
                total: formatPrecision(calculationData.totalAmount),
                metaData: {
                    country: countryCode,
                    currency: currencyCode,
                    agentMethod: method,
                    value: inputValue,
                },
                status: 'pending',
                method: 'agent',
            });
            const requestData = await agent.user.related('transactions').create({
                type: 'deposit_request',
                from: fromData,
                to: toData,
                amount: formatPrecision(calculationData.amount),
                fee: formatPrecision(calculationData.fee),
                total: formatPrecision(calculationData.totalAmount),
                metaData: {
                    country: countryCode,
                    currency: currencyCode,
                    agentMethod: method,
                    value: inputValue,
                    trxId: depositData.trxId,
                },
                status: 'pending',
                method,
            });
            await notification_service.sendDepositRequestNotification(requestData.id);
            if (currency.notificationLimit !== null && depositData.amount >= currency.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(depositData.id);
            }
            return response.created({
                success: true,
                message: 'Deposit Request created successfully',
                data: depositData,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
    async previewRequestByAgent(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { email, amount } = request.qs();
            if (!email || !amount) {
                return response.badRequest({
                    success: false,
                    message: 'Not enough data!',
                });
            }
            const agent = await Agent.query()
                .where('userId', auth.user.id)
                .preload('user', (query) => query.preload('customer'))
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            const user = await User.query()
                .where('email', email)
                .preload('customer')
                .preload('merchant')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'Customer data not found' });
            }
            const calculationData = await depositRequestCalculation(formatPrecision(amount), user, agent);
            if (!calculationData) {
                return response.badRequest({
                    success: false,
                    message: 'Something went wrong. Please contact with support',
                });
            }
            return response.json(calculationData);
        }
        catch (error) {
            errorHandler(error, ctx, 'Preview Request Error');
        }
    }
    async storeRequestByAgent(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { email, amount, currencyCode, countryCode } = await request.validateUsing(storeRequestByAgentSchema);
            const branding = await brandingService();
            const agent = await Agent.query()
                .where('userId', auth.user.id)
                .preload('user', (query) => query.preload('customer'))
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            const user = await User.query()
                .where('email', email)
                .preload('customer')
                .preload('merchant')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'Customer data not found' });
            }
            if (!user.status) {
                return response.badRequest({
                    success: false,
                    message: 'User is inactive',
                });
            }
            if (user.roleId === 4) {
                return response.badRequest({
                    success: false,
                    message: 'Agent is not permitted for deposit',
                });
            }
            if (!user.permission.deposit) {
                return response.badRequest({
                    success: false,
                    message: 'User is not allowed to deposit money',
                });
            }
            const currency = await Currency.findBy('code', currencyCode.toUpperCase());
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
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
            const depositCommissionSetting = await Setting.findBy({
                key: 'deposit_commission',
                value1: 'on',
            });
            let commissionAmount = amount;
            if (currency.code !== branding.defaultCurrency) {
                const calculationsData = await exchangeCalculations(currency.code, branding.defaultCurrency, amount, agent.userId);
                if (!calculationsData) {
                    return response.badRequest({
                        success: false,
                        message: 'Something went wrong. Please contact support or try again later.',
                    });
                }
                commissionAmount = calculationsData.amountTo;
            }
            const calculationData = await depositRequestCalculation(amount, user, agent);
            if (!calculationData) {
                return response.badRequest({
                    success: false,
                    message: 'Something went wrong. Please contact with support',
                });
            }
            const agentWallet = await auth
                .user.related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!agentWallet) {
                return response.badRequest({
                    success: false,
                    message: `Agent ${currency.code} wallet not added yet`,
                });
            }
            if (agentWallet.balance < amount) {
                return response.badRequest({
                    success: false,
                    message: 'Balance insufficiant',
                });
            }
            let customerWallet = await user
                .related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!customerWallet) {
                customerWallet = await user.related('wallets').create({
                    balance: 0,
                    default: false,
                    currencyId: currency.id,
                    dailyTransferAmount: currency.dailyTransferAmount,
                });
            }
            const fromData = {
                image: agent.user.customer.profileImage ?? '',
                label: agent.name ?? '',
                email: agent.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const toData = {
                image: user.customer.profileImage ?? '',
                label: user.customer.name ?? '',
                email: user.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const depositData = await user.related('transactions').create({
                type: 'deposit',
                from: fromData,
                to: toData,
                amount: formatPrecision(calculationData.amount),
                fee: formatPrecision(calculationData.fee),
                total: formatPrecision(calculationData.totalAmount),
                metaData: {
                    country: countryCode,
                    currency: currencyCode,
                    agentMethod: 'hand To hand',
                    value: '',
                },
                status: 'completed',
                method: 'agent',
            });
            const requestData = await agent.user.related('transactions').create({
                type: 'direct_deposit',
                from: fromData,
                to: toData,
                amount: formatPrecision(calculationData.amount),
                fee: formatPrecision(calculationData.fee),
                total: formatPrecision(calculationData.totalAmount),
                metaData: {
                    country: countryCode,
                    currency: currencyCode,
                    agentMethod: 'hand to hand',
                    value: '',
                    trxId: depositData.trxId,
                },
                status: 'completed',
                method: 'hand to hand',
            });
            agentWallet.balance = agentWallet.balance - amount;
            await agentWallet.save();
            customerWallet.balance = customerWallet.balance + calculationData.totalAmount;
            await customerWallet.save();
            const commission = commissionAmount *
                ((agent.depositCommission !== null
                    ? agent.depositCommission
                    : depositCommissionSetting
                        ? formatPrecision(depositCommissionSetting.value2 ?? 1.0)
                        : 1.0) /
                    100);
            await agent.related('commissions').create({
                transactionId: requestData.id,
                amount: commission,
                status: 'pending',
            });
            const notificationTransaction = await Transaction.query()
                .where('id', depositData.id)
                .firstOrFail();
            await notification_service.sendDepositCompletedNotification(notificationTransaction);
            if (currency.notificationLimit !== null && depositData.amount >= currency.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(depositData.id);
            }
            await referralService(user, 'first_deposit');
            return response.created({
                success: true,
                message: 'Deposit Request created successfully',
                data: requestData,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
    async acceptDeposit(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const depositRequest = await Transaction.query()
                .where({ id, type: 'deposit_request', user_id: auth.user.id, status: 'pending' })
                .first();
            const branding = await brandingService();
            if (!depositRequest) {
                return response.notFound({ success: false, message: 'Request data not found' });
            }
            const agent = await Agent.query().where('userId', auth.user.id).first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            const metaData = JSON.parse(depositRequest.metaData);
            if (!metaData.trxId) {
                return response.badRequest({ success: false, message: 'Something went wrong' });
            }
            const deposit = await Transaction.query()
                .where({ type: 'deposit', trxId: metaData.trxId, status: 'pending' })
                .first();
            if (!deposit) {
                return response.notFound({ success: false, message: 'Deposit data not found' });
            }
            const depositUser = await User.query().where('id', deposit.userId).first();
            if (!depositUser) {
                return response.notFound({ success: false, message: 'Customer data not found' });
            }
            const currency = await Currency.findBy('code', metaData.currency.toUpperCase());
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            let commissionAmount = depositRequest.amount;
            if (currency.code !== branding.defaultCurrency) {
                const calculationsData = await exchangeCalculations(currency.code, branding.defaultCurrency, depositRequest.amount, agent.userId);
                if (!calculationsData) {
                    return response.badRequest({
                        success: false,
                        message: 'Something went wrong. Please contact support or try again later.',
                    });
                }
                commissionAmount = calculationsData.amountTo;
            }
            const agentWallet = await auth
                .user.related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!agentWallet) {
                return response.badRequest({
                    success: false,
                    message: `Agent ${currency.code} wallet not added yet`,
                });
            }
            if (agentWallet.balance < depositRequest.total) {
                return response.badRequest({
                    success: false,
                    message: 'Balance insufficiant',
                });
            }
            let customerWallet = await depositUser
                .related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!customerWallet) {
                customerWallet = await depositUser.related('wallets').create({
                    balance: 0,
                    default: false,
                    currencyId: currency.id,
                });
            }
            agentWallet.balance = agentWallet.balance - depositRequest.amount;
            await agentWallet.save();
            customerWallet.balance = customerWallet.balance + depositRequest.total;
            await customerWallet.save();
            depositRequest.status = 'completed';
            await depositRequest.save();
            deposit.status = 'completed';
            await deposit.save();
            const depositCommissionSetting = await Setting.findBy({
                key: 'deposit_commission',
                value1: 'on',
            });
            const commission = commissionAmount *
                ((agent.depositCommission !== null
                    ? agent.depositCommission
                    : depositCommissionSetting
                        ? formatPrecision(depositCommissionSetting.value2 ?? 1.0)
                        : 1.0) /
                    100);
            await agent.related('commissions').create({
                transactionId: depositRequest.id,
                amount: commission,
                status: 'pending',
            });
            await notification_service.sendDepositCompletedNotification(deposit);
            await referralService(depositUser, 'first_deposit');
            return response.created({
                success: true,
                message: 'Deposit accepted successfully',
                data: deposit,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Accept Deposit Error');
        }
    }
    async declineDeposit(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const depositRequest = await Transaction.query()
                .where({ id, type: 'deposit_request', user_id: auth.user.id, status: 'pending' })
                .first();
            if (!depositRequest) {
                return response.notFound({ success: false, message: 'Request data not found' });
            }
            const metaData = JSON.parse(depositRequest.metaData);
            if (!metaData.trxId) {
                return response.badRequest({ success: false, message: 'Something went wrong' });
            }
            const deposit = await Transaction.query()
                .where({ type: 'deposit', trxId: metaData.trxId, status: 'pending' })
                .first();
            if (!deposit) {
                return response.notFound({ success: false, message: 'Deposit data not found' });
            }
            depositRequest.status = 'failed';
            await depositRequest.save();
            deposit.status = 'failed';
            await deposit.save();
            await notification_service.sendDepositFailedNotification(deposit);
            return response.created({
                success: true,
                message: 'Deposit declined successfully',
                data: deposit,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Decline Deposit Error');
        }
    }
}
//# sourceMappingURL=deposit_requests_controller.js.map