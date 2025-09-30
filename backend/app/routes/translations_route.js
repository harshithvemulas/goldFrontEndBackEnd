import router from '@adonisjs/core/services/router';
const TranslationsController = () => import('#controllers/translations_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/:lang', [TranslationsController, 'getByLang']);
    router.post('/:lang', [TranslationsController, 'createMissingLang']);
})
    .prefix('translations');
router
    .group(() => {
    router.post('/languages/translations', [TranslationsController, 'createTranslations']);
    router.put('/languages/translations/:id', [TranslationsController, 'updateTranslations']);
    router.delete('/languages/translations/:id', [TranslationsController, 'deleteTranslations']);
    router.get('/languages/api/:code', [TranslationsController, 'getTranslationsApi']);
})
    .prefix('admin')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=translations_route.js.map