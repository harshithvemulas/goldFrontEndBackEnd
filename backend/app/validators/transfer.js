import vine from '@vinejs/vine';
export const storeSchema = vine.compile(vine.object({
    currencyCode: vine.string().trim(),
    amount: vine.number().positive(),
    email: vine.string().trim().email(),
}));
//# sourceMappingURL=transfer.js.map