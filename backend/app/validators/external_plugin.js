import vine from '@vinejs/vine';
export const extPluginUpdateSchema = vine.compile(vine.object({
    apiKey: vine.string().nullable().optional(),
    apiKey2: vine.string().nullable().optional(),
    apiKey3: vine.string().nullable().optional(),
    secretKey: vine.string().nullable().optional(),
    active: vine.boolean(),
}));
//# sourceMappingURL=external_plugin.js.map