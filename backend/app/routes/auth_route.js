import router from '@adonisjs/core/services/router';
const AuthController = () => import('#controllers/auth_controller');
import { middleware } from '#start/kernel';
router
    .group(() => {
    router.post('/register', [AuthController, 'register']);
    router.post('/verify-email', [AuthController, 'verifyEmail']);
    router.post('/resend-verify-email', [AuthController, 'resendVerifyEmail']);
    router.post('/login', [AuthController, 'login']);
    router.post('/resend-otp', [AuthController, 'resendOtp']);
    router.post('/verify-otp', [AuthController, 'verifyOtp']);
    router.get('/check', [AuthController, 'checkAuth']).use(middleware.auth({ guards: ['api'] }));
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth({ guards: ['api'] }));
    router
        .post('/change-password', [AuthController, 'changePassword'])
        .use(middleware.auth({ guards: ['api'] })).use(middleware.demo());
    router.post('/forgot-password', [AuthController, 'forgotPassword']);
    router.post('/reset-password', [AuthController, 'resetPassword']).use(middleware.demo());
    router.post('/geo-location', [AuthController, 'getGeoLocation']);
})
    .prefix('/auth');
//# sourceMappingURL=auth_route.js.map