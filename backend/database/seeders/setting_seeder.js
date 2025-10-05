import Setting from '#models/setting';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
export default class extends BaseSeeder {
    async run() {
        await Setting.createMany([
            {
                key: 'deposit',
                value1: 'on',
                value2: '0.5',
            },
            {
                key: 'withdraw',
                value1: 'on',
                value2: '0.5',
            },
            {
                key: 'transfer',
                value1: 'on',
                value2: '0.5',
            },
            {
                key: 'payment',
                value1: 'on',
                value2: '0.5',
            },
            {
                key: 'exchange',
                value1: 'on',
                value2: '0.5',
            },
            {
                key: 'topup',
                value1: 'on',
                value2: '0.5',
            },
            {
                key: 'electricity_bill',
                value1: 'on',
                value2: '0.5',
            },
            {
                key: 'deposit_commission',
                value1: 'on',
                value2: '1.0',
            },
            {
                key: 'withdraw_commission',
                value1: 'on',
                value2: '1.5',
            },
            {
                key: 'investment',
                value1: 'on',
                value2: '10',
            },
            {
                key: 'langs',
                value5: JSON.stringify([
                    {
                        code: 'en',
                        name: 'English',
                    },
                    {
                        code: 'es',
                        name: 'Español',
                    },
                    {
                        code: 'fr',
                        name: 'French',
                    },
                    {
                        code: 'de',
                        name: 'Deutsch',
                    },
                    {
                        code: 'ru',
                        name: 'Russian',
                    },
                    {
                        code: 'pt',
                        name: 'Portuguese',
                    },
                    {
                        code: 'cn',
                        name: 'Chinese',
                    },
                ]),
            },
            {
                key: 'branding',
                value1: 'PaySnap',
                value2: 'https://awdfe.abidr.me',
                value3: 'https://awdpayapi.abidr.me',
                value4: 'USD',
                value5: 'en',
            },
            {
                key: 'favicon',
            },
            {
                key: 'authBanner',
            },
            {
                key: 'cardBg',
            },
            {
                key: 'referral',
                value1: '0',
                value2: 'referrer',
                value3: 'kyc',
            },
            {
                key: 'customer_registration',
                value1: 'on',
            },
            {
                key: 'agent_registration',
                value1: 'on',
            },
            {
                key: 'merchant_registration',
                value1: 'on',
            },
            {
                key: 'virtual_card',
                value1: 'on',
                value2: 'sudo-africa',
            },
        ]);
    }
}
//# sourceMappingURL=setting_seeder.js.map