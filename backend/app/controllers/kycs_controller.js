import Kyc from '#models/kyc';
import errorHandler from '#exceptions/error_handler';
import { createUpdateSchema } from '#validators/kyc';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers';
import notification_service from '#services/notification_service';
import referralService from '#services/referral_service';
export default class KycsController {
    async index(ctx) {
        const { response } = ctx;
        try {
            const data = Kyc.all();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async getDetail(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await Kyc.query()
                .where('userId', auth.user.id)
                .preload('user', (userQuery) => {
                userQuery.preload('customer');
            })
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
            const userId = request.param('id');
            const data = await Kyc.query()
                .where('userId', Number.parseInt(userId))
                .preload('user', (userQuery) => {
                userQuery.preload('customer');
            })
                .first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get by id Error');
        }
    }
    async createOrUpdate(ctx) {
        const { auth, request, response } = ctx;
        try {
            if (auth.user?.kycStatus) {
                return response.abort({ success: false, message: 'Kyc already accepted' });
            }
            const { documentType, selfie, front, back } = await request.validateUsing(createUpdateSchema);
            const kyc = await Kyc.findBy({
                userId: auth.user.id,
            });
            let newData = { documentType };
            if (selfie) {
                await selfie.move(app.makePath('public/uploads'), {
                    name: `${cuid()}.${selfie.extname}`,
                });
                newData.selfie = selfie.fileName;
            }
            if (front) {
                await front.move(app.makePath('public/uploads'), {
                    name: `${cuid()}.${front.extname}`,
                });
                newData.front = front.fileName;
            }
            if (back) {
                await back.move(app.makePath('public/uploads'), {
                    name: `${cuid()}.${back.extname}`,
                });
                newData.back = back.fileName;
            }
            if (!kyc) {
                await auth.user?.related('kyc').create({ status: 'pending', ...newData });
                await notification_service.sendKycSubmitNotification(auth.user);
                return response.created({ success: true, message: 'Kyc updated successfully' });
            }
            await kyc.merge({ status: 'pending', ...newData }).save();
            await notification_service.sendKycSubmitNotification(auth.user);
            return response.created({ success: true, message: 'Kyc updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Create or update Error');
        }
    }
    async acceptKyc(ctx) {
        const { request, response } = ctx;
        try {
            const kycId = request.param('id');
            const kyc = await Kyc.query().where('id', Number.parseInt(kycId)).preload('user').first();
            if (!kyc) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await kyc.merge({ status: 'verified' }).save();
            await kyc.user.merge({ kycStatus: true }).save();
            await notification_service.sendKycAcceptedNotification(kyc.user.id);
            await referralService(kyc.user, 'kyc');
            return response.ok({ success: true, message: 'Kyc accepted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Accept kyc Error');
        }
    }
    async declineKyc(ctx) {
        const { request, response } = ctx;
        try {
            const kycId = request.param('id');
            const kyc = await Kyc.query().where('id', Number.parseInt(kycId)).preload('user').first();
            if (!kyc) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await kyc.merge({ status: 'failed' }).save();
            await kyc.user.merge({ kycStatus: false }).save();
            await notification_service.sendKycAcceptedNotification(kyc.user.id);
            return response.ok({ success: true, message: 'Kyc declined successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Decline kyc Error');
        }
    }
}
//# sourceMappingURL=kycs_controller.js.map