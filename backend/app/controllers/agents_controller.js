import errorHandler from '#exceptions/error_handler';
import { updateSchema, updateFeesCommissionsSchema, updateStatusSchema } from '#validators/agent';
import Address from '#models/address';
import Agent from '#models/agent';
import { DateTime } from 'luxon';
import { Parser as Json2csvParser } from 'json2csv';
import notification_service from '#services/notification_service';
export default class AgentsController {
    async index(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const data = await Agent.filter(input)
                .andWhereHas('user', (query) => {
                query.where('roleId', 4);
            })
                .preload('user', (query) => query
                .preload('customer')
                .preload('wallets', (wQuery) => wQuery.where('default', true).preload('currency')))
                .preload('address')
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async exportCSV(ctx) {
        const { request, response } = ctx;
        try {
            const { fromDate, toDate, ...input } = request.qs();
            const dataQuery = Agent.filter(input)
                .andWhereHas('user', (query) => {
                query.where('roleId', 4);
            })
                .preload('user', (query) => query
                .preload('customer')
                .preload('wallets', (wQuery) => wQuery.where('default', true).preload('currency')))
                .preload('address');
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
                { label: 'User Id', value: 'user.id' },
                { label: 'Agent Id', value: 'agentId' },
                { label: 'Agent Name', value: 'name' },
                { label: 'Agent Email', value: 'email' },
                { label: 'Agent Status', value: 'status' },
                {
                    label: 'Registered At',
                    value: (ele) => DateTime.fromISO(ele.user.createdAt).toFormat('yyyy-MM-dd HH:mm:ss'),
                },
                { label: 'Name', value: 'user.customer.name' },
                { label: 'Email', value: 'user.email' },
                { label: 'Gender', value: 'user.customer.gender' },
                {
                    label: 'DOB',
                    value: (ele) => DateTime.fromISO(ele.user.customer.dob.toISOString()).toFormat('yyyy-MM-dd'),
                },
                { label: 'Phone Number', value: (ele) => ele.user.customer.phone || 'N/A' },
                { label: 'Status', value: 'user.status' },
                { label: 'Kyc Status', value: 'user.kycStatus' },
                { label: 'Suspened', value: 'isSuspend' },
                { label: 'Recommended', value: 'isRecommended' },
            ];
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(data);
            response.header('Content-Type', 'text/csv');
            response.header('Content-Disposition', `attachment; filename=agents.csv`);
            return response.send(csv);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async indexDeposit(ctx) {
        const { request, response } = ctx;
        try {
            const { countryCode, currencyCode } = request.qs();
            let where = { allowDeposit: true };
            if (countryCode) {
                where['countryCode'] = countryCode;
            }
            if (currencyCode) {
                where['currencyCode'] = currencyCode;
            }
            const data = await Agent.query()
                .where({ status: 'verified', isSuspend: false })
                .preload('address')
                .preload('user', (query) => {
                query.preload('customer');
            })
                .whereHas('agentMethods', (query) => {
                query.where(where);
            })
                .preload('agentMethods', (query) => {
                query.where(where);
            });
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Deposit Error');
        }
    }
    async indexWithdraw(ctx) {
        const { request, response } = ctx;
        try {
            const { countryCode, currencyCode } = request.qs();
            let where = { allowWithdraw: true };
            if (countryCode) {
                where['countryCode'] = countryCode;
            }
            if (currencyCode) {
                where['currencyCode'] = currencyCode;
            }
            const data = await Agent.query()
                .where({ status: 'verified', isSuspend: false })
                .preload('address')
                .preload('user', (query) => {
                query.preload('customer');
            })
                .whereHas('agentMethods', (query) => {
                query.where(where);
            })
                .preload('agentMethods', (query) => {
                query.where(where);
            });
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Withdraw Error');
        }
    }
    async getDetail(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await Agent.query()
                .where('userId', auth.user.id)
                .preload('user')
                .preload('address')
                .first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Detail Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Agent.query()
                .where('id', id)
                .whereHas('user', (query) => query.where({ roleId: 4 }))
                .preload('user', (query) => {
                query
                    .preload('referralUser', (rQuery) => {
                    rQuery.preload('customer');
                })
                    .preload('customer', (cQuery) => cQuery.preload('address'))
                    .preload('kyc')
                    .preload('permission')
                    .preload('wallets', (wQuery) => wQuery.preload('currency'));
            })
                .preload('address')
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
    async updateProfile(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('userId');
            let userId = id && auth.user.roleId === 1 ? id : auth.user.id;
            const { name, email, occupation, whatsapp, addressLine, zipCode, countryCode, city, processingTime, } = await request.validateUsing(updateSchema);
            const agent = await Agent.query()
                .where({ userId })
                .preload('user', (query) => query.preload('customer', (cQuery) => cQuery.preload('address')))
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            await agent.merge({ name, email, occupation, whatsapp, processingTime }).save();
            if (!agent.address) {
                const customerAddress = agent.user.customer.address;
                const address = await Address.create({
                    type: 'mailing',
                    addressLine: addressLine ? addressLine : customerAddress.addressLine,
                    zipCode: zipCode ? zipCode : customerAddress.zipCode,
                    countryCode: countryCode ? countryCode : customerAddress.countryCode,
                    city: city ? city : customerAddress.city,
                });
                agent.addressId = address.id;
                await agent.save();
                return response.created({ success: true, message: 'Agent updated successfully' });
            }
            await agent.address.merge({ addressLine, zipCode, countryCode, city }).save();
            return response.created({ success: true, message: 'Agent updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async updateFeesCommissions(ctx) {
        const { request, response } = ctx;
        try {
            const userId = request.param('userId');
            const payload = await request.validateUsing(updateFeesCommissionsSchema);
            const agent = await Agent.findBy({
                userId,
            });
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            await agent.merge(payload).save();
            return response.created({ success: true, message: 'Agent updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async updateStatus(ctx) {
        const { auth, request, response } = ctx;
        try {
            const userId = request.param('userId');
            const payload = await request.validateUsing(updateStatusSchema);
            const agent = await Agent.query()
                .where('userId', Number.parseInt(userId))
                .preload('user')
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await agent.merge(payload).save();
            if (payload.isSuspend !== undefined && payload.isSuspend) {
                await notification_service.sendSuspensionNotification(agent.userId);
                await notification_service.sendAgentMerchantSuspensionNotification(agent.user, 'Suspended Agent Account ', auth.user.id);
            }
            if (payload.isSuspend !== undefined && !payload.isSuspend) {
                await notification_service.sendSuspensionRemovedNotification(agent.userId);
                await notification_service.sendAgentMerchantSuspensionNotification(agent.user, 'Removed Agent Suspension', auth.user.id);
            }
            return response.ok({ success: true, message: 'Status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update status Error');
        }
    }
    async toggleSuspendStatus(ctx) {
        const { auth, request, response } = ctx;
        try {
            const agentId = request.param('id');
            const agent = await Agent.query()
                .where('id', Number.parseInt(agentId))
                .preload('user')
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await agent.merge({ isSuspend: !agent.isSuspend }).save();
            if (agent.isSuspend) {
                await notification_service.sendSuspensionNotification(agent.userId);
                await notification_service.sendAgentMerchantSuspensionNotification(agent.user, 'Suspended Agent Account ', auth.user.id);
            }
            else {
                await notification_service.sendSuspensionRemovedNotification(agent.userId);
                await notification_service.sendAgentMerchantSuspensionNotification(agent.user, 'Removed Agent Suspension', auth.user.id);
            }
            return response.ok({ success: true, message: 'Suspend status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Toggle status Error');
        }
    }
    async toggleRecommendStatus(ctx) {
        const { request, response } = ctx;
        try {
            const agentId = request.param('id');
            const agent = await Agent.query()
                .where('id', Number.parseInt(agentId))
                .preload('user')
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await agent.merge({ isRecommended: !agent.isRecommended }).save();
            return response.ok({ success: true, message: 'Recommended status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Toggle recommend status Error');
        }
    }
    async acceptAgent(ctx) {
        const { auth, request, response } = ctx;
        try {
            const agentId = request.param('id');
            const agent = await Agent.query()
                .where('id', Number.parseInt(agentId))
                .preload('user')
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await agent.merge({ status: 'verified' }).save();
            await notification_service.sendAgentMerchantSuspensionNotification(agent.user, 'Approved Agent Account', auth.user.id);
            return response.ok({ success: true, message: 'Agent accepted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Accept Agent Error');
        }
    }
    async declineAgent(ctx) {
        const { auth, request, response } = ctx;
        try {
            const agentId = request.param('id');
            const agent = await Agent.query()
                .where('id', Number.parseInt(agentId))
                .preload('user')
                .first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await agent.merge({ status: 'failed' }).save();
            await notification_service.sendAgentMerchantSuspensionNotification(agent.user, 'Rejected Agent Account', auth.user.id);
            return response.ok({ success: true, message: 'Agent declined successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Decline Agent Error');
        }
    }
}
//# sourceMappingURL=agents_controller.js.map