import router from '@adonisjs/core/services/router';
const CurrenciesController = () => import('#controllers/currencies_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [CurrenciesController, 'index']);
    router.get('/:id', [CurrenciesController, 'getById']);
})
    .prefix('currencies')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/', [CurrenciesController, 'adminIndex']);
    router.get('/fetch-currency-rate', [CurrenciesController, 'fetchCurrencyRate']);
    router.post('/create', [CurrenciesController, 'store']);
    router.put('/update/:id', [CurrenciesController, 'update']);
    router.put('/toggle-active/:id', [CurrenciesController, 'toggleActiveStatus']);
    router.put('/toggle-crypto/:id', [CurrenciesController, 'toggleCryptoStatus']);
    router.delete('/delete/:id', [CurrenciesController, 'destroy']);
})
    .prefix('admin/currencies')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=currencies_route.js.map