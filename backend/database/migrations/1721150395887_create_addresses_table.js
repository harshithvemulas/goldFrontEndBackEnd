import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'addresses';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.enum('type', ['billing', 'mailing']).notNullable();
            table.string('address_line').nullable();
            table.string('street').nullable();
            table.string('zip_code').nullable();
            table.string('country_code').nullable();
            table.string('city').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1721150395887_create_addresses_table.js.map