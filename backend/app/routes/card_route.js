import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
const CardsController = () => import('#controllers/cards_controller');
router
    .group(() => {
    router.post('/authorize', [CardsController, 'authorizeCardPayment']);
    router.post('/sudo-africa', [CardsController, 'authorizeSudoCardPayment']);
})
    .prefix('cards');
router
    .group(() => {
    router.get('/', [CardsController, 'index']);
    router.post('/generate-virtual', [CardsController, 'generateVirtualCard']);
    router.put('/change-status/:id', [CardsController, 'changeCardStatus']);
    router.delete('/:id', [CardsController, 'cancelCard']);
})
    .prefix('cards')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['customer', 'merchant', 'agent'] }));
router
    .group(() => {
    router.get('/', [CardsController, 'adminIndex']);
    router.get('/:id', [CardsController, 'adminById']);
    router.delete('/:id', [CardsController, 'destroy']);
    router.put('/change-status/:id', [CardsController, 'changeCardStatusAdmin']);
})
    .prefix('admin/cards')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.role({ guards: ['admin', 'supervisor'] }));
//# sourceMappingURL=card_route.js.map