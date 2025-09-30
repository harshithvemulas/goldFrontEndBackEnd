import DepositGateway from '#models/deposit_gateway';
import brandingService from '#services/branding_service';
import axios from 'axios';
class Coinbase {
    baseUrl = 'https://api.commerce.coinbase.com';
    async createPayment(deposit, trxSecret, urls) {
        try {
            const branding = await brandingService();
            const gatewayData = await DepositGateway.findBy('value', 'coinbase');
            const apiKey = gatewayData.apiKey;
            const { data } = await axios.post(`${this.baseUrl}/charges`, {
                name: `${deposit.trxId}`,
                description: 'Payment to ' + branding.siteName,
                pricing_type: 'fixed_price',
                metadata: { trxSecret: trxSecret },
                local_price: {
                    amount: deposit.amount.toFixed(2),
                    currency: deposit.metaData.currency,
                },
                redirect_url: urls.success,
                cancel_url: urls.failed,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CC-Api-Key': apiKey,
                    'X-CC-Version': '2018-03-22',
                },
            });
            return data?.data;
        }
        catch (error) {
            throw new Error('Failed to initialize coinbase gateway');
        }
    }
}
export default Coinbase;
//# sourceMappingURL=coinbase.js.map