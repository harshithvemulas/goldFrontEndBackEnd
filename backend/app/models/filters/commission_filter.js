import { BaseModelFilter } from 'adonis-lucid-filter';
import { DateTime } from 'luxon';
export default class CommissionFilter extends BaseModelFilter {
    status(value) {
        this.$query.where('status', value);
    }
    date(value) {
        const formattedDate = DateTime.fromISO(value).toISODate();
        if (formattedDate) {
            this.$query.whereRaw('DATE(created_at) = ?', [formattedDate]);
        }
    }
    search(value) {
        this.$query.where((builder) => {
            builder.whereHas('transaction', (query) => {
                query.where('trxId', 'LIKE', `%${value}%`);
            });
        });
    }
}
//# sourceMappingURL=commission_filter.js.map