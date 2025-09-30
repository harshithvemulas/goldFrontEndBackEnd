import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'agent_methods';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('agent_id')
                .unsigned()
                .references('id')
                .inTable('agents')
                .onDelete('CASCADE')
                .notNullable();
            table.string('name', 255).notNullable();
            table.string('value', 255).nullable();
            table.string('country_code', 255).nullable();
            table.string('currency_code', 255).nullable();
            table.boolean('active').defaultTo(true).notNullable();
            table.boolean('allow_deposit').defaultTo(true).notNullable();
            table.boolean('allow_withdraw').defaultTo(true).notNullable();
            table.boolean('required_input').defaultTo(false).notNullable();
            table.enum('input_type', ['email', 'phone', 'other']).defaultTo('phone');
            table.string('other_name', 255).nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1725376963085_create_agent_methods_table.js.map