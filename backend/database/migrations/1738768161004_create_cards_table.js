import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'cards';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('card_id').notNullable();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
            table
                .integer('wallet_id')
                .unsigned()
                .references('id')
                .inTable('wallets')
                .onDelete('SET NULL');
            table.string('number').notNullable();
            table.string('cvc').notNullable();
            table.string('last_four').notNullable();
            table.string('brand').notNullable();
            table.string('exp_month').notNullable();
            table.string('exp_year').notNullable();
            table.enum('status', ['active', 'inactive', 'canceled']).notNullable().defaultTo('active');
            table.enum('type', ['virtual', 'physical']).notNullable();
            table.timestamp('created_at').defaultTo(this.now());
            table.timestamp('updated_at').defaultTo(this.now());
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1738768161004_create_cards_table.js.map