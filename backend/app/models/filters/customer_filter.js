import { BaseModelFilter } from 'adonis-lucid-filter';
export default class CustomerFilter extends BaseModelFilter {
    status(value) {
        if (value === 'true') {
            this.$query.whereHas('user', (query) => query.where('status', true));
        }
        if (value === 'false') {
            this.$query.whereHas('user', (query) => query.where('status', false));
        }
    }
    gender(value) {
        this.$query.where('gender', value);
    }
    countryCode(value) {
        this.$query.whereHas('address', (query) => query.where('countryCode', value.toUpperCase()));
    }
    listType(value) {
        if (value === 'pending') {
            this.$query.whereHas('user', (query) => query.where('kycStatus', false));
        }
        if (value === 'verified') {
            this.$query.whereHas('user', (query) => query.where('kycStatus', true));
        }
    }
    search(value) {
        this.$query.where((builder) => {
            builder
                .whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", [`%${value}%`])
                .orWhere('phone', 'LIKE', `%${value}%`)
                .orWhereHas('user', (query) => {
                query.where('email', 'LIKE', `%${value}%`);
            });
        });
    }
}
//# sourceMappingURL=customer_filter.js.map