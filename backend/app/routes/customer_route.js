import router from '@adonisjs/core/services/router';
const CustomersController = () => import('#controllers/customers_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/referred-users', [CustomersController, 'getReferralUsers']);
    router.get('/referred-by-user', [CustomersController, 'getReferralUser']);
    router.get('/detail', [CustomersController, 'getDetail']);
    router.put('/update', [CustomersController, 'update']);
    router.put('/update-address', [CustomersController, 'updateAddress']);
})
    .prefix('customers')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [CustomersController, 'index']);
    router.get('/export/all', [CustomersController, 'exportCSV']);
    router.get('/:id', [CustomersController, 'getById']);
    router.put('/update/:id', [CustomersController, 'update']);
    router.put('/update-address/:id', [CustomersController, 'updateAddress']);
    router.put('/convert-account/:id', [CustomersController, 'convertAccount']);
})
    .prefix('admin/customers')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=customer_route.js.map