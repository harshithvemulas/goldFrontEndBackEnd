import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'investment_plans';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name').notNullable();
            table.text('description').nullable();
            table.boolean('is_active').defaultTo(true);
            table.boolean('is_featured').defaultTo(false);
            table.boolean('is_range').defaultTo(true);
            table.double('min_amount').notNullable();
            table.double('max_amount').nullable();
            table.string('currency').notNullable();
            table.double('interest_rate').notNullable();
            table.integer('duration').notNullable();
            table.enum('duration_type', ['daily', 'weekly', 'monthly', 'yearly']).notNullable();
            table.boolean('withdraw_after_matured').defaultTo(true);
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1738500414821_create_investment_plans_table.js.map