import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'investments';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name').notNullable();
            table.double('amount_invested').notNullable();
            table.string('currency').notNullable();
            table.double('interest_rate').notNullable();
            table.double('profit').notNullable();
            table.integer('duration').notNullable();
            table.enum('duration_type', ['daily', 'weekly', 'monthly', 'yearly']).notNullable();
            table.boolean('withdraw_after_matured').defaultTo(true);
            table.enum('status', ['active', 'completed', 'withdrawn', 'on_hold']).defaultTo('active');
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
            table.timestamp('ends_at').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1738502047874_create_investments_table.js.map