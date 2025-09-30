import { BaseModelFilter } from 'adonis-lucid-filter';
export default class AgentFilter extends BaseModelFilter {
    status(value) {
        if (value === 'true') {
            this.$query.whereHas('user', (query) => query.where('status', true));
        }
        if (value === 'false') {
            this.$query.whereHas('user', (query) => query.where('status', false));
        }
    }
    suspended(value) {
        if (value === 'true') {
            this.$query.where('isSuspend', true);
        }
        if (value === 'false') {
            this.$query.where('isSuspend', false);
        }
    }
    recommended(value) {
        if (value === 'true') {
            this.$query.where('isRecommended', true);
        }
        if (value === 'false') {
            this.$query.where('isRecommended', false);
        }
    }
    agentStatus(value) {
        this.$query.where('status', value);
    }
    gender(value) {
        this.$query.whereHas('user', (query) => query.whereHas('customer', (cQuery) => cQuery.where('gender', value)));
    }
    countryCode(value) {
        this.$query.whereHas('user', (query) => query.whereHas('customer', (cQuery) => cQuery.whereHas('address', (aQuery) => aQuery.where('countryCode', value.toUpperCase()))));
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
                .where('name', 'LIKE', `%${value}%`)
                .orWhere('email', 'LIKE', `%${value}%`)
                .orWhere('agentId', 'LIKE', `%${value}%`)
                .orWhereHas('user', (query) => {
                query
                    .where('email', 'LIKE', `%${value}%`)
                    .orWhereHas('customer', (cQuery) => {
                    cQuery
                        .whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", [`%${value}%`])
                        .orWhere('name', 'LIKE', `%${value}%`)
                        .orWhere('phone', 'LIKE', `%${value}%`);
                })
                    .orWhere('email', 'LIKE', `%${value}%`);
            });
        });
    }
}
//# sourceMappingURL=agent_filter.js.map