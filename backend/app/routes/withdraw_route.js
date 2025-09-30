import router from '@adonisjs/core/services/router';
const WithdrawsController = () => import('#controllers/withdraws_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [WithdrawsController, 'index']);
    router.get('/methods/list', [WithdrawsController, 'indexWithdrawMethods']);
    router.get('/:id', [WithdrawsController, 'getById']);
    router.get('/preview/create', [WithdrawsController, 'previewWithdraw']);
    router.post('/create', [WithdrawsController, 'createWithdraw']);
})
    .prefix('withdraws')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant', 'agent'] }));
router
    .group(() => {
    router.get('/', [WithdrawsController, 'adminIndex']);
    router.get('/:id', [WithdrawsController, 'getById']);
    router.get('/export/all', [WithdrawsController, 'exportAdminCsv']);
    router.put('/accept/:id', [WithdrawsController, 'acceptWithdraw']);
    router.put('/decline/:id', [WithdrawsController, 'declineWithdraw']);
})
    .prefix('admin/withdraws')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=withdraw_route.js.map