import errorHandler from '#exceptions/error_handler';
import Currency from '#models/currency';
import { createSchema } from '#validators/currency';
import currencyRatesFetcher from '#services/currency_rates_fetcher';
export default class CurrenciesController {
    async index(ctx) {
        const { response } = ctx;
        try {
            const data = await Currency.findManyBy({ active: true });
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index currency Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await Currency.query().paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index currency Error');
        }
    }
    async fetchCurrencyRate(ctx) {
        const { response } = ctx;
        try {
            await currencyRatesFetcher();
            return response.json({ success: true, message: 'Currency rate updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Currency rate fetched Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const currencyId = request.param('id');
            const data = await Currency.findBy({ id: currencyId, active: true });
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get by currency id Error');
        }
    }
    async store(ctx) {
        const { request, response } = ctx;
        try {
            const payload = await request.validateUsing(createSchema);
            await Currency.create(payload);
            return response.json({ success: true, message: 'Currency created successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Storing currency Error');
        }
    }
    async update(ctx) {
        const { request, response } = ctx;
        try {
            const currencyId = request.param('id');
            const currency = await Currency.find(Number.parseInt(currencyId));
            if (!currency) {
                return response.badRequest({ success: false, message: 'Invalid currency primary Id' });
            }
            const payload = await request.validateUsing(createSchema);
            await Currency.query().where('id', currency.id).update(payload);
            return response.json({ success: true, message: 'Currency updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Updating currency Error');
        }
    }
    async toggleActiveStatus(ctx) {
        const { request, response } = ctx;
        try {
            const currencyId = request.param('id');
            const currency = await Currency.find(Number.parseInt(currencyId));
            if (!currency) {
                return response.badRequest({ success: false, message: 'Invalid currency primary Id' });
            }
            currency.active = !currency.active;
            await currency.save();
            return response.json({ success: true, message: 'Active status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Updating currency Error');
        }
    }
    async toggleCryptoStatus(ctx) {
        const { request, response } = ctx;
        try {
            const currencyId = request.param('id');
            const currency = await Currency.find(Number.parseInt(currencyId));
            if (!currency) {
                return response.badRequest({ success: false, message: 'Invalid currency primary Id' });
            }
            currency.isCrypto = !currency.isCrypto;
            await currency.save();
            return response.json({ success: true, message: 'Crypto status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Updating currency Error');
        }
    }
    async destroy(ctx) {
        const { request, response } = ctx;
        try {
            const currencyId = request.param('id');
            const currency = await Currency.find(Number.parseInt(currencyId));
            if (!currency) {
                return response.badRequest({ success: false, message: 'Invalid currency primary Id' });
            }
            await currency.delete();
            return response.json({ success: true, message: 'Currency deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Destroying currency Error');
        }
    }
}
//# sourceMappingURL=currencies_controller.js.map