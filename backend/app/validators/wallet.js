import vine from '@vinejs/vine';
export const balanceEditSchema = vine.compile(vine.object({
    amount: vine.number(),
    currencyCode: vine.string().trim(),
    userId: vine.number(),
    keepRecords: vine.boolean(),
}));
//# sourceMappingURL=wallet.js.map