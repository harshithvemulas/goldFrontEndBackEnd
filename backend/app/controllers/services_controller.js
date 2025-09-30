import errorHandler from '#exceptions/error_handler';
import Transaction from '#models/transaction';
import reloadly from '#services/reloadly_service';
import formatPrecision from '../utils/format_precision.js';
import Currency from '#models/currency';
import exchangeCalculations, { fxRateCalculation } from '#services/exchange_calculations';
import User from '#models/user';
import { removeBalance } from '#services/wallet_service';
import { saveElectricitySchema, savePhoneSchema, topUpSchema, uitilitySchema, } from '#validators/service';
import Setting from '#models/setting';
import brandingService from '#services/branding_service';
export default class ServicesController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit } = request.qs();
            const data = await auth
                .user.related('transactions')
                .query()
                .where('type', 'services')
                .preload('user')
                .paginate(page, limit);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async indexSavedPhone(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await auth.user.related('saves').query().where('type', 'phone');
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index wallet Error');
        }
    }
    async indexSavedElectricity(ctx) {
        const { auth, response } = ctx;
        try {
            const data = await auth.user.related('saves').query().where('type', 'electricity');
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Index wallet Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query()
                .where({ id, type: 'services' })
                .preload('user')
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
    async getTopUpPreview(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { number, amount, countryCode, currencyCode } = await request.validateUsing(topUpSchema);
            const topUpSetting = await Setting.findBy({ key: 'topup', value1: 'on' });
            let regularFeePercentage = topUpSetting ? formatPrecision(topUpSetting.value2 ?? 0) : 0;
            const fee = amount * (regularFeePercentage / 100);
            const sendingAmount = formatPrecision(amount - fee);
            const branding = await brandingService();
            const currencyFromData = await Currency.findBy('code', currencyCode.toUpperCase());
            const currencyToData = await Currency.findBy('code', branding.defaultCurrency);
            if (!currencyFromData || !currencyToData) {
                return response.badRequest({ success: false, message: 'Currency could not fetched' });
            }
            const calculationsData = await exchangeCalculations(currencyCode, branding.defaultCurrency, sendingAmount, auth.user.id);
            if (!calculationsData) {
                return response.badRequest({ success: false, message: 'Calculation failed' });
            }
            const wallet = await auth.user
                ?.related('wallets')
                .query()
                .where('currencyId', currencyFromData.id)
                .first();
            if (!wallet) {
                return response.notFound({ success: false, message: 'Wallet not found' });
            }
            if (wallet.balance < amount) {
                return response.badRequest({ success: false, message: 'Balance insufficiant' });
            }
            const data = await reloadly.topUpPreview(number, calculationsData.amountTo, fee, countryCode, currencyCode, calculationsData.exchangeRate);
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const finalData = {
                receiver: { ...data },
                sender: { sendingAmount: amount, fee, receivingAmount: sendingAmount, currencyCode },
            };
            return response.json({
                success: true,
                message: 'Preview processed successfully',
                data: finalData,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Getting Top Up Preview Error');
        }
    }
    async createTopUp(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { number, amount, countryCode, currencyCode } = await request.validateUsing(topUpSchema);
            const topUpSetting = await Setting.findBy({ key: 'topup', value1: 'on' });
            if (!topUpSetting) {
                return response.badRequest({
                    success: false,
                    message: 'This service is not available right now',
                });
            }
            let regularFeePercentage = topUpSetting ? formatPrecision(topUpSetting.value2 ?? 0) : 0;
            const fee = amount * (regularFeePercentage / 100);
            const sendingAmount = formatPrecision(amount - fee);
            const branding = await brandingService();
            const currencyFromData = await Currency.findBy('code', currencyCode.toUpperCase());
            const currencyToData = await Currency.findBy('code', branding.defaultCurrency);
            if (!currencyFromData || !currencyToData) {
                return response.badRequest({ success: false, message: 'Currency could not fetched' });
            }
            const calculationsData = await exchangeCalculations(currencyCode, branding.defaultCurrency, sendingAmount, auth.user.id);
            if (!calculationsData) {
                return response.badRequest({ success: false, message: 'Calculation failed' });
            }
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            if (!user.permission.services) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to topup',
                });
            }
            if (!user.kycStatus) {
                if (currencyFromData.kycLimit !== null && amount > currencyFromData.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to topup more than ${currencyFromData.kycLimit} ${currencyFromData.code}`,
                    });
                }
            }
            const wallet = await auth.user
                ?.related('wallets')
                .query()
                .where('currencyId', currencyFromData.id)
                .first();
            if (!wallet) {
                return response.notFound({ success: false, message: 'Wallet not found' });
            }
            if (wallet.balance < amount) {
                return response.badRequest({ success: false, message: 'Balance insufficiant' });
            }
            const data = await reloadly.createTopUp(number, calculationsData.amountTo, fee, countryCode, currencyCode, calculationsData.exchangeRate);
            if (!data) {
                return response.badRequest({ success: false, message: 'Top up failed' });
            }
            const topUpServices = await user.related('transactions').create({
                type: 'services',
                from: {
                    label: user.customer.name ?? '',
                    image: user.customer.profileImage ?? '',
                    email: user.email,
                    currency: currencyCode,
                },
                to: { label: number, currency: data.deliveredAmountCurrencyCode },
                amount,
                fee,
                total: sendingAmount,
                status: 'completed',
                metaData: {
                    transactionId: data.transactionId,
                    status: data.status,
                    type: 'topup',
                    countryCode: data.countryCode,
                    currency: data.deliveredAmountCurrencyCode,
                    operatorId: data.operatorId,
                    operatorName: data.operatorName,
                    deliveredAmount: data.deliveredAmount,
                    deliveredAmountCurrencyCode: data.deliveredAmountCurrencyCode,
                },
            });
            await removeBalance(amount, currencyCode, user.id);
            return response.created({
                success: true,
                message: 'Top up created successfully',
                data: topUpServices,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Creating Top Up Error');
        }
    }
    async previewUtilityBill(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { meterNumber, amount, currencyCode, billerId } = await request.validateUsing(uitilitySchema);
            const electricitySetting = await Setting.findBy({ key: 'electricity_bill', value1: 'on' });
            let regularFeePercentage = electricitySetting
                ? formatPrecision(electricitySetting.value2 ?? 0)
                : 0;
            const fee = amount * (regularFeePercentage / 100);
            const sendingAmount = formatPrecision(amount + fee);
            const branding = await brandingService();
            const currencyFromData = await Currency.findBy('code', currencyCode.toUpperCase());
            const currencyToData = await Currency.findBy('code', branding.defaultCurrency);
            if (!currencyFromData || !currencyToData) {
                return response.badRequest({ success: false, message: 'Currency could not fetched' });
            }
            const calculationsData = await fxRateCalculation(currencyCode, branding.defaultCurrency, amount);
            if (!calculationsData) {
                return response.badRequest({ success: false, message: 'Calculation failed' });
            }
            const wallet = await auth.user
                ?.related('wallets')
                .query()
                .where('currencyId', currencyFromData.id)
                .first();
            if (!wallet) {
                return response.notFound({ success: false, message: 'Wallet not found' });
            }
            if (wallet.balance < sendingAmount) {
                return response.badRequest({ success: false, message: 'Balance insufficient' });
            }
            const data = await reloadly.previewUtilityBill(meterNumber, formatPrecision(calculationsData), currencyCode, billerId);
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            const finalData = {
                receiver: { ...data },
                sender: { sendingAmount, fee, receivingAmount: amount, currencyCode },
            };
            return response.json({
                success: true,
                message: 'Preview processed successfully',
                data: finalData,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Creating Utility Bill Error');
        }
    }
    async createUtilityBill(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { meterNumber, amount, currencyCode, billerId } = await request.validateUsing(uitilitySchema);
            const electricitySetting = await Setting.findBy({ key: 'electricity_bill', value1: 'on' });
            if (!electricitySetting) {
                return response.badRequest({
                    success: false,
                    message: 'This service is not available right now',
                });
            }
            let regularFeePercentage = electricitySetting
                ? formatPrecision(electricitySetting.value2 ?? 0)
                : 0;
            const fee = amount * (regularFeePercentage / 100);
            const sendingAmount = formatPrecision(amount + fee);
            const branding = await brandingService();
            const currencyFromData = await Currency.findBy('code', currencyCode.toUpperCase());
            const currencyToData = await Currency.findBy('code', branding.defaultCurrency);
            if (!currencyFromData || !currencyToData) {
                return response.badRequest({ success: false, message: 'Currency could not fetched' });
            }
            const calculationsData = await fxRateCalculation(currencyCode, branding.defaultCurrency, amount);
            if (!calculationsData) {
                return response.badRequest({ success: false, message: 'Calculation failed' });
            }
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('permission')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            if (!user.permission.services) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to pay electricity bill',
                });
            }
            if (!user.kycStatus) {
                if (currencyFromData.kycLimit !== null && amount > currencyFromData.kycLimit) {
                    return response.badRequest({
                        success: false,
                        message: `You are not allowed to pay electricity bill more than ${currencyFromData.kycLimit} ${currencyFromData.code}`,
                    });
                }
            }
            const wallet = await auth.user
                ?.related('wallets')
                .query()
                .where('currencyId', currencyFromData.id)
                .first();
            if (!wallet) {
                return response.notFound({ success: false, message: 'Wallet not found' });
            }
            if (wallet.balance < amount) {
                return response.badRequest({ success: false, message: 'Balance insufficiant' });
            }
            const data = await reloadly.createUtilityBill(meterNumber, formatPrecision(calculationsData), currencyCode, billerId);
            if (!data) {
                return response.badRequest({ success: false, message: 'Utility bill payment failed' });
            }
            let verifiedData = null;
            if (data.status === 'PROCESSING') {
                verifiedData = await reloadly.verifyUtilityBill(data.id);
                if (verifiedData.length < 1 || !verifiedData.transaction) {
                    return response.badRequest({
                        success: false,
                        message: 'Utility bill proccessed but not yet successful.',
                    });
                }
            }
            const utilityServices = await user.related('transactions').create({
                type: 'services',
                from: {
                    label: user.customer.name ?? '',
                    image: user.customer.profileImage ?? '',
                    email: user.email,
                    currency: currencyCode,
                },
                to: {
                    label: meterNumber,
                    currency: verifiedData[0].transaction.deliveryAmountCurrencyCode,
                },
                amount: sendingAmount,
                fee,
                total: amount,
                status: 'completed',
                metaData: {
                    currencyFrom: currencyCode,
                    transactionId: verifiedData[0].transaction.id,
                    status: verifiedData[0].transaction.status,
                    type: 'electricity',
                    serviceType: verifiedData[0].billDetails.serviceType,
                    countryCode: verifiedData[0].billDetails.billerCountryCode,
                    billerId: verifiedData[0].billDetails.billerId,
                    billerName: verifiedData[0].billerName.billerName,
                    deliveredAmount: verifiedData[0].transaction.deliveryAmount,
                    currencyTo: verifiedData[0].transaction.deliveryAmountCurrencyCode,
                },
            });
            await removeBalance(sendingAmount, currencyCode, user.id);
            return response.created({
                success: true,
                message: 'Utility bill paid successfully',
                data: utilityServices,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Creating Utility Bill Error');
        }
    }
    async getBillers(ctx) {
        const { response } = ctx;
        try {
            const data = await reloadly.getBillers();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Getting Billers Error');
        }
    }
    async saveNumber(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { number, name } = await request.validateUsing(savePhoneSchema);
            const alreadyExist = await auth
                .user.related('saves')
                .query()
                .where({ type: 'phone', value: number })
                .first();
            if (alreadyExist) {
                return response.notFound({
                    success: false,
                    message: 'This number is already exist in the saved list',
                });
            }
            await auth.user.related('saves').create({
                type: 'phone',
                info: {
                    label: name ?? '',
                },
                value: number,
            });
            return response.json({ success: true, message: 'Number saved successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Save number Error');
        }
    }
    async saveElectricity(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { meterNumber, billerId } = await request.validateUsing(saveElectricitySchema);
            const accessToken = await reloadly.getAccessToken('https://utilities.reloadly.com');
            const biller = await reloadly.getBillersById(billerId, accessToken);
            if (!biller) {
                return response.badRequest({ success: false, message: 'Invalid biller Id' });
            }
            const alreadyExist = await auth
                .user.related('saves')
                .query()
                .where({ type: 'electricity', value: meterNumber })
                .first();
            if (alreadyExist) {
                return response.notFound({
                    success: false,
                    message: 'This meter number is already exist in the saved list',
                });
            }
            await auth.user.related('saves').create({
                type: 'electricity',
                info: {
                    label: biller.name ?? '',
                    type: biller.serviceType ?? '',
                },
                value: meterNumber,
                metaData: { billerId: billerId },
            });
            return response.json({ success: true, message: 'Meter number saved successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Save meter number Error');
        }
    }
}
//# sourceMappingURL=services_controller.js.map