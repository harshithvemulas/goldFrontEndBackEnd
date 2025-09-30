import router from '@adonisjs/core/services/router';
const CallbacksController = () => import('#controllers/callbacks_controller');
router
    .group(() => {
    router.post('/coinbase', [CallbacksController, 'validateCoinbase']);
    router.post('/wave', [CallbacksController, 'validateWaveCI']);
    router.post('/perfectmoney', [CallbacksController, 'validatePerfectMoney']);
    router.post('/paydunya', [CallbacksController, 'validatePaydunya']);
    router.post('/stripe', [CallbacksController, 'validateStripe']);
    router.get('/flutterwave', [CallbacksController, 'flutterwaveVerify']);
    router.post('/flutterwave', [CallbacksController, 'flutterwaveVerify']);
    router.post('/mollie', [CallbacksController, 'validateMollie']);
    router.post('/razorpay', [CallbacksController, 'validateRazorpay']);
    router.post('/coingate', [CallbacksController, 'validateCoingate']);
    router.post('/nowpayments', [CallbacksController, 'validateNowPayments']);
    router.post('/paypal', [CallbacksController, 'validatePaypal']);
    router.get('/bkash', [CallbacksController, 'validateBkash']);
    router.get('/paystack', [CallbacksController, 'validatePaystack']);
    router.post('/cashfree', [CallbacksController, 'validateCashfree']);
    router.post('/payfast', [CallbacksController, 'validatePayfast']);
})
    .prefix('webhooks');
router
    .group(() => {
    router.get('/razorpay', [CallbacksController, 'razorPayGateway']);
    router.get('/cashfree', [CallbacksController, 'cashfreeGateway']);
    router.get('/payfast', [CallbacksController, 'payfastGateway']);
})
    .prefix('payment-gateway');
router.group(() => { }).prefix('disburse-webhooks');
//# sourceMappingURL=callbacks_route.js.map