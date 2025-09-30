import Transaction from '#models/transaction';
import { DateTime } from 'luxon';
import errorHandler from '#exceptions/error_handler';
import { Parser as Json2csvParser } from 'json2csv';
import User from '#models/user';
class ExportService {
    async getTransactionsData(fromDate, toDate, userId, type, toEmail) {
        const trxQuery = Transaction.query().preload('user').orderBy('id', 'desc');
        if (userId) {
            trxQuery.where({ userId });
        }
        if (fromDate) {
            trxQuery.where('createdAt', '>=', fromDate);
        }
        if (toDate) {
            trxQuery.where('createdAt', '<=', toDate);
        }
        if (type && type.length > 0) {
            trxQuery.andWhere('type', 'in', type);
        }
        if (toEmail) {
            trxQuery.andWhereJson('to', { email: toEmail });
        }
        const transactions = await trxQuery.exec();
        return transactions.map((trx) => {
            const trxJson = trx.toJSON();
            const fromData = JSON.parse(trxJson.from || '{}');
            const toData = JSON.parse(trxJson.to || '{}');
            const metaData = JSON.parse(trxJson.metaData || '{}');
            return {
                trxId: trxJson.trxId,
                description: trxJson.type,
                status: trxJson.status,
                method: trxJson.method ?? 'N/A',
                createdAt: DateTime.fromISO(trxJson.createdAt).toFormat('yyyy-MM-dd'),
                from: fromData?.label ?? 'N/A',
                to: toData?.label ?? 'N/A',
                amount: trxJson.amount,
                fee: trxJson.fee,
                total: trxJson.total,
                currency: metaData?.currency ?? 'N/A',
                phone: metaData?.number ?? 'N/A',
                trxAction: metaData?.trxAction ?? 'N/A',
                feeByCustomer: metaData?.feeByCustomer ?? 'N/A',
                address: metaData?.address ?? 'N/A',
            };
        });
    }
    generateCSV(data, fields, response, filename) {
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(data);
        response.header('Content-Type', 'text/csv');
        response.header('Content-Disposition', `attachment; filename=${filename}.csv`);
        return response.send(csv);
    }
    formatData(fromDate, toDate) {
        const fromDateFormatted = fromDate ? DateTime.fromISO(fromDate).toISODate() : null;
        const toDateFormatted = toDate ? DateTime.fromISO(toDate).toISODate() : null;
        if (!fromDateFormatted || !toDateFormatted) {
            throw new Error('Invalid date format');
        }
        return { fromDateFormatted, toDateFormatted };
    }
    async exportData(ctx, type) {
        const { auth, request, response } = ctx;
        try {
            const { fromDate, toDate } = request.qs();
            const id = request.param('id');
            const userId = auth.user.roleId === 1 ? id : auth.user.id;
            const user = userId
                ? await User.query().where('id', userId).preload('customer').preload('merchant').first()
                : undefined;
            const { fromDateFormatted, toDateFormatted } = this.formatData(fromDate, toDate);
            let email;
            if (type === 'payment') {
                email = user ? user.merchant.email : undefined;
            }
            const transactions = await this.getTransactionsData(fromDateFormatted, toDateFormatted, user ? user.id : undefined, this.getFilterNameFromType(type), email);
            const fields = this.getFieldsForType(type);
            const filename = this.getFilenameForType(type);
            return this.generateCSV(transactions, fields, response, filename);
        }
        catch (error) {
            errorHandler(error, ctx, `${type}`);
        }
    }
    getFieldsForType(type) {
        switch (type) {
            case 'transactions':
                return [
                    { label: 'Date', value: 'createdAt' },
                    { label: 'Description', value: 'description' },
                    { label: 'From', value: 'from' },
                    { label: 'To', value: 'to' },
                    { label: 'Amount', value: 'amount' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Fee', value: 'fee' },
                    { label: 'After Processing', value: 'total' },
                    { label: 'Status', value: 'status' },
                    { label: 'Trx ID', value: 'trxId' },
                    { label: 'Method', value: 'method' },
                ];
            case 'payment':
                return [
                    { label: 'Date', value: 'createdAt' },
                    { label: 'Description', value: 'description' },
                    { label: 'From', value: 'from' },
                    { label: 'Amount', value: 'amount' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Fee', value: 'fee' },
                    { label: 'After Processing', value: 'total' },
                    { label: 'Status', value: 'status' },
                    { label: 'Trx ID', value: 'trxId' },
                ];
            case 'deposit_request':
            case 'withdraw_request':
                return [
                    { label: 'Date', value: 'createdAt' },
                    { label: 'Description', value: 'description' },
                    { label: 'To', value: 'to' },
                    { label: 'Amount', value: 'amount' },
                    { label: 'Fee', value: 'fee' },
                    { label: 'After Processing', value: 'total' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Status', value: 'status' },
                    { label: 'Trx ID', value: 'trxId' },
                ];
            case 'admin_payment':
                return [
                    { label: 'Trx ID', value: 'trxId' },
                    { label: 'Date', value: 'createdAt' },
                    { label: 'Description', value: 'description' },
                    { label: 'Status', value: 'status' },
                    { label: 'Amount', value: 'amount' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Fee', value: 'fee' },
                    { label: 'After Processing', value: 'total' },
                    { label: 'User', value: 'from' },
                    { label: 'Merchant', value: 'to' },
                ];
            case 'admin_exchange':
                return [
                    { label: 'Trx ID', value: 'trxId' },
                    { label: 'Date', value: 'createdAt' },
                    { label: 'Description', value: 'description' },
                    { label: 'Status', value: 'status' },
                    { label: 'Amount', value: 'amount' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Fee', value: 'fee' },
                    { label: 'After Processing', value: 'total' },
                    { label: 'User', value: 'from' },
                ];
            case 'admin_withdraw':
            case 'admin_deposit':
                return [
                    { label: 'Trx ID', value: 'trxId' },
                    { label: 'Date', value: 'createdAt' },
                    { label: 'Description', value: 'description' },
                    { label: 'Status', value: 'status' },
                    { label: 'Amount', value: 'amount' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Fee', value: 'fee' },
                    { label: 'After Processing', value: 'total' },
                    { label: 'Method', value: 'method' },
                    { label: 'Number', value: 'phone' },
                    { label: 'User', value: 'from' },
                ];
            case 'admin_transfer':
                return [
                    { label: 'Trx ID', value: 'trxId' },
                    { label: 'Date', value: 'createdAt' },
                    { label: 'Description', value: 'description' },
                    { label: 'type', value: 'trxAction' },
                    { label: 'Status', value: 'status' },
                    { label: 'Amount', value: 'amount' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Fee', value: 'fee' },
                    { label: 'After Processing', value: 'total' },
                    { label: 'Sent by', value: 'from' },
                    { label: 'Received by', value: 'to' },
                ];
            case 'payment_request':
                return [
                    { label: 'Date', value: 'createdAt' },
                    { label: 'Description', value: 'description' },
                    { label: 'From', value: 'from' },
                    { label: 'To', value: 'to' },
                    { label: 'Amount', value: 'amount' },
                    { label: 'Currency', value: 'currency' },
                    { label: 'Fee', value: 'fee' },
                    { label: 'After Processing', value: 'total' },
                    { label: 'Status', value: 'status' },
                    { label: 'Trx ID', value: 'trxId' },
                    { label: 'Fee By Customer', value: 'feeByCustomer' },
                    { label: 'Address', value: 'address' },
                ];
            default:
                throw new Error(`Unsupported type: ${type}`);
        }
    }
    getFilenameForType(type) {
        switch (type) {
            case 'transactions':
                return 'transactions';
            case 'payment':
            case 'admin_payment':
                return 'payments';
            case 'admin_exchange':
                return 'exchanges';
            case 'admin_withdraw':
                return 'withdraws';
            case 'admin_deposit':
                return 'deposits';
            case 'admin_transfer':
                return 'transfers';
            case 'deposit_request':
                return 'deposit_requests';
            case 'withdraw_request':
                return 'withdraw_requests';
            case 'payment_request':
                return 'payment_requests';
            default:
                throw new Error(`Unsupported type: ${type}`);
        }
    }
    getFilterNameFromType(type) {
        switch (type) {
            case 'payment':
            case 'admin_payment':
                return ['payment'];
            case 'admin_exchange':
                return ['exchange'];
            case 'admin_withdraw':
                return ['withdraw'];
            case 'admin_deposit':
                return ['deposit'];
            case 'admin_transfer':
                return ['transfer'];
            case 'deposit_request':
                return ['deposit_request', 'direct_deposit'];
            case 'withdraw_request':
                return ['withdraw_request'];
            case 'payment_request':
                return ['payment_request'];
            default:
                return undefined;
        }
    }
}
const exportService = new ExportService();
export default exportService;
//# sourceMappingURL=export_service.js.map