import errorHandler from '#exceptions/error_handler';
export default class LoginSessionsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await auth
                .user.related('loginSessions')
                .query()
                .preload('user')
                .orderBy('id', 'desc')
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async deactiveSession(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const session = await auth
                .user.related('loginSessions')
                .query()
                .where('id', id)
                .preload('user')
                .first();
            if (!session) {
                return response.badRequest({ success: false, message: 'Invalid session token Provided' });
            }
            session.active = false;
            await session.save();
            return response.created({
                success: true,
                message: 'Successfully logged out from the selected device',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async deactiveAllSessions(ctx) {
        const { auth, response, session } = ctx;
        try {
            await auth
                .user.related('loginSessions')
                .query()
                .whereNot('sessionToken', session.get('session-token'))
                .update({ active: false });
            return response.created({
                success: true,
                message: 'Successfully logged out from all the devices',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
}
//# sourceMappingURL=login_sessions_controller.js.map