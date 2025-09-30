import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'customers';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('cardholder_id').nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('cardholder_id');
        });
    }
}
//# sourceMappingURL=1738767592257_create_cardholder_customers_table.js.map