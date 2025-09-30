import router from '@adonisjs/core/services/router';
const LoginSessionsController = () => import('#controllers/login_sessions_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.get('/', [LoginSessionsController, 'index']);
    router.put('/remove/:id', [LoginSessionsController, 'deactiveSession']);
    router.put('/remove-all', [LoginSessionsController, 'deactiveAllSessions']);
})
    .prefix('login-sessions')
    .use(middleware.auth({ guards: ['api'] }));
//# sourceMappingURL=login_session_route.js.map