import router from '@adonisjs/core/services/router';
const WalletsController = () => import('#controllers/wallets_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [WalletsController, 'index']);
    router.get('/saved', [WalletsController, 'indexSavedWallets']);
    router.get('/:id', [WalletsController, 'getById']);
    router.post('/create', [WalletsController, 'store']);
    router.post('/save', [WalletsController, 'saveWallet']);
    router.put('/make-default/:id', [WalletsController, 'makeDefault']);
    router.put('/pin-dashboard/:id', [WalletsController, 'pinDashboard']);
})
    .prefix('wallets')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.put('/transfer-limit/:id', [WalletsController, 'updateTransferLimit']);
})
    .prefix('admin/wallets')
    .use(middleware.auth({ guards: ['api'] }));
//# sourceMappingURL=wallets_route.js.map