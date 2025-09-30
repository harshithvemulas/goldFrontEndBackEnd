import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'merchants';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
                .notNullable();
            table.integer('address_id').unsigned().references('id').inTable('addresses').nullable();
            table.string('merchant_id').notNullable().unique();
            table.string('store_profile_image').nullable();
            table.string('name').nullable();
            table.string('email').notNullable();
            table.string('url').nullable();
            table.enum('status', ['pending', 'verified', 'failed']).notNullable();
            table.boolean('is_suspend').defaultTo(false);
            table.string('proof').nullable();
            table.double('deposit_fee').nullable().defaultTo(null);
            table.double('withdrawal_fee').nullable().defaultTo(null);
            table.double('exchange_fee').nullable().defaultTo(null);
            table.double('transfer_fee').nullable().defaultTo(null);
            table.double('payment_fee').nullable().defaultTo(null);
            table.string('api_key').nullable();
            table.string('allowed_ip').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1721150413844_create_merchants_table.js.map