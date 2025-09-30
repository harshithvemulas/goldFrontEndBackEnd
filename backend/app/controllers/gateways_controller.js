import errorHandler from '#exceptions/error_handler';
import DepositGateway from '#models/deposit_gateway';
import User from '#models/user';
import gatewayFieldsConfig from '#utils/gateway_fields_config';
import { updateSchema } from '#validators/deposit_gateway';
import { cuid } from '@adonisjs/core/helpers';
import app from '@adonisjs/core/services/app';
export default class GatewaysController {
    async gatewayConfig(ctx) {
        const { response } = ctx;
        try {
            return response.json(gatewayFieldsConfig);
        }
        catch (error) {
            errorHandler(error, ctx, 'Gateway Config Error');
        }
    }
    async index(ctx) {
        const { request, response } = ctx;
        try {
            const { country, currency, search } = request.qs();
            const data = await DepositGateway.filter({ search })
                .where('active', true)
                .if(currency, (query) => {
                query.andWhere('allowedCurrencies', 'like', `%${currency}%`);
            })
                .orderBy('name', 'asc');
            const filteredData = data.filter((gateway) => {
                if (!country) {
                    return true;
                }
                if (gateway.allowedCountries.includes('*')) {
                    return true;
                }
                return gateway.allowedCountries.includes(country);
            });
            const serializeData = filteredData.map((ele) => ele.serialize({
                fields: {
                    omit: [
                        'apiKey',
                        'secretKey',
                        'params',
                        'ex1',
                        'ex2',
                        'variables',
                        'allowedCountries',
                        'allowedCurrencies',
                    ],
                },
            }));
            return response.json(serializeData);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await DepositGateway.query().where({ id, active: true }).first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            data.serialize({
                fields: {
                    omit: [
                        'apiKey',
                        'secretKey',
                        'params',
                        'ex1',
                        'ex2',
                        'variables',
                        'allowedCountries',
                        'allowedCurrencies',
                    ],
                },
            });
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get By Id Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, search } = request.qs();
            const dataQuery = DepositGateway.filter({ search });
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
            const data = await DepositGateway.query()
                .where({ id })
                .preload('blackListedUsers', (query) => query.preload('customer'))
                .first();
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
            const payload = await request.validateUsing(updateSchema);
            const gateway = await DepositGateway.query().where({ id }).first();
            if (!gateway) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            if (payload.value !== gateway.value) {
                const exist = await DepositGateway.query().where({ value: payload.value }).first();
                if (exist) {
                    return response.badRequest({
                        success: false,
                        message: `Gateway with value ${payload.value} already exists`,
                    });
                }
            }
            let newData = { ...payload };
            if (payload.uploadLogo) {
                await payload.uploadLogo.move(app.makePath('public/uploads'), {
                    name: `${cuid()}.${payload.uploadLogo.extname}`,
                });
                newData.logoImage = payload.uploadLogo.fileName;
            }
            delete newData.uploadLogo;
            await gateway.merge(newData).save();
            return response.created({ success: true, message: 'Gateway has been updated' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async addToBlackList(ctx) {
        const { request, response } = ctx;
        try {
            const { userId, gatewayId } = request.only(['userId', 'gatewayId']);
            const gateway = await DepositGateway.query().where({ id: gatewayId }).first();
            if (!gateway) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const user = await User.query().where('id', userId).first();
            if (!user) {
                return response.notFound({ success: false, message: 'Invalid User Id' });
            }
            await gateway.related('blackListedUsers').attach([user.id]);
            return response.created({ success: true, message: 'User added to the blacklist' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Add to blacklist  Error');
        }
    }
    async removeFromBlackList(ctx) {
        const { request, response } = ctx;
        try {
            const { userId, gatewayId } = request.only(['userId', 'gatewayId']);
            const gateway = await DepositGateway.query().where({ id: gatewayId }).first();
            if (!gateway) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const user = await User.query().where('id', userId).first();
            if (!user) {
                return response.notFound({ success: false, message: 'Invalid User Id' });
            }
            await gateway.related('blackListedUsers').detach([user.id]);
            return response.created({ success: true, message: 'User removed from the blacklist' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Remove from blacklist Error');
        }
    }
}
//# sourceMappingURL=gateways_controller.js.map