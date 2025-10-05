import router from '@adonisjs/core/services/router';
const MerchantsController = () => import('#controllers/merchants_controller');
import { middleware } from '#start/kernel';
const MerchantWebhooksController = () => import('#controllers/merchant_webhooks_controller');
router
    .group(() => {
    router.get('/detail', [MerchantsController, 'getDetail']);
    router.get('/payment-requests', [MerchantsController, 'indexPaymentRequests']);
    router.get('/export-payment-request', [MerchantsController, 'exportPaymentRequestCSV']);
    router.post('/payment-requests', [MerchantsController, 'requestPayment']);
    router.put('/update', [MerchantsController, 'update']).use(middleware.demo());
    router.put('/generate-api-key', [MerchantsController, 'generateApiKey']);
    router.delete('/delete-api-key', [MerchantsController, 'deleteApiKey']);
    router.get('/webhooks', [MerchantWebhooksController, 'index']);
})
    .prefix('merchants')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['merchant'] }));
router
    .group(() => {
    router.get('/saved', [MerchantsController, 'indexSavedMerchants']);
    router.get('/global', [MerchantsController, 'getGlobalMerchants']);
    router.post('/save', [MerchantsController, 'saveMerchant']);
    router
        .get('/payment-requests/:id', [MerchantsController, 'getPaymentRequestById'])
        .use(middleware.role({ guards: ['admin', 'merchant'] }));
})
    .prefix('merchants')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [MerchantsController, 'index']);
    router.get('/export/all', [MerchantsController, 'exportCSV']);
    router.get('/export-payment-request/:id', [MerchantsController, 'exportPaymentRequestCSV']);
    router.get('/:id', [MerchantsController, 'getById']);
    router.get('/payment-requests/all', [MerchantsController, 'adminIndexPaymentRequests']);
    router.put('/update/:userId', [MerchantsController, 'update']).use(middleware.demo());
    router.put('/update-fees/:userId', [MerchantsController, 'updateFees']);
    router.put('/toggle-suspend/:id', [MerchantsController, 'toggleSuspendStatus']);
    router.put('/accept/:id', [MerchantsController, 'acceptMerchant']);
    router.put('/decline/:id', [MerchantsController, 'declineMerchant']);
})
    .prefix('admin/merchants')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=merchant_route.js.map