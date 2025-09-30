import DepositGateway from '#models/deposit_gateway';
import brandingService from '#services/branding_service';
import axios from 'axios';
const coingatePayment = async (deposit, urls) => {
    try {
        const branding = await brandingService();
        const gatewayData = await DepositGateway.findBy('value', 'coingate');
        const { data } = await axios.post(`https://${gatewayData?.ex1 === 'sandbox' ? 'api-sandbox' : 'api'}.coingate.com/v2/orders`, {
            title: `Payment to ${branding.siteName}`,
            price_amount: deposit.amount,
            price_currency: deposit.metaData.currency,
            receive_currency: 'EUR',
            callback_url: `${urls.apiUrl}/webhooks/coingate`,
            cancel_url: urls.failed,
            success_url: urls.success,
            order_id: deposit.trxId,
            purchaser_email: deposit.user.email,
        }, {
            headers: {
                Authorization: `Token ${gatewayData.apiKey}`,
            },
        });
        return data.payment_url;
    }
    catch {
        throw new Error('Coingate payment failed');
    }
};
export default coingatePayment;
//# sourceMappingURL=coingate.js.map