import { BaseModelFilter } from 'adonis-lucid-filter';
export default class DepositGatewayFilter extends BaseModelFilter {
    search(value) {
        this.$query.where('name', 'LIKE', `%${value}%`);
    }
}
//# sourceMappingURL=deposit_gateway_filter.js.map