import { BaseModelFilter } from 'adonis-lucid-filter';
import { DateTime } from 'luxon';
export default class TransactionFilter extends BaseModelFilter {
    type(value) {
        if (Array.isArray(value)) {
            if (value.length > 0) {
                this.$query.whereIn('type', value);
            }
        }
        else {
            this.$query.where('type', value);
        }
    }
    status(value) {
        this.$query.where('status', value);
    }
    method(value) {
        this.$query.where('method', value);
    }
    date(value) {
        const formattedDate = DateTime.fromISO(value).toISODate();
        if (formattedDate) {
            this.$query.whereRaw('DATE(created_at) = ?', [formattedDate]);
        }
    }
    bookmark(value) {
        if (value === 'true') {
            this.$query.where('isBookmarked', true);
        }
    }
    search(value) {
        this.$query.where((builder) => {
            builder
                .where('trxId', 'LIKE', `%${value}%`)
                .orWhereRaw(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`from\`, '$.label'))) LIKE LOWER(?)`, [
                `${value}%`,
            ])
                .orWhereRaw(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`to\`, '$.label'))) LIKE LOWER(?)`, [
                `${value}%`,
            ]);
        });
    }
    toSearch(value) {
        this.$query.where((builder) => {
            builder
                .where('trxId', 'LIKE', `%${value}%`)
                .orWhereRaw(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`to\`, '$.label'))) LIKE LOWER(?)`, [
                `${value}%`,
            ]);
        });
    }
    fromSearch(value) {
        this.$query.where((builder) => {
            builder
                .where('trxId', 'LIKE', `%${value}%`)
                .orWhereRaw(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`from\`, '$.label'))) LIKE LOWER(?)`, [
                `${value}%`,
            ]);
        });
    }
    userSearch(value) {
        this.$query.where((builder) => {
            builder.where('trxId', 'LIKE', `%${value}%`).orWhereHas('user', (query) => {
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
    currency(value) {
        this.$query.whereJson('metaData', { currency: value });
    }
}
//# sourceMappingURL=transaction_filter.js.map