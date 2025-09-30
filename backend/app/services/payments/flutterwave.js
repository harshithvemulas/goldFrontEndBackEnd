import DepositGateway from '#models/deposit_gateway';
import brandingService from '#services/branding_service';
import axios from 'axios';
const flutterwave = async (deposit, trxSecret) => {
    try {
        const branding = await brandingService();
        const gateway = await DepositGateway.findByOrFail('value', 'flutterwave');
        const { data: paymentData } = await axios.post('https://api.flutterwave.com/v3/payments', {
            tx_ref: trxSecret,
            amount: deposit.amount,
            currency: deposit.metaData.currency,
            redirect_url: `${branding.apiUrl}/webhooks/flutterwave`,
            customer: {
                email: deposit?.user?.email,
            },
            customizations: {
                title: branding.siteName,
            },
        }, {
            headers: {
                Authorization: `Bearer ${gateway.secretKey}`,
            },
        });
        if (paymentData.status !== 'success') {
            throw new Error('Flutterwave payment failed');
        }
        return paymentData.data.link;
    }
    catch {
        throw new Error('Flutterwave payment failed');
    }
};
export default flutterwave;
//# sourceMappingURL=flutterwave.js.map