import vine from '@vinejs/vine';
export const updateSchema = vine.compile(vine.object({
    name: vine.string(),
    value: vine.string(),
    apiKey: vine.string().nullable().optional(),
    secretKey: vine.string().nullable().optional(),
    active: vine.boolean(),
    activeApi: vine.boolean(),
    isCrypto: vine.boolean(),
    recommended: vine.boolean(),
    ex1: vine.string().nullable().optional(),
    ex2: vine.string().nullable().optional(),
    allowedCurrencies: vine.string().nullable().optional(),
    allowedCountries: vine.string().nullable().optional(),
    uploadLogo: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
    })
        .nullable()
        .optional(),
}));
//# sourceMappingURL=deposit_gateway.js.map