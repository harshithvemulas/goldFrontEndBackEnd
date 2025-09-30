import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'withdraw_methods';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('logo_image').nullable();
            table.string('name').notNullable();
            table.string('value').notNullable();
            table.string('api_key').nullable();
            table.string('secret_key').nullable();
            table.json('params').nullable();
            table.string('currency_code').nullable();
            table.string('country_code').nullable();
            table.boolean('active').defaultTo(false);
            table.boolean('active_api').defaultTo(false);
            table.boolean('recommended').defaultTo(false);
            table.string('variable').nullable();
            table.string('ex1').nullable();
            table.string('ex2').nullable();
            table.double('min_amount').notNullable();
            table.double('max_amount').notNullable();
            table.double('fixed_charge').defaultTo(0.0);
            table.double('percentage_charge').nullable().defaultTo(null);
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1723650251746_create_withdraw_methods_table.js.map