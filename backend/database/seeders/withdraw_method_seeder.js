import WithdrawMethod from '#models/withdraw_method';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
export default class extends BaseSeeder {
    async run() {
        await WithdrawMethod.createMany([
            {
                name: 'Bank (USD)',
                value: 'bank_usd',
                params: JSON.stringify([
                    { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
                    { name: 'accountName', label: 'Account Name', type: 'text', required: true },
                    { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
                    { name: 'iban', label: 'IBAN', type: 'text', required: true },
                ]),
                active: true,
                activeApi: true,
                minAmount: 1,
                maxAmount: 2500,
                currencyCode: 'USD',
                countryCode: '*',
                fixedCharge: 3,
                percentageCharge: 3,
            },
            {
                name: 'Bank (EUR)',
                value: 'bank_eur',
                params: JSON.stringify([
                    { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
                    { name: 'accountName', label: 'Account Name', type: 'text', required: true },
                    { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
                    { name: 'iban', label: 'IBAN', type: 'text', required: true },
                ]),
                active: true,
                activeApi: true,
                minAmount: 1,
                maxAmount: 2500,
                currencyCode: 'USD',
                countryCode: '*',
                fixedCharge: 3,
                percentageCharge: 3,
            },
            {
                name: 'Tether USDT (TRC20)',
                value: 'usdt_trc20',
                params: JSON.stringify([
                    { name: 'extWallet', label: 'Wallet ID', type: 'text', required: true },
                ]),
                active: true,
                activeApi: true,
                minAmount: 1,
                maxAmount: 2500,
                currencyCode: 'USD',
                countryCode: '*',
                fixedCharge: 3,
                percentageCharge: 3,
            },
            {
                name: 'PERFECTMONEY USD',
                value: 'perfectmoney_dollar',
                params: JSON.stringify([
                    { name: 'extWallet', label: 'Wallet ID', type: 'text', required: true },
                ]),
                active: true,
                activeApi: true,
                minAmount: 1,
                maxAmount: 2500,
                currencyCode: 'USD',
                countryCode: '*',
                fixedCharge: 0.5,
                percentageCharge: 5,
                apiKey: '89812225',
                secretKey: 'Ru11501718Ru',
                ex1: 'U35368357',
            },
            {
                name: 'PERFECTMONEY EUR',
                value: 'perfectmoney_euro',
                params: JSON.stringify([
                    { name: 'extWallet', label: 'Wallet ID', type: 'text', required: true },
                ]),
                active: true,
                activeApi: true,
                minAmount: 1,
                maxAmount: 2500,
                currencyCode: 'EUR',
                countryCode: '*',
                fixedCharge: 0.4,
                percentageCharge: 5,
                apiKey: '89812225',
                secretKey: 'Ru11501718Ru',
                ex1: 'E33172315',
            },
        ]);
    }
}
//# sourceMappingURL=withdraw_method_seeder.js.map