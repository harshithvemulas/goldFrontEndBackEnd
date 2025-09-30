import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
const InvestmentPlansController = () => import('#controllers/investment_plans_controller');
router
    .group(() => {
    router.get('/', [InvestmentPlansController, 'index']);
})
    .prefix('investment-plans')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant', 'agent'] }));
router
    .group(() => {
    router.get('/', [InvestmentPlansController, 'adminIndex']);
    router.get('/:id', [InvestmentPlansController, 'adminById']);
    router.post('/', [InvestmentPlansController, 'store']);
    router.put('/:id', [InvestmentPlansController, 'update']);
    router.delete('/:id', [InvestmentPlansController, 'destroy']);
})
    .prefix('admin/investment-plans')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=investment_plan_route.js.map