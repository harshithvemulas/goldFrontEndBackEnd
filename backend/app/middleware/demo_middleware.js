import env from '#start/env';
export default class DemoMiddleware {
    async handle(ctx, next) {
        const demoMode = env.get('DEMO_MODE') === 'yes';
        if (demoMode) {
            return ctx.response.status(403).json({
                message: 'This action is not allowed in demo mode',
            });
        }
        return next();
    }
}
//# sourceMappingURL=demo_middleware.js.map