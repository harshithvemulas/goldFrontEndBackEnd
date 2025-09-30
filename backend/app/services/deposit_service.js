import Transaction from '#models/transaction';
import { Encryption } from '@adonisjs/core/encryption';
import { addBalance } from './wallet_service.js';
import env from '#start/env';
import notification_service from './notification_service.js';
import webhookService from './webhook_service.js';
const encryption = new Encryption({
    secret: env.get('APP_KEY'),
});
export const validateDeposit = async (success, trxSecret, isMtn = false) => {
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
            const metaData = JSON.parse(transaction.metaData);
            if (transaction?.metaDataParsed?.apiPayment && !transaction?.metaDataParsed?.sandbox) {
                await addBalance(transaction.total, metaData.currency, transaction.userId);
            }
            else if (!transaction?.metaDataParsed?.apiPayment) {
                await addBalance(transaction.total, metaData.currency, transaction.userId);
            }
            await notification_service.sendDepositCompletedNotification(transaction);
            webhookService(transaction.id);
            return true;
        }
        else {
            transaction.status = 'failed';
            await transaction.save();
            await notification_service.sendDepositFailedNotification(transaction);
            webhookService(transaction.id);
            throw new Error('Deposit failed');
        }
    }
    catch (error) {
        console.error('Error in validating deposit:', error);
    }
};
//# sourceMappingURL=deposit_service.js.map