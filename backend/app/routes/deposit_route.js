import router from '@adonisjs/core/services/router';
const DepositsController = () => import('#controllers/deposits_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [DepositsController, 'index']);
    router.get('/:id', [DepositsController, 'getById']);
    router.get('/preview/create', [DepositsController, 'previewDeposit']);
    router.post('/create', [DepositsController, 'createDeposit']);
})
    .prefix('deposits')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant', 'agent'] }));
router
    .group(() => {
    router.get('/', [DepositsController, 'adminIndex']);
    router.get('/:id', [DepositsController, 'getById']);
    router.get('/export/all', [DepositsController, 'exportAdminCsv']);
    router.put('/accept/:id', [DepositsController, 'acceptDeposit']);
    router.put('/decline/:id', [DepositsController, 'declineDeposit']);
})
    .prefix('admin/deposits')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=deposit_route.js.map