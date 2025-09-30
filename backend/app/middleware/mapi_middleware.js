import Merchant from '#models/merchant';
export default class MapiMiddleware {
    async handle(ctx, next) {
        if (!ctx.request.header('Authorization')) {
            return ctx.response.status(401).json({
                success: false,
                message: 'No API key provided. Please add your API key to the headers with "X-API-Key".',
            });
        }
        const apiKey = ctx.request.header('Authorization')?.split(' ')[1];
        const merchant = await Merchant.query().where('apiKey', apiKey).preload('user').first();
        if (!merchant) {
            return ctx.response.status(401).json({
                success: false,
                message: 'Invalid API key provided.',
            });
        }
        ctx.request.updateBody({ merchant: merchant.serialize(), ...ctx.request.body() });
        const output = await next();
        return output;
    }
}
//# sourceMappingURL=mapi_middleware.js.map