import errorHandler from '#exceptions/error_handler';
import Agent from '#models/agent';
import AgentMethod from '#models/agent_method';
import { methodSchema, methodUpdateSchema } from '#validators/agent_method';
export default class AgentMethodsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const id = request.param('userId');
            let userId = id && auth.user.roleId === 1 ? id : auth.user.id;
            const agent = await Agent.query().where({ userId }).first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            const dataQuery = AgentMethod.query().where('agentId', agent.id).orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await AgentMethod.query().where('id', id).first();
            if (!data) {
                return response.notFound({ success: false, message: 'Agent method data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get By Id Error');
        }
    }
    async store(ctx) {
        const { auth, request, response } = ctx;
        try {
            const payload = await request.validateUsing(methodSchema);
            const agent = await Agent.query().where('userId', auth.user.id).first();
            if (!agent) {
                return response.notFound({ success: false, message: 'Agent data not found' });
            }
            await agent?.related('agentMethods').create(payload);
            return response.created({ success: true, message: 'New method created successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Store Error');
        }
    }
    async update(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const payload = await request.validateUsing(methodUpdateSchema);
            const agentMethod = await AgentMethod.query().where('id', id).first();
            if (!agentMethod) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await agentMethod.merge(payload).save();
            return response.created({ success: true, message: 'Agent method updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async delete(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const agentMethod = await AgentMethod.query().where('id', id).first();
            if (!agentMethod) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await agentMethod.delete();
            return response.created({ success: true, message: 'Agent method deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Delete Error');
        }
    }
}
//# sourceMappingURL=agent_methods_controller.js.map