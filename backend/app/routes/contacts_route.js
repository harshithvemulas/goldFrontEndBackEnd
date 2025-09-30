import router from '@adonisjs/core/services/router';
const ContactsController = () => import('#controllers/contacts_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [ContactsController, 'index']);
    router.get('/quicksend', [ContactsController, 'getQuickSendContacts']);
    router.get('/:id', [ContactsController, 'getById']);
    router.post('/create', [ContactsController, 'addContact']);
    router.put('/quicksend/add/:id', [ContactsController, 'addToQuickSend']);
    router.put('/quicksend/remove/:id', [ContactsController, 'removeFromQuickSend']);
    router.delete('delete/:id', [ContactsController, 'deleteContact']);
})
    .prefix('contacts')
    .use(middleware.auth({ guards: ['api'] }));
//# sourceMappingURL=contacts_route.js.map