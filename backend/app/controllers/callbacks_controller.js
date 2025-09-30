import errorHandler from '#exceptions/error_handler';
import Wave from '#services/payments/wave';
import PaypalPayment from '#services/payments/paypal';
import DepositGateway from '#models/deposit_gateway';
import { validateDeposit } from '#services/deposit_service';
import Stripe from 'stripe';
import axios from 'axios';
import brandingService from '#services/branding_service';
import Transaction from '#models/transaction';
import { Encryption } from '@adonisjs/core/encryption';
import env from '#start/env';
import { createMollieClient } from '@mollie/api-client';
import Razorpay from 'razorpay';
const encryption = new Encryption({
    secret: env.get('APP_KEY'),
});
export default class CallbacksController {
    async validateCoinbase(ctx) {
        const { request, response } = ctx;
        try {
            const { event } = request.body();
            await validateDeposit(event?.type === 'charge:confirmed', event?.data?.metadata?.trxSecret);
            return response.json({
                success: true,
                message: 'Webhook processed successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Validate Coinbase Error');
        }
    }
    async validateStripe({ request, response }) {
        const data = request.raw();
        const sig = request.header('stripe-signature');
        try {
            const gateway = await DepositGateway.findByOrFail('value', 'stripe');
            const stripe = new Stripe(gateway.apiKey);
            let event;
            try {
                event = stripe.webhooks.constructEvent(data ?? '', sig, gateway.secretKey);
            }
            catch (err) {
                return response.badRequest(`Webhook Error: ${err.message}`);
            }
            const session = event.data.object;
            await validateDeposit(event.type === 'checkout.session.completed', session.metadata.ref);
            return response.json({ success: true, message: 'Payment successful' });
        }
        catch {
            return response.badRequest({ success: false, message: 'Payment failed' });
        }
    }
    async flutterwaveVerify({ request, response }) {
        const data = request.only(['tx_ref', 'status', 'transaction_id']);
        const branding = await brandingService();
        const decrypted = encryption.decrypt(data.tx_ref);
        const deposit = await Transaction.findByOrFail('trxId', decrypted);
        try {
            const gateway = await DepositGateway.findByOrFail('value', 'flutterwave');
            const { data: paymentData } = await axios.get(`https://api.flutterwave.com/v3/transactions/${data.transaction_id}/verify`, {
                headers: {
                    Authorization: `Bearer ${gateway.secretKey}`,
                },
            });
            await validateDeposit(paymentData.data.status === 'successful', data.tx_ref);
            if (deposit.metaDataParsed?.apiPayment) {
                return response
                    .redirect()
                    .toPath(branding.siteUrl +
                    `/mpay/review?trxId=${deposit.trxId}&status=${paymentData.data.status === 'successful' ? 'completed' : 'failed'}`);
            }
            return response
                .redirect()
                .toPath(branding.siteUrl +
                `/deposit/transaction-status?trxId=${deposit.trxId}&status=${paymentData.data.status === 'successful' ? 'completed' : 'failed'}`);
        }
        catch {
            if (deposit.metaDataParsed?.apiPayment) {
                return response
                    .redirect()
                    .toPath(branding.siteUrl + `/mpay/review?trxId=${deposit.trxId}&status=failed`);
            }
            return response
                .redirect()
                .toPath(branding.siteUrl + `/deposit/transaction-status?trxId=${deposit.trxId}&status=failed`);
        }
    }
    async validateWaveCI(ctx) {
        const { data, type } = ctx.request.body();
        try {
            const gateway = await DepositGateway.findByOrFail({ active: true, value: 'wave_ci' });
            const wave = new Wave(gateway);
            const waveValidated = await wave.validateWebhook(data?.id);
            if (!waveValidated || waveValidated?.client_reference !== data?.client_reference) {
                return ctx.response.status(400).json({
                    success: false,
                    message: 'Invalid request',
                });
            }
            await validateDeposit(type === 'checkout.session.completed', data?.client_reference);
            return ctx.response.json({
                success: true,
                message: 'Webhook processed successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Validate Wave CI Error');
        }
    }
    async validatePerfectMoney(ctx) {
        const { PAYMENT_ID } = ctx.request.body();
        try {
            await validateDeposit(true, PAYMENT_ID);
            return ctx.response.json({
                success: true,
                message: 'Webhook processed successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Validate Perfect Money Error');
        }
    }
    async validatePaydunya({ request, response }) {
        const { data } = request.body();
        try {
            if (!data?.custom_data?.paymentSecret) {
                return response.json({
                    success: false,
                    message: 'Invalid request',
                });
            }
            await validateDeposit(data.status === 'completed', data?.custom_data?.paymentSecret);
            return response.json({
                success: true,
                message: 'Payment processed successfully',
            });
        }
        catch (err) {
            return response.json({
                success: false,
                message: 'Invalid request',
            });
        }
    }
    async validateMollie({ request, response }) {
        const { id } = request.body();
        try {
            const gateway = await DepositGateway.findByOrFail('value', 'mollie');
            const mollieClient = createMollieClient({
                apiKey: gateway.apiKey,
            });
            const payment = await mollieClient.payments.get(id);
            await validateDeposit(payment.status === 'paid', payment?.metadata);
            return response.json({
                success: true,
                message: 'Payment processed successfully',
            });
        }
        catch (error) {
            return response.json({
                success: false,
                message: 'Invalid request',
            });
        }
    }
    async validateCoingate(ctx) {
        const { request, response } = ctx;
        try {
            const { id } = request.body();
            const gatewayData = await DepositGateway.findBy('value', 'coingate');
            const { data } = await axios.get(`https://${gatewayData?.ex1 === 'sandbox' ? 'api-sandbox' : 'api'}.coingate.com/v2/orders/${id}`, {
                headers: {
                    Authorization: `Token ${gatewayData.apiKey}`,
                },
            });
            if (data?.status === 'pending')
                return response.json({ success: true, message: 'Payment is pending' });
            const trxSecret = encryption.encrypt(data?.order_id);
            await validateDeposit(data?.status === 'paid', trxSecret);
            return response.json({
                success: true,
                message: 'Payment processed successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Validate Coingate Error');
        }
    }
    async validateNowPayments(ctx) {
        const { request, response } = ctx;
        try {
            const { order_id: orderId, payment_status: paymentStatus } = request.body();
            if (paymentStatus === 'waiting') {
                return response.json({
                    success: true,
                    message: 'Payment is pending',
                });
            }
            await validateDeposit(paymentStatus === 'finished', orderId);
            return response.json({
                success: true,
                message: 'Payment processed successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Validate NowPayments Error');
        }
    }
    async validateBkash(ctx) {
        const { request, response } = ctx;
        const branding = await brandingService();
        try {
            const { paymentID } = request.qs();
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
            const { data } = await axios.post(`${baseUrl}/payment/status`, {
                paymentID,
            }, {
                headers: {
                    'Authorization': tokenData?.id_token,
                    'X-App-Key': gatewayData?.apiKey,
                },
            });
            const deposit = await Transaction.findByOrFail('trxId', data?.merchantInvoice);
            if (data?.transactionStatus === 'Initiated') {
                return response
                    .redirect()
                    .toPath(branding.siteUrl + `/deposit/transaction-status?trxId=${deposit.trxId}&status=failed`);
            }
            const trxSecret = encryption.encrypt(data?.merchantInvoice);
            await validateDeposit(data?.transactionStatus === 'Completed', trxSecret);
            return response
                .redirect()
                .toPath(branding.siteUrl + `/deposit/transaction-status?trxId=${deposit.trxId}&status=completed`);
        }
        catch (error) {
            return response.redirect().toPath(branding.siteUrl + `/transaction-history`);
        }
    }
    async validatePaystack({ request, response }) {
        const { reference } = request.qs();
        const branding = await brandingService();
        const decrypted = encryption.decrypt(reference);
        const deposit = await Transaction.findByOrFail('trxId', decrypted);
        try {
            const gateway = await DepositGateway.findByOrFail('value', 'paystack');
            const { data: paymentData } = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${gateway.secretKey}`,
                },
            });
            await validateDeposit(paymentData?.data?.status === 'success', reference);
            if (deposit.metaDataParsed?.apiPayment) {
                return response
                    .redirect()
                    .toPath(branding.siteUrl +
                    `/mpay/review?trxId=${deposit.trxId}&status=${paymentData?.data?.status === 'success' ? 'completed' : 'failed'}`);
            }
            return response
                .redirect()
                .toPath(branding.siteUrl +
                `/deposit/transaction-status?trxId=${deposit.trxId}&status=${paymentData?.data?.status === 'success' ? 'completed' : 'failed'}`);
        }
        catch {
            if (deposit.metaDataParsed?.apiPayment) {
                return response
                    .redirect()
                    .toPath(branding.siteUrl + `/mpay/review?trxId=${deposit.trxId}&status=failed`);
            }
            return response.redirect().toPath(branding.siteUrl + '/transaction-history');
        }
    }
    async validateRazorpay({ request, response }) {
        const { razorpay_payment_id: razorpayPaymentId } = request.body();
        const branding = await brandingService();
        try {
            const gateway = await DepositGateway.findByOrFail('value', 'razorpay');
            const razorpay = new Razorpay({
                key_id: gateway.apiKey,
                key_secret: gateway.secretKey,
            });
            const payment = await razorpay.payments.fetch(razorpayPaymentId);
            await validateDeposit(payment.status === 'captured', payment.notes.trxSecret);
            const decrypted = encryption.decrypt(payment.notes.trxSecret);
            const deposit = await Transaction.findByOrFail('trxId', decrypted);
            if (deposit.metaDataParsed?.apiPayment) {
                return response
                    .redirect()
                    .toPath(branding.siteUrl +
                    `/mpay/review?trxId=${deposit.trxId}&status=${payment.status === 'captured' ? 'completed' : 'failed'}`);
            }
            return response
                .redirect()
                .toPath(branding.siteUrl +
                `/deposits/transaction-status?trxId=${deposit.trxId}&status=${payment.status === 'captured' ? 'completed' : 'failed'}`);
        }
        catch {
            return response.redirect().toPath(branding.siteUrl + '/transaction-history');
        }
    }
    async validateCashfree({ request, response }) {
        const { data } = request.body();
        try {
            const trxSecret = encryption.encrypt(data?.order?.order_id);
            await validateDeposit(data?.payment.payment_status === 'SUCCESS', trxSecret);
            return response.json({
                success: true,
                message: 'Payment processed successfully',
            });
        }
        catch {
            return response.json({
                success: false,
                message: 'Invalid request',
            });
        }
    }
    async validatePayfast({ request, response }) {
        const { m_payment_id: paymentId, payment_status: paymentStatus } = request.body();
        try {
            const trxSecret = encryption.encrypt(paymentId);
            await validateDeposit(paymentStatus === 'COMPLETE', trxSecret);
            return response.json({
                success: true,
                message: 'Payment processed successfully',
            });
        }
        catch {
            return response.json({
                success: false,
                message: 'Invalid request',
            });
        }
    }
    async payfastGateway({ request, response, view }) {
        try {
            const { merchantId, merchantKey, amount, itemName, trxId, mode } = request.qs();
            const branding = await brandingService();
            const deposit = await Transaction.findByOrFail('trxId', trxId);
            let returnUrl = branding.siteUrl + `/deposit/transaction-status?trxId=${trxId}&status=completed`;
            let cancelUrl = branding.siteUrl + `/deposit/transaction-status?trxId=${trxId}&status=failed`;
            if (deposit.metaDataParsed?.apiPayment) {
                returnUrl = branding.siteUrl + `/mpay/review?trxId=${trxId}&status=completed`;
                cancelUrl = branding.siteUrl + `/mpay/review?trxId=${trxId}&status=failed`;
            }
            return view.render('gateways/payfast', {
                merchantId,
                merchantKey,
                amount,
                itemName,
                trxId,
                mode,
                returnUrl,
                cancelUrl,
                notifyUrl: branding.apiUrl + '/webhooks/payfast',
            });
        }
        catch {
            const branding = await brandingService();
            return response.redirect().toPath(branding.siteUrl + '/transaction-history');
        }
    }
    async razorPayGateway({ request, response, view }) {
        try {
            const { keyId, orderId, amount, currency, name, prefillEmail, prefillContact, callbackUrl, cancelUrl, } = request.qs();
            return view.render('gateways/razorpay', {
                keyId,
                orderId,
                amount,
                currency,
                name,
                prefillEmail,
                prefillContact,
                callbackUrl,
                cancelUrl,
            });
        }
        catch {
            const branding = await brandingService();
            return response.redirect().toPath(branding.siteUrl + '/transaction-history');
        }
    }
    async cashfreeGateway({ request, response, view }) {
        try {
            const gatewayData = await DepositGateway.findByOrFail('value', 'cashfree');
            const { sessionId } = request.qs();
            return view.render('gateways/cashfree', {
                sessionId,
                mode: gatewayData.secretKey?.includes('test') ? 'sandbox' : 'production',
            });
        }
        catch {
            const branding = await brandingService();
            return response.redirect().toPath(branding.siteUrl + '/transaction-history');
        }
    }
    async validatePaypal({ request, response }) {
        const payload = request.body();
        const transmissionID = request.header('paypal-transmission-id');
        const transmissionTime = request.header('paypal-transmission-time');
        const certURL = request.header('paypal-cert-url');
        const authAlgo = request.header('paypal-auth-algo');
        const transmissionSig = request.header('paypal-transmission-sig');
        try {
            const gateway = await DepositGateway.findByOrFail('value', 'paypal');
            const body = {
                transmission_id: transmissionID,
                transmission_time: transmissionTime,
                cert_url: certURL,
                auth_algo: authAlgo,
                transmission_sig: transmissionSig,
                webhook_id: gateway.ex2,
                webhook_event: payload,
            };
            const paypal = new PaypalPayment(gateway);
            const responseData = await paypal.verifyWebhookSignature(body);
            if (responseData.verification_status !== 'SUCCESS') {
                return response.abort({
                    success: false,
                    message: 'Paypal Webhook Error, payload verification failure.',
                });
            }
            await validateDeposit(payload.event_type === 'CHECKOUT.ORDER.APPROVED', payload.custom_id);
            return response.json({ success: true, message: 'Payment successful' });
        }
        catch {
            return response.badRequest({ success: false, message: 'Payment failed' });
        }
    }
}
//# sourceMappingURL=callbacks_controller.js.map