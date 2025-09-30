import DepositGateway from '#models/deposit_gateway';
import brandingService from '#services/branding_service';
import Razorpay from 'razorpay';
const razorPayPayment = async (deposit, trxSecret, urls) => {
    try {
        const branding = await brandingService();
        const gateway = await DepositGateway.findByOrFail('value', 'razorpay');
        const razorpay = new Razorpay({
            key_id: gateway.apiKey,
            key_secret: gateway.secretKey,
        });
        const payment = await razorpay.orders.create({
            amount: deposit.amount * 100,
            currency: deposit.metaData.currency,
            receipt: 'Deposit #' + deposit.trxId,
            notes: {
                trxSecret,
            },
        });
        return (branding.apiUrl +
            `/payment-gateway/razorpay?keyId=${gateway.apiKey}&orderId=${payment.id}&amount=${payment.amount}&currency=${payment.currency}&name=${branding.siteName}&&prefillEmail=${deposit.user.email}&prefillContact=${deposit.user.customer.phone || '00000'}&callbackUrl=${branding.apiUrl}/webhooks/razorpay&cancelUrl=${urls.failed}`);
    }
    catch (error) {
        throw new Error(error);
    }
};
export default razorPayPayment;
//# sourceMappingURL=razorpay.js.map