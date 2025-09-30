import errorHandler from '#exceptions/error_handler';
import User from '#models/user';
import WithdrawMethod from '#models/withdraw_method';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers';
import Roles from '../enum/roles.js';
import { createSchema, updateSchema } from '#validators/withdraw_method';
import string from '@adonisjs/core/helpers/string';
export default class MethodsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { country, currency, search } = request.qs();
            const data = await WithdrawMethod.filter({ search })
                .where('active', true)
                .if(currency, (query) => {
                query.andWhere('currencyCode', currency);
            })
                .if(auth.user.roleId === Roles.CUSTOMER, (query) => {
                query.andWhereNotIn('value', ['bank_usd', 'bank_eur', 'usdt_trc20']);
            })
                .orderBy('name', 'asc');
            const filteredData = data.filter((gateway) => {
                if (!country) {
                    return true;
                }
                if (gateway.countryCode === '*') {
                    return true;
                }
                return gateway.countryCode === country;
            });
            const serializeData = filteredData.map((ele) => ele.serialize({
                fields: {
                    omit: ['apiKey', 'secretKey', 'ex1', 'ex2'],
                },
            }));
            return response.json(serializeData);
        }
        catch (error) {
            errorHandler(error, ctx, 'index methods Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await WithdrawMethod.query().where({ id, active: true }).first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            data.serialize({
                fields: {
                    omit: ['apiKey', 'secretKey', 'ex1', 'ex2'],
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
            const dataQuery = WithdrawMethod.filter({ search });
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
            const data = await WithdrawMethod.query()
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
    async create(ctx) {
        const { request, response } = ctx;
        try {
            const payload = await request.validateUsing(createSchema);
            let newData = { params: payload?.inputParams };
            delete payload.inputParams;
            newData = { ...newData, ...payload, value: string.slug(payload.name) };
            if (payload.uploadLogo) {
                await payload.uploadLogo.move(app.makePath('public/uploads'), {
                    name: `${cuid()}.${payload.uploadLogo.extname}`,
                });
                newData.logoImage = payload.uploadLogo.fileName;
            }
            delete newData.uploadLogo;
            const method = new WithdrawMethod();
            await method.merge(newData).save();
            return response.created({ success: true, message: 'Withdraw method has been updated' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async update(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const payload = await request.validateUsing(updateSchema);
            const method = await WithdrawMethod.query().where({ id }).first();
            if (!method) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            let newData = { params: payload?.inputParams };
            delete payload.inputParams;
            newData = { ...newData, ...payload };
            if (payload.uploadLogo) {
                await payload.uploadLogo.move(app.makePath('public/uploads'), {
                    name: `${cuid()}.${payload.uploadLogo.extname}`,
                });
                newData.logoImage = payload.uploadLogo.fileName;
            }
            delete newData.uploadLogo;
            await method.merge(newData).save();
            return response.created({ success: true, message: 'Withdraw method has been updated' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async addToBlackList(ctx) {
        const { request, response } = ctx;
        try {
            const { userId, methodId } = request.only(['userId', 'methodId']);
            const method = await WithdrawMethod.query().where({ id: methodId }).first();
            if (!method) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const user = await User.query().where('id', userId).first();
            if (!user) {
                return response.notFound({ success: false, message: 'Invalid User Id' });
            }
            await method.related('blackListedUsers').attach([user.id]);
            return response.created({ success: true, message: 'User added to the blacklist' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Add to blacklist  Error');
        }
    }
    async removeFromBlackList(ctx) {
        const { request, response } = ctx;
        try {
            const { userId, methodId } = request.only(['userId', 'methodId']);
            const method = await WithdrawMethod.query().where({ id: methodId }).first();
            if (!method) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const user = await User.query().where('id', userId).first();
            if (!user) {
                return response.notFound({ success: false, message: 'Invalid User Id' });
            }
            await method.related('blackListedUsers').detach([user.id]);
            return response.created({ success: true, message: 'User removed from the blacklist' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Remove from blacklist Error');
        }
    }
}
//# sourceMappingURL=methods_controller.js.map