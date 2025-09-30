import vine from '@vinejs/vine';
export const createDepositSchema = vine.compile(vine.object({
    method: vine.string().trim(),
    amount: vine.number(),
    currencyCode: vine.string().trim(),
    country: vine.string(),
    byApi: vine.boolean().optional(),
}));
//# sourceMappingURL=deposit.js.map