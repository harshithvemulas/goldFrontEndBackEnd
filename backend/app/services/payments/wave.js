import axios from 'axios';
class Wave {
    apiKey;
    webhookKey;
    baseUrl = 'https://api.wave.com';
    constructor(gateway) {
        this.apiKey = gateway?.apiKey;
        this.webhookKey = gateway?.secretKey;
    }
    async createPayment(deposit, trxSecret, urls) {
        try {
            const { data } = await axios.post(`${this.baseUrl}/v1/checkout/sessions`, {
                amount: Math.round(deposit.amount),
                currency: deposit.metaData.currency,
                client_reference: trxSecret,
                success_url: urls.success,
                error_url: urls.failed,
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Idempotency-Key': trxSecret,
                },
            });
            return data.wave_launch_url;
        }
        catch (error) {
            throw new Error(error.response.data?.message);
        }
    }
    async validateWebhook(sessionId) {
        try {
            const { data } = await axios.get(`${this.baseUrl}/v1/checkout/sessions/${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return data;
        }
        catch (error) {
            throw new Error(error.response.data);
        }
    }
}
export default Wave;
//# sourceMappingURL=wave.js.map