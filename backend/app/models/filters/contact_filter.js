import { BaseModelFilter } from 'adonis-lucid-filter';
export default class ContactFilter extends BaseModelFilter {
    search(value) {
        this.$query.where((builder) => {
            builder.whereHas('contact', (query) => {
                query
                    .whereHas('customer', (cQuery) => {
                    cQuery
                        .whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", [`%${value}%`])
                        .orWhere('phone', 'LIKE', `%${value}%`);
                })
                    .orWhere('email', 'LIKE', `%${value}%`);
            });
        });
    }
}
//# sourceMappingURL=contact_filter.js.map