import router from '@adonisjs/core/services/router';
const ExchangesController = () => import('#controllers/exchanges_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [ExchangesController, 'index']);
    router.get('/calculations', [ExchangesController, 'getExchangeCalculation']);
    router.get('/:id', [ExchangesController, 'getById']);
    router.post('/create-request', [ExchangesController, 'store']);
})
    .prefix('exchanges')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [ExchangesController, 'adminIndex']);
    router.get('/:id', [ExchangesController, 'getById']);
    router.get('/export/all', [ExchangesController, 'exportAdminCsv']);
    router.put('/:id', [ExchangesController, 'editExchange']);
    router.put('/accept/:id', [ExchangesController, 'acceptExchange']);
    router.put('/decline/:id', [ExchangesController, 'declineExchange']);
})
    .prefix('admin/exchanges')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=exchange_route.js.map