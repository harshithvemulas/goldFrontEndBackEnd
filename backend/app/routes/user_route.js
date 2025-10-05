import router from '@adonisjs/core/services/router';
const UsersController = () => import('#controllers/users_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.post('/send-support-email', [UsersController, 'sendSupportEmail']);
    router.get('/check', [UsersController, 'getUserByEmail']);
})
    .prefix('users')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [UsersController, 'index']);
    router.get('/export/all', [UsersController, 'exportCSV']);
    router.get('/:id', [UsersController, 'getById']);
    router.get('/blacklisted-gateways/:id', [UsersController, 'getBlackListedGateways']);
    router.get('/blacklisted-methods/:id', [UsersController, 'getBlackListedMethods']);
    router.get('/permission/:id', [UsersController, 'getUserPermission']);
    router.get('/total-count/dashboard', [UsersController, 'totalCountByAdmin']);
    router.post('/create-admin/', [UsersController, 'createAdmin']);
    router.put('/edit-admin/:id', [UsersController, 'updateAdmin']);
    router.post('/send-email/:id', [UsersController, 'sendEmail']);
    router.post('/send-bulk-email/', [UsersController, 'sendBulkEmail']);
    router.put('/permission/:id', [UsersController, 'updateUserPermission']).use(middleware.demo());
    router.put('/transfer-limit/:id', [UsersController, 'updateTransferLimit']).use(middleware.demo());
    router.put('/toggle-active/:id', [UsersController, 'toggleActiveStatus']).use(middleware.demo());
    router.post('/add-balance', [UsersController, 'addBalanceToWallet']);
    router.post('/remove-balance', [UsersController, 'removeBalanceFromWallet']);
    router.delete('/:id', [UsersController, 'delete']).use(middleware.demo());
})
    .prefix('admin/users')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=user_route.js.map