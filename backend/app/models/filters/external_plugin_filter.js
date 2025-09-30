import { BaseModelFilter } from 'adonis-lucid-filter';
export default class ExternalPluginFilter extends BaseModelFilter {
    search(value) {
        this.$query.where('name', 'LIKE', `%${value}%`);
    }
}
//# sourceMappingURL=external_plugin_filter.js.map