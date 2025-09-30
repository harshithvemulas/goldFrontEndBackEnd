import DepositGateway from '#models/deposit_gateway';
import axios from 'axios';
const paystackPayment = async (deposit, trxSecret, urls) => {
    try {
        const gatewayData = await DepositGateway.findBy('value', 'paystack');
        const { data } = await axios.post(`https://api.paystack.co/transaction/initialize`, {
            email: deposit?.user?.email,
            amount: deposit.amount * 100,
            currency: deposit.currency,
            callback_url: `${urls.apiUrl}/webhooks/paystack`,
            reference: trxSecret,
            metadata: {
                cancel_action: urls.failed,
            },
        }, {
            headers: {
                Authorization: 'Bearer ' + gatewayData.secretKey,
            },
        });
        return data.data.authorization_url;
    }
    catch {
        throw new Error('Error processing paystack');
    }
};
export default paystackPayment;
//# sourceMappingURL=paystack.js.map