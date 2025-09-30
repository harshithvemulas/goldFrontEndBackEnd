import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'wallets';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('wallet_id').notNullable().unique();
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
                .notNullable();
            table.double('balance').notNullable();
            table.boolean('default').defaultTo(false);
            table.boolean('pin_dashboard').defaultTo(true);
            table
                .integer('currency_id')
                .unsigned()
                .references('id')
                .inTable('currencies')
                .onDelete('SET NULL')
                .nullable();
            table.double('daily_transfer_amount').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1723107941031_create_wallets_table.js.map