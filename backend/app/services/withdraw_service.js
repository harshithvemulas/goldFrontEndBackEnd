import Transaction from '#models/transaction';
import { Encryption } from '@adonisjs/core/encryption';
import { addBalance } from './wallet_service.js';
import env from '#start/env';
import notification_service from './notification_service.js';
const encryption = new Encryption({
    secret: env.get('APP_KEY'),
});
export const validateWithdraw = async (success, trxSecret, isMtn = false) => {
    try {
        let decrypted;
        let transaction;
        if (isMtn) {
            decrypted = trxSecret;
            transaction = await Transaction.query()
                .where('trxId', decrypted)
                .andWhere('status', 'pending')
                .firstOrFail();
        }
        else {
            decrypted = encryption.decrypt(trxSecret);
            transaction = await Transaction.query()
                .where('trxId', decrypted)
                .andWhere('status', 'pending')
                .firstOrFail();
        }
        if (success) {
            transaction.status = 'completed';
            await transaction.save();
            await notification_service.sendWithdrawCompletedNotification(transaction);
            return true;
        }
        else {
            transaction.status = 'failed';
            await transaction.save();
            const metaData = JSON.parse(transaction.metaData);
            await addBalance(transaction.amount, metaData.currency, transaction.userId);
            await notification_service.sendWithdrawFailedNotification(transaction);
            throw new Error('Withdraw failed');
        }
    }
    catch (error) {
        console.error('Error in validating withdraw:', error);
    }
};
//# sourceMappingURL=withdraw_service.js.map