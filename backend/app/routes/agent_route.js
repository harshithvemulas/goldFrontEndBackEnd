import router from '@adonisjs/core/services/router';
const AgentsController = () => import('#controllers/agents_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/detail', [AgentsController, 'getDetail']);
    router.put('/update', [AgentsController, 'updateProfile']);
})
    .prefix('agents')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['agent'] }));
router
    .group(() => {
    router.get('/deposit', [AgentsController, 'indexDeposit']);
    router.get('/withdraw', [AgentsController, 'indexWithdraw']);
})
    .prefix('agents')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [AgentsController, 'index']);
    router.get('/export/all', [AgentsController, 'exportCSV']);
    router.get('/:id', [AgentsController, 'getById']);
    router.put('/update/:userId', [AgentsController, 'updateProfile']);
    router.put('/update-fees-commissions/:userId', [AgentsController, 'updateFeesCommissions']);
    router.put('/update-status/:userId', [AgentsController, 'updateStatus']);
    router.put('/toggle-suspend/:id', [AgentsController, 'toggleSuspendStatus']);
    router.put('/toggle-recommend/:id', [AgentsController, 'toggleRecommendStatus']);
    router.put('/accept/:id', [AgentsController, 'acceptAgent']);
    router.put('/decline/:id', [AgentsController, 'declineAgent']);
})
    .prefix('admin/agents')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=agent_route.js.map