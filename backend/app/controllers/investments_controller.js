import errorHandler from '#exceptions/error_handler';
import Currency from '#models/currency';
import Investment from '#models/investment';
import InvestmentPlan from '#models/investment_plan';
import Wallet from '#models/wallet';
import { addBalance, removeBalance } from '#services/wallet_service';
import { storeSchema, updateSchema } from '#validators/investment';
import { DateTime } from 'luxon';
export default class InvestmentsController {
    async index(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await Investment.query()
                .where('status', 'active')
                .andWhere('userId', auth?.user.id)
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('agent');
                query.preload('merchant');
            })
                .orderBy('createdAt', 'desc');
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async indexHistory(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await Investment.query()
                .whereNot('status', 'active')
                .andWhere('userId', auth?.user.id)
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('agent');
                query.preload('merchant');
            })
                .orderBy('createdAt', 'desc')
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async indexById(ctx) {
        const { auth, response, params } = ctx;
        try {
            const data = await Investment.query()
                .where('id', params.id)
                .andWhere('userId', auth?.user.id)
                .first();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, search } = request.qs();
            const dataQuery = Investment.filter({ search });
            const data = await dataQuery
                .where('status', 'active')
                .orderBy('createdAt', 'desc')
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('agent');
                query.preload('merchant');
            })
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminIndexHistory(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, search } = request.qs();
            const dataQuery = Investment.filter({ search });
            const data = await dataQuery
                .whereNot('status', 'active')
                .orderBy('createdAt', 'desc')
                .preload('user', (query) => {
                query.preload('customer');
                query.preload('agent');
                query.preload('merchant');
            })
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminById(ctx) {
        const { response, params } = ctx;
        try {
            const data = await Investment.findOrFail(params.id);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async update(ctx) {
        const { request, response, params } = ctx;
        try {
            const data = await request.validateUsing(updateSchema);
            const investment = await Investment.findOrFail(params.id);
            investment.merge(data);
            await investment.save();
            return response.json(investment);
        }
        catch (error) {
            errorHandler(error, ctx, 'update Error');
        }
    }
    async destroy(ctx) {
        const { response, params } = ctx;
        try {
            const investment = await Investment.findOrFail(params.id);
            await investment.delete();
            return response.json({ message: 'Investment deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'destroy Error');
        }
    }
    async investByPlan(ctx) {
        const { auth, request, response } = ctx;
        try {
            const data = await request.validateUsing(storeSchema);
            const investmentPlan = await InvestmentPlan.findOrFail(data.investmentPlanId);
            if (!investmentPlan.isActive) {
                return response.status(400).json({ message: 'Investment Plan is not active' });
            }
            if (investmentPlan.isRange) {
                if (data.amountInvested < investmentPlan.minAmount ||
                    (investmentPlan.maxAmount !== null && data.amountInvested > investmentPlan.maxAmount)) {
                    return response.status(400).json({ message: 'Amount is not within the range' });
                }
            }
            else {
                if (data.amountInvested !== investmentPlan.minAmount) {
                    return response.status(400).json({ message: 'Amount is not correct' });
                }
            }
            const currency = await Currency.findBy('code', investmentPlan.currency.toUpperCase());
            if (!currency) {
                return response.notFound({
                    success: false,
                    message: 'Currency code invalid or data not found',
                });
            }
            const wallet = await Wallet.findBy({ userId: ctx.auth?.user.id, currencyId: currency.id });
            if (!wallet || wallet.balance < data.amountInvested) {
                return response.badRequest({ success: false, message: 'Insufficient balance' });
            }
            await removeBalance(data.amountInvested, investmentPlan.currency.toUpperCase(), ctx.auth?.user.id);
            const investment = await Investment.create({
                name: investmentPlan.name,
                amountInvested: data.amountInvested,
                currency: investmentPlan.currency,
                interestRate: investmentPlan.interestRate,
                duration: investmentPlan.duration,
                durationType: investmentPlan.durationType,
                withdrawAfterMatured: investmentPlan.withdrawAfterMatured,
                status: 'active',
                userId: ctx.auth?.user.id,
                profit: 0,
                endsAt: DateTime.now().plus({ days: investmentPlan.duration }),
            });
            await auth?.user?.load('customer');
            await auth?.user?.related('transactions').create({
                type: 'investment',
                from: { label: auth?.user.customer.name, email: auth?.user.email },
                to: { label: 'Investment' },
                amount: data.amountInvested,
                total: data.amountInvested,
                status: 'completed',
                metaData: { currency: investment.currency },
                fee: 0,
                userId: ctx.auth?.user.id,
            });
            return response.json(investment);
        }
        catch (error) {
            errorHandler(error, ctx, 'Invest Create Error');
        }
    }
    async withdraw(ctx) {
        const { auth, response, params } = ctx;
        try {
            const investment = await Investment.query()
                .where('id', params.id)
                .andWhere('userId', auth?.user?.id)
                .firstOrFail();
            if (investment.status !== 'active') {
                return response.status(400).json({ message: 'Investment is not active' });
            }
            if (investment.withdrawAfterMatured && investment.endsAt > DateTime.now()) {
                return response.status(400).json({ message: 'Investment is not matured yet' });
            }
            investment.status = 'withdrawn';
            await investment.save();
            await addBalance(investment.amountInvested + investment.profit, investment.currency, investment.userId);
            await auth?.user?.load('customer');
            await auth?.user?.related('transactions').create({
                type: 'investment',
                from: { label: 'Investment' },
                to: { label: auth?.user.customer.name, email: auth?.user.email },
                amount: investment.amountInvested + investment.profit,
                total: investment.amountInvested + investment.profit,
                metaData: { currency: investment.currency },
                status: 'completed',
                fee: 0,
                userId: ctx.auth?.user.id,
            });
            return response.json(investment);
        }
        catch (error) {
            errorHandler(error, ctx, 'Investment Withdraw Error');
        }
    }
}
//# sourceMappingURL=investments_controller.js.map