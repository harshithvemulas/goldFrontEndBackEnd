import DepositGateway from '#models/deposit_gateway';
import env from '#start/env';
import bkashPayment from './payments/bkash.js';
import cashfreePayment from './payments/cashfree.js';
import Coinbase from './payments/coinbase.js';
import coingatePayment from './payments/coingate.js';
import flutterwave from './payments/flutterwave.js';
import molliePayment from './payments/mollie.js';
import nowPayments from './payments/nowpayments.js';
import PaypalPayment from './payments/paypal.js';
import Paydunya from './payments/paydunya.js';
import payfastPayment from './payments/payfast.js';
import paystackPayment from './payments/paystack.js';
import PerfectMoney from './payments/perfectmoney.js';
import razorPayPayment from './payments/razorpay.js';
import stripePayment from './payments/stripe.js';
import Wave from './payments/wave.js';
import { Encryption } from '@adonisjs/core/encryption';
import brandingService from './branding_service.js';
const processPayment = async (deposit, gateway, apiPayment = false) => {
    try {
        const encryption = new Encryption({
            secret: env.get('APP_KEY'),
        });
        const trxSecret = encryption.encrypt(deposit.trxId);
        const branding = await brandingService();
        let urls = {
            siteUrl: branding.siteUrl,
            apiUrl: branding.apiUrl,
            success: `${branding.siteUrl}/deposit/transaction-status?trxId=${deposit.trxId}&status=completed`,
            failed: `${branding.siteUrl}/deposit/transaction-status?trxId=${deposit.trxId}&status=failed`,
            check: `${branding.siteUrl}/deposit/transaction-status?trxId=${deposit.trxId}`,
        };
        if (apiPayment) {
            urls = {
                siteUrl: branding.siteUrl,
                apiUrl: branding.apiUrl,
                success: `${branding.siteUrl}/mpay/review?trxId=${deposit.trxId}&status=completed`,
                failed: `${branding.siteUrl}/mpay/review?trxId=${deposit.trxId}&status=failed`,
                check: `${branding.siteUrl}/mpay/review?trxId=${deposit.trxId}`,
            };
        }
        switch (gateway.value) {
            case 'paydunya':
                const paydunyaGateway = await DepositGateway.findByOrFail('value', 'paydunya');
                const paydunya = new Paydunya(paydunyaGateway);
                const paydunyaData = await paydunya.generateInvoice(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: paydunyaData?.redirect,
                };
            case 'coinbase':
                const coinbase = new Coinbase();
                const coinbaseData = await coinbase.createPayment(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: coinbaseData.hosted_url,
                };
            case 'stripe':
                const stripeData = await stripePayment(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: stripeData,
                };
            case 'bkash':
                const bkashData = await bkashPayment(deposit);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: bkashData,
                };
            case 'paystack':
                const paystackData = await paystackPayment(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: paystackData,
                };
            case 'payfast':
                const payfastData = await payfastPayment(deposit);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: payfastData,
                };
            case 'cashfree':
                const cashfreeData = await cashfreePayment(deposit, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: cashfreeData,
                };
            case 'mollie':
                const mollieData = await molliePayment(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: mollieData,
                };
            case 'coingate':
                const coingateData = await coingatePayment(deposit, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: coingateData,
                };
            case 'razorpay':
                const razorpayData = await razorPayPayment(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: razorpayData,
                };
            case 'nowpayments':
                const nowPaymentsData = await nowPayments(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: nowPaymentsData,
                };
            case 'wave':
                const wave = new Wave(gateway);
                const waveData = await wave.createPayment(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: waveData,
                };
            case 'flutterwave':
                const flutterwaveData = await flutterwave(deposit, trxSecret);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: flutterwaveData,
                };
            case 'perfectmoney':
                const perfectMoney = new PerfectMoney(gateway);
                const perfectMoneyData = await perfectMoney.createPayment(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'post',
                    postData: perfectMoneyData,
                };
            case 'paypal':
                const paypal = new PaypalPayment(gateway);
                const paypalData = await paypal.createPaypalCheckout(deposit, trxSecret, urls);
                return {
                    success: true,
                    message: 'Deposit processed successfully',
                    data: apiPayment ? undefined : deposit,
                    type: 'redirect',
                    redirect: paypalData,
                };
            default:
                return { success: true, message: 'Deposit processed successfully' };
        }
    }
    catch (error) {
        throw new Error(error);
    }
};
export default processPayment;
//# sourceMappingURL=process_payments.js.map