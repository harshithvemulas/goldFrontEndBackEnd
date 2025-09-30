import errorHandler from '#exceptions/error_handler';
import Agent from '#models/agent';
import Transaction from '#models/transaction';
import { storeRequestSchema } from '#validators/withdraw_request';
import User from '#models/user';
import Currency from '#models/currency';
import formatPrecision from '../utils/format_precision.js';
import { addBalance } from '#services/wallet_service';
import Setting from '#models/setting';
import exportService from '#services/export_service';
import exchangeCalculations from '#services/exchange_calculations';
import notification_service from '#services/notification_service';
import brandingService from '#services/branding_service';
export default class WithdrawRequestsController {
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
                date: input.date,
                bookmark: input.bookmark,
                method: input.method,
            }))
                .where('type', 'withdraw_request')
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async exportCsv(ctx) {
        await exportService.exportData(ctx, 'withdraw_request');
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id, type: 'withdraw_request' })
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
        const { request, response } = ctx;
        try {
            const { agentId, amount } = request.qs();
            if (!agentId || !amount) {
                return response.badRequest({
                    success: false,
                    message: 'Not enough data!',
                });
            }
            const formatedAmount = formatPrecision(amount);
            const withdrawSetting = await Setting.findBy({ key: 'withdraw', value1: 'on' });
            const agent = await Agent.query()
                .where({ agentId })
                .preload('user', (query) => query.preload('customer'))
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            let totalAmount = formatedAmount;
            let regularFeePercentage = withdrawSetting ? formatPrecision(withdrawSetting.value2 ?? 0) : 0;
            if (agent.withdrawalCharge !== null) {
                regularFeePercentage = regularFeePercentage + agent.withdrawalCharge;
            }
            let fee = formatedAmount * (regularFeePercentage / 100);
            totalAmount += fee;
            return response.json({
                chargedAmount: formatPrecision(totalAmount),
                fee: formatPrecision(fee),
                recievedAmount: formatedAmount,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Preview Error');
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
            if (user.roleId === 3) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to deposit through the agent!',
                });
            }
            if (!user.permission.withdraw) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to withdraw money',
                });
            }
            const currency = await Currency.findBy('code', currencyCode.toUpperCase());
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
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
            if (!user.kycStatus) {
                if (currency.kycLimit !== null && amount > currency.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to withdraw more than ${currency.kycLimit} ${currency.code}`,
                    });
                }
            }
            const withdrawSetting = await Setting.findBy({ key: 'withdraw', value1: 'on' });
            if (!withdrawSetting) {
                return response.badRequest({
                    success: false,
                    message: 'This service is not available right now',
                });
            }
            let chargedAmount = amount;
            let regularFeePercentage = withdrawSetting ? formatPrecision(withdrawSetting.value2 ?? 0) : 0;
            if (agent.withdrawalCharge !== null) {
                regularFeePercentage = regularFeePercentage + agent.withdrawalCharge;
            }
            let fee = amount * (regularFeePercentage / 100);
            chargedAmount += fee;
            let customerWallet = await user
                .related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!customerWallet) {
                return response.badRequest({
                    success: false,
                    message: `Customer ${currency.code} wallet not added yet`,
                });
            }
            if (customerWallet.balance < chargedAmount) {
                return response.badRequest({
                    success: false,
                    message: 'Balance insufficiant',
                });
            }
            const fromData = {
                image: user.customer.profileImage ?? '',
                label: user.customer.name ?? '',
                email: user.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const toData = {
                image: agent.user.customer.profileImage ?? '',
                label: agent.name ?? '',
                email: agent.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const withdrawData = await auth.user.related('transactions').create({
                type: 'withdraw',
                from: fromData,
                to: toData,
                amount: formatPrecision(chargedAmount),
                fee: formatPrecision(fee),
                total: formatPrecision(amount),
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
                type: 'withdraw_request',
                from: fromData,
                to: toData,
                amount: formatPrecision(chargedAmount),
                fee: formatPrecision(fee),
                total: formatPrecision(amount),
                metaData: {
                    country: countryCode,
                    currency: currencyCode,
                    agentMethod: method,
                    value: inputValue,
                    trxId: withdrawData.trxId,
                },
                status: 'pending',
                method,
            });
            customerWallet.balance = customerWallet.balance - chargedAmount;
            await customerWallet.save();
            await notification_service.sendWithdrawRequestNotification(requestData.id);
            if (currency.notificationLimit !== null && amount >= currency.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(withdrawData.id);
            }
            response.created({
                success: true,
                message: 'Withdraw Request created successfully',
                data: withdrawData,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
    async acceptWithdraw(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const withdrawRequest = await Transaction.query()
                .where({ id, type: 'withdraw_request', user_id: auth.user.id, status: 'pending' })
                .first();
            if (!withdrawRequest) {
                return response.notFound({ success: false, message: 'Request data not found' });
            }
            const agent = await Agent.query().where('userId', auth.user.id).first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            const fromData = JSON.parse(withdrawRequest.from);
            const metaData = JSON.parse(withdrawRequest.metaData);
            if (!metaData.trxId) {
                return response.badRequest({ success: false, message: 'Something went wrong' });
            }
            const withdraw = await Transaction.query()
                .where({ type: 'withdraw', trxId: metaData.trxId, status: 'pending' })
                .first();
            if (!withdraw) {
                return response.notFound({ success: false, message: 'Withdraw data not found' });
            }
            const withdrawUser = await User.query().where('id', withdraw.userId).first();
            if (!withdrawUser) {
                return response.notFound({ success: false, message: 'Customer data not found' });
            }
            const currency = await Currency.findBy('code', fromData.currency.toUpperCase());
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            let commissionAmount = withdrawRequest.total;
            const branding = await brandingService();
            if (currency.code !== branding?.defaultCurrency) {
                const calculationsData = await exchangeCalculations(currency.code, branding.defaultCurrency, withdrawRequest.total, agent.userId);
                if (!calculationsData) {
                    return response.badRequest({
                        success: false,
                        message: 'Something went wrong. Please contact support or try again later',
                    });
                }
                commissionAmount = calculationsData.amountTo;
            }
            let agentWallet = await auth
                .user.related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!agentWallet) {
                agentWallet = await auth.user.related('wallets').create({
                    balance: 0,
                    default: false,
                    currencyId: currency.id,
                    dailyTransferAmount: currency.dailyTransferAmount,
                });
            }
            agentWallet.balance = agentWallet.balance + withdrawRequest.total;
            await agentWallet.save();
            withdrawRequest.status = 'completed';
            await withdrawRequest.save();
            withdraw.status = 'completed';
            await withdraw.save();
            const withdrawCommissionSetting = await Setting.findBy({
                key: 'withdraw_commission',
                value1: 'on',
            });
            const commission = commissionAmount *
                ((agent.depositCommission !== null
                    ? agent.depositCommission
                    : withdrawCommissionSetting
                        ? formatPrecision(withdrawCommissionSetting.value2 ?? 1.5)
                        : 1.5) /
                    100);
            await agent.related('commissions').create({
                transactionId: withdrawRequest.id,
                amount: commission,
                status: 'pending',
            });
            await notification_service.sendWithdrawCompletedNotification(withdraw);
            return response.created({
                success: true,
                message: 'Withdraw accepted successfully',
                data: withdraw,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Accept Withdraw Error');
        }
    }
    async declineWithdraw(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const withdrawRequest = await Transaction.query()
                .where({ id, type: 'withdraw_request', user_id: auth.user.id, status: 'pending' })
                .first();
            if (!withdrawRequest) {
                return response.notFound({ success: false, message: 'Request data not found' });
            }
            const fromData = JSON.parse(withdrawRequest.from);
            const metaData = JSON.parse(withdrawRequest.metaData);
            if (!metaData.trxId) {
                return response.badRequest({ success: false, message: 'Something went wrong' });
            }
            const withdraw = await Transaction.query()
                .where({ type: 'withdraw', trxId: metaData.trxId, status: 'pending' })
                .first();
            if (!withdraw) {
                return response.notFound({ success: false, message: 'Withdraw data not found' });
            }
            const withdrawUser = await User.query().where('id', withdraw.userId).first();
            if (!withdrawUser) {
                return response.notFound({ success: false, message: 'Customer data not found' });
            }
            await addBalance(withdraw.amount, fromData.currency, withdrawUser.id);
            withdrawRequest.status = 'failed';
            await withdrawRequest.save();
            withdraw.status = 'failed';
            await withdraw.save();
            await notification_service.sendWithdrawFailedNotification(withdraw);
            return response.created({
                success: true,
                message: 'Withdraw declined successfully',
                data: withdraw,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Decline Withdraw Error');
        }
    }
}
//# sourceMappingURL=withdraw_requests_controller.js.map