import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'agents';
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
            table.integer('address_id').unsigned().references('id').inTable('addresses').nullable();
            table.string('agent_id').notNullable().unique();
            table.string('name').nullable();
            table.string('email').notNullable();
            table.string('occupation').nullable();
            table.string('whatsapp').nullable();
            table.enum('status', ['pending', 'verified', 'failed']).notNullable();
            table.double('processing_time').defaultTo(2).nullable();
            table.boolean('is_recommended').defaultTo(false);
            table.boolean('is_suspend').defaultTo(false);
            table.string('proof').nullable();
            table.double('deposit_charge').nullable().defaultTo(null);
            table.double('withdrawal_charge').nullable().defaultTo(null);
            table.double('deposit_commission').nullable().defaultTo(null);
            table.double('withdrawal_commission').nullable().defaultTo(null);
            table.double('deposit_fee').nullable().defaultTo(null);
            table.double('withdrawal_fee').nullable().defaultTo(null);
            table.double('exchange_fee').nullable().defaultTo(null);
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1721150421683_create_agents_table.js.map