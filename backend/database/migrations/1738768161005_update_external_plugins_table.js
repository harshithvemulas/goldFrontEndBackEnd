import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'external_plugins';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.text('api_key').nullable().alter();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('api_key').nullable().alter();
        });
    }
}
//# sourceMappingURL=1738768161005_update_external_plugins_table.js.map