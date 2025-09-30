import router from '@adonisjs/core/services/router';
const TransactionsController = () => import('#controllers/transactions_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [TransactionsController, 'index']);
    router.get('/counts/total', [TransactionsController, 'totalCount']);
    router.get('/chart/moonthly-report', [TransactionsController, 'totalAmountChart']);
    router.get('/export/all', [TransactionsController, 'exportCsv']);
    router.get('/:id', [TransactionsController, 'getById']);
    router.get('/trx/:trxId', [TransactionsController, 'getByTrxId']);
    router.get('/download-receipt/:trxId', [TransactionsController, 'downloadReceipt']);
    router.put('/toggle-bookmark/:id', [TransactionsController, 'toggleBookmark']);
})
    .prefix('transactions')
    .use(middleware.auth({ guards: ['api'] }));
router
    .group(() => {
    router.get('/:id', [TransactionsController, 'adminIndex']);
    router.get('/role/:roleId', [TransactionsController, 'adminIndexByRole']);
    router.get('/export/:id', [TransactionsController, 'exportCsv']);
    router.get('/counts/:id', [TransactionsController, 'totalCount']);
    router.get('/chart/dashboard', [TransactionsController, 'adminDashboardChart']);
})
    .prefix('admin/transactions')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=transaction_route.js.map