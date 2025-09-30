import Transaction from '#models/transaction';
import { DateTime } from 'luxon';
export const totalTransferedAmount = async (currencyCode, userId) => {
    try {
        const today = DateTime.now().startOf('day');
        const tomorrow = today.plus({ days: 1 });
        const transfers = await Transaction.query()
            .where({ type: 'transfer', userId })
            .whereJson('metaData', { currency: currencyCode.toLocaleUpperCase(), trxAction: 'send' })
            .where('createdAt', '>=', today.toJSDate())
            .where('createdAt', '<', tomorrow.toJSDate());
        const totalAmount = transfers.reduce((acc, transfer) => {
            return acc + transfer.amount;
        }, 0);
        return totalAmount;
    }
    catch (error) {
        console.error('Error counting total:', error);
        return 0;
    }
};
export const totalTransactions = async (userId) => {
    try {
        const today = DateTime.now().startOf('day');
        const tomorrow = today.plus({ days: 1 });
        const transfers = await Transaction.query()
            .where({ type: 'transfer', userId })
            .whereJson('metaData', { trxAction: 'send' })
            .where('createdAt', '>=', today.toJSDate())
            .where('createdAt', '<', tomorrow.toJSDate())
            .count('* as total');
        return transfers[0].total;
    }
    catch (error) {
        console.error('Error counting transaction:', error);
        return 0;
    }
};
//# sourceMappingURL=transfer_service.js.map