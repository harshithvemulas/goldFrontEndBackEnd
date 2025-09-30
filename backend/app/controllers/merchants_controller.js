import errorHandler from '#exceptions/error_handler';
import { paymentRequestSchema, updateFeesSchema, updateSchema } from '#validators/merchant';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers';
import { v4 as uuidv4 } from 'uuid';
import Address from '#models/address';
import Merchant from '#models/merchant';
import mail from '@adonisjs/mail/services/main';
import Transaction from '#models/transaction';
import { DateTime } from 'luxon';
import { Parser as Json2csvParser } from 'json2csv';
import exportService from '#services/export_service';
import notification_service from '#services/notification_service';
import PaymentRequestNotification from '#mails/payment_request_notification';
import brandingService from '#services/branding_service';
export default class MerchantsController {
    async index(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const data = await Merchant.filter(input)
                .andWhereHas('user', (query) => {
                query.where('roleId', 3);
            })
                .preload('user', (query) => query
                .preload('customer')
                .preload('wallets', (wQuery) => wQuery.where('default', true).preload('currency')))
                .preload('address')
                .orderBy('id', 'desc')
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
            const dataQuery = Merchant.filter(input)
                .andWhereHas('user', (query) => {
                query.where('roleId', 3);
            })
                .preload('user', (query) => query
                .preload('customer')
                .preload('wallets', (wQuery) => wQuery.where('default', true).preload('currency')))
                .preload('address')
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
                { label: 'User Id', value: 'user.id' },
                { label: 'Merchant Id', value: 'merchantId' },
                { label: 'Merchant Name', value: 'name' },
                { label: 'Merchant Email', value: 'email' },
                { label: 'Merchant Status', value: 'status' },
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
            ];
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(data);
            response.header('Content-Type', 'text/csv');
            response.header('Content-Disposition', `attachment; filename=merchants.csv`);
            return response.send(csv);
        }
        catch (error) {
            errorHandler(error, ctx, 'export Error');
        }
    }
    async exportPaymentRequestCSV(ctx) {
        await exportService.exportData(ctx, 'payment_request');
    }
    async indexSavedMerchants(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await auth.user.related('saves').query().where('type', 'merchant');
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index merchant Error');
        }
    }
    async adminIndexPaymentRequests(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = Transaction.filter({
                toSearch: input.search,
                status: input.status,
                date: input.date,
                bookmark: input.bookmark,
            })
                .where('type', 'payment_request')
                .preload('user')
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index payment request Error');
        }
    }
    async indexPaymentRequests(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = auth
                .user.related('transactions')
                .query()
                .apply((scopes) => scopes.filtration({
                search: input.search,
                status: input.status,
                date: input.date,
                bookmark: input.bookmark,
            }))
                .where('type', 'payment_request')
                .preload('user')
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index payment request Error');
        }
    }
    async getPaymentRequestById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id, type: 'payment_request' })
                .preload('user')
                .first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get payment request by Id Error');
        }
    }
    async getDetail(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await Merchant.query()
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
            const data = await Merchant.query()
                .where('id', id)
                .whereHas('user', (query) => query.where({ roleId: 3 }))
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
    async getGlobalMerchants(ctx) {
        const { request, response } = ctx;
        try {
            const { search } = request.qs();
            let data = await Merchant.query()
                .where('isSuspend', false)
                .andWhereHas('user', (query) => {
                query.where('status', true);
            })
                .andWhere('merchantId', 'LIKE', `%${search}%`)
                .orWhere('name', 'LIKE', `%${search}%`)
                .orWhere('email', 'LIKE', `%${search}%`)
                .orWhere('url', 'LIKE', `%${search}%`);
            const serializeData = data.map((ele) => ele.serialize({
                fields: {
                    pick: ['merchantId', 'email', 'name', 'profileImage', 'url'],
                },
            }));
            return response.json(serializeData);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get By Merhcant ID Error');
        }
    }
    async update(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('userId');
            let userId = id && auth.user.roleId === 1 ? id : auth.user.id;
            const payload = await request.validateUsing(updateSchema);
            const { name, email, proof, addressLine, zipCode, countryCode, city, storeProfileImage, ...restPayload } = payload;
            const merchant = await Merchant.query().where({ userId }).preload('address').first();
            if (!merchant) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            merchant.merge(restPayload);
            if (storeProfileImage) {
                await storeProfileImage.move(app.makePath('public/uploads'), {
                    name: `${cuid()}.${storeProfileImage.extname}`,
                });
                merchant.storeProfileImage = storeProfileImage.fileName;
            }
            if (!merchant.address) {
                const address = await Address.create({
                    type: 'mailing',
                    addressLine,
                    zipCode,
                    countryCode,
                    city,
                });
                merchant.addressId = address.id;
            }
            await merchant.save();
            await merchant.address.merge({ addressLine, zipCode, countryCode, city }).save();
            return response.created({ success: true, message: 'Merchant updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async updateFees(ctx) {
        const { request, response } = ctx;
        try {
            const userId = request.param('userId');
            const payload = await request.validateUsing(updateFeesSchema);
            const merchant = await Merchant.findBy({
                userId,
            });
            if (!merchant) {
                return response.notFound({ success: false, message: 'Merchant data not found' });
            }
            await merchant.merge(payload).save();
            return response.created({ success: true, message: 'Merchant fees updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async generateApiKey(ctx) {
        const { auth, response } = ctx;
        try {
            const merchant = await Merchant.findBy({
                userId: auth.user.id,
            });
            if (!merchant) {
                return response.notFound({ success: false, message: 'Merchant detail not found' });
            }
            const apiKey = uuidv4();
            merchant.apiKey = apiKey;
            merchant.save();
            return response.created({ success: true, message: 'Api key generated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async deleteApiKey(ctx) {
        const { auth, response } = ctx;
        try {
            const merchant = await Merchant.findBy({
                userId: auth.user.id,
            });
            if (!merchant) {
                return response.notFound({ success: false, message: 'Merchant detail not found' });
            }
            merchant.apiKey = null;
            merchant.save();
            return response.created({ success: true, message: 'Api key deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async saveMerchant(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { merchantId } = request.only(['merchantId']);
            const merchant = await Merchant.query()
                .where('merchantId', merchantId)
                .preload('user', (query) => {
                query.preload('customer');
            })
                .first();
            if (!merchant) {
                return response.notFound({
                    success: false,
                    message: 'Merchant data not found or invalid merchant_id',
                });
            }
            const alreadyExist = await auth
                .user.related('saves')
                .query()
                .where({ type: 'merchant', value: merchantId })
                .first();
            if (alreadyExist) {
                return response.notFound({
                    success: false,
                    message: 'This merchant_id is already exist in the saved list',
                });
            }
            await auth.user.related('saves').create({
                type: 'merchant',
                info: {
                    image: merchant.storeProfileImage ?? '',
                    label: merchant.name ?? '',
                    email: merchant.email ?? '',
                },
                value: merchant.merchantId,
                relatedModel: 'merchants',
                relatedModelId: merchant.id,
            });
            return response.json({ success: true, message: 'Merchant saved successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Save Merchant Error');
        }
    }
    async toggleSuspendStatus(ctx) {
        const { auth, request, response } = ctx;
        try {
            const merchantId = request.param('id');
            const merchant = await Merchant.query()
                .where('id', Number.parseInt(merchantId))
                .preload('user')
                .first();
            if (!merchant) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await merchant.merge({ isSuspend: !merchant.isSuspend }).save();
            if (merchant.isSuspend) {
                await notification_service.sendSuspensionNotification(merchant.userId);
                await notification_service.sendAgentMerchantSuspensionNotification(merchant.user, 'Suspended Merchant Account', auth.user.id);
            }
            else {
                await notification_service.sendSuspensionRemovedNotification(merchant.userId);
                await notification_service.sendAgentMerchantSuspensionNotification(merchant.user, 'Removed Merchant Suspension', auth.user.id);
            }
            return response.ok({ success: true, message: 'Suspend status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Accept Merchant Error');
        }
    }
    async acceptMerchant(ctx) {
        const { auth, request, response } = ctx;
        try {
            const merchantId = request.param('id');
            const merchant = await Merchant.query()
                .where('id', Number.parseInt(merchantId))
                .preload('user')
                .first();
            if (!merchant) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await merchant.merge({ status: 'verified' }).save();
            await notification_service.sendAgentMerchantSuspensionNotification(merchant.user, 'Approved Merchant Account', auth.user.id);
            return response.ok({ success: true, message: 'Merchant accepted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Accept Merchant Error');
        }
    }
    async declineMerchant(ctx) {
        const { auth, request, response } = ctx;
        try {
            const merchantId = request.param('id');
            const merchant = await Merchant.query()
                .where('id', Number.parseInt(merchantId))
                .preload('user')
                .first();
            if (!merchant) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await merchant.merge({ status: 'failed' }).save();
            await notification_service.sendAgentMerchantSuspensionNotification(merchant.user, 'Rejected Merchant Account', auth.user.id);
            return response.ok({ success: true, message: 'Merchant declined successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Decline Merchant Error');
        }
    }
    async requestPayment(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { email, name, address, feeByCustomer, amount, currencyCode, countryCode } = await request.validateUsing(paymentRequestSchema);
            const merchant = await Merchant.findBy({
                userId: auth.user.id,
            });
            if (!merchant) {
                return response.notFound({ status: false, message: 'Merchant details not found' });
            }
            const paymentRequest = await auth.user.related('transactions').create({
                type: 'payment_request',
                from: {
                    label: merchant.name ?? '',
                    image: merchant.storeProfileImage ?? '',
                    email: merchant.email,
                    currency: currencyCode,
                },
                to: { label: name, email },
                amount,
                fee: 0,
                total: amount,
                status: 'pending',
                metaData: {
                    country: countryCode.toUpperCase(),
                    currency: currencyCode.toUpperCase(),
                    feeByCustomer,
                    address,
                },
            });
            const branding = await brandingService();
            await mail.sendLater(new PaymentRequestNotification(merchant, {
                customerName: name,
                amount,
                currencyCode,
                link: `${branding?.siteUrl}/mpay/qrform?merchantId=${merchant.id}&amount=${amount}&currency=${currencyCode}&country=${countryCode}&customerName=${name}&customerEmail=${email}&customerAddress=${address}`,
            }, email, branding));
            return response.created({
                success: true,
                message: 'Payment requested successfully',
                data: paymentRequest,
                redirectUrl: `${branding?.siteUrl}/mpay/qrform?merchantId=${merchant.id}&amount=${amount}&currency=${currencyCode}&country=${countryCode}&customerName=${name}&customerEmail=${email}&customerAddress=${address}`,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Payment Request Error');
        }
    }
}
//# sourceMappingURL=merchants_controller.js.map