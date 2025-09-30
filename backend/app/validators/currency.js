import vine from '@vinejs/vine';
export const createSchema = vine.compile(vine.object({
    name: vine.string(),
    code: vine.string().trim(),
    isCrypto: vine.boolean(),
    acceptApiRate: vine.boolean(),
    usdRate: vine.number().optional().requiredWhen('acceptApiRate', '=', false),
    kycLimit: vine.number().nullable(),
    notificationLimit: vine.number().nullable(),
    minAmount: vine.number(),
    maxAmount: vine.number(),
    dailyTransferAmount: vine.number().nullable(),
    dailyTransferLimit: vine.number().nullable(),
}));
//# sourceMappingURL=currency.js.map