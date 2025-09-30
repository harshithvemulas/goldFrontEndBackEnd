import router from '@adonisjs/core/services/router';
const KycsController = () => import('#controllers/kycs_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/detail', [KycsController, 'getDetail']);
    router.post('/submit', [KycsController, 'createOrUpdate']);
})
    .prefix('kycs')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [KycsController, 'index']);
    router.get('/:id', [KycsController, 'getById']);
    router.put('/accept/:id', [KycsController, 'acceptKyc']);
    router.put('/decline/:id', [KycsController, 'declineKyc']);
})
    .prefix('admin/kycs')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=kyc_route.js.map