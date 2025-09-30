import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'currencies';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name').notNullable();
            table.string('code').notNullable();
            table.string('icon').nullable();
            table.double('usd_rate').defaultTo(1.0);
            table.boolean('accept_api_rate').defaultTo(false);
            table.boolean('is_crypto').defaultTo(false);
            table.boolean('active').defaultTo(false);
            table.json('meta_data').nullable();
            table.double('kyc_limit').nullable();
            table.double('notification_limit').nullable();
            table.double('min_amount').notNullable();
            table.double('max_amount').notNullable();
            table.double('daily_transfer_amount').nullable();
            table.integer('daily_transfer_limit').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
        this.defer(async (db) => {
            await db.table(this.tableName).multiInsert([
                {
                    id: 1,
                    name: 'West African CFA franc',
                    code: 'XOF',
                    usd_rate: 620.699735,
                    accept_api_rate: true,
                    active: true,
                    kyc_limit: 145000,
                    notification_limit: 20000,
                    min_amount: 200,
                    max_amount: 1500000,
                    daily_transfer_amount: 1500000,
                    daily_transfer_limit: 10,
                },
                {
                    id: 2,
                    name: 'US Dollar',
                    code: 'USD',
                    usd_rate: 1,
                    accept_api_rate: true,
                    active: true,
                    kyc_limit: 250,
                    notification_limit: 300,
                    min_amount: 1,
                    max_amount: 1000,
                    daily_transfer_amount: 5000,
                    daily_transfer_limit: 10,
                },
            ]);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1723107934558_create_currencies_table.js.map