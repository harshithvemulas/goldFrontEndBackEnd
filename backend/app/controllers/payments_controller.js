import errorHandler from '#exceptions/error_handler';
import Transaction from '#models/transaction';
import Merchant from '#models/merchant';
import User from '#models/user';
import Currency from '#models/currency';
import { storeSchema } from '#validators/payment';
import exportService from '#services/export_service';
import Setting from '#models/setting';
import formatPrecision from '#utils/format_precision';
import notification_service from '#services/notification_service';
export default class PaymentsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await auth
                .user.related('transactions')
                .query()
                .where('type', 'payment')
                .preload('user', (query) => {
                query.preload('customer');
            })
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
                .where('type', 'payment')
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('merchant');
                query.preload('agent');
            })
                .apply((scopes) => scopes.filtration({
                search: input.search,
                status: input.status,
                date: input.date,
                bookmark: input.bookmark,
            }))
                .andWhereJson('metaData', { trxAction: 'receive' })
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async merchantIndex(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            await auth.user.load('merchant');
            const dataQuery = auth
                .user.related('transactions')
                .query()
                .apply((scopes) => scopes.filtration({
                fromSearch: input.search,
                status: input.status,
                date: input.date,
                bookmark: input.bookmark,
            }))
                .where('type', 'payment')
                .whereJson('to', { email: auth.user.merchant.email })
                .preload('user', (query) => {
                query.preload('customer');
            })
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async exportCsv(ctx) {
        await exportService.exportData(ctx, 'payment');
    }
    async exportAdminCsv(ctx) {
        await exportService.exportData(ctx, 'admin_payment');
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id, type: 'payment' })
                .preload('user')
                .preload('user', (query) => {
                query.preload('customer');
            })
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
    async previewPayment(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { amount } = request.qs();
            if (!amount) {
                return response.badRequest({
                    success: false,
                    message: 'Not enough data!',
                });
            }
            const formatedAmount = formatPrecision(amount);
            const payer = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .first();
            if (!payer) {
                return response.notFound({ success: false, message: 'Payer data not found' });
            }
            const paymentSetting = await Setting.findBy({ key: 'payment', value1: 'on' });
            let regularFeePercentage = paymentSetting ? formatPrecision(paymentSetting.value2 ?? 0) : 0;
            if (payer && payer.roleId === 3 && payer.merchant) {
                if (payer.merchant.paymentFee !== null) {
                    regularFeePercentage = payer.merchant.paymentFee;
                }
            }
            const fee = formatPrecision(formatedAmount * (regularFeePercentage / 100));
            return response.json({
                amount: formatedAmount,
                fee: formatPrecision(fee),
                totalAmount: formatPrecision(formatedAmount - fee),
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Preview Error');
        }
    }
    async store(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { currencyCode, amount, merchantId } = await request.validateUsing(storeSchema);
            if (amount <= 0) {
                return response.badRequest({
                    success: false,
                    message: 'The amount must have to be greater than 0',
                });
            }
            const merchant = await Merchant.query()
                .where('merchantId', merchantId)
                .preload('user', (query) => {
                query.preload('customer');
            })
                .first();
            if (!merchant) {
                return response.notFound({ success: false, message: 'Invalid merchant_id!' });
            }
            if (merchant.isSuspend || merchant.status !== 'verified') {
                return response.badRequest({
                    success: false,
                    message: 'This merchant is not at service',
                });
            }
            const recipient = merchant.user;
            const payer = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .preload('permission')
                .first();
            if (!payer) {
                return response.notFound({ success: false, message: 'Payer data not found' });
            }
            if (recipient.id === payer.id) {
                return response.badRequest({ success: false, message: "Merchant can't pay himself" });
            }
            if (!recipient.status) {
                return response.badRequest({ success: false, message: 'Merchant is inactive' });
            }
            const currency = await Currency.findBy('code', currencyCode);
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            if (!payer.kycStatus) {
                if (currency.kycLimit !== null && amount > currency.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to make payment more than ${currency.kycLimit} ${currency.code}`,
                    });
                }
            }
            if (!payer.permission.payment) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to make payment',
                });
            }
            const payerWallet = await auth.user
                ?.related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!payerWallet) {
                return response.notFound({ success: false, message: 'Payer wallet not found' });
            }
            if (payerWallet.balance < amount) {
                return response.badRequest({ success: false, message: 'Balance insufficient' });
            }
            let recipientWallet = await recipient
                .related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!recipientWallet) {
                const newCurrency = await Currency.findBy('code', currencyCode);
                if (!newCurrency) {
                    return response.notFound({
                        success: false,
                        message: 'Currency code invalid or data not found',
                    });
                }
                recipientWallet = await recipient.related('wallets').create({
                    balance: 0,
                    default: false,
                    currencyId: newCurrency.id,
                    dailyTransferAmount: newCurrency.dailyTransferAmount,
                });
            }
            const paymentSetting = await Setting.findBy({ key: 'payment', value1: 'on' });
            if (!paymentSetting) {
                return response.badRequest({
                    success: false,
                    message: 'This service is not available right now',
                });
            }
            let regularFeePercentage = paymentSetting ? formatPrecision(paymentSetting.value2 ?? 0) : 0;
            if (payer && payer.roleId === 3 && payer.merchant) {
                if (payer.merchant.isSuspend || payer.merchant.status !== 'verified') {
                    return response.badRequest({
                        success: false,
                        message: 'Your account is currently on hold. Please contact support',
                    });
                }
                if (payer.merchant.paymentFee !== null) {
                    regularFeePercentage = payer.merchant.paymentFee;
                }
            }
            const fee = formatPrecision(amount * (regularFeePercentage / 100));
            const fromData = {
                image: payer.customer.profileImage ?? '',
                label: payer.customer.name ?? '',
                email: payer.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const toData = {
                image: merchant.storeProfileImage ?? '',
                label: merchant.name ?? '',
                email: merchant.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const payerPaymentData = await payer.related('transactions').create({
                type: 'payment',
                from: fromData,
                to: toData,
                amount,
                fee: 0,
                total: formatPrecision(amount),
                metaData: {
                    currency: currencyCode.toUpperCase(),
                    trxAction: 'send',
                },
                status: 'completed',
            });
            payerWallet.balance = payerWallet.balance - amount;
            await payerWallet.save();
            const recipientData = await recipient.related('transactions').create({
                type: 'payment',
                from: fromData,
                to: toData,
                amount,
                fee,
                total: formatPrecision(amount - fee),
                metaData: {
                    currency: currencyCode.toUpperCase(),
                    trxAction: 'receive',
                },
                status: 'completed',
            });
            recipientWallet.balance = recipientWallet.balance + (amount - fee);
            await recipientWallet.save();
            await notification_service.sendPaymentReceivedNotification(recipientData.id);
            if (currency.notificationLimit !== null && amount >= currency.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(payerPaymentData.id);
            }
            return response.created({
                success: true,
                message: 'Payment completed successfully',
                data: payerPaymentData,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
}
//# sourceMappingURL=payments_controller.js.map