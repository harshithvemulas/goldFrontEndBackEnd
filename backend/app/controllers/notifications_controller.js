import errorHandler from '#exceptions/error_handler';
import Notification from '#models/notification';
export default class NotificationsController {
    async index(ctx) {
        const { request, response, auth } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await Notification.query()
                .where('userId', auth.user.id)
                .orderBy('createdAt', 'desc')
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Notification Index Error');
        }
    }
    async getById(ctx) {
        const { request, response, auth } = ctx;
        try {
            const { id } = request.params();
            const data = await Notification.query()
                .where('id', id)
                .andWhere('userId', auth.user.id)
                .firstOrFail();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Notification GetById Error');
        }
    }
    async unreadCount(ctx) {
        const { response, auth } = ctx;
        try {
            const count = await Notification.query()
                .where('userId', auth.user.id)
                .andWhere('isRead', false)
                .count('* as total');
            return response.json({ total: count[0].$extras.total });
        }
        catch (error) {
            errorHandler(error, ctx, 'Notification unread Count Error');
        }
    }
    async markAsRead(ctx) {
        const { request, response, auth } = ctx;
        try {
            const { id } = request.params();
            const data = await Notification.query()
                .where('id', id)
                .andWhere('userId', auth.user.id)
                .firstOrFail();
            data.isRead = true;
            await data.save();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Notification MarkAsRead Error');
        }
    }
    async markAllAsRead(ctx) {
        const { response, auth } = ctx;
        try {
            await Notification.query().where('userId', auth.user.id).update({ isRead: true });
            return response.json({ message: 'All notifications marked as read' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Notification MarkAllAsRead Error');
        }
    }
}
//# sourceMappingURL=notifications_controller.js.map