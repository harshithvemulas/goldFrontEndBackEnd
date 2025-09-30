import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'users';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable();
            table.integer('role_id').unsigned().references('id').inTable('roles').notNullable();
            table.string('email').notNullable().unique();
            table.boolean('is_email_verified').defaultTo(false);
            table.boolean('status').defaultTo(false);
            table.string('password').notNullable();
            table.boolean('kyc_status').defaultTo(false);
            table.string('last_ip_address').nullable();
            table.string('last_country_name').nullable();
            table.integer('password_updated').defaultTo(Math.floor(Date.now() / 1000));
            table.string('referral_code').notNullable();
            table
                .integer('referred_by')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('SET NULL')
                .nullable();
            table.boolean('referral_handled').defaultTo(false);
            table.string('otp_code').nullable();
            table.boolean('accept_terms_condition').defaultTo(true);
            table.boolean('limit_transfer').defaultTo(true);
            table.integer('daily_transfer_limit').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1720270344682_create_users_table.js.map