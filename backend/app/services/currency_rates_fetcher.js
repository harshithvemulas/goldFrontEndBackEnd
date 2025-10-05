import Currency from '#models/currency';
import ExternalPlugin from '#models/external_plugin';
import axios from 'axios';
const currencyRatesFetcher = async () => {
    try {
        const data = await Currency.all();
        const setting = await ExternalPlugin.findByOrFail('value', 'currency-api');
        if (!setting.active) {
            console.error('Currency API is not set');
            return;
        }
        const filteredDataCrypto = data.filter((coin) => coin.usdRate && coin.isCrypto);
        const filteredDataFiat = data.filter((coin) => coin.usdRate && !coin.isCrypto);
        for (const coin of filteredDataCrypto) {
            const { data: cryptoData } = await axios.get('https://api.currencyapi.com/v3/latest', {
                params: {
                    base_currency: 'USD',
                    currencies: coin.code.toUpperCase(),
                    apikey: setting?.apiKey,
                },
            });
            await coin.merge({ usdRate: cryptoData?.data?.[coin.code.toUpperCase()]['value'] }).save();
        }
        for (const coin of filteredDataFiat) {
            const { data: fiatData, headers } = await axios.get('https://api.currencyapi.com/v3/latest', {
                params: {
                    base_currency: 'USD',
                    currencies: coin.code.toUpperCase() === 'CNH' ? 'CNY' : coin.code.toUpperCase(),
                    apikey: setting?.apiKey,
                },
            });
            setting.apiKey2 = headers['x-ratelimit-remaining-quota-month'];
            setting.apiKey3 = headers['x-ratelimit-limit-quota-month'];
            await setting.save();
            if (fiatData?.data) {
                await coin
                    .merge({
                    usdRate: fiatData?.data?.[coin.code.toUpperCase() === 'CNH' ? 'CNY' : coin.code.toUpperCase()]['value'],
                })
                    .save();
            }
        }
    }
    catch (error) {
        console.log(error?.response?.data);
        console.error('Error fetching currency rates:', error?.response?.data?.message);
    }
};
export const currencyConversion = async (from, to, amount) => {
    try {
        const fromCurrency = await Currency.query().where('code', from.toUpperCase()).first();
        const toCurrency = await Currency.query().where('code', to.toUpperCase()).first();
        if (!fromCurrency || !toCurrency) {
            return 0;
        }
        const fromPriceUsd = fromCurrency.usdRate;
        const toPriceUsd = toCurrency.usdRate;
        if (fromPriceUsd <= 0 || toPriceUsd <= 0) {
            return 0;
        }
        return amount * (toPriceUsd / fromPriceUsd);
    }
    catch (error) {
        console.error('Error in currency conversion:', error);
        return 0;
    }
};
export default currencyRatesFetcher;
//# sourceMappingURL=currency_rates_fetcher.js.map