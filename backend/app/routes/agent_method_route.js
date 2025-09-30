import router from '@adonisjs/core/services/router';
const AgentMethodsController = () => import('#controllers/agent_methods_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [AgentMethodsController, 'index']);
    router.get('/:id', [AgentMethodsController, 'getById']);
    router.post('/create', [AgentMethodsController, 'store']);
    router.put('/:id', [AgentMethodsController, 'update']);
    router.delete('/:id', [AgentMethodsController, 'delete']);
})
    .prefix('agent-methods')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['agent'] }));
router
    .group(() => {
    router.get('/:userId', [AgentMethodsController, 'index']);
    router.get('/detail/:id', [AgentMethodsController, 'getById']);
})
    .prefix('admin/agent-methods')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=agent_method_route.js.map