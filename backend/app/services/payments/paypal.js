import axios from 'axios';
import brandingService from '#services/branding_service';
class PaypalPayment {
    clientId;
    clientSecret;
    paypalBaseUrl;
    constructor(gateway) {
        this.clientId = gateway.apiKey || '';
        this.clientSecret = gateway.secretKey || '';
        this.paypalBaseUrl =
            gateway.ex1 === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
    }
    async generateAccessToken() {
        try {
            const response = await axios({
                url: this.paypalBaseUrl + '/v1/oauth2/token',
                method: 'post',
                data: 'grant_type=client_credentials',
                auth: {
                    username: this.clientId,
                    password: this.clientSecret,
                },
            });
            return response.data.access_token;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async createPaypalCheckout(deposit, trxSecret, urls) {
        try {
            const branding = await brandingService();
            if (!branding?.siteUrl) {
                throw new Error('Base URL configuration error');
            }
            const accessToken = await this.generateAccessToken();
            const response = await axios({
                url: this.paypalBaseUrl + '/v2/checkout/orders',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                data: JSON.stringify({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            custom_id: trxSecret,
                            amount: {
                                currency_code: deposit.metaData.currency?.toUpperCase(),
                                value: deposit.amount,
                            },
                        },
                    ],
                    application_context: {
                        return_url: urls.success,
                        cancel_url: urls.failed,
                        shipping_preference: 'NO_SHIPPING',
                        user_action: 'PAY_NOW',
                        brand_name: branding.siteName || '',
                    },
                }),
            });
            return response.data.links.find((link) => link.rel === 'approve').href;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async capturePaypalPayment(paypalOrderId) {
        try {
            const accessToken = await this.generateAccessToken();
            const response = await axios({
                url: this.paypalBaseUrl + `/v2/checkout/orders/${paypalOrderId}/capture`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async verifyWebhookSignature(body) {
        try {
            const accessToken = await this.generateAccessToken();
            const response = await axios({
                url: this.paypalBaseUrl + '/v1/notifications/verify-webhook-signature',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                data: JSON.stringify(body),
            });
            return response.data;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
export default PaypalPayment;
//# sourceMappingURL=paypal.js.map