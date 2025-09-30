import Translation from '#models/translation';
export default class TranslationsController {
    async getByLang({ request, response }) {
        const { lang } = request.params();
        const translations = await Translation.query().where('code', lang);
        if (!translations.length) {
            return response.json({});
        }
        const obj = {};
        for (const translation of translations) {
            obj[translation.key] = translation.value;
        }
        return response.json(obj);
    }
    async createMissingLang({ request, response }) {
        const { lang } = request.params();
        const { key } = request.body();
        const data = await Translation.query().where('code', lang).andWhere('key', key).first();
        if (!data) {
            await Translation.create({
                code: lang,
                key,
                value: key,
            });
        }
        return response.json({ message: 'Successfully saved missing keys' });
    }
    async getTranslationsApi({ request, response }) {
        const { code } = request.params();
        const { search, page, limit } = request.qs();
        try {
            const data = await Translation.query()
                .where('code', code)
                .if(search, (query) => {
                query.whereLike('key', `%${search}%`).orWhereLike('value', `%${search}%`);
            })
                .orderBy('id', 'desc')
                .paginate(page, limit);
            return response.json(data);
        }
        catch {
            return response.badRequest({ success: false, message: 'Something went wrong' });
        }
    }
    async createTranslations({ request, response }) {
        const { code, key, value } = request.body();
        await Translation.create({
            code,
            key,
            value,
        });
        return response.json({ message: 'Successfully created translation' });
    }
    async updateTranslations({ request, response }) {
        const { id } = request.params();
        const { key, value } = request.body();
        const data = await Translation.findOrFail(id);
        data.key = key;
        data.value = value;
        await data.save();
        return response.json({ message: 'Successfully updated translation' });
    }
    async deleteTranslations({ request, response }) {
        const { id } = request.params();
        const data = await Translation.findOrFail(id);
        await data.delete();
        return response.json({ message: 'Successfully deleted translation' });
    }
}
//# sourceMappingURL=translations_controller.js.map