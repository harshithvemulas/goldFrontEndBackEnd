import errorHandler from '#exceptions/error_handler';
import MerchantWebhook from '#models/merchant_webhook';
export default class MerchantWebhooksController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const dataQuery = MerchantWebhook.query()
                .where('userId', auth.user.id)
                .preload('user', (query) => {
                query.preload('merchant');
            })
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
}
//# sourceMappingURL=merchant_webhooks_controller.js.map