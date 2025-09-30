import Roles from '../enum/roles.js';
export default class RoleMiddleware {
    async handle(ctx, next, options = {}) {
        const roleIds = options?.guards?.map((guard) => Roles[guard.toUpperCase()]);
        if (!roleIds?.includes(ctx.auth.user?.roleId ?? -1)) {
            return ctx.response.badRequest({ success: false, message: 'Unauthorized access' });
        }
        return next();
    }
}
//# sourceMappingURL=role_middleware.js.map