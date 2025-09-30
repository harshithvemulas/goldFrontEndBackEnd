import vine from '@vinejs/vine';
export const createWithdrawSchema = vine.compile(vine.object({
    method: vine.string(),
    amount: vine.number(),
    currencyCode: vine.string().trim(),
    country: vine.string().optional(),
    inputParams: vine.any().optional(),
}));
//# sourceMappingURL=withdraw.js.map