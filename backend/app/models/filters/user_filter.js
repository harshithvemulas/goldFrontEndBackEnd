import { BaseModelFilter } from 'adonis-lucid-filter';
export default class UserFilter extends BaseModelFilter {
    status(value) {
        if (value === 'true') {
            this.$query.where('status', true);
        }
        if (value === 'false') {
            this.$query.where('status', false);
        }
    }
    gender(value) {
        this.$query.whereHas('customer', (query) => query.where('gender', value));
    }
    countryCode(value) {
        this.$query.whereHas('customer', (query) => query.whereHas('address', (aQuery) => aQuery.where('countryCode', value.toUpperCase())));
    }
    listType(value) {
        if (value === 'pending') {
            this.$query.where('kycStatus', false);
        }
        if (value === 'verified') {
            this.$query.where('kycStatus', true);
        }
    }
    role(value) {
        this.$query.where('roleId', Number.parseInt(value));
    }
    search(value) {
        this.$query.where((builder) => {
            builder.where('email', 'LIKE', `%${value}%`).orWhereHas('customer', (query) => {
                query
                    .whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", [`%${value}%`])
                    .orWhere('phone', 'LIKE', `%${value}%`);
            });
        });
    }
}
//# sourceMappingURL=user_filter.js.map