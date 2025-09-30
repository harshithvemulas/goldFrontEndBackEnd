import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'merchant_webhooks';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('type').notNullable();
            table.string('webhook_url').notNullable();
            table.text('request_body').notNullable();
            table.text('response_body').notNullable();
            table.integer('status_code').notNullable();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1730563529986_create_merchant_webhooks_table.js.map