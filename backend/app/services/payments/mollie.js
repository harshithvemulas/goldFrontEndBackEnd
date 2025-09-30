import DepositGateway from '#models/deposit_gateway';
import { createMollieClient } from '@mollie/api-client';
const molliePayment = async (deposit, trxSecret, urls) => {
    try {
        const gateway = await DepositGateway.findByOrFail('value', 'mollie');
        const mollieClient = createMollieClient({
            apiKey: gateway.apiKey,
        });
        const payment = await mollieClient.payments.create({
            amount: {
                value: deposit.amount.toFixed(2),
                currency: deposit.metaData.currency,
            },
            description: 'Deposit #' + deposit.trxId,
            metadata: trxSecret,
            redirectUrl: urls.success,
            cancelUrl: urls.failed,
            webhookUrl: `${urls.apiUrl}/webhooks/mollie`,
        });
        return payment.getCheckoutUrl();
    }
    catch (error) {
        throw new Error(error);
    }
};
export default molliePayment;
//# sourceMappingURL=mollie.js.map