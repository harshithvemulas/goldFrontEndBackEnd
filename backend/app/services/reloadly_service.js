import axios from 'axios';
import { fxRateCalculation } from './exchange_calculations.js';
import formatPrecision from '../utils/format_precision.js';
import ExternalPlugin from '#models/external_plugin';
class ReloadlyService {
    clientId = '';
    clientSecret = '';
    authUrl = 'https://auth.reloadly.com';
    utilityUrl = 'https://utilities.reloadly.com';
    topUpUrl = 'https://topups.reloadly.com';
    constructor() {
        this.initiate();
    }
    async initiate() {
        try {
            const setting = await ExternalPlugin.findBy({ value: 'reloadly' });
            this.clientId = setting?.apiKey ?? '';
            this.clientSecret = setting?.secretKey ?? '';
            if (setting?.apiKey2 === 'sandbox') {
                this.utilityUrl = 'https://utilities-sandbox.reloadly.com';
                this.topUpUrl = '	https://topups-sandbox.reloadly.com';
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getAccessToken(audience) {
        try {
            if (this.clientId === '' || this.clientSecret === '') {
                await this.initiate();
            }
            const { data: tokenData } = await axios.post(`${this.authUrl}/oauth/token`, {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials',
                audience: audience.includes('topups') ? this.topUpUrl : this.utilityUrl,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            return tokenData.access_token;
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async getBalance(Accept, accessToken, type) {
        try {
            const url = type === 'topup' ? this.topUpUrl : this.utilityUrl;
            const { data: balanceData } = await axios.get(`${url}/accounts/balance`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: Accept,
                },
            });
            return balanceData.balance;
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async detectOperator(number, countryCode, accessToken) {
        try {
            const { data: operator } = await axios.get(`${this.topUpUrl}/operators/auto-detect/phone/${number}/countries/${countryCode.toUpperCase()}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/com.reloadly.topups-v1+json',
                },
            });
            return operator;
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async topUpPreview(number, amount, fee, countryCode, currencyCode, fxRate) {
        try {
            const accessToken = await this.getAccessToken(this.topUpUrl);
            const operator = await this.detectOperator(number, countryCode, accessToken);
            if (operator.minAmount > amount) {
                throw new Error(`Invalid amount provided, the current minimum  amount for this operator is ${formatPrecision(fxRate * operator.minAmount + fee)} ${currencyCode.toLocaleUpperCase()}`);
            }
            if (operator.maxAmount < amount) {
                throw new Error(`Invalid amount provided, the current maximum  amount for this operator is ${formatPrecision(fxRate * operator.maxAmount + fee)} ${currencyCode.toLocaleUpperCase()}`);
            }
            const { data: fxData } = await axios.post(`${this.topUpUrl}/operators/fx-rate`, {
                operatorId: operator.operatorId,
                amount,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/com.reloadly.topups-v1+json',
                },
            });
            return { ...fxData, number };
        }
        catch (error) {
            console.error('Error fetching FX Rates:', error);
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async createTopUp(number, amount, fee, countryCode, currencyCode, fxRate) {
        try {
            const accessToken = await this.getAccessToken(this.topUpUrl);
            const balance = await this.getBalance('application/com.reloadly.topups-v1+json', accessToken, 'topup');
            if (!balance) {
                throw new Error('Something went wrong. Please contact with support');
            }
            if (balance < amount) {
                throw new Error('Something went wrong. Please contact with support');
            }
            const operator = await this.detectOperator(number, countryCode, accessToken);
            if (operator.minAmount > amount) {
                throw new Error(`Invalid amount provided, the current minimum  amount for this operator is ${formatPrecision(fxRate * operator.minAmount + fee)} ${currencyCode.toLocaleUpperCase()}`);
            }
            if (operator.maxAmount < amount) {
                throw new Error(`Invalid amount provided, the current maximum  amount for this operator is ${formatPrecision(fxRate * operator.maxAmount + fee)} ${currencyCode.toLocaleUpperCase()}`);
            }
            const { data: topUpData } = await axios.post(`${this.topUpUrl}/topups`, {
                operatorId: operator.operatorId,
                amount: amount,
                useLocalAmount: false,
                customIdentifier: 'topup',
                recipientPhone: {
                    countryCode,
                    number,
                },
                senderPhone: {
                    countryCode: 'CIV',
                    number: '+2250708681438',
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/com.reloadly.topups-v1+json',
                },
            });
            return topUpData;
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async getBillers() {
        try {
            const accessToken = await this.getAccessToken(this.utilityUrl);
            const { data } = await axios.get(`${this.utilityUrl}/billers?size=10000&type=ELECTRICITY_BILL_PAYMENT`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/com.reloadly.utilities-v1+json',
                },
            });
            return data.content;
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async getBillersById(id, accessToken) {
        try {
            const { data } = await axios.get(`${this.utilityUrl}/billers?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/com.reloadly.utilities-v1+json',
                },
            });
            if (data.content.length !== 1) {
                return null;
            }
            return data.content[0];
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async previewUtilityBill(meterNumber, amount, currencyCode, billerId) {
        try {
            const accessToken = await this.getAccessToken(this.utilityUrl);
            const biller = await this.getBillersById(billerId, accessToken);
            if (!biller) {
                throw new Error('Invalid biller Id');
            }
            if (biller.minInternationalTransactionAmount > amount) {
                const minTrxAmount = await fxRateCalculation('XOF', currencyCode, biller.minInternationalTransactionAmount);
                throw new Error(`Invalid amount provided, the current minimum  amount for this biller is ${formatPrecision(minTrxAmount || 0)} ${currencyCode.toLocaleUpperCase()}`);
            }
            if (biller.maxInternationalTransactionAmount < amount) {
                const maxTrxAmount = await fxRateCalculation('XOF', currencyCode, biller.maxInternationalTransactionAmount);
                throw new Error(`Invalid amount provided, the current maximum amount for this biller is ${formatPrecision(maxTrxAmount || 0)} ${currencyCode.toLocaleUpperCase()}`);
            }
            return {
                id: biller.id,
                name: biller.name,
                countryCode: biller.countryCode,
                countryName: biller.countryName,
                type: biller.type,
                serviceType: biller.serviceType,
                meterNumber,
                fxRate: formatPrecision(biller.fx.rate * amount),
                currencyCode: biller.localTransactionCurrencyCode,
            };
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async createUtilityBill(meterNumber, amount, currencyCode, billerId) {
        try {
            const accessToken = await this.getAccessToken(this.utilityUrl);
            const balance = await this.getBalance('application/com.reloadly.utilities-v1+json', accessToken, 'utility');
            if (!balance) {
                throw new Error('Something went wrong. Please contact with support.');
            }
            if (balance < amount) {
                throw new Error('Something went wrong. Please contact with support.');
            }
            const biller = await this.getBillersById(billerId, accessToken);
            if (!biller) {
                throw new Error('Invalid biller Id');
            }
            if (biller.minInternationalTransactionAmount > amount) {
                const minTrxAmount = await fxRateCalculation('XOF', currencyCode, biller.minInternationalTransactionAmount);
                throw new Error(`Invalid amount provided, the current minimum amount for this biller is ${formatPrecision(minTrxAmount || 0)} ${currencyCode.toLocaleUpperCase()}`);
            }
            if (biller.maxInternationalTransactionAmount < amount) {
                const maxTrxAmount = await fxRateCalculation('XOF', currencyCode, biller.maxInternationalTransactionAmount);
                throw new Error(`Invalid amount provided, the current maximum amount for this biller is ${formatPrecision(maxTrxAmount || 0)} ${currencyCode.toLocaleUpperCase()}`);
            }
            const { data: uitilityData } = await axios.post(`${this.utilityUrl}/pay`, {
                subscriberAccountNumber: meterNumber,
                amount: amount,
                billerId: biller.id,
                useLocalAmount: false,
                referenceId: 'electricity-bill',
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/com.reloadly.utilities-v1+json',
                },
            });
            return uitilityData;
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
    async verifyUtilityBill(id) {
        try {
            const accessToken = await this.getAccessToken(this.utilityUrl);
            const { data: uitilityData } = await axios.get(`${this.utilityUrl}/transactions/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/com.reloadly.utilities-v1+json',
                },
            });
            return uitilityData;
        }
        catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    }
}
const reloadly = new ReloadlyService();
export default reloadly;
//# sourceMappingURL=reloadly_service.js.map