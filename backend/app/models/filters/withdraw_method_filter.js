import { BaseModelFilter } from 'adonis-lucid-filter';
export default class WithdrawMethodFilter extends BaseModelFilter {
    search(value) {
        this.$query.where('name', 'LIKE', `%${value}%`);
    }
}
//# sourceMappingURL=withdraw_method_filter.js.map