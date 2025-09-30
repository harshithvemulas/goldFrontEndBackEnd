import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
const SettingsController = () => import('#controllers/settings_controller');
router
    .group(() => {
    router
        .get('/', [SettingsController, 'getGlobalSettings'])
        .use(middleware.auth({ guards: ['api'] }));
    router.get('/branding', [SettingsController, 'getBranding']);
})
    .prefix('settings/global');
router
    .group(() => {
    router.get('/', [SettingsController, 'adminIndex']);
    router.post('/', [SettingsController, 'updateSettings']);
    router.put('/branding', [SettingsController, 'updateBranding']);
})
    .prefix('admin/settings')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=setting_route.js.map