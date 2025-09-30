import errorHandler from '#exceptions/error_handler';
import Transaction from '#models/transaction';
import { storeSchema, updateSchema } from '#validators/exchange';
import exchangeCalculations from '#services/exchange_calculations';
import Wallet from '#models/wallet';
import User from '#models/user';
import Currency from '#models/currency';
import formatPrecision from '../utils/format_precision.js';
import exportService from '#services/export_service';
import notification_service from '#services/notification_service';
import Setting from '#models/setting';
export default class ExchangesController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await auth
                .user.related('transactions')
                .query()
                .where('type', 'exchange')
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
                .where('type', 'exchange')
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('merchant');
                query.preload('agent');
            })
                .apply((scopes) => scopes.filtration({
                userSearch: input.search,
                status: input.status,
                date: input.date,
                bookmark: input.bookmark,
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
        await exportService.exportData(ctx, 'admin_exchange');
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id, type: 'exchange' })
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
    async getExchangeCalculation(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { currencyFrom, currencyTo, amountFrom } = request.qs();
            const data = await exchangeCalculations(currencyFrom.toUpperCase(), currencyTo.toUpperCase(), formatPrecision(amountFrom), auth.user.id);
            if (!data) {
                return response.badRequest({ success: false, message: 'Calculation failed' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Calculation Error');
        }
    }
    async store(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { currencyFrom, currencyTo, amountFrom } = await request.validateUsing(storeSchema);
            const exchangeSetting = await Setting.findBy({ key: 'exchange', value1: 'on' });
            if (!exchangeSetting) {
                return response.badRequest({
                    success: false,
                    message: 'This service is not available right now',
                });
            }
            const currencyFromData = await Currency.findBy('code', currencyFrom.toUpperCase());
            const currencyToData = await Currency.findBy('code', currencyTo.toUpperCase());
            if (!currencyFromData || !currencyToData) {
                return response.badRequest({ success: false, message: 'Currency could not fetched' });
            }
            const calculationsData = await exchangeCalculations(currencyFrom, currencyTo, amountFrom, auth.user.id);
            if (!calculationsData) {
                return response.badRequest({ success: false, message: 'Calculation failed' });
            }
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            if (!user.kycStatus) {
                if (currencyFromData.kycLimit !== null && amountFrom > currencyFromData.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to exchange more than ${currencyFromData.kycLimit} ${currencyFromData.code}`,
                    });
                }
            }
            if (!user.permission.exchange) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to exchange money',
                });
            }
            const fromWallet = await Wallet.findBy({
                userId: user.id,
                currencyId: currencyFromData.id,
            });
            if (!fromWallet) {
                return response.badRequest({
                    success: false,
                    message: `${currencyFrom} wallet not added yet`,
                });
            }
            if (fromWallet.balance < amountFrom) {
                return response.badRequest({
                    success: false,
                    message: 'Insufficient balance',
                });
            }
            const toWallet = await Wallet.findBy({
                userId: user.id,
                currencyId: currencyToData.id,
            });
            if (!toWallet) {
                return response.badRequest({
                    success: false,
                    message: `${currencyTo} wallet not added yet`,
                });
            }
            const exchangeData = await user.related('transactions').create({
                type: 'exchange',
                from: { label: user.customer.name ?? '', email: user.email, currency: currencyFrom },
                to: { label: user.customer.name ?? '', email: user.email, currency: currencyTo },
                metaData: {
                    amountFrom,
                    currencyFrom,
                    currencyTo,
                    currency: currencyTo,
                    exchangeRate: calculationsData.exchangeRate,
                },
                amount: calculationsData.amountTo,
                fee: calculationsData.fee,
                total: calculationsData.total,
                status: 'pending',
            });
            fromWallet.balance = fromWallet.balance - amountFrom;
            await fromWallet.save();
            await notification_service.sendExchangeRequestNotification(exchangeData.id);
            if (currencyFromData.notificationLimit !== null &&
                amountFrom >= currencyFromData.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(exchangeData.id);
            }
            return response.created({
                success: true,
                message: 'Exchange request sent successfully',
                data: exchangeData,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
    async editExchange(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const { exchangeRate } = await request.validateUsing(updateSchema);
            const exchangeData = await Transaction.query()
                .where({ id, type: 'exchange', status: 'pending' })
                .preload('user')
                .first();
            if (!exchangeData) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const metaDataString = exchangeData.metaData;
            const metaData = JSON.parse(metaDataString);
            const calculationsData = await exchangeCalculations(metaData.currencyFrom, metaData.currencyTo, metaData.amountFrom, exchangeData.userId, exchangeRate);
            if (!calculationsData) {
                return response.badRequest({ success: false, message: 'Calculation failed' });
            }
            metaData.exchangeRate = calculationsData.exchangeRate;
            exchangeData.metaData = JSON.stringify(metaData);
            exchangeData.amount = calculationsData.amountTo;
            exchangeData.fee = calculationsData.fee;
            exchangeData.total = calculationsData.total;
            await exchangeData.save();
            return response.created({ success: true, message: 'Exchange updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
    async acceptExchange(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const exchangeData = await Transaction.query()
                .where({ id, type: 'exchange', status: 'pending' })
                .preload('user')
                .first();
            if (!exchangeData) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const metaDataString = exchangeData.metaData;
            const metaData = JSON.parse(metaDataString);
            const currencyToData = await Currency.findBy('code', metaData.currencyTo.toUpperCase());
            if (!currencyToData) {
                return response.badRequest({ success: false, message: 'Currency could not fetched' });
            }
            const toWallet = await Wallet.findBy({
                userId: exchangeData.userId,
                currencyId: currencyToData.id,
            });
            if (!toWallet) {
                return response.badRequest({
                    success: false,
                    message: `${metaData.currencyTo} wallet not added yet`,
                });
            }
            exchangeData.status = 'completed';
            await exchangeData.save();
            toWallet.balance = toWallet.balance + exchangeData.total;
            await toWallet.save();
            await notification_service.sendExchangeAcceptedNotification(exchangeData);
            return response.created({ success: true, message: 'Exchange request accepted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
    async declineExchange(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const exchangeData = await Transaction.query()
                .where({ id, type: 'exchange', status: 'pending' })
                .preload('user')
                .first();
            if (!exchangeData) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const metaDataString = exchangeData.metaData;
            const metaData = JSON.parse(metaDataString);
            const currencyFromData = await Currency.findBy('code', metaData.currencyFrom.toUpperCase());
            if (!currencyFromData) {
                return response.badRequest({ success: false, message: 'Currency could not fetched' });
            }
            const fromWallet = await Wallet.findBy({
                userId: exchangeData.userId,
                currencyId: currencyFromData.id,
            });
            if (!fromWallet) {
                return response.badRequest({
                    success: false,
                    message: `${metaData.currencyFrom} wallet not added yet`,
                });
            }
            exchangeData.status = 'failed';
            await exchangeData.save();
            fromWallet.balance = fromWallet.balance + metaData.amountFrom;
            await fromWallet.save();
            await notification_service.sendExchangeDelinedNotification(exchangeData);
            return response.created({ success: true, message: 'Exchange request decline successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing Error');
        }
    }
}
//# sourceMappingURL=exchanges_controller.js.map