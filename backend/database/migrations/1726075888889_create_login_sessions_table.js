import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'login_sessions';
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
            table.string('session_id').unique().notNullable();
            table.string('session_token').unique().notNullable();
            table.string('ip_address').nullable();
            table.string('country').nullable();
            table.string('device_name').nullable();
            table.string('fingerprint').nullable();
            table.boolean('active').defaultTo(true);
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1726075888889_create_login_sessions_table.js.map