import errorHandler from '#exceptions/error_handler';
import Save from '#models/save';
export default class SavesController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = auth
                .user.related('saves')
                .query()
                .apply((scopes) => scopes.filtration(input))
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Save.query().where('id', Number.parseInt(id)).first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get by id Error');
        }
    }
    async toggleBookmark(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Save.find(Number.parseInt(id));
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            data.isBookmarked = !data.isBookmarked;
            await data.save();
            return response.ok({ success: true, message: 'Bookmark status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Toggle Bookmark Error');
        }
    }
    async destroy(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Save.find(Number.parseInt(id));
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await data.delete();
            return response.ok({ success: true, message: 'Saved item deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Destroy Error');
        }
    }
}
//# sourceMappingURL=saves_controller.js.map