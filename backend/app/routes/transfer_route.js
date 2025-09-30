import router from '@adonisjs/core/services/router';
const TransfersController = () => import('#controllers/transfers_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [TransfersController, 'index']);
    router.get('/:id', [TransfersController, 'getById']);
    router.get('/preview/create', [TransfersController, 'previewTransfer']);
    router.post('/create', [TransfersController, 'store']);
})
    .prefix('transfers')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant'] }));
router
    .group(() => {
    router.get('/', [TransfersController, 'adminIndex']);
    router.get('/:id', [TransfersController, 'getById']);
    router.get('/export/all', [TransfersController, 'exportAdminCsv']);
})
    .prefix('admin/transfers')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=transfer_route.js.map