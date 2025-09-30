import errorHandler from '#exceptions/error_handler';
import Transaction from '#models/transaction';
import exportService from '#services/export_service';
import { DateTime } from 'luxon';
import User from '#models/user';
import ReceiptPDFGenerator from '#services/pdf_service';
export default class TransactionsController {
    async index(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { page, limit, ...input } = request.qs();
            const dataQuery = auth
                .user.related('transactions')
                .query()
                .apply((scopes) => scopes.filtration(input))
                .preload('user')
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminIndex(ctx) {
        const { request, response } = ctx;
        try {
            const userId = request.param('id');
            const { page, limit, ...input } = request.qs();
            const dataQuery = Transaction.filter(input)
                .where({ userId })
                .preload('user')
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async adminIndexByRole(ctx) {
        const { request, response } = ctx;
        try {
            const roleId = request.param('roleId');
            const { page, limit, ...input } = request.qs();
            const dataQuery = Transaction.filter(input)
                .if(roleId && [1, 2, 3, 4].includes(Number.parseInt(roleId)), (query) => query.whereHas('user', (uQuery) => uQuery.where('roleId', roleId)))
                .preload('user')
                .orderBy('id', 'desc');
            const data = page && limit ? await dataQuery.paginate(page, limit) : await dataQuery.exec();
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async exportCsv(ctx) {
        await exportService.exportData(ctx, 'transactions');
    }
    async downloadReceipt(ctx) {
        const { auth, request, response } = ctx;
        try {
            const trxId = request.param('trxId');
            const user = await User.query().where('id', auth.user.id).preload('customer').first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found.' });
            }
            const transaction = await Transaction.findBy({ trxId, userId: user.id });
            if (!transaction) {
                return response.badRequest({ success: false, message: 'Invalid transaction id' });
            }
            const pdfGenerator = new ReceiptPDFGenerator(transaction.id, user);
            const generatedPdf = await pdfGenerator.generatePDF();
            if (generatedPdf) {
                response.header('Content-Type', 'application/pdf');
                response.header('Content-Disposition', `attachment; filename="receipt_${trxId}.pdf"`);
                return response.send(generatedPdf);
            }
            return response.notFound({ success: false, message: 'Receipt not found' });
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async totalCount(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const userId = auth.user.roleId === 1 ? id : auth.user.id;
            if (!userId) {
                return response.badRequest({
                    success: false,
                    message: 'Invalid user id or user id not provided',
                });
            }
            const { type, date, status } = request.qs();
            const data = await Transaction.filter({ type, date, status }).where({
                userId,
                status: 'completed',
            });
            const counts = {
                deposit: 0,
                withdraw: 0,
                transfer: 0,
                exchange: 0,
                payment: 0,
                services: 0,
                payment_request: 0,
                deposit_request: 0,
                withdraw_request: 0,
            };
            data.forEach((transaction) => {
                if (transaction.type === 'deposit') {
                    counts.deposit++;
                }
                else if (transaction.type === 'withdraw') {
                    counts.withdraw++;
                }
                else if (transaction.type === 'transfer') {
                    counts.transfer++;
                }
                else if (transaction.type === 'exchange') {
                    counts.exchange++;
                }
                else if (transaction.type === 'payment') {
                    counts.payment++;
                }
                else if (transaction.type === 'services') {
                    counts.services++;
                }
                else if (transaction.type === 'payment_request') {
                    counts.payment_request++;
                }
                else if (transaction.type === 'deposit_request' ||
                    transaction.type === 'direct_deposit') {
                    counts.deposit_request++;
                }
                else if (transaction.type === 'withdraw_request') {
                    counts.withdraw_request++;
                }
            });
            return response.json(counts);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async totalAmountChart(ctx) {
        const { auth, request, response } = ctx;
        try {
            const id = request.param('id');
            const userId = auth.user.roleId === 1 ? id : auth.user.id;
            if (!userId) {
                return response.badRequest({
                    success: false,
                    message: 'Invalid user id or user id not provided',
                });
            }
            const { type, currency } = request.qs();
            const user = await User.query()
                .where('id', userId)
                .preload('customer')
                .preload('merchant')
                .first();
            if (!user) {
                return response.notFound({ success: false, message: 'User data not found' });
            }
            const currentYear = DateTime.now().year;
            const transactions = await Transaction.filter({ type, currency })
                .where({ userId: user.id, status: 'completed' })
                .if(type === 'payment' && user.roleId === 3, (query) => query.whereJson('to', { email: user.merchant.email }))
                .whereRaw('YEAR(created_at) = ?', [currentYear])
                .orderBy('created_at', 'asc');
            const monthlyTotals = transactions.reduce((acc, transaction) => {
                const createdAt = transaction.createdAt.toFormat('yyyy-MM-dd');
                const transactionDate = DateTime.fromISO(createdAt);
                const month = transactionDate.month;
                if (!acc[month]) {
                    acc[month] = 0;
                }
                acc[month] += transaction.total;
                return acc;
            }, {});
            const result = Array.from({ length: 12 }, (_, index) => {
                const month = index + 1;
                return {
                    month,
                    total: monthlyTotals[month] || 0,
                };
            });
            return response.ok({ success: true, data: result });
        }
        catch (error) {
            errorHandler(error, ctx, 'Total Amount Count Error');
        }
    }
    async adminDashboardChart(ctx) {
        const { request, response } = ctx;
        try {
            const { type: transactionTypes, currency, days = 7 } = request.qs();
            if (!currency) {
                return response.badRequest({ success: false, message: 'Currency param is required' });
            }
            const typesArray = Array.isArray(transactionTypes)
                ? transactionTypes
                : transactionTypes
                    ? [transactionTypes]
                    : [];
            if (!(typesArray.length > 0)) {
                return response.badRequest({ success: false, message: 'Type param is required' });
            }
            const now = DateTime.now();
            const daysAgo = now.minus({ days }).startOf('day');
            const transactions = await Transaction.filter({
                type: typesArray,
                currency,
                status: 'completed',
            })
                .whereBetween('created_at', [daysAgo.toISO(), now.toISO()])
                .orderBy('created_at', 'asc');
            const result = {};
            for (let i = 0; i < Number.parseInt(days); i++) {
                const day = now.minus({ days: i }).toFormat('yyyy-MM-dd');
                result[day] = typesArray.reduce((acc, type) => {
                    acc[type] = 0;
                    return acc;
                }, {});
            }
            transactions.forEach((transaction) => {
                const day = transaction.createdAt.toFormat('yyyy-MM-dd');
                if (result[day] && typesArray.includes(transaction.type)) {
                    result[day][transaction.type] += transaction.total;
                }
            });
            return response.ok({ success: true, data: result });
        }
        catch (error) {
            errorHandler(error, ctx, 'Total Amount Count Error');
        }
    }
    async getById(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.query().where({ id }).preload('user').first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Detail Error');
        }
    }
    async getByTrxId(ctx) {
        const { auth, request, response } = ctx;
        try {
            const trxId = request.param('trxId');
            const data = await Transaction.query()
                .where({ trxId })
                .if(auth.user.roleId !== 1, (query) => {
                query.where({ userId: auth.user.id });
            })
                .preload('user')
                .first();
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get By TrxId Error');
        }
    }
    async toggleBookmark(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.find(Number.parseInt(id));
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            data.isBookmarked = !data.isBookmarked;
            await data.save();
            return response.ok({ success: true, message: 'Bookmark status updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Toggle Bookmark Error');
        }
    }
    async delete(ctx) {
        const { request, response } = ctx;
        try {
            const id = request.param('id');
            const data = await Transaction.find(Number.parseInt(id));
            if (!data) {
                return response.notFound({ success: false, message: 'Data not found' });
            }
            data.isBookmarked = !data.isBookmarked;
            await data.save();
            return response.ok({ success: true, message: 'Transaction has deleted successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Delete transaction Error');
        }
    }
}
//# sourceMappingURL=transactions_controller.js.map