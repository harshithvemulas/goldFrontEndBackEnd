import router from '@adonisjs/core/services/router';
const MethodsController = () => import('#controllers/methods_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [MethodsController, 'index']);
    router.get('/:id', [MethodsController, 'getById']);
})
    .prefix('methods')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [MethodsController, 'adminIndex']);
    router.post('/', [MethodsController, 'create']);
    router.get('/:id', [MethodsController, 'adminById']);
    router.put('/:id', [MethodsController, 'update']).use(middleware.demo());
    router.post('/add-to-blacklist', [MethodsController, 'addToBlackList']).use(middleware.demo());
    router.post('/remove-from-blacklist', [MethodsController, 'removeFromBlackList']).use(middleware.demo());
})
    .prefix('admin/methods')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=method_route.js.map