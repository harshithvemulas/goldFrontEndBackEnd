import Card from '#models/card';
import Customer from '#models/customer';
import ExternalPlugin from '#models/external_plugin';
import User from '#models/user';
import { DateTime } from 'luxon';
import axios from 'axios';
class SudoCard {
    sudoData;
    request;
    vgsRequest;
    constructor() {
        this.createSudoEnv();
    }
    async createSudoEnv() {
        const sudoData = await ExternalPlugin.findByOrFail('value', 'sudo-africa');
        this.request = axios.create({
            baseURL: sudoData?.apiKey2 === 'sandbox'
                ? 'https://api.sandbox.sudo.cards'
                : 'https://api.sudo.africa',
            headers: {
                Authorization: `${sudoData?.apiKey}`,
            },
        });
        this.vgsRequest = axios.create({
            baseURL: sudoData?.apiKey2 === 'sandbox'
                ? 'https://tntbuyt0v9u.sandbox.verygoodproxy.com'
                : 'https://tntpaxvvvet.live.verygoodproxy.com',
        });
        this.sudoData = sudoData;
    }
    async createCustomer(userId) {
        await this.createSudoEnv();
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
        const customerDob = DateTime.fromISO(user?.customer?.dob.toISOString()).toFormat('yyyy/M/d');
        try {
            const { data } = await this.request.post('/customers', {
                type: 'individual',
                name: user?.customer?.name,
                phoneNumber: '+' + user?.customer?.phone,
                emailAddress: user?.email,
                status: 'active',
                billingAddress: {
                    line1: user?.customer?.address?.addressLine,
                    city: user?.customer?.address?.city,
                    state: user?.customer?.address?.city,
                    postalCode: user?.customer?.address?.zipCode,
                    country: user?.customer?.address?.countryCode,
                },
                individual: {
                    firstName: user?.customer?.firstName,
                    lastName: user?.customer?.lastName,
                    dob: customerDob,
                },
            });
            await Customer.query().where('userId', userId).update({
                cardholderId: data?.data?._id,
            });
            return { message: 'Cardholder generated successfully' };
        }
        catch (error) {
            throw new Error(error?.response?.data?.message || 'Error generating cardholder');
        }
    }
    async createCard(userId, wallet) {
        await this.createSudoEnv();
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
        try {
            const { data } = await this.request.post('/cards', {
                customerId: user?.customer?.cardholderId,
                type: 'virtual',
                brand: this.sudoData?.secretKey,
                currency: wallet.currency?.code,
                status: 'active',
                debitAccountId: this.sudoData?.apiKey3,
                fundingSourceId: this.sudoData?.ex1,
            });
            if (data?.statusCode !== 200)
                throw new Error(data?.message);
            const cardToken = await this.createToken(data?.data?._id);
            const { data: vgsNumber } = await this.vgsRequest.get('/cards/' + data?.data?._id + '/secure-data/number', {
                headers: {
                    Authorization: `Bearer ${cardToken}`,
                },
            });
            const { data: vgsCvv } = await this.vgsRequest.get('/cards/' + data?.data?._id + '/secure-data/cvv2', {
                headers: {
                    Authorization: `Bearer ${cardToken}`,
                },
            });
            await Card.create({
                userId: user.id,
                walletId: wallet.id,
                cardId: data?.data?._id,
                type: 'virtual',
                lastFour: data?.data?.maskedPan?.split('*')[6],
                brand: data?.data?.brand,
                expMonth: data?.data?.expiryMonth.toString(),
                expYear: data?.data?.expiryYear.toString(),
                number: vgsNumber?.data?.number,
                cvc: vgsCvv?.data?.cvv2,
            });
            return { message: 'Card generated successfully' };
        }
        catch (error) {
            throw new Error(error?.response?.data?.message || error || 'Error generating card');
        }
    }
    async changeCardStatus(cardId, status) {
        await this.createSudoEnv();
        try {
            const card = await Card.query().where('id', cardId).firstOrFail();
            await this.request.put(`/cards/${card.cardId}`, { status });
            await card.merge({ status }).save();
            return { message: 'Card status updated successfully' };
        }
        catch (error) {
            throw new Error(error?.response?.data?.message || 'Error updating card status');
        }
    }
    async cancelCard(cardId) {
        await this.createSudoEnv();
        try {
            const card = await Card.query().where('id', cardId).firstOrFail();
            await this.request.put(`/cards/${card.cardId}`, { status: 'canceled' });
            await card.merge({ status: 'canceled' }).save();
            return { message: 'Card status updated successfully' };
        }
        catch (error) {
            throw new Error(error?.response?.data?.message || 'Error updating card status');
        }
    }
    async createToken(cardId) {
        await this.createSudoEnv();
        try {
            const { data } = await this.request.get(`/cards/${cardId}/token`);
            return data?.data?.token;
        }
        catch (error) {
            throw new Error(error?.response?.data?.message || 'Error generating token');
        }
    }
}
export default new SudoCard();
//# sourceMappingURL=sudo_card_service.js.map