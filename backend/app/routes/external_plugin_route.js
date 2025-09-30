import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
const ExternalPluginsController = () => import('#controllers/external_plugins_controller');
router
    .group(() => {
    router.get('/:value', [ExternalPluginsController, 'getByValue']);
})
    .prefix('external-plugins')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [ExternalPluginsController, 'adminIndex']);
    router.get('/config', [ExternalPluginsController, 'pluginConfig']);
    router.get('/:id', [ExternalPluginsController, 'adminById']);
    router.put('/:id', [ExternalPluginsController, 'update']);
})
    .prefix('admin/external-plugins')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=external_plugin_route.js.map