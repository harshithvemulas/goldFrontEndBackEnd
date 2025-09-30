import ExternalPlugin from '#models/external_plugin';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
export default class extends BaseSeeder {
    async run() {
        await ExternalPlugin.createMany([
            {
                name: 'Stripe Cards',
                value: 'stripe-cards',
                apiKey: 'pk_test_51JFcapDOao7iBpqLWFvN7POFwsVlOvquoccwgz5wShxckcaNK6YWDyH0sRmq8QmTSgX0bRWJIow4oFA6RIoptsGi00DybpSVjO',
                secretKey: 'sk_test_51JFcapDOao7iBpqLH42awxLJ6q0Kkw1A4FouIY3VkxsWpnhBaHsNTHmv3BLbiqClF4rn8zUHkt7gpyyjnqz6bzXW00vatkcqFB',
                active: true,
            },
            {
                name: 'Sudo Africa',
                value: 'sudo-africa',
                apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2MzMTA0ZGVhZmNjNWUzODNhZGVlYTgiLCJlbWFpbEFkZHJlc3MiOiJhYmlkQGNpcmNsZWNvZGVzLmNvIiwianRpIjoiNjdjMzEwYzNlYWZjYzVlMzgzYWRmMzBhIiwibWVtYmVyc2hpcCI6eyJfaWQiOiI2N2MzMTA0ZGVhZmNjNWUzODNhZGVlYWIiLCJidXNpbmVzcyI6eyJfaWQiOiI2N2MzMTA0ZGVhZmNjNWUzODNhZGVlYTYiLCJuYW1lIjoiQ2lyY2xlQ29kZXMiLCJpc0FwcHJvdmVkIjpmYWxzZX0sInVzZXIiOiI2N2MzMTA0ZGVhZmNjNWUzODNhZGVlYTgiLCJyb2xlIjoiQVBJS2V5In0sImlhdCI6MTc0MDgzNzA1OSwiZXhwIjoxNzcyMzk0NjU5fQ.CAbL0nqnS6W0moxILWoiVKZG9lC4iv4deXZTauRPvr0',
                apiKey2: 'sandbox',
                apiKey3: '67c31a84eafcc5e383ae09d4',
                secretKey: 'Verve',
                ex1: '67c3281eeafcc5e383ae5eef',
                active: true,
            },
            {
                name: 'Currency API',
                value: 'currency-api',
                apiKey: 'MYL2F66ma5mZa1CBRUibP6VUzl6qMf02pGcIZ2xN',
                active: true,
            },
            {
                name: 'Reloadly',
                value: 'reloadly',
                apiKey: 'TLUIAis3sxMl3PtSfHENbc8gk0w8dIi1',
                apiKey2: 'sandbox',
                secretKey: '4Y8ylJtY2R-7Dzvy8ndrx7Uvlck6f8-BMyJmdkFN9GCd06xNKSMxJWv941e3JcB',
                active: true,
            },
            {
                name: 'Tawk.to Chat',
                value: 'tawk-to',
                apiKey: '1il8bfb9m',
                secretKey: '67c2be613dc5d5190df01990',
                active: true,
            },
            {
                name: 'Google Analytics',
                value: 'google-analytics',
                apiKey: 'UA-123456789-1',
                active: true,
            },
        ]);
    }
}
//# sourceMappingURL=external_plugin_seeder.js.map