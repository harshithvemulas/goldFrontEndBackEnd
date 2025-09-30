import router from '@adonisjs/core/services/router';
const PaymentsController = () => import('#controllers/payments_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [PaymentsController, 'index']);
    router.get('/:id', [PaymentsController, 'getById']);
    router.get('/preview/create', [PaymentsController, 'previewPayment']);
    router.post('/create', [PaymentsController, 'store']);
})
    .prefix('payments')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant'] }));
router
    .group(() => {
    router.get('/list-view', [PaymentsController, 'merchantIndex']);
    router.get('/export', [PaymentsController, 'exportCsv']);
})
    .prefix('payments/merchants')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['merchant'] }));
router
    .group(() => {
    router.get('/', [PaymentsController, 'adminIndex']);
    router.get('/:id', [PaymentsController, 'getById']);
    router.get('/export/all', [PaymentsController, 'exportAdminCsv']);
})
    .prefix('admin/payments')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=payment_route.js.map