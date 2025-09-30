import errorHandler from '#exceptions/error_handler';
import InvestmentPlan from '#models/investment_plan';
import { storeSchema, updateSchema } from '#validators/investment_plan';
export default class InvestmentPlansController {
    async index(ctx) {
        const { response } = ctx;
        try {
            const data = await InvestmentPlan.query().where('isActive', true).orderBy('createdAt', 'asc');
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminIndex(ctx) {
        const { response } = ctx;
        try {
            const data = await InvestmentPlan.query().orderBy('createdAt', 'asc');
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminById(ctx) {
        const { response, params } = ctx;
        try {
            const data = await InvestmentPlan.findOrFail(params.id);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async store(ctx) {
        const { request, response } = ctx;
        try {
            const data = await request.validateUsing(storeSchema);
            const investmentPlan = await InvestmentPlan.create(data);
            return response.json(investmentPlan);
        }
        catch (error) {
            errorHandler(error, ctx, 'store Error');
        }
    }
    async update(ctx) {
        const { request, response, params } = ctx;
        try {
            const data = await request.validateUsing(updateSchema);
            const investmentPlan = await InvestmentPlan.findOrFail(params.id);
            investmentPlan.merge(data);
            await investmentPlan.save();
            return response.json(investmentPlan);
        }
        catch (error) {
            errorHandler(error, ctx, 'update Error');
        }
    }
    async destroy(ctx) {
        const { response, params } = ctx;
        try {
            const investmentPlan = await InvestmentPlan.findOrFail(params.id);
            await investmentPlan.delete();
            return response.json({ message: 'Investment Plan deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'destroy Error');
        }
    }
}
//# sourceMappingURL=investment_plans_controller.js.map