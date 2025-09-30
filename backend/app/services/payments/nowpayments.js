import DepositGateway from '#models/deposit_gateway';
import brandingService from '#services/branding_service';
import axios from 'axios';
const nowPayments = async (deposit, trxSecret, urls) => {
    try {
        const branding = await brandingService();
        const gatewayData = await DepositGateway.findBy('value', 'nowpayments');
        const { data } = await axios.post(`https://api.nowpayments.io/v1/invoice`, {
            price_amount: deposit.amount,
            price_currency: deposit.metaData.currency,
            order_id: trxSecret,
            ipn_callback_url: `${urls.apiUrl}/webhooks/nowpayments`,
            success_url: urls.success,
            cancel_url: urls.failed,
            order_description: `Payment to ${branding.siteName}`,
        }, {
            headers: {
                'x-api-key': gatewayData.apiKey,
            },
        });
        return data.invoice_url;
    }
    catch {
        throw new Error('Error processing nowpayments');
    }
};
export default nowPayments;
//# sourceMappingURL=nowpayments.js.map