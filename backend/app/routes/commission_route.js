import router from '@adonisjs/core/services/router';
const CommissionsController = () => import('#controllers/commissions_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/:userId', [CommissionsController, 'index']);
    router.get('/detail/:id', [CommissionsController, 'getById']);
    router.get('/total-pending/:userId', [CommissionsController, 'totalCommissions']);
    router.get('/export/:userId', [CommissionsController, 'exportCSV']);
})
    .prefix('commissions')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['agent', 'admin'] }));
router
    .group(() => {
    router.get('/', [CommissionsController, 'adminIndex']);
    router.post('/settlement/:userId', [CommissionsController, 'settleCommission']);
    router.put('/status/:id', [CommissionsController, 'updateStatus']);
    router.delete('/:id', [CommissionsController, 'delete']);
})
    .prefix('admin/commissions')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=commission_route.js.map