import WithdrawMethod from '#models/withdraw_method';
import env from '#start/env';
import { Encryption } from '@adonisjs/core/encryption';
import PMPayout from './withdraws/pm_payout.js';
const processWithdraw = async (withdraw) => {
    try {
        const encryption = new Encryption({
            secret: env.get('APP_KEY'),
        });
        const trxSecret = encryption.encrypt(withdraw.trxId);
        withdraw.metaData = JSON.stringify({
            ...withdraw.metaData,
            trxSecret,
        });
        await withdraw.save();
        const method = await WithdrawMethod.findByOrFail('value', withdraw.method);
        if (method?.value.includes('perfectmoney')) {
            const pmPayout = new PMPayout(method);
            await pmPayout.creditPM(withdraw);
            return { success: true, message: 'Withdraw processed successfully', data: withdraw };
        }
        return { success: true, message: 'Withdraw processed successfully', data: withdraw };
    }
    catch (err) {
        throw new Error(err);
    }
};
export default processWithdraw;
//# sourceMappingURL=process_withdraws.js.map