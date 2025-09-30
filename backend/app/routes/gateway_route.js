import router from '@adonisjs/core/services/router';
const GatewaysController = () => import('#controllers/gateways_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [GatewaysController, 'index']);
    router.get('/:id', [GatewaysController, 'getById']);
})
    .prefix('gateways')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [GatewaysController, 'adminIndex']);
    router.get('/config', [GatewaysController, 'gatewayConfig']);
    router.get('/:id', [GatewaysController, 'adminById']);
    router.put('/:id', [GatewaysController, 'update']);
    router.post('/add-to-blacklist', [GatewaysController, 'addToBlackList']);
    router.post('/remove-from-blacklist', [GatewaysController, 'removeFromBlackList']);
})
    .prefix('admin/gateways')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=gateway_route.js.map