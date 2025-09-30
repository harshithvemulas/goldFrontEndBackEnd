import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'commissions';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('agent_id')
                .unsigned()
                .references('id')
                .inTable('agents')
                .onDelete('CASCADE')
                .nullable();
            table
                .integer('transaction_id')
                .unsigned()
                .references('id')
                .inTable('transactions')
                .onDelete('SET NULL')
                .nullable();
            table.double('amount').notNullable();
            table.enum('status', ['pending', 'completed', 'failed']);
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1727529987231_create_commissions_table.js.map