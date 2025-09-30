import router from '@adonisjs/core/services/router';
const SavesController = () => import('#controllers/saves_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [SavesController, 'index']);
    router.get('/:id', [SavesController, 'getById']);
    router.put('/toggle-bookmark/:id', [SavesController, 'toggleBookmark']);
    router.delete('/delete/:id', [SavesController, 'destroy']);
})
    .prefix('saves')
    .use(middleware.auth({ guards: ['api'] }));
//# sourceMappingURL=saves_route.js.map