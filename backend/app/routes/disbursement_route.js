import router from '@adonisjs/core/services/router';
const disbursementsController = () => import('#controllers/disbursements_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/method-template/:id', [disbursementsController, 'getDisbursementCsvByMethods']);
    router.post('/upload-preview', [disbursementsController, 'uploadDisbursementCsv']);
    router.post('/process', [disbursementsController, 'processDisbursement']);
})
    .prefix('disbursements')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['merchant'] }));
//# sourceMappingURL=disbursement_route.js.map