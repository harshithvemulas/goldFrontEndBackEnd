import Currency from '#models/currency';
import Setting from '#models/setting';
import User from '#models/user';
import formatPrecision from '../utils/format_precision.js';
const exchangeCalculations = async (from, to, amountFrom, userId, exRate) => {
    try {
        const currencyFrom = await Currency.query().where('code', from.toUpperCase()).first();
        const currencyTo = await Currency.query().where('code', to.toLowerCase()).first();
        if (!currencyFrom || !currencyTo) {
            return null;
        }
        const fromPriceUsd = currencyFrom.usdRate;
        const toPriceUsd = currencyTo.usdRate;
        if (fromPriceUsd <= 0 || toPriceUsd <= 0) {
            return null;
        }
        const exchangeRate = exRate ? exRate : toPriceUsd / fromPriceUsd;
        const user = await User.query()
            .where('id', userId)
            .preload('customer')
            .preload('merchant')
            .preload('agent')
            .first();
        const exchangeSetting = await Setting.findBy({ key: 'exchange', value1: 'on' });
        let regularFeePercentage = exchangeSetting ? formatPrecision(exchangeSetting.value2 ?? 0) : 0;
        if (user && user.roleId === 3 && user.merchant) {
            if (user.merchant.exchangeFee !== null) {
                regularFeePercentage = user.merchant.exchangeFee;
            }
        }
        if (user && user.roleId === 4 && user.agent) {
            if (user.agent.exchangeFee !== null) {
                regularFeePercentage = user.agent.exchangeFee;
            }
        }
        const amountTo = formatPrecision(amountFrom * exchangeRate);
        const fee = formatPrecision(amountTo * (regularFeePercentage / 100));
        const total = formatPrecision(amountTo - fee);
        return { amountFrom, amountTo, fee, total, currencyFrom: from, currencyTo: to, exchangeRate };
    }
    catch (error) {
        console.error('Error in exchange calculation:', error);
    }
};
export const fxRateCalculation = async (from, to, amount) => {
    try {
        const currencyFrom = await Currency.query().where('code', from.toUpperCase()).first();
        const currencyTo = await Currency.query().where('code', to.toLowerCase()).first();
        if (!currencyFrom || !currencyTo) {
            return null;
        }
        const fromPriceUsd = currencyFrom.usdRate;
        const toPriceUsd = currencyTo.usdRate;
        if (fromPriceUsd <= 0 || toPriceUsd <= 0) {
            return null;
        }
        const cryptoCondition = currencyTo.isCrypto || currencyFrom.isCrypto;
        const exchangeRate = cryptoCondition ? fromPriceUsd / toPriceUsd : toPriceUsd / fromPriceUsd;
        return formatPrecision(amount * exchangeRate);
    }
    catch (error) {
        console.error('Error in fx rate calculation:', error);
    }
};
export default exchangeCalculations;
//# sourceMappingURL=exchange_calculations.js.map