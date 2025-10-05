import Card from '#models/card';
import Customer from '#models/customer';
import ExternalPlugin from '#models/external_plugin';
import User from '#models/user';
import { DateTime } from 'luxon';
import stripe from 'stripe';
import brandingService from './branding_service.js';
class StripeCard {
    stripeData;
    stripe;
    constructor() {
        this.createStripeEnv();
    }
    async createStripeEnv() {
        try {
            const branding = await brandingService();
            const stripeData = await ExternalPlugin.findByOrFail('value', 'stripe-cards');
            this.stripe = new stripe(stripeData?.secretKey);
            this.stripeData = stripeData;
            const webhooks = await this.stripe.webhookEndpoints.list();
            const webhookExists = webhooks.data.find((webhook) => webhook.url.includes('/cards/authorize'));
            if (!webhookExists) {
                const data = await this.stripe.webhookEndpoints.create({
                    url: branding.apiUrl + '/cards/authorize',
                    enabled_events: ['issuing_authorization.request'],
                });
                await stripeData.merge({ apiKey2: data.secret }).save();
            }
            if (webhookExists && webhookExists.url !== branding.apiUrl + '/cards/authorize') {
                await this.stripe.webhookEndpoints.del(webhookExists.id);
                const data = await this.stripe.webhookEndpoints.create({
                    url: branding.apiUrl + '/cards/authorize',
                    enabled_events: ['issuing_authorization.request'],
                });
                await stripeData.merge({ apiKey2: data.secret }).save();
            }
        }
        catch {
            throw new Error('Stripe webhook generation error');
        }
    }
    async createCustomer(userId) {
        await this.createStripeEnv();
        const user = await User.query()
            .where('id', userId)
            .preload('customer', (query) => {
            query.preload('address');
        })
            .preload('loginSessions')
            .preload('kyc')
            .firstOrFail();
        if (user?.customer?.cardholderId) {
            return { message: 'Cardholder already exists' };
        }
        const customerDob = DateTime.fromISO(user?.customer?.dob.toISOString())
            .toFormat('yyyy-M-d')
            ?.split('-');
        const cardholder = await this.stripe.issuing.cardholders.create({
            name: user?.customer?.name,
            email: user?.email,
            phone_number: '+' + user?.customer?.phone,
            status: 'active',
            type: 'individual',
            individual: {
                first_name: user?.customer?.firstName,
                last_name: user?.customer?.lastName,
                dob: {
                    day: Number.parseInt(customerDob[2], 10),
                    month: Number.parseInt(customerDob[1], 10),
                    year: Number.parseInt(customerDob[0], 10),
                },
            },
            billing: {
                address: {
                    line1: user?.customer?.address?.addressLine,
                    city: user?.customer?.address?.city,
                    postal_code: user?.customer?.address?.zipCode,
                    country: user?.customer?.address?.countryCode,
                },
            },
        });
        await this.stripe.issuing.cardholders.update(cardholder?.id, {
            individual: {
                card_issuing: {
                    user_terms_acceptance: {
                        date: DateTime.now().toUnixInteger(),
                        ip: user.loginSessions?.[0]?.ipAddress,
                    },
                },
            },
        });
        await Customer.query().where('userId', userId).update({
            cardholderId: cardholder?.id,
        });
        return { message: 'Cardholder generated successfully' };
    }
    async createCard(userId, wallet) {
        await this.createStripeEnv();
        const user = await User.query()
            .where('id', userId)
            .preload('customer', (query) => {
            query.preload('address');
        })
            .preload('loginSessions')
            .preload('kyc')
            .firstOrFail();
        if (!user?.customer?.cardholderId) {
            throw new Error('Cardholder does not exist');
        }
        const card = await this.stripe.issuing.cards.create({
            cardholder: user?.customer?.cardholderId,
            currency: wallet.currency?.code,
            type: 'virtual',
            status: 'active',
        });
        const cardData = await this.stripe.issuing.cards.retrieve(card.id, {
            expand: ['number', 'cvc'],
        });
        await Card.create({
            userId: user.id,
            walletId: wallet.id,
            cardId: card.id,
            type: 'virtual',
            lastFour: card.last4,
            brand: card.brand,
            expMonth: card.exp_month.toString(),
            expYear: card.exp_year.toString(),
            number: cardData.number,
            cvc: cardData.cvc,
        });
        return { message: 'Card generated successfully' };
    }
    async changeCardStatus(cardId, status) {
        await this.createStripeEnv();
        const card = await Card.query().where('id', cardId).firstOrFail();
        const data = await this.stripe.issuing.cards.update(card.cardId, {
            status,
        });
        await card.merge({ status: data.status }).save();
        return { message: 'Card status updated successfully' };
    }
    async cancelCard(cardId) {
        await this.createStripeEnv();
        const card = await Card.query().where('id', cardId).firstOrFail();
        await this.stripe.issuing.cards.update(card.cardId, {
            cancellation_reason: 'stolen',
            status: 'canceled',
        });
        await card.delete();
        return { message: 'Card canceled successfully' };
    }
}
export default new StripeCard();
//# sourceMappingURL=stripe_card_service.js.map