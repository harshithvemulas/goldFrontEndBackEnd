import errorHandler from '#exceptions/error_handler';
import Transaction from '#models/transaction';
import { storeSchema } from '#validators/transfer';
import User from '#models/user';
import Currency from '#models/currency';
import { totalTransactions, totalTransferedAmount } from '#services/transfer_service';
import exportService from '#services/export_service';
import Setting from '#models/setting';
import formatPrecision from '#utils/format_precision';
import notification_service from '#services/notification_service';
export default class TransfersController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await auth
                .user.related('transactions')
                .query()
                .where('type', 'transfer')
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
                .where('type', 'transfer')
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
                .andWhereJson('metaData', { trxAction: 'send' })
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async exportAdminCsv(ctx) {
        await exportService.exportData(ctx, 'admin_transfer');
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id, type: 'transfer' })
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
    async previewTransfer(ctx) {
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
            const sender = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .first();
            if (!sender) {
                return response.notFound({ success: false, message: 'Sender data not found' });
            }
            const transferSetting = await Setting.findBy({ key: 'transfer', value1: 'on' });
            let regularFeePercentage = transferSetting ? formatPrecision(transferSetting.value2 ?? 0) : 0;
            if (sender && sender.roleId === 3 && sender.merchant) {
                if (sender.merchant.transferFee !== null) {
                    regularFeePercentage = sender.merchant.transferFee;
                }
            }
            const fee = formatPrecision(formatedAmount * (regularFeePercentage / 100));
            return response.json({
                formatedAmount: formatedAmount + fee,
                fee: formatPrecision(fee),
                totalAmount: formatPrecision(formatedAmount),
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Preview Error');
        }
    }
    async store(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { currencyCode, amount, email } = await request.validateUsing(storeSchema);
            const recipient = await User.query().where('email', email).preload('customer').first();
            if (!recipient) {
                return response.notFound({ success: false, message: 'Recipient data not found' });
            }
            if (!recipient.status) {
                return response.badRequest({ success: false, message: 'Recipient is inactive' });
            }
            if (![2, 3].includes(recipient.roleId)) {
                return response.notAcceptable({ success: false, message: 'This email is not acceptable' });
            }
            const sender = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .preload('permission')
                .first();
            if (!sender) {
                return response.notFound({ success: false, message: 'Sender data not found' });
            }
            if (recipient.id === sender.id) {
                return response.badRequest({ success: false, message: "Sender can't be the recipient" });
            }
            const currency = await Currency.findBy('code', currencyCode);
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            if (!sender.permission.transfer) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to transfer money',
                });
            }
            if (!sender.kycStatus) {
                if (currency.kycLimit !== null && amount > currency.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to transfer more than ${currency.kycLimit} ${currency.code}`,
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
            const senderWallet = await auth.user
                ?.related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!senderWallet) {
                return response.notFound({ success: false, message: 'Sender wallet not found' });
            }
            if (auth.user.limitTransfer) {
                const totalAmount = await totalTransferedAmount(currencyCode, auth.user.id);
                const totalCount = await totalTransactions(auth.user.id);
                if (senderWallet.dailyTransferAmount &&
                    totalAmount + amount > senderWallet.dailyTransferAmount) {
                    return response.badRequest({
                        success: false,
                        message: `Your daily transaction amount limit will exceed! Currently you can only transfer max ${senderWallet.dailyTransferAmount - totalAmount} ${currencyCode} from this wallet`,
                    });
                }
                if (auth.user.dailyTransferLimit && totalCount + 1 > auth.user.dailyTransferLimit) {
                    return response.badRequest({
                        success: false,
                        message: 'Your daily limit of transaction has already reached!',
                    });
                }
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
            const transferSetting = await Setting.findBy({ key: 'transfer', value1: 'on' });
            if (!transferSetting) {
                return response.badRequest({
                    success: false,
                    message: 'This service is not available right now',
                });
            }
            let regularFeePercentage = transferSetting ? formatPrecision(transferSetting.value2 ?? 0) : 0;
            if (sender && sender.roleId === 3 && sender.merchant) {
                if (sender.merchant.isSuspend || sender.merchant.status !== 'verified') {
                    return response.badRequest({
                        success: false,
                        message: 'Your account is currently on hold. Please contact support',
                    });
                }
                if (sender.merchant.transferFee !== null) {
                    regularFeePercentage = sender.merchant.transferFee;
                }
            }
            const fee = formatPrecision(amount * (regularFeePercentage / 100));
            if (senderWallet.balance < amount + fee) {
                return response.badRequest({ success: false, message: 'Insufficient balance' });
            }
            const fromData = {
                image: sender.customer.profileImage ?? '',
                label: sender.customer.name ?? '',
                email: sender.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const toData = {
                image: recipient.customer.profileImage ?? '',
                label: recipient.customer.name ?? '',
                email: recipient.email ?? '',
                currency: currencyCode.toUpperCase() ?? '',
            };
            const senderTransferData = await sender.related('transactions').create({
                type: 'transfer',
                from: fromData,
                to: toData,
                amount: formatPrecision(amount + fee),
                fee,
                total: formatPrecision(amount),
                metaData: {
                    currency: currencyCode.toUpperCase() ?? '',
                    trxAction: 'send',
                },
                status: 'completed',
            });
            senderWallet.balance = senderWallet.balance - (amount + fee);
            await senderWallet.save();
            const recipientTransferData = await recipient.related('transactions').create({
                type: 'transfer',
                from: fromData,
                to: toData,
                amount,
                fee: 0,
                total: formatPrecision(amount),
                metaData: {
                    currency: currencyCode.toUpperCase() ?? '',
                    trxAction: 'receive',
                },
                status: 'completed',
            });
            recipientWallet.balance = recipientWallet.balance + amount;
            await recipientWallet.save();
            await notification_service.sendTransferReceivedNotification(recipientTransferData.id);
            if (currency.notificationLimit !== null && amount >= currency.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(senderTransferData.id);
            }
            return response.created({
                success: true,
                message: 'Balance transfered successfully',
                data: senderTransferData,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
}
//# sourceMappingURL=transfers_controller.js.map