import { BaseModelFilter } from 'adonis-lucid-filter';
export default class SaveFilter extends BaseModelFilter {
    type(value) {
        this.$query.where('type', value);
    }
    bookmark(value) {
        if (value === 'true') {
            this.$query.where('isBookmarked', true);
        }
    }
    search(value) {
        this.$query.whereRaw(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(info, '$.label'))) LIKE LOWER(?)`, [
            `${value}%`,
        ]);
    }
}
//# sourceMappingURL=save_filter.js.map