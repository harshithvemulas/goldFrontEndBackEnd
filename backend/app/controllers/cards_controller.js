import errorHandler from '#exceptions/error_handler';
import Card from '#models/card';
import Currency from '#models/currency';
import Customer from '#models/customer';
import Setting from '#models/setting';
import stripe_card_service from '#services/stripe_card_service';
import sudo_card_service from '#services/sudo_card_service';
import { removeBalance } from '#services/wallet_service';
export default class CardsController {
    async index(ctx) {
        const { auth, response } = ctx;
        try {
            const cards = await Card.query()
                .where('userId', auth.user.id)
                .preload('wallet', (query) => {
                query.preload('currency');
            });
            return response.ok(cards);
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Fetch Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const cards = await Card.query()
                .preload('wallet', (query) => {
                query.preload('currency');
            })
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('merchant');
                query.preload('agent');
            })
                .orderBy('createdAt', 'desc')
                .paginate(page, limit);
            return response.ok(cards);
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Fetch Error');
        }
    }
    async adminById(ctx) {
        const { params, response } = ctx;
        try {
            const card = await Card.query()
                .where('id', params.id)
                .preload('wallet')
                .preload('user')
                .firstOrFail();
            return response.ok(card);
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Fetch Error');
        }
    }
    async changeCardStatus(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { id } = request.params();
            const { status } = request.body();
            if (!id || !status) {
                throw new Error('Card ID and status are required');
            }
            const card = await Card.query().where('id', id).andWhere('userId', auth?.user.id).first();
            if (!card) {
                throw new Error('Card not found');
            }
            await stripe_card_service.changeCardStatus(id, status);
            return response.ok({ message: 'Card status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Status Update Error');
        }
    }
    async cancelCard(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { id } = request.params();
            const card = await Card.query().where('id', id).andWhere('userId', auth?.user.id).first();
            if (!card) {
                throw new Error('Card not found');
            }
            await stripe_card_service.cancelCard(id);
            return response.ok({ message: 'Card cancelled successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Cancel Update Error');
        }
    }
    async changeCardStatusAdmin(ctx) {
        const { request, response } = ctx;
        try {
            const { id } = request.params();
            const { status } = request.body();
            if (!id || !status) {
                throw new Error('Card ID and status are required');
            }
            await stripe_card_service.changeCardStatus(id, status);
            return response.ok({ message: 'Card status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Status Update Error');
        }
    }
    async destroy(ctx) {
        const { params, response } = ctx;
        try {
            const card = await Card.query().where('id', params.id).firstOrFail();
            await stripe_card_service.cancelCard(card.id);
            return response.ok({ message: 'Card cancelled successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Deletion Error');
        }
    }
    async authorizeCardPayment(ctx) {
        const { request, response } = ctx;
        try {
            const event = request.body();
            if (event.type === 'issuing_authorization.request') {
                const { pending_request: pendingRequest } = event.data.object;
                const amount = pendingRequest.amount / 100;
                const currency = pendingRequest.currency.toUpperCase();
                const cardHolder = event.data.object.cardholder;
                const customer = await Customer.query()
                    .where('cardholderId', cardHolder)
                    .preload('user')
                    .firstOrFail();
                const currencyServer = await Currency.query().where('code', currency).firstOrFail();
                const wallet = await customer.user
                    ?.related('wallets')
                    .query()
                    .where('currencyId', currencyServer?.id)
                    .firstOrFail();
                if (wallet.balance < amount) {
                    throw new Error('Insufficient funds');
                }
                await removeBalance(amount, currency, wallet.userId);
                response.append('Stripe-Version', '2022-08-01');
                response.safeHeader('Content-Type', 'application/json');
                return response.status(200).json({
                    approved: true,
                });
            }
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Authorization Error');
        }
    }
    async authorizeSudoCardPayment(ctx) {
        const { request, response } = ctx;
        try {
            const event = request.body();
            if (event.type === 'card.balance') {
                const customer = await Customer.query()
                    .where('cardholderId', event?.data?.object?.customer?._id)
                    .preload('user')
                    .firstOrFail();
                const currencyServer = await Currency.query()
                    .where('code', event?.data?.object?.currency)
                    .firstOrFail();
                const wallet = await customer.user
                    ?.related('wallets')
                    .query()
                    .where('currencyId', currencyServer?.id)
                    .firstOrFail();
                return response.json({
                    statusCode: 200,
                    responseCode: '00',
                    data: {
                        balance: wallet?.balance,
                    },
                });
            }
            else if (event.type === 'authorization.request') {
                const customer = await Customer.query()
                    .where('cardholderId', event?.data?.object?.customer?._id)
                    .preload('user')
                    .firstOrFail();
                const currencyServer = await Currency.query()
                    .where('code', event?.data?.object?.currency)
                    .firstOrFail();
                const wallet = await customer.user
                    ?.related('wallets')
                    .query()
                    .where('currencyId', currencyServer?.id)
                    .firstOrFail();
                if (wallet?.balance < event?.data?.object?.pendingRequest?.amount) {
                    return response.json({
                        statusCode: 400,
                        responseCode: '51',
                    });
                }
                else {
                    await removeBalance(event?.data?.object?.pendingRequest?.amount, event?.data?.object?.currency, wallet.userId);
                    return response.json({
                        statusCode: 200,
                        responseCode: '00',
                    });
                }
            }
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Authorization Error');
        }
    }
    async generateVirtualCard(ctx) {
        const { auth, request, response } = ctx;
        try {
            const setting = await Setting.findByOrFail('key', 'virtual_card');
            if (setting.value1 === 'off') {
                throw new Error('Virtual card generation is disabled');
            }
            const { walletId } = request.all();
            if (!walletId) {
                throw new Error('Wallet ID is required');
            }
            await auth.user.load('customer');
            const wallet = await auth?.user
                ?.related('wallets')
                .query()
                .where('id', walletId)
                .preload('currency')
                .firstOrFail();
            if (!wallet) {
                throw new Error('Wallet not found');
            }
            const existingCard = await Card.query().where('walletId', wallet.id).first();
            if (existingCard) {
                throw new Error('Card already exists for this wallet');
            }
            if (setting.value2 === 'stripe-cards') {
                if (!['USD', 'EUR', 'GBP'].includes(wallet.currency?.code)) {
                    throw new Error('Invalid currency code');
                }
                if (!auth.user.customer?.cardholderId) {
                    await stripe_card_service.createCustomer(auth.user.id);
                }
                const data = await stripe_card_service.createCard(auth.user.id, wallet);
                return response.ok({ success: true, message: data?.message });
            }
            else {
                if (!['USD', 'NGN'].includes(wallet.currency?.code)) {
                    throw new Error('Invalid currency code');
                }
                if (!auth.user.customer?.cardholderId) {
                    await sudo_card_service.createCustomer(auth.user.id);
                }
                const data = await sudo_card_service.createCard(auth.user.id, wallet);
                return response.ok({ success: true, message: data?.message });
            }
        }
        catch (error) {
            errorHandler(error, ctx, 'Card Generation Error');
        }
    }
}
//# sourceMappingURL=cards_controller.js.map