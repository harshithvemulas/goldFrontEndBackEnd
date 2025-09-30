const ApiController = () => import('#controllers/api_controller');
import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/payment/:trxId', [ApiController, 'getPaymentStatus']).use(middleware.mapi());
    router.post('/payment', [ApiController, 'createPayment']).use(middleware.mapi());
    router.post('/webhook/create', [ApiController, 'createWebhook']).use(middleware.mapi());
})
    .prefix('/mapi');
router
    .group(() => {
    router.post('/merchant/qr', [ApiController, 'createPaymentQrCode']);
    router.get('/merchant/:merchantId', [ApiController, 'getMerchantDetails']);
    router.get('/:trxId', [ApiController, 'getPaymentDetails']);
    router.post('/init/:trxId', [ApiController, 'initiatePayment']);
    router.post('/otp/init', [ApiController, 'initiateOtp']);
    router.post('/otp/verify', [ApiController, 'verifyOtp']);
})
    .prefix('/mapi-global');
//# sourceMappingURL=api_route.js.map