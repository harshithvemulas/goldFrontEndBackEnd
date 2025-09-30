import mail from '@adonisjs/mail/services/main';
import errorHandler from '#exceptions/error_handler';
import User from '#models/user';
import { updateAdminSchema, createAdminSchema, sendMailSchema, updateTransferLimitSchema, updateUserPermissionSchema, } from '#validators/user';
import fs from 'node:fs';
import Transaction from '#models/transaction';
import { compareDate } from '../utils/compare_date_time.js';
import Currency from '#models/currency';
import Address from '#models/address';
import { DateTime } from 'luxon';
import { Parser as Json2csvParser } from 'json2csv';
import { addBalance, removeBalance } from '#services/wallet_service';
import { balanceEditSchema } from '#validators/wallet';
import db from '@adonisjs/lucid/services/db';
import formatPrecision from '#utils/format_precision';
import { currencyConversion } from '#services/currency_rates_fetcher';
import notification_service from '#services/notification_service';
import brandingService from '#services/branding_service';
import Customer from '#models/customer';
export default class UsersController {
    async index(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = User.filter(input)
                .preload('customer', (query) => {
                query.preload('address');
            })
                .preload('merchant', (query) => {
                query.preload('address');
            })
                .preload('agent')
                .preload('wallets', (query) => query.where('default', true).preload('currency'))
                .preload('referralUser', (query) => {
                query.preload('customer');
            })
                .preload('loginSessions', (query) => {
                query.orderBy('id', 'desc').first();
            })
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index Error');
        }
    }
    async exportCSV(ctx) {
        const { request, response } = ctx;
        try {
            const { fromDate, toDate, ...input } = request.qs();
            const dataQuery = User.filter(input)
                .preload('customer')
                .preload('merchant')
                .preload('agent')
                .preload('wallets', (query) => query.where('default', true).preload('currency'))
                .preload('referralUser')
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
                { label: 'User Id', value: 'id' },
                { label: 'Role Id', value: 'roleId' },
                {
                    label: 'Registered At',
                    value: (ele) => DateTime.fromISO(ele.createdAt).toFormat('yyyy-MM-dd HH:mm:ss'),
                },
                { label: 'Name', value: 'customer.name' },
                { label: 'Email', value: 'email' },
                { label: 'Gender', value: 'customer.gender' },
                {
                    label: 'DOB',
                    value: (ele) => DateTime.fromISO(ele.customer.dob.toISOString()).toFormat('yyyy-MM-dd'),
                },
                { label: 'Phone Number', value: (ele) => ele.customer.dob || 'N/A' },
                { label: 'Status', value: 'status' },
                { label: 'Kyc Status', value: 'kycStatus' },
            ];
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(data);
            response.header('Content-Type', 'text/csv');
            response.header('Content-Disposition', `attachment; filename=customers.csv`);
            return response.send(csv);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async totalCountByAdmin(ctx) {
        const { request, response } = ctx;
        try {
            const { type, date, status } = request.qs();
            const formattedDate = DateTime.fromISO(date).toISODate();
            const counts = {
                deposit: 0,
                direct_deposit: 0,
                withdraw: 0,
                transfer: 0,
                exchange: 0,
                payment: 0,
                services: 0,
                payment_request: 0,
                deposit_request: 0,
                withdraw_request: 0,
                customer: { total: 0, new: 0 },
                merchant: { total: 0, new: 0 },
                agent: { total: 0, new: 0 },
                depositAmount: 0,
                withdrawAmount: 0,
                transferAmount: 0,
                exchangeAmount: 0,
                investment: 0,
                investment_return: 0,
                referral_bonus: 0,
            };
            const transactions = await Transaction.query()
                .if(type, (query) => {
                query.where('type', type);
            })
                .if(date, (query) => {
                query.whereRaw('DATE(created_at) = ?', [formattedDate]);
            })
                .where('status', status || 'completed');
            const transactionsJSON = transactions
                .map((trx) => {
                const metaData = JSON.parse(trx.metaData.toString());
                if (trx.type === 'transfer' || trx.type === 'payment') {
                    if (metaData?.trxAction === 'receive') {
                        return null;
                    }
                }
                const serialized = trx.serialize({
                    fields: ['type', 'amount', 'currency'],
                });
                return serialized;
            })
                ?.filter((trx) => trx !== null);
            let currencyTypeSums = transactionsJSON.reduce((acc, trx) => {
                const key = `${trx.currency}-${trx.type}`;
                acc[key] = (acc[key] || 0) + Number.parseFloat(trx.amount || '0');
                return acc;
            }, {});
            const currencyTypes = Object.keys(currencyTypeSums || {});
            await Promise.all(currencyTypes.map(async (key) => {
                const [currency, trxType] = key.split('-');
                if (currency !== 'USD') {
                    const exchangedAmount = await currencyConversion(currency, 'USD', currencyTypeSums[key] || 0);
                    if (trxType === 'deposit') {
                        counts.depositAmount += exchangedAmount;
                    }
                    if (trxType === 'withdraw') {
                        counts.withdrawAmount += exchangedAmount;
                    }
                    if (trxType === 'transfer') {
                        counts.transferAmount += exchangedAmount;
                    }
                    if (trxType === 'exchange') {
                        counts.exchangeAmount += exchangedAmount;
                    }
                }
                else {
                    if (trxType === 'deposit') {
                        counts.depositAmount += currencyTypeSums[key] || 0;
                    }
                    if (trxType === 'withdraw') {
                        counts.withdrawAmount += currencyTypeSums[key] || 0;
                    }
                    if (trxType === 'transfer') {
                        counts.transferAmount += currencyTypeSums[key] || 0;
                    }
                    if (trxType === 'exchange') {
                        counts.exchangeAmount += currencyTypeSums[key] || 0;
                    }
                }
            }));
            const trxCount = await Transaction.query()
                .select(['type', db.raw('COUNT(*) as count')])
                .if(type, (query) => {
                query.where('type', type);
            })
                .if(date, (query) => {
                query.whereRaw('DATE(created_at) = ?', [formattedDate]);
            })
                .where('status', status || 'completed')
                .groupBy('type');
            const userData = await User.query().where({ status: true });
            trxCount?.map((trx) => {
                if (trx.type === 'transfer' || trx.type === 'payment') {
                    counts[trx.type] = trx.$extras.count / 2;
                }
                else {
                    counts[trx.type] = formatPrecision(trx.$extras.count);
                }
            });
            userData.forEach((user) => {
                if (user.roleId === 2) {
                    counts.customer.total++;
                    if (compareDate(user.createdAt)) {
                        counts.customer.new++;
                    }
                }
                if (user.roleId === 3) {
                    counts.merchant.total++;
                    if (compareDate(user.createdAt)) {
                        counts.merchant.new++;
                    }
                }
                if (user.roleId === 4) {
                    counts.agent.total++;
                    if (compareDate(user.createdAt)) {
                        counts.agent.new++;
                    }
                }
            });
            return response.json(counts);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await User.query()
                .where({ id })
                .preload('customer', (query) => {
                query.preload('address');
            })
                .preload('merchant', (query) => {
                query.preload('address');
            })
                .preload('agent')
                .preload('kyc')
                .preload('permission')
                .preload('wallets', (query) => query.preload('currency'))
                .preload('referralUser', (query) => {
                query.preload('customer');
            })
                .preload('loginSessions', (query) => {
                query.orderBy('id', 'desc').first();
            })
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
    async getUserByEmail(ctx) {
        const { request, response } = ctx;
        try {
            const { email } = request.qs();
            let data = await User.query().where({ email }).preload('customer').first();
            if (!data) {
                return response.notFound({ success: false, message: 'Invalid Email' });
            }
            if (![2, 3].includes(data.roleId)) {
                return response.badRequest({ success: false, message: 'This email is not acceptable' });
            }
            const newData = {
                id: data.id,
                email: data.email,
                name: data.customer.name,
                profileImage: data.customer.profileImage,
                gender: data.customer.gender,
            };
            return response.json(newData);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get User By Email Error');
        }
    }
    async getBlackListedGateways(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await User.query().where({ id }).preload('blackListedGateways').first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Blacklisted Gateways Error');
        }
    }
    async getBlackListedMethods(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await User.query().where({ id }).preload('blackListedMethods').first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Blacklisted Methods Error');
        }
    }
    async getUserPermission(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const user = await User.query().where({ id }).preload('permission').first();
            if (!user) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            if (!user.permission) {
                await user.related('permission').create({});
                await user.load('permission');
            }
            return response.json(user);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get User Permission Error');
        }
    }
    async updateAdmin(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const payload = await request.validateUsing(updateAdminSchema);
            const user = await User.query().where({ id }).preload('customer').first();
            if (!user) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            user.email = payload.email;
            if (payload.password) {
                user.password = payload.password;
            }
            await user.save();
            const customer = await Customer.findByOrFail('userId', id);
            const address = await Address.findByOrFail('id', customer?.addressId);
            customer.firstName = payload.firstName;
            customer.lastName = payload.lastName;
            customer.phone = payload.phone;
            customer.gender = payload.gender;
            customer.dob = payload.dob;
            await customer.save();
            address.addressLine = payload.addressLine;
            address.zipCode = payload.zipCode;
            address.countryCode = payload.countryCode;
            address.city = payload.city;
            await address.save();
            return response.created({ success: true, message: 'Admin updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Create Admin Error');
        }
    }
    async createAdmin(ctx) {
        const { request, response } = ctx;
        try {
            const payload = await request.validateUsing(createAdminSchema);
            const branding = await brandingService();
            const currency = await Currency.findBy('code', branding.defaultCurrency);
            const user = new User();
            user.email = payload.email;
            user.password = payload.password;
            user.status = true;
            user.kycStatus = true;
            user.isEmailVerified = true;
            user.limitTransfer = false;
            user.roleId = 1;
            user.acceptTermsCondition = true;
            await user.save();
            user.related('permission').create({});
            await user.related('wallets').create({
                balance: 0,
                default: true,
                currencyId: currency?.id ?? 1,
                dailyTransferAmount: null,
            });
            const customerAddress = await Address.create({
                type: 'mailing',
                addressLine: payload.addressLine,
                zipCode: payload.zipCode,
                countryCode: payload.countryCode,
                city: payload.city,
            });
            await user.related('customer').create({
                addressId: customerAddress.id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                phone: payload.phone,
                gender: payload.gender,
                dob: payload.dob,
            });
            return response.created({ success: true, message: 'Admin created successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Create Admin Error');
        }
    }
    async updateUserPermission(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const payload = await request.validateUsing(updateUserPermissionSchema);
            const user = await User.query().where({ id }).preload('permission').first();
            if (!user) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            if (!user.permission) {
                await user.related('permission').create({});
                await user.load('permission');
            }
            user.permission[payload.permission] = !user.permission[payload.permission];
            await user.permission.save();
            return response.created({ success: true, message: 'Permission updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update permission Error');
        }
    }
    async updateTransferLimit(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const payload = await request.validateUsing(updateTransferLimitSchema);
            const user = await User.query().where({ id }).first();
            if (!user) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await user.merge(payload).save();
            return response.created({ success: true, message: 'Transfer limit updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update transfer limit Error');
        }
    }
    async toggleActiveStatus(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const user = await User.query().where({ id }).first();
            if (!user) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            user.status = !user.status;
            await user.save();
            if (user.status === false) {
                await notification_service.sendUserStatusUpdateNotification(user, 'deactivated', auth.user.id);
                await user.related('loginSessions').query().update({ active: false });
            }
            else {
                await notification_service.sendUserStatusUpdateNotification(user, 'activated', auth.user.id);
            }
            return response.created({
                success: true,
                message: 'User active status updated successfully',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update permission Error');
        }
    }
    async sendEmail(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const payload = await request.validateUsing(sendMailSchema);
            const user = await User.query().where({ id }).preload('customer').first();
            if (!user) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await mail.sendLater((message) => {
                message.to(user.email).subject(payload.subject).html(`<p>${payload.message}</p>`);
            });
            return response.created({ success: true, message: 'Email sent successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Sending email Error');
        }
    }
    async sendBulkEmail(ctx) {
        const { request, response } = ctx;
        try {
            const { ids } = request.only(['ids']);
            const payload = await request.validateUsing(sendMailSchema);
            const users = await User.query().where('id', 'in', ids).preload('customer');
            users.forEach(async (user) => {
                await mail.sendLater((message) => {
                    message.to(user.email).subject(payload.subject).html(`<p>${payload.message}</p>`);
                });
            });
            return response.created({ success: true, message: 'Emails sent successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Sending emails Error');
        }
    }
    async sendSupportEmail(ctx) {
        const { auth, request, response } = ctx;
        try {
            const payload = await request.validateUsing(sendMailSchema);
            const user = await User.query().where({ id: auth.user.id }).preload('customer').first();
            if (!user) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const mailData = {
                from: user.email,
                to: 'jakir@circlecodes.co',
                subject: payload.subject,
                html: `<p>${payload.message}</p>`,
            };
            if (payload.attachments) {
                const attachments = Array.isArray(payload.attachments)
                    ? payload.attachments
                    : [payload.attachments];
                mailData.attachments = attachments
                    .filter((attachment) => attachment.tmpPath)
                    .map((attachment) => {
                    const attachmentBuffer = fs.readFileSync(attachment.tmpPath);
                    return {
                        filename: attachment.clientName,
                        content: attachmentBuffer,
                    };
                });
            }
            await mail.sendLater((message) => {
                message.from(mailData.from).to(mailData.to).subject(mailData.subject).html(mailData.html);
                if (mailData.attachments) {
                    mailData.attachments.forEach((attachment) => {
                        message.attachData(attachment.content, {
                            filename: attachment.filename,
                        });
                    });
                }
            });
            return response.created({ success: true, message: 'Support Email sent successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Sending support email Error');
        }
    }
    async addBalanceToWallet(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { amount, currencyCode, userId, keepRecords } = await request.validateUsing(balanceEditSchema);
            const user = await User.query().where('id', userId).preload('customer').firstOrFail();
            await addBalance(amount, currencyCode, userId);
            if (keepRecords) {
                await Transaction.create({
                    type: 'deposit',
                    from: { label: 'System' },
                    to: { label: user.customer.name, email: user.email },
                    amount,
                    fee: 0,
                    total: amount,
                    metaData: { currency: currencyCode },
                    method: 'System',
                    status: 'completed',
                    userId: user.id,
                });
            }
            await notification_service.sendAddBalanceNotification(user, amount, currencyCode, auth.user.id);
            return response.json({ success: true, message: 'Balance added successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Add Balance to Wallet Error');
        }
    }
    async removeBalanceFromWallet(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { amount, currencyCode, userId, keepRecords } = await request.validateUsing(balanceEditSchema);
            const user = await User.query().where('id', userId).preload('customer').firstOrFail();
            await removeBalance(amount, currencyCode, userId);
            if (keepRecords) {
                await Transaction.create({
                    type: 'withdraw',
                    from: { label: user.customer.name, email: user.email },
                    to: { label: 'System' },
                    amount,
                    fee: 0,
                    total: amount,
                    metaData: { currency: currencyCode },
                    method: 'System',
                    status: 'completed',
                    userId: user.id,
                });
            }
            await notification_service.sendRemoveBalanceNotification(user, amount, currencyCode, auth.user.id);
            return response.json({ success: true, message: 'Balance added successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Add Balance to Wallet Error');
        }
    }
    async delete(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            if (auth.user.id === Number.parseInt(id)) {
                return response.badRequest({ success: false, message: 'Invalid id!' });
            }
            const user = await User.find(Number.parseInt(id));
            if (!user) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            await user.delete();
            await notification_service.sendUserDeleteNotification(user, auth.user.id);
            return response.ok({ success: true, message: 'User has deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Delete transaction Error');
        }
    }
}
//# sourceMappingURL=users_controller.js.map