import errorHandler from '#exceptions/error_handler';
import { v4 as uuidv4 } from 'uuid';
import Wallet from '#models/wallet';
import Currency from '#models/currency';
import User from '#models/user';
export default class WalletsController {
    async index(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await Wallet.query()
                .where({ userId: auth.user.id })
                .preload('currency')
                .preload('cards');
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index wallet Error');
        }
    }
    async indexSavedWallets(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await auth.user.related('saves').query().where('type', 'wallet');
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index wallet Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const walletId = request.param('walletId');
            let data = await Wallet.query()
                .where({ walletId })
                .preload('currency')
                .preload('cards')
                .first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index wallet Error');
        }
    }
    async store(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { currencyCode } = request.only(['currencyCode']);
            if (!currencyCode) {
                return response.badRequest({ success: false, message: 'Currency code is not provided' });
            }
            const currency = await Currency.findBy({
                code: currencyCode.toUpperCase(),
            });
            if (!currency) {
                return response.badRequest({ success: false, message: 'Currency code is invalid' });
            }
            if (!auth.user) {
                return response.badRequest({ success: false, message: 'User not found' });
            }
            const exist = await Wallet.findBy({ currencyId: currency.id, userId: auth.user.id });
            if (exist) {
                return response.badRequest({ success: false, message: 'This wallet already exist' });
            }
            await auth.user.related('wallets').create({
                walletId: 'W' + uuidv4().substring(0, 5),
                balance: 0,
                default: false,
                currencyId: currency.id,
                dailyTransferAmount: currency.dailyTransferAmount,
            });
            return response.json({ success: true, message: 'Wallet created successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing wallet Error');
        }
    }
    async makeDefault(ctx) {
        const { auth, request, response } = ctx;
        try {
            const walletId = request.param('id');
            const wallet = await Wallet.find(Number.parseInt(walletId));
            if (!wallet) {
                return response.badRequest({ success: false, message: 'Invalid wallet primary Id' });
            }
            if (!auth.user) {
                return response.badRequest({ success: false, message: 'User not found' });
            }
            await auth.user.related('wallets').query().where('default', true).update({ default: false });
            wallet.default = true;
            await wallet.save();
            return response.json({ success: true, message: 'Wallet updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Making default wallet Error');
        }
    }
    async pinDashboard(ctx) {
        const { request, response } = ctx;
        try {
            const { pinDashboard } = request.only(['pinDashboard']);
            const walletId = request.param('id');
            const wallet = await Wallet.find(Number.parseInt(walletId));
            if (!wallet) {
                return response.badRequest({ success: false, message: 'Invalid wallet primary Id' });
            }
            wallet.pinDashboard = pinDashboard;
            await wallet.save();
            return response.json({ success: true, message: 'Wallet updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Pin dashboard wallet Error');
        }
    }
    async updateTransferLimit(ctx) {
        const { request, response } = ctx;
        try {
            const { dailyTransferAmount } = request.only(['dailyTransferAmount']);
            const walletId = request.param('id');
            const wallet = await Wallet.find(Number.parseInt(walletId));
            if (!wallet) {
                return response.badRequest({ success: false, message: 'Invalid wallet primary Id' });
            }
            wallet.dailyTransferAmount = dailyTransferAmount;
            await wallet.save();
            return response.json({ success: true, message: 'Wallet updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Daily transfer limit update Error');
        }
    }
    async saveWallet(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { walletId } = request.only(['walletId']);
            const wallet = await Wallet.query()
                .where('walletId', walletId)
                .preload('user')
                .preload('currency')
                .first();
            if (!wallet) {
                return response.notFound({
                    success: false,
                    message: 'Wallet data not found or invalid wallet_id',
                });
            }
            const walletUser = await User.query()
                .where('id', wallet.user.id)
                .preload('customer')
                .first();
            if (!walletUser) {
                return response.badRequest({ success: false, message: 'Wallet user data not found' });
            }
            const alreadyExist = await auth
                .user.related('saves')
                .query()
                .where({ type: 'wallet', value: walletId })
                .first();
            if (alreadyExist) {
                return response.notFound({
                    success: false,
                    message: 'This wallet_id is already exist in the saved list',
                });
            }
            await auth.user.related('saves').create({
                type: 'wallet',
                info: {
                    image: walletUser.customer.profileImage ?? '',
                    label: walletUser.customer.name ?? '',
                    email: walletUser.email ?? '',
                },
                value: wallet.walletId,
                relatedModel: 'users',
                relatedModelId: walletUser.id,
                metaData: { currency: wallet.currency.code },
            });
            return response.json({ success: true, message: 'Wallet saved successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Save wallet Error');
        }
    }
}
//# sourceMappingURL=wallets_controller.js.map