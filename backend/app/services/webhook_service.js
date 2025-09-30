import MerchantWebhook from '#models/merchant_webhook';
import Transaction from '#models/transaction';
import axios from 'axios';
const webhookService = async (id) => {
    const transaction = await Transaction.findByOrFail('id', id);
    if (!transaction.metaDataParsed?.apiPayment) {
        return;
    }
    await transaction.load('user');
    await transaction.user.load('merchant');
    try {
        const { data } = await axios.post(transaction?.metaDataParsed?.callbackUrl, {
            trxId: transaction.trxId,
            type: 'payment',
            paymentAmount: transaction.amount,
            paymentFee: transaction.fee,
            amountAfterProcessing: transaction.total,
            status: transaction.status,
            currency: transaction.currency,
            logo: transaction.metaDataParsed.logo,
            successUrl: transaction.metaDataParsed.successUrl,
            cancelUrl: transaction.metaDataParsed.cancelUrl,
            sandbox: transaction.metaDataParsed.sandbox,
            createdAt: transaction.createdAt,
            merchant: {
                name: transaction.user.merchant?.name,
                email: transaction.user.merchant?.email,
            },
        });
        await MerchantWebhook.create({
            type: 'POST',
            webhookUrl: transaction?.metaDataParsed?.callbackUrl,
            requestBody: JSON.stringify({
                trxId: transaction.trxId,
                type: 'payment',
                paymentAmount: transaction.amount,
                paymentFee: transaction.fee,
                amountAfterProcessing: transaction.total,
                status: transaction.status,
                currency: transaction.currency,
                logo: transaction.metaDataParsed.logo,
                successUrl: transaction.metaDataParsed.successUrl,
                cancelUrl: transaction.metaDataParsed.cancelUrl,
                sandbox: transaction.metaDataParsed.sandbox,
                createdAt: transaction.createdAt,
                merchant: {
                    name: transaction.user.merchant?.name,
                    email: transaction.user.merchant?.email,
                },
            }),
            responseBody: JSON.stringify(data) || '',
            statusCode: 200,
            userId: transaction.userId,
        });
    }
    catch (error) {
        await MerchantWebhook.create({
            type: 'POST',
            webhookUrl: transaction?.metaDataParsed?.callbackUrl || '',
            requestBody: JSON.stringify({
                trxId: transaction.trxId,
                type: 'payment',
                paymentAmount: transaction.amount,
                paymentFee: transaction.fee,
                amountAfterProcessing: transaction.total,
                status: transaction.status,
                currency: transaction.currency,
                logo: transaction.metaDataParsed.logo,
                successUrl: transaction.metaDataParsed.successUrl,
                cancelUrl: transaction.metaDataParsed.cancelUrl,
                sandbox: transaction.metaDataParsed.sandbox,
                createdAt: transaction.createdAt,
                merchant: {
                    name: transaction.user.merchant?.name,
                    email: transaction.user.merchant?.email,
                },
            }),
            responseBody: JSON.stringify(error?.response?.data) || '',
            statusCode: error?.response?.status || 400,
            userId: transaction.userId,
        });
    }
};
export default webhookService;
//# sourceMappingURL=webhook_service.js.map