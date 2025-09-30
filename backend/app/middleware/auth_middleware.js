export default class AuthMiddleware {
    redirectTo = '/login';
    async handle(ctx, next, options = {}) {
        if ((await ctx.auth.check()) &&
            ctx.session.has('session-token') &&
            !(await ctx.auth
                .user.related('loginSessions')
                .query()
                .where('sessionToken', ctx.session.get('session-token'))
                .andWhere('active', true)
                .first())) {
            ctx.auth.use('api').logout();
        }
        await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo });
        return next();
    }
}
//# sourceMappingURL=auth_middleware.js.map