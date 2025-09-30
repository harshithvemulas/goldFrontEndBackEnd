import router from '@adonisjs/core/services/router';
const ServicesController = () => import('#controllers/services_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [ServicesController, 'index']);
    router.get('/phone/saved', [ServicesController, 'indexSavedPhone']);
    router.get('/electricity/saved', [ServicesController, 'indexSavedElectricity']);
    router.get('/:id', [ServicesController, 'getById']);
    router.post('/topup/preview', [ServicesController, 'getTopUpPreview']);
    router.get('/utility/billers', [ServicesController, 'getBillers']);
    router.post('/topup/create', [ServicesController, 'createTopUp']);
    router.post('/utility/preview', [ServicesController, 'previewUtilityBill']);
    router.post('/utility/create', [ServicesController, 'createUtilityBill']);
    router.post('/phone/save', [ServicesController, 'saveNumber']);
    router.post('/electricity/save', [ServicesController, 'saveElectricity']);
})
    .prefix('services')
    .use(middleware.auth({ guards: ['api'] }));
//# sourceMappingURL=services_route.js.map