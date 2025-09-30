import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'permissions';
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
            table.boolean('deposit').defaultTo(true);
            table.boolean('withdraw').defaultTo(true);
            table.boolean('payment').defaultTo(true);
            table.boolean('exchange').defaultTo(true);
            table.boolean('transfer').defaultTo(true);
            table.boolean('add_account').defaultTo(true);
            table.boolean('add_remove_balance').defaultTo(true);
            table.boolean('services').defaultTo(true);
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1721150433086_create_permissions_table.js.map