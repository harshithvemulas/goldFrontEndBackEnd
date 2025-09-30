import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'customers';
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
            table.string('first_name', 255).nullable();
            table.string('last_name', 255).nullable();
            table.string('profile_image').nullable();
            table.string('phone').nullable();
            table.enum('gender', ['male', 'female']).nullable();
            table.date('dob').nullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1721150395888_create_customers_table.js.map