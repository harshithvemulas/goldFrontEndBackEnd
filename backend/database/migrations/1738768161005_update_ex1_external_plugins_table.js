import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'external_plugins';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.text('ex_1').nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('ex_1');
        });
    }
}
//# sourceMappingURL=1738768161005_update_ex1_external_plugins_table.js.map