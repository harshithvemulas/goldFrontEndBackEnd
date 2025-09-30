import { BaseSchema } from '@adonisjs/lucid/schema';
import Roles from '../../app/enum/roles.js';
export default class extends BaseSchema {
    tableName = 'roles';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name', 50).notNullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
        this.defer(async (db) => {
            await db.table(this.tableName).multiInsert([
                {
                    id: Roles.ADMIN,
                    name: 'Admin',
                },
                {
                    id: Roles.CUSTOMER,
                    name: 'Customer',
                },
                {
                    id: Roles.MERCHANT,
                    name: 'Merchant',
                },
                {
                    id: Roles.AGENT,
                    name: 'Agent',
                },
                {
                    id: Roles.SUPERVISOR,
                    name: 'Supervisor',
                },
            ]);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1720270344681_create_roles_table.js.map