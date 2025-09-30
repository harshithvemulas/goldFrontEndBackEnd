import SendPaymentOtpNotification from '#mails/send_payment_otp_notification';
import Currency from '#models/currency';
import DepositGateway from '#models/deposit_gateway';
import Merchant from '#models/merchant';
import MerchantWebhook from '#models/merchant_webhook';
import Setting from '#models/setting';
import Token from '#models/token';
import Transaction from '#models/transaction';
import User from '#models/user';
import formatPrecision from '#utils/format_precision';
import mail from '@adonisjs/mail/services/main';
import { DateTime } from 'luxon';
import { Encryption } from '@adonisjs/core/encryption';
import env from '#start/env';
import { createApiPaymentQrSchema, createApiPaymentSchema } from '#validators/api_payment';
import errorHandler from '#exceptions/error_handler';
import brandingService from '#services/branding_service';
import processPayment from '#services/process_payments';
import webhookService from '#services/webhook_service';
import { addBalance } from '#services/wallet_service';
const encryption = new Encryption({
    secret: env.get('APP_KEY'),
});
export default class ApiController {
    async validate({ request, response }) {
        try {
            const { merchant } = request.body();
            return response.json(merchant);
        }
        catch {
            return response.status(400).json({ success: false, message: 'Invalid API Key' });
        }
    }
    async getGateways({ response }) {
        try {
            const gateways = await DepositGateway.query().orderBy('name', 'asc');
            const returnedGateways = gateways.map((gateway) => {
                return {
                    ...gateway.serialize(),
                    variables: JSON.parse(gateway.variables || '{}'),
                    allowedCountries: JSON.parse(gateway.allowedCountries || '[]'),
                    allowedCurrencies: JSON.parse(gateway.allowedCurrencies || '[]'),
                };
            });
            return response.json(returnedGateways);
        }
        catch {
            return response.status(400).json({ success: false, message: 'Failed to fetch gateways' });
        }
    }
    async getPaymentDetails(ctx) {
        const { request, response } = ctx;
        try {
            const { trxId } = request.params();
            const transaction = await Transaction.query()
                .where('trxId', trxId)
                .andWhere('type', 'payment')
                .andWhereILike('metaData', '%apiPayment%')
                .preload('user', (query) => {
                query.preload('merchant');
            })
                .firstOrFail();
            const gateways = await DepositGateway.query()
                .whereILike('allowedCurrencies', `%${transaction.currency}%`)
                .andWhere('active', true)
                .andWhere('activeApi', true)
                .orderBy('name', 'asc');
            const gatewaysMapped = gateways.map((gateway) => {
                return {
                    logoImage: gateway?.logoImage,
                    name: gateway.name,
                    value: gateway.value,
                };
            });
            const branding = await brandingService();
            return response.json({
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
                gateways: [
                    {
                        logoImage: branding.logo,
                        name: branding.siteName,
                        value: 'otp_pay',
                    },
                    ...gatewaysMapped,
                ],
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Payment Details Error');
        }
    }
    async getMerchantDetails(ctx) {
        const { request, response } = ctx;
        try {
            const { merchantId } = request.params();
            const merchant = await Merchant.query().where('id', merchantId).preload('user').firstOrFail();
            return response.json(merchant);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Merchant Details Error');
        }
    }
    async getPaymentStatus(ctx) {
        const { request, response } = ctx;
        try {
            const { trxId } = request.params();
            const { merchant } = request.body();
            const transaction = await Transaction.query()
                .where('trxId', trxId)
                .andWhere('type', 'payment')
                .andWhere('userId', merchant.userId)
                .andWhereILike('metaData', '%apiPayment%')
                .preload('user', (query) => {
                query.preload('merchant');
            })
                .firstOrFail();
            return response.json({
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
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Payment Status Error');
        }
    }
    async initiatePayment(ctx) {
        const { request, response } = ctx;
        try {
            const { trxId } = request.params();
            const { method } = request.body();
            const transaction = await Transaction.query()
                .where('trxId', trxId)
                .andWhere('type', 'payment')
                .andWhereILike('metaData', '%apiPayment%')
                .preload('user', (query) => {
                query.preload('merchant');
            })
                .firstOrFail();
            if (transaction.status !== 'pending') {
                return response.badRequest({
                    success: false,
                    message: 'Transaction already completed or failed',
                });
            }
            const gateway = await DepositGateway.findBy({ active: true, value: method });
            if (!gateway) {
                return response.notFound({
                    success: false,
                    message: 'This payment method is not valid or inactive.',
                });
            }
            if (!gateway.allowedCurrencies.includes(transaction.currency)) {
                return response.badRequest({
                    success: false,
                    message: 'This payment method is not valid for this currency.',
                });
            }
            await transaction.load('user');
            await transaction.user.load('customer');
            const returnObj = await processPayment({
                ...transaction,
                ...transaction.serialize(),
                metaData: JSON.parse(transaction.metaData),
                currency: transaction.currency,
                metaDataParsed: JSON.stringify(transaction.metaData),
            }, gateway, true);
            return response.json(returnObj);
        }
        catch (error) {
            errorHandler(error, ctx, 'Initiate Payment Error');
        }
    }
    async createPayment(ctx) {
        const { request, response } = ctx;
        try {
            const { amount, currency, logo, callbackUrl, successUrl, cancelUrl, sandbox, custom, customerName, customerEmail, merchant, feeByCustomer, } = await request.validateUsing(createApiPaymentSchema);
            const currencyData = await Currency.findBy('code', currency.toUpperCase());
            if (!currencyData) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            if (amount > currencyData.maxAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Max:) ${currencyData?.maxAmount}`,
                });
            }
            if (amount < currencyData.minAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Min:) ${currencyData?.minAmount}`,
                });
            }
            const user = await User.query()
                .where('id', merchant.userId)
                .preload('customer')
                .preload('merchant')
                .preload('agent')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'Merchant data not found' });
            }
            if (!user.permission.deposit) {
                return response.badRequest({
                    success: false,
                    message: 'Merchant permission denied',
                });
            }
            const paymentSetting = await Setting.findBy({ key: 'deposit', value1: 'on' });
            if (!paymentSetting) {
                return response.badRequest({
                    success: false,
                    message: 'This service is not available right now',
                });
            }
            let regularFeePercentage = paymentSetting ? formatPrecision(paymentSetting.value2 ?? 0) : 0;
            if (user?.merchant?.depositFee) {
                regularFeePercentage = formatPrecision(user?.merchant?.depositFee);
            }
            const fee = formatPrecision(amount * (regularFeePercentage / 100));
            const fromData = {
                label: customerName ?? '',
                email: customerEmail ?? '',
                currency: currency.toUpperCase() ?? '',
            };
            const toData = {
                image: user?.merchant?.storeProfileImage ?? '',
                label: user?.merchant?.name ?? '',
                email: user?.merchant?.email ?? '',
                currency: currency.toUpperCase() ?? '',
            };
            const deposit = await user.related('transactions').create({
                type: 'payment',
                from: fromData,
                to: toData,
                amount: feeByCustomer ? amount + fee : amount,
                fee,
                total: formatPrecision(feeByCustomer ? amount : amount - fee),
                metaData: {
                    currency: currency.toUpperCase(),
                    logo,
                    callbackUrl,
                    successUrl,
                    cancelUrl,
                    sandbox,
                    custom,
                    apiPayment: true,
                },
                status: 'pending',
            });
            const branding = await brandingService();
            return response.json({
                success: true,
                message: 'Payment created successfully',
                redirectUrl: branding.siteUrl + '/mpay?trxId=' + deposit.trxId,
                data: {
                    trxId: deposit.trxId,
                    type: 'payment',
                    paymentAmount: deposit.amount,
                    paymentFee: deposit.fee,
                    amountAfterProcessing: deposit.total,
                    status: deposit.status,
                    currency,
                    logo,
                    callbackUrl,
                    successUrl,
                    cancelUrl,
                    sandbox,
                    custom,
                    createdAt: deposit.createdAt,
                },
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Create API Payment Error');
        }
    }
    async createPaymentQrCode(ctx) {
        const { request, response } = ctx;
        try {
            const { amount, currency, customerName, customerEmail, merchantId, feeByCustomer } = await request.validateUsing(createApiPaymentQrSchema);
            const currencyData = await Currency.findBy('code', currency.toUpperCase());
            if (!currencyData) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            if (amount > currencyData.maxAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Max:) ${currencyData?.maxAmount}`,
                });
            }
            if (amount < currencyData.minAmount) {
                return response.badRequest({
                    success: false,
                    message: `Amount not allowed (Min:) ${currencyData?.minAmount}`,
                });
            }
            const merchant = await Merchant.query().where('id', merchantId).firstOrFail();
            const user = await User.query()
                .where('id', merchant.userId)
                .preload('customer')
                .preload('merchant')
                .preload('agent')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'Merchant data not found' });
            }
            if (!user.permission.deposit) {
                return response.badRequest({
                    success: false,
                    message: 'Merchant permission denied',
                });
            }
            const paymentSetting = await Setting.findBy({ key: 'deposit', value1: 'on' });
            if (!paymentSetting) {
                return response.badRequest({
                    success: false,
                    message: 'This service is not available right now',
                });
            }
            let regularFeePercentage = paymentSetting ? formatPrecision(paymentSetting.value2 ?? 0) : 0;
            if (user?.merchant?.depositFee) {
                regularFeePercentage = formatPrecision(user?.merchant?.depositFee);
            }
            const fee = formatPrecision(amount * (regularFeePercentage / 100));
            const fromData = {
                label: customerName ?? '',
                email: customerEmail ?? '',
                currency: currency.toUpperCase() ?? '',
            };
            const toData = {
                image: user?.merchant?.storeProfileImage ?? '',
                label: user?.merchant?.name ?? '',
                email: user?.merchant?.email ?? '',
                currency: currency.toUpperCase() ?? '',
            };
            const branding = await brandingService();
            const deposit = await user.related('transactions').create({
                type: 'payment',
                from: fromData,
                to: toData,
                amount: feeByCustomer ? amount + fee : amount,
                fee,
                total: formatPrecision(feeByCustomer ? amount : amount - fee),
                metaData: {
                    currency: currency.toUpperCase(),
                    successUrl: branding.siteUrl,
                    cancelUrl: branding.siteUrl,
                    apiPayment: true,
                },
                status: 'pending',
            });
            return response.json({
                success: true,
                message: 'Payment created successfully',
                redirectUrl: branding.siteUrl + '/mpay?trxId=' + deposit.trxId,
                data: {
                    trxId: deposit.trxId,
                    type: 'payment',
                    paymentAmount: deposit.amount,
                    paymentFee: deposit.fee,
                    amountAfterProcessing: deposit.total,
                    status: deposit.status,
                    currency,
                    createdAt: deposit.createdAt,
                },
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Create API Payment Error');
        }
    }
    async createWebhook({ request, response }) {
        try {
            const { type, webhookUrl, requestBody, responseBody, statusCode, userId } = request.body();
            const webhook = await MerchantWebhook.create({
                type,
                webhookUrl,
                requestBody,
                responseBody,
                statusCode,
                userId,
            });
            return response.json(webhook);
        }
        catch (error) {
            return response.status(400).json({ success: false, message: error.message });
        }
    }
    async initiateOtp({ request, response }) {
        try {
            const { email, trxId } = request.body();
            const user = await User.findBy('email', email);
            if (!user) {
                return response.badRequest({ success: false, message: 'Invalid email account provided' });
            }
            const transaction = await Transaction.query().where('trxId', trxId).firstOrFail();
            let otp = '1111';
            if (!env.get('DEMO_OTP')) {
                otp = Math.floor(1000 + Math.random() * 9000).toString();
            }
            const token = await Token.generatePaymentOtp(user, otp);
            const branding = await brandingService();
            await mail.sendLater(new SendPaymentOtpNotification(user, otp, transaction.amount, transaction.currency, branding));
            return response.json({ token });
        }
        catch (error) {
            return response.status(400).json({ success: false, message: error.message });
        }
    }
    async verifyOtp({ request, response }) {
        try {
            const { token, otp, trxId } = request.body();
            const user = await Token.getTokenUser(token, 'PAYMENT_OTP');
            if (!user) {
                return response.badRequest({ success: false, message: 'Invalid token provided' });
            }
            const record = await Token.query()
                .where('token', token)
                .where('type', 'PAYMENT_OTP')
                .where('expiresAt', '>', DateTime.now().toSQL())
                .orderBy('createdAt', 'desc')
                .first();
            const payment = await Transaction.query().where('trxId', trxId).firstOrFail();
            if (!record) {
                return response.badRequest({ success: false, message: 'Invalid OTP provided' });
            }
            if (encryption.decrypt(record?.token) !== otp) {
                return response.badRequest({ success: false, message: 'Invalid OTP provided' });
            }
            if (user.id === payment?.userId) {
                return response.badRequest({ success: false, message: "You can't pay yourself" });
            }
            const currency = await Currency.findBy('code', payment?.currency);
            if (!currency) {
                return response.badRequest({ success: false, message: 'Invalid currency code provided' });
            }
            const payer = await User.query()
                .where('id', user?.id)
                .preload('customer')
                .preload('merchant')
                .preload('permission')
                .first();
            if (!payer) {
                return response.notFound({ success: false, message: 'Account data not found' });
            }
            if (!user.kycStatus) {
                if (currency.kycLimit !== null && payment?.total > currency.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to make payment more than ${currency.kycLimit} ${currency.code}`,
                    });
                }
            }
            if (!payer.permission.payment) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to make payment',
                });
            }
            const payerWallet = await user
                ?.related('wallets')
                .query()
                .where('currencyId', currency.id)
                .first();
            if (!payerWallet) {
                return response.notFound({ success: false, message: 'Payer wallet not found' });
            }
            if (payerWallet.balance < payment?.amount) {
                return response.badRequest({ success: false, message: 'Balance insufficient' });
            }
            await user.related('transactions').create({
                type: 'payment',
                from: payment?.from,
                to: payment?.to,
                amount: payment?.amount,
                fee: 0,
                total: formatPrecision(payment?.amount),
                metaData: {
                    currency: payment?.currency.toUpperCase(),
                    trxAction: 'send',
                },
                status: 'completed',
            });
            if (!payment?.metaDataParsed?.sandbox) {
                payerWallet.balance = payerWallet.balance - payment?.amount;
                await payerWallet.save();
                await addBalance(payment.total, payment.currency, payment.userId);
            }
            payment.status = 'completed';
            await payment.save();
            webhookService(payment.id);
            return response.json({ success: true, message: 'Payment successful', status: 'success' });
        }
        catch (error) {
            return response
                .status(400)
                .json({ success: false, message: error.message, status: 'failed' });
        }
    }
}
//# sourceMappingURL=api_controller.js.map