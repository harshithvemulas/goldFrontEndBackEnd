import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'saves';
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
            table.enum('type', ['wallet', 'merchant', 'phone', 'electricity']);
            table.string('info').notNullable();
            table.string('value').notNullable();
            table.string('related_model').nullable();
            table.integer('related_model_id').nullable();
            table.json('meta_data').nullable();
            table.boolean('is_bookmarked').defaultTo(false);
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1724498210729_create_saves_table.js.map