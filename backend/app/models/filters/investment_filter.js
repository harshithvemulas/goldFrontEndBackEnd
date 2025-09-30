import { BaseModelFilter } from 'adonis-lucid-filter';
export default class InvestmentFilter extends BaseModelFilter {
    search(value) {
        this.$query.where('name', 'LIKE', `%${value}%`);
        this.$query.orWhere('durationType', 'LIKE', `%${value}%`);
        this.$query.orWhere('currency', 'LIKE', `%${value}%`);
    }
}
//# sourceMappingURL=investment_filter.js.map