import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'external_plugins';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name').notNullable();
            table.string('value').notNullable();
            table.string('api_key').nullable();
            table.string('api_key_2').nullable();
            table.string('api_key_3').nullable();
            table.string('secret_key').nullable();
            table.boolean('active').defaultTo(false);
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1738763498205_create_external_plugins_table.js.map