import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'deposit_gateways';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('logo_image').nullable();
            table.string('name').notNullable();
            table.string('value').notNullable();
            table.string('api_key').nullable();
            table.string('secret_key').nullable();
            table.boolean('active').defaultTo(false);
            table.boolean('active_api').defaultTo(false);
            table.boolean('is_crypto').defaultTo(false);
            table.boolean('recommended').defaultTo(false);
            table.string('ex1').nullable();
            table.string('ex2').nullable();
            table.json('variables').nullable();
            table.json('allowed_currencies').nullable();
            table.json('allowed_countries').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1723650233989_create_deposit_gateways_table.js.map