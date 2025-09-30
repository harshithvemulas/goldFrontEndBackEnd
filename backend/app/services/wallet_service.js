import Currency from '#models/currency';
import formatPrecision from '../utils/format_precision.js';
export const addBalance = async (amount, currencyCode, userId) => {
    try {
        const currency = await Currency.findBy('code', currencyCode);
        if (!currency) {
            throw new Error('Currency data invalid or not found');
        }
        const wallet = await currency?.related('wallets').query().where('userId', userId).first();
        if (!wallet) {
            await currency.related('wallets').create({
                dailyTransferAmount: currency.dailyTransferAmount,
                balance: formatPrecision(amount),
                userId,
            });
            return 'Balance Updated';
        }
        wallet.balance = wallet.balance + formatPrecision(amount);
        await wallet.save();
        return 'Balance Updated';
    }
    catch (error) {
        console.error('Error in adding ballance:', error);
    }
};
export const removeBalance = async (amount, currencyCode, userId) => {
    try {
        const currency = await Currency.findBy('code', currencyCode);
        if (!currency) {
            return null;
        }
        const wallet = await currency
            ?.related('wallets')
            .query()
            .where('userId', userId)
            .preload('user')
            .first();
        if (!wallet) {
            throw new Error(`${currencyCode} Wallet not added yet`);
        }
        if (wallet.user.roleId !== 1 && wallet.balance < formatPrecision(amount)) {
            throw new Error('Balance is insufficient');
        }
        wallet.balance = wallet.balance - formatPrecision(amount);
        await wallet.save();
        return 'Balance Updated';
    }
    catch (error) {
        console.error('Error in removing ballance:', error);
    }
};
//# sourceMappingURL=wallet_service.js.map