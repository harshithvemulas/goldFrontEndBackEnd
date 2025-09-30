import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'settings';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('key').notNullable();
            table.string('value_1').nullable();
            table.string('value_2').nullable();
            table.string('value_3').nullable();
            table.string('value_4').nullable();
            table.text('value_5').nullable();
            table.string('file').nullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1724731690685_create_settings_table.js.map