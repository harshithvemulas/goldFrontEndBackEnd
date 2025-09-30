import router from '@adonisjs/core/services/router';
const WithdrawRequestsController = () => import('#controllers/withdraw_requests_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [WithdrawRequestsController, 'index']);
    router.get('/:id', [WithdrawRequestsController, 'getById']);
    router.get('/export/all', [WithdrawRequestsController, 'exportCsv']);
    router.put('/accept/:id', [WithdrawRequestsController, 'acceptWithdraw']);
    router.put('/decline/:id', [WithdrawRequestsController, 'declineWithdraw']);
})
    .prefix('withdraw-requests')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['agent'] }));
router
    .group(() => {
    router.get('/preview/create', [WithdrawRequestsController, 'previewRequest']);
    router.post('/create', [WithdrawRequestsController, 'storeRequest']);
})
    .prefix('withdraw-requests')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant', 'agent'] }));
//# sourceMappingURL=withdraw_request_route.js.map