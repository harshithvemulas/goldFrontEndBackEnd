import vine from '@vinejs/vine';
export const createSchema = vine.compile(vine.object({
    name: vine.string(),
    active: vine.boolean(),
    recommended: vine.boolean(),
    inputParams: vine.string().nullable().optional(),
    currencyCode: vine.string(),
    countryCode: vine.string(),
    minAmount: vine.number(),
    maxAmount: vine.number(),
    fixedCharge: vine.number(),
    percentageCharge: vine.number().nullable(),
    uploadLogo: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })
        .nullable()
        .optional(),
}));
export const updateSchema = vine.compile(vine.object({
    name: vine.string().optional(),
    active: vine.boolean(),
    recommended: vine.boolean(),
    inputParams: vine.string().nullable().optional(),
    currencyCode: vine.string().optional(),
    countryCode: vine.string().optional(),
    minAmount: vine.number().optional(),
    maxAmount: vine.number().optional(),
    fixedCharge: vine.number().optional(),
    percentageCharge: vine.number().nullable().optional(),
    uploadLogo: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })
        .nullable()
        .optional(),
}));
//# sourceMappingURL=withdraw_method.js.map