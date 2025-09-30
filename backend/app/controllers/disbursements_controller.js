import errorHandler from '#exceptions/error_handler';
import WithdrawMethod from '#models/withdraw_method';
import { Parser as Json2csvParser } from 'json2csv';
import { promises as fs } from 'node:fs';
import { parse } from 'csv-parse/sync';
import Currency from '#models/currency';
import User from '#models/user';
import Wallet from '#models/wallet';
import { removeBalance } from '#services/wallet_service';
import processWithdraw from '#services/process_withdraws';
import formatPrecision from '../utils/format_precision.js';
import db from '@adonisjs/lucid/services/db';
import { withdrawCalculation } from '#services/fees_calculation_service';
import notification_service from '#services/notification_service';
export default class DisbursementsController {
    async getDisbursementCsvByMethods(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const method = await WithdrawMethod.findBy({ active: true, id: id });
            if (!method) {
                return response.notFound({ success: false, message: 'Method not found' });
            }
            const params = JSON.parse(method.params);
            const fields = [params[0].name, 'amount', 'currencyCode'];
            const data = [
                {
                    [params[0]['name']]: '',
                    amount: '',
                    currencyCode: method.currencyCode,
                },
            ];
            const json2csvParser = new Json2csvParser({ fields });
            let csv = json2csvParser.parse(data);
            if (!csv) {
                return response.badRequest({
                    success: false,
                    message: 'Something went wrong while generating disbursement template',
                });
            }
            response.header('Content-Type', 'text/csv');
            response.header('Content-Disposition', 'attachment; filename="disbursement_template.csv"');
            response.send(csv);
        }
        catch (error) {
            errorHandler(error, ctx, 'DisbursementCsv get Error');
        }
    }
    async uploadDisbursementCsv(ctx) {
        const { request, response } = ctx;
        try {
            const csvFile = request.file('file', {
                extnames: ['csv'],
            });
            if (!csvFile) {
                return response.badRequest('Please upload a CSV file');
            }
            const filePath = csvFile.tmpPath;
            if (!filePath) {
                return response.badRequest('Uploaded file is empty or could not be read');
            }
            const fileContent = await fs.readFile(filePath, 'utf8');
            const records = parse(fileContent, { columns: true, skip_empty_lines: true });
            response.ok({ success: true, data: records });
        }
        catch (error) {
            errorHandler(error, ctx, 'DisbursementCsv upload Error');
        }
    }
    async processDisbursement(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { records } = request.only(['records']);
            const result = {
                success: [],
                failed: [],
            };
            const user = await User.query()
                .where('id', auth.user.id)
                .preload('customer')
                .preload('merchant')
                .preload('permission')
                .preload('kyc')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            if (!user.permission.withdraw) {
                return response.badRequest({
                    success: false,
                    message: 'You are not allowed to withdraw money',
                });
            }
            await Promise.all(records.map(async (record) => {
                try {
                    record.amount = formatPrecision(record.amount);
                    const data = await this.createWithdraw(record, user);
                    if (data && data.success) {
                        result.success.push({
                            record: {
                                ...record,
                                amount: data?.data?.amount,
                                fee: data?.data?.fee,
                                total: data?.data?.total,
                            },
                            message: data.message,
                        });
                    }
                }
                catch (err) {
                    result.failed.push({
                        record: {
                            ...record,
                            fee: 0,
                            total: 0,
                        },
                        message: err.message,
                    });
                }
            }));
            response.json({
                ...result,
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'process Disbursement Error');
        }
    }
    async createWithdraw(record, user) {
        const { method, amount, currencyCode, country, number, extWallet } = record;
        const withdrawMethod = await WithdrawMethod.findBy({
            active: true,
            value: method,
            currencyCode: currencyCode.toLocaleUpperCase(),
        });
        if (!withdrawMethod) {
            throw new Error('This method is not valid or inactive');
        }
        const params = JSON.parse(withdrawMethod.params);
        if (params?.name === 'number' && !number && params?.required) {
            throw new Error('number is required');
        }
        if (params?.name === 'extWallet' && !extWallet && params?.required) {
            throw new Error('extWallet is required');
        }
        const calculationData = await withdrawCalculation(amount, user, withdrawMethod);
        if (!calculationData) {
            throw new Error('Something went wrong. Please contact with support');
        }
        const { fee, chargedAmount, recievedAmount } = calculationData;
        if (withdrawMethod.minAmount > recievedAmount) {
            throw new Error(`Minimum withdrawal is ${withdrawMethod.minAmount} ${withdrawMethod.currencyCode}`);
        }
        if (withdrawMethod.maxAmount < recievedAmount) {
            throw new Error(`Maximum withdrawal is ${withdrawMethod.minAmount} ${withdrawMethod.currencyCode}`);
        }
        const currency = await Currency.findBy('code', currencyCode.toUpperCase());
        if (!currency) {
            throw new Error('Currency code invalid or data not found');
        }
        if (country && country === '*') {
            throw new Error('Invalid Country Code');
        }
        if (recievedAmount > currency.maxAmount) {
            throw new Error(`Amount not allowed (Max:) ${currency?.maxAmount}`);
        }
        if (recievedAmount < currency.minAmount) {
            throw new Error(`Amount not allowed (Min:) ${currency?.minAmount}`);
        }
        if (!user.kycStatus) {
            if (currency.kycLimit !== null && recievedAmount > currency.kycLimit) {
                throw new Error(`You are not allowed to withdraw more than ${currency.kycLimit} ${currency.code}`);
            }
        }
        const wallet = await Wallet.findBy({ userId: user.id, currencyId: currency.id });
        if (!wallet || wallet.balance < chargedAmount) {
            throw new Error('Insufficient balance');
        }
        const transactionData = await db.transaction(async (trx) => {
            const withdraw = await user.related('transactions').create({
                type: 'withdraw',
                from: { label: user.customer.name, email: user.email },
                to: { label: withdrawMethod.name },
                amount: chargedAmount,
                fee: fee,
                total: recievedAmount,
                metaData: { country, currency: currencyCode, partyId: number, extWallet },
                method: withdrawMethod.value,
                status: 'pending',
            }, { client: trx });
            const returnObj = await processWithdraw(withdraw);
            await removeBalance(chargedAmount, currencyCode, user.id);
            if (currency.notificationLimit !== null && recievedAmount >= currency.notificationLimit) {
                await notification_service.sendTransactionWarningNotification(withdraw.id);
            }
            return returnObj;
        });
        return transactionData;
    }
}
//# sourceMappingURL=disbursements_controller.js.map