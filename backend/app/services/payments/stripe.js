import DepositGateway from '#models/deposit_gateway';
import brandingService from '#services/branding_service';
import Stripe from 'stripe';
const stripePayment = async (deposit, trxSecret, urls) => {
    try {
        const branding = await brandingService();
        const gateway = await DepositGateway.findByOrFail('value', 'stripe');
        const stripe = new Stripe(gateway.apiKey);
        const webhooks = await stripe.webhookEndpoints.list();
        const webhookExists = webhooks.data.find((webhook) => webhook.url === branding.apiUrl + '/webhooks/stripe');
        if (!webhookExists) {
            const data = await stripe.webhookEndpoints.create({
                url: branding.apiUrl + '/webhooks/stripe',
                enabled_events: ['checkout.session.completed'],
            });
            await gateway.merge({ secretKey: data.secret }).save();
        }
        const paymentIntent = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: deposit.metaData.currency,
                        product_data: {
                            name: `Deposit #${deposit.id}`,
                        },
                        unit_amount: deposit.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: { ref: trxSecret },
            success_url: urls.success,
            cancel_url: urls.failed,
        });
        return paymentIntent.url;
    }
    catch {
        throw new Error('Stripe gateway error');
    }
};
export default stripePayment;
//# sourceMappingURL=stripe.js.map