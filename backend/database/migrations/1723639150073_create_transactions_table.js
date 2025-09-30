import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'transactions';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('trx_id').notNullable().unique();
            table.string('type');
            table.json('from').notNullable().defaultTo({});
            table.json('to').notNullable().defaultTo({});
            table.double('amount').notNullable();
            table.double('fee').notNullable();
            table.double('total').notNullable();
            table.enum('status', ['pending', 'completed', 'failed']);
            table.string('method').nullable();
            table.boolean('is_bookmarked').defaultTo(false);
            table.json('meta_data').nullable();
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('SET NULL')
                .nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1723639150073_create_transactions_table.js.map