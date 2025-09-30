import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
const InvestmentsController = () => import('#controllers/investments_controller');
router
    .group(() => {
    router.get('/', [InvestmentsController, 'index']);
    router.get('/history', [InvestmentsController, 'indexHistory']);
    router.get('/:id', [InvestmentsController, 'indexById']);
    router.post('/', [InvestmentsController, 'investByPlan']);
    router.post('/withdraw/:id', [InvestmentsController, 'withdraw']);
})
    .prefix('investments')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant', 'agent'] }));
router
    .group(() => {
    router.get('/', [InvestmentsController, 'adminIndex']);
    router.get('/history', [InvestmentsController, 'adminIndexHistory']);
    router.get('/:id', [InvestmentsController, 'adminById']);
    router.put('/:id', [InvestmentsController, 'update']);
    router.delete('/:id', [InvestmentsController, 'destroy']);
})
    .prefix('admin/investments')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=investment_route.js.map