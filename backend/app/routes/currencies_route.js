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
    router.post('/create', [CurrenciesController, 'store']).use(middleware.demo());
    router.put('/update/:id', [CurrenciesController, 'update']).use(middleware.demo());
    router.put('/toggle-active/:id', [CurrenciesController, 'toggleActiveStatus']).use(middleware.demo());
    router.put('/toggle-crypto/:id', [CurrenciesController, 'toggleCryptoStatus']).use(middleware.demo());
    router.delete('/delete/:id', [CurrenciesController, 'destroy']).use(middleware.demo());
})
    .prefix('admin/currencies')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=currencies_route.js.map