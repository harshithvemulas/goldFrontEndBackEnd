import errorHandler from '#exceptions/error_handler';
import ExternalPlugin from '#models/external_plugin';
import pluginFieldsConfig from '#utils/plugin_fields_config';
import { extPluginUpdateSchema } from '#validators/external_plugin';
export default class ExternalPluginsController {
    async getByValue(ctx) {
        const { request, response } = ctx;
        try {
            const value = request.param('value');
            const allowedPublicValues = ['google-analytics', 'recaptcha', 'tawk-to'];
            if (!allowedPublicValues.includes(value)) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const data = await ExternalPlugin.query().where({ value }).first();
            if (!data) {
                return response.badRequest({ success: false, message: 'Data not found' });
            }
            switch (value) {
                case 'google-analytics':
                    return response.json({
                        name: data.name,
                        value: data.value,
                        apiKey: data.apiKey,
                        active: data.active,
                    });
                case 'recaptcha':
                    return response.json({
                        name: data.name,
                        value: data.value,
                        apiKey: data.apiKey,
                        active: data.active,
                    });
                case 'tawk-to':
                    return response.json({
                        name: data.name,
                        value: data.value,
                        apiKey: data.apiKey,
                        secretKey: data.secretKey,
                        active: data.active,
                    });
                default:
                    return response.badRequest({ success: false, message: 'Data not found' });
            }
        }
        catch (error) {
            errorHandler(error, ctx, 'Get By Value Error');
        }
    }
    async pluginConfig(ctx) {
        const { response } = ctx;
        try {
            return response.json(pluginFieldsConfig);
        }
        catch (error) {
            errorHandler(error, ctx, 'External Plugin Config Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, search } = request.qs();
            const dataQuery = ExternalPlugin.filter({ search });
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Admin Index Error');
        }
    }
    async adminById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await ExternalPlugin.query().where({ id }).first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get By Id Error');
        }
    }
    async update(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const payload = await request.validateUsing(extPluginUpdateSchema);
            const gateway = await ExternalPlugin.query().where({ id }).first();
            if (!gateway) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            let newData = { ...payload };
            await gateway.merge(newData).save();
            return response.created({ success: true, message: 'External plugin has been updated' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
}
//# sourceMappingURL=external_plugins_controller.js.map