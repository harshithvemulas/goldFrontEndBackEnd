import errorHandler from '#exceptions/error_handler';
import { updateSchema, updateAddressSchema, convertAccountSchema } from '#validators/customer';
import Customer from '#models/customer';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers';
import Address from '#models/address';
import User from '#models/user';
import { DateTime } from 'luxon';
import { Parser as Json2csvParser } from 'json2csv';
import Transaction from '#models/transaction';
export default class CustomersController {
    async index(ctx) {
        const { request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const data = await Customer.filter(input)
                .andWhereHas('user', (query) => {
                query.where('roleId', 2);
            })
                .preload('user', (query) => query.preload('wallets', (wQuery) => wQuery.where('default', true).preload('currency')))
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
            const dataQuery = Customer.filter(input)
                .andWhereHas('user', (query) => {
                query.where('roleId', 2);
            })
                .preload('user', (query) => query.preload('wallets', (wQuery) => wQuery.where('default', true).preload('currency')))
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
                {
                    label: 'Registered At',
                    value: (ele) => DateTime.fromISO(ele.user.createdAt).toFormat('yyyy-MM-dd HH:mm:ss'),
                },
                { label: 'Name', value: 'name' },
                { label: 'Email', value: 'user.email' },
                { label: 'Gender', value: 'gender' },
                {
                    label: 'DOB',
                    value: (ele) => DateTime.fromISO(ele.dob.toISOString()).toFormat('yyyy-MM-dd'),
                },
                { label: 'Phone Number', value: (ele) => ele.phone || 'N/A' },
                { label: 'Status', value: 'user.status' },
                { label: 'Kyc Status', value: 'user.kycStatus' },
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
    async getReferralUsers(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { search } = request.qs();
            const data = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('referralUsers', (query) => query
                .apply((scopes) => scopes.filtration({
                search,
            }))
                .andWhere('status', true)
                .preload('customer'))
                .first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const totalBonusForReferringOthers = await auth
                .user.related('transactions')
                .query()
                .where('type', 'referral_bonus')
                .andWhereRaw(`JSON_UNQUOTE(JSON_EXTRACT(meta_data, '$.referredUserId')) IS NOT NULL`)
                .sum('amount as totalBonus')
                .first();
            const referralUsersWithBonus = await Promise.all(data.referralUsers.map(async (item) => {
                const transactions = await Transaction.query()
                    .where('user_id', auth.user.id)
                    .andWhere('type', 'referral_bonus')
                    .andWhereRaw(`JSON_UNQUOTE(JSON_EXTRACT(meta_data, '$.referredUserId')) = ?`, [item.id])
                    .select('*');
                const totalBonus = transactions.reduce((sum, transaction) => {
                    return sum + transaction.amount;
                }, 0);
                return {
                    ...item.serialize({
                        fields: {
                            pick: ['id', 'email'],
                        },
                        relations: {
                            customer: {
                                fields: ['profileImage', 'name', 'phone', 'gender'],
                            },
                        },
                    }),
                    totalBonus,
                };
            }));
            const responseData = {
                referralUsers: referralUsersWithBonus,
                totalBonusForReferringOthers: totalBonusForReferringOthers?.$extras.totalBonus || 0,
            };
            return response.json(responseData);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get referral Users Error');
        }
    }
    async getReferralUser(ctx) {
        const { auth, response } = ctx;
        try {
            await auth.user.load('referralUser', (query) => {
                query.where('status', true).preload('customer');
            });
            let data = null;
            if (auth.user.referralUser) {
                data = auth.user.referralUser.serialize({
                    fields: {
                        pick: ['id', 'email'],
                    },
                    relations: {
                        customer: {
                            fields: ['profileImage', 'name', 'phone', 'gender'],
                        },
                    },
                });
            }
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get ReferrerdBy User Error');
        }
    }
    async getDetail(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await Customer.query()
                .where('userId', auth.user.id)
                .preload('user', (query) => {
                query.preload('referralUser', (rQuery) => {
                    rQuery.preload('customer');
                });
            })
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
            const data = await Customer.query()
                .where('id', id)
                .whereHas('user', (query) => query.where({ roleId: 2 }))
                .preload('user', (query) => {
                query
                    .preload('referralUser', (rQuery) => {
                    rQuery.preload('customer');
                })
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
    async update(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            let userId = id && auth.user.roleId === 1 ? id : auth.user.id;
            const payload = await request.validateUsing(updateSchema);
            const { profileImage, email, ...restPayload } = payload;
            if (auth.user.roleId === 1 && email) {
                const user = await User.findBy({ id: userId });
                if (!user) {
                    return response.notFound({ success: false, message: 'Invalid User Id' });
                }
                if (user.email !== email) {
                    const exist = await User.findBy({ email });
                    if (exist) {
                        return response.badRequest({ success: false, message: 'This email is already exist!' });
                    }
                    await user.merge({ email }).save();
                }
            }
            const customer = await Customer.findBy({
                userId,
            });
            if (!customer) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            customer.merge(restPayload);
            if (profileImage) {
                await profileImage.move(app.makePath('public/uploads'), {
                    name: `${cuid()}.${profileImage.extname}`,
                });
                customer.profileImage = profileImage.fileName;
            }
            await customer.save();
            return response.created({ success: true, message: 'Profile updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update Error');
        }
    }
    async updateAddress(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            let userId = id && auth.user.roleId === 1 ? id : auth.user.id;
            const payload = await request.validateUsing(updateAddressSchema);
            const customer = await Customer.findBy({
                userId,
            });
            if (!customer) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            await customer.load('address');
            if (!customer.address) {
                const address = await Address.create({ type: 'mailing', ...payload });
                customer.addressId = address.id;
                await customer.save();
                return response.created({ success: true, message: 'Address updated successfully' });
            }
            await customer.address.merge(payload).save();
            return response.created({ success: true, message: 'Address updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Update address Error');
        }
    }
    async convertAccount(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const payload = await request.validateUsing(convertAccountSchema);
            if ([1, 2].includes(payload.roleId)) {
                return response.badRequest({
                    success: false,
                    message: "Can't convert into the given role",
                });
            }
            const user = await User.query()
                .where({ id })
                .preload('customer', (query) => query.preload('address'))
                .preload('merchant')
                .preload('agent')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            if (user.roleId !== 2) {
                return response.badRequest({
                    success: false,
                    message: 'Only customers are allowed to be converted',
                });
            }
            if (payload.roleId === 3 && !payload.merchant) {
                return response.badRequest({ success: false, message: 'Must need to input merchant info' });
            }
            if (payload.roleId === 4 && !payload.agent) {
                return response.badRequest({ success: false, message: 'Must need to input agent info' });
            }
            if (payload.roleId === 3 && !user.merchant) {
                const merchantAddress = await Address.create({
                    type: 'mailing',
                    addressLine: payload.merchant?.addressLine,
                    zipCode: payload.merchant?.zipCode,
                    countryCode: payload.merchant?.countryCode,
                    city: payload.merchant?.city,
                });
                await user.related('merchant').create({
                    addressId: merchantAddress.id,
                    name: payload.merchant?.name,
                    email: payload.merchant?.email,
                    url: payload.merchant?.url || null,
                    status: 'verified',
                });
            }
            if (payload.roleId === 4 && !user.agent) {
                const agentAddress = await Address.create({
                    type: 'mailing',
                    addressLine: user.customer.address.addressLine,
                    zipCode: user.customer.address.zipCode,
                    countryCode: user.customer.address.countryCode,
                    city: user.customer.address.city,
                });
                await user.related('agent').create({
                    addressId: agentAddress.id,
                    name: payload.agent?.name,
                    email: payload.agent?.email ? payload.agent?.email : user.email,
                    occupation: payload.agent?.occupation,
                    whatsapp: payload.agent?.whatsapp,
                    status: 'verified',
                });
            }
            user.roleId = payload.roleId;
            await user.save();
            return response.created({ success: true, message: 'Account coverted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Convert Customer Error');
        }
    }
}
//# sourceMappingURL=customers_controller.js.map