import router from '@adonisjs/core/services/router';
const DepositRequestsController = () => import('#controllers/deposit_requests_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [DepositRequestsController, 'index']);
    router.get('/:id', [DepositRequestsController, 'getById']);
    router.get('/export/all', [DepositRequestsController, 'exportCsv']);
    router.get('/direct-deposit/preview', [DepositRequestsController, 'previewRequestByAgent']);
    router.post('/direct-deposit/create', [DepositRequestsController, 'storeRequestByAgent']);
    router.put('/accept/:id', [DepositRequestsController, 'acceptDeposit']);
    router.put('/decline/:id', [DepositRequestsController, 'declineDeposit']);
})
    .prefix('deposit-requests')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['agent'] }));
router
    .group(() => {
    router.get('/preview/create', [DepositRequestsController, 'previewRequest']);
    router.post('/create', [DepositRequestsController, 'storeRequest']);
})
    .prefix('deposit-requests')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant'] }));
//# sourceMappingURL=deposit_request_route.js.map