import DepositGateway from '#models/deposit_gateway';
import axios from 'axios';
const cashfreePayment = async (deposit, urls) => {
    try {
        const gatewayData = await DepositGateway.findBy('value', 'cashfree');
        let baseUrl = 'https://api.cashfree.com/pg';
        if (gatewayData?.secretKey?.includes('test')) {
            baseUrl = 'https://sandbox.cashfree.com/pg';
        }
        if (!deposit.user.customer.phone) {
            throw new Error('Phone number is required for cashfree payment. Please update your profile.');
        }
        if (!deposit.user.customer.phone.startsWith('+91')) {
            throw new Error('+91 is the only supported country code for cashfree payment. Please update your profile.');
        }
        const { data } = await axios.post(`${baseUrl}/orders`, {
            order_amount: deposit.amount,
            order_currency: deposit.metaData.currency,
            customer_details: {
                customer_id: `${deposit?.user?.id}`,
                customer_phone: deposit?.user?.customer?.phone,
            },
            order_meta: {
                notify_url: `${urls.apiUrl}/webhooks/cashfree`,
                return_url: urls.check,
            },
            order_id: deposit.trxId,
        }, {
            headers: {
                'x-api-version': '2023-08-01',
                'X-Client-Id': gatewayData.apiKey,
                'X-Client-Secret': gatewayData.secretKey,
            },
        });
        return urls.apiUrl + `/payment-gateway/cashfree?sessionId=${data?.payment_session_id}`;
    }
    catch (e) {
        throw new Error(e?.response?.data?.message || e || 'Error processing cashfree');
    }
};
export default cashfreePayment;
//# sourceMappingURL=cashfree.js.map