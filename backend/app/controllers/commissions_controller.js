import errorHandler from '#exceptions/error_handler';
import Agent from '#models/agent';
import Commission from '#models/commission';
import { updateStatusSchema } from '#validators/commission';
import { DateTime } from 'luxon';
import { Parser as Json2csvParser } from 'json2csv';
import formatPrecision from '#utils/format_precision';
import brandingService from '#services/branding_service';
import { addBalance } from '#services/wallet_service';
export default class CommissionsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const userId = request.param('userId');
            if (auth.user.roleId !== 1 && auth.user.id !== Number.parseInt(userId)) {
                return response.unauthorized({ success: false, message: 'You are not allowed!' });
            }
            const agent = await Agent.query().where({ userId }).first();
            if (!agent) {
                return response.badRequest({ success: false, message: 'Agent data not found' });
            }
            const dataQuery = Commission.filter(input)
                .where('agentId', agent.id)
                .preload('agent', (query) => {
                query.preload('user', (uQuery) => {
                    uQuery.preload('customer');
                });
            })
                .preload('transaction')
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async exportCSV(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { fromDate, toDate, ...input } = request.qs();
            const userId = request.param('userId');
            if (auth.user.roleId !== 1 && auth.user.id !== Number.parseInt(userId)) {
                return response.unauthorized({ success: false, message: 'You are not allowed!' });
            }
            const agent = await Agent.query().where({ userId }).first();
            if (!agent) {
                return response.badRequest({ success: false, message: 'Agent data not found' });
            }
            const dataQuery = Commission.filter(input)
                .where('agentId', agent.id)
                .preload('agent', (query) => {
                query.preload('user', (uQuery) => {
                    uQuery.preload('customer');
                });
            })
                .preload('transaction')
                .orderBy('id', 'desc');
            const fromDateFormatted = fromDate ? DateTime.fromISO(fromDate).toISODate() : null;
            const toDateFormatted = toDate ? DateTime.fromISO(toDate).toISODate() : null;
            if (fromDateFormatted) {
                dataQuery.where('createdAt', '>=', fromDateFormatted);
            }
            if (toDateFormatted) {
                dataQuery.where('createdAt', '<=', toDateFormatted);
            }
            const data = await dataQuery.exec();
            const fields = [
                {
                    label: 'Date',
                    value: (ele) => DateTime.fromISO(ele.createdAt).toFormat('yyyy-MM-dd HH:mm:ss'),
                },
                { label: 'Status', value: 'status' },
                { label: 'Amount', value: 'amount' },
                { label: 'TRX ID', value: 'transaction.trxId' },
            ];
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(data);
            response.header('Content-Type', 'text/csv');
            response.header('Content-Disposition', `attachment; filename=settlements.csv`);
            return response.send(csv);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = Commission.filter(input)
                .preload('agent', (query) => {
                query.preload('user', (uQuery) => {
                    uQuery.preload('customer');
                    uQuery.preload('merchant');
                    uQuery.preload('agent');
                });
            })
                .preload('transaction')
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Admin Index Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Commission.query()
                .where('id', id)
                .preload('agent', (query) => {
                query.preload('user', (uQuery) => {
                    uQuery.preload('customer');
                });
            })
                .preload('transaction')
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
    async totalCommissions(ctx) {
        const { auth, request, response } = ctx;
        try {
            const userId = request.param('userId');
            if (auth.user.roleId !== 1 && auth.user.id !== Number.parseInt(userId)) {
                return response.unauthorized({ success: false, message: 'You are not allowed!' });
            }
            const agent = await Agent.query().where({ userId }).first();
            if (!agent) {
                return response.badRequest({ success: false, message: 'Agent data not found' });
            }
            const commissions = await Commission.query()
                .where('agent_id', agent.id)
                .andWhere('status', 'pending')
                .sum('amount as total')
                .first();
            const branding = await brandingService();
            const total = {
                total: commissions ? formatPrecision(commissions.$extras.total) : 0,
                currency: branding.defaultCurrency,
            };
            return response.json(total);
        }
        catch (error) {
            errorHandler(error, ctx, 'Total Commission Error');
        }
    }
    async settleCommission(ctx) {
        const { request, response } = ctx;
        try {
            const userId = request.param('userId');
            const agent = await Agent.query().where({ userId }).first();
            if (!agent) {
                return response.badRequest({ success: false, message: 'Agent data not found' });
            }
            const commissionAmountTotal = await Commission.query()
                .where('agentId', agent.id)
                .andWhere('status', 'pending')
                .sum('amount as total')
                .first();
            const branding = await brandingService();
            await addBalance(commissionAmountTotal?.$extras.total.toFixed(2), branding.defaultCurrency, agent.userId);
            const updatedCount = await Commission.query()
                .where('agentId', agent.id)
                .andWhere('status', 'pending')
                .update({ status: 'completed' });
            if (Number.parseInt(updatedCount) === 0) {
                return response.badRequest({
                    success: false,
                    message: `No pending commissions found`,
                });
            }
            return response.ok({
                success: true,
                message: `Successfully settled pending commissions`,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Settlement Commission Error');
        }
    }
    async updateStatus(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const { status } = await request.validateUsing(updateStatusSchema);
            const commission = await Commission.query().where('id', id).first();
            if (!commission) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            commission.status = status;
            await commission.save();
            return response.ok({
                success: true,
                message: 'Status updated successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update status Error');
        }
    }
    async delete(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const commission = await Commission.query().where('id', id).first();
            if (!commission) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await commission.delete();
            return response.ok({
                success: true,
                message: 'Commission deleted successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Deleting Error');
        }
    }
}
//# sourceMappingURL=commissions_controller.js.map