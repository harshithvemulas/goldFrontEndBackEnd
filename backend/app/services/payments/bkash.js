import DepositGateway from '#models/deposit_gateway';
import brandingService from '#services/branding_service';
import axios from 'axios';
const bkashPayment = async (deposit) => {
    try {
        const branding = await brandingService();
        const gatewayData = await DepositGateway.findBy('value', 'bkash');
        let baseUrl = 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout';
        if (gatewayData?.ex1?.includes('sandbox')) {
            baseUrl = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout';
        }
        const { data: tokenData } = await axios.post(baseUrl + '/token/grant', {
            app_key: gatewayData?.apiKey,
            app_secret: gatewayData?.secretKey,
        }, {
            headers: {
                username: gatewayData?.ex1,
                password: gatewayData?.ex2,
            },
        });
        const { data } = await axios.post(baseUrl + '/create', {
            mode: '0011',
            payerReference: deposit.trxId,
            callbackURL: `${branding.apiUrl}/webhooks/bkash`,
            amount: deposit.amount,
            currency: deposit.metaData.currency,
            intent: 'sale',
            merchantInvoiceNumber: deposit.trxId,
        }, {
            headers: {
                'Authorization': tokenData?.id_token,
                'X-App-Key': gatewayData?.apiKey,
            },
        });
        return data.bkashURL;
    }
    catch {
        throw new Error('Error processing bkash');
    }
};
export default bkashPayment;
//# sourceMappingURL=bkash.js.map