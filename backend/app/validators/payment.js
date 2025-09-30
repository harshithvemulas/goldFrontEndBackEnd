import vine from '@vinejs/vine';
export const storeSchema = vine.compile(vine.object({
    currencyCode: vine.string().trim(),
    amount: vine.number().positive(),
    merchantId: vine.string(),
}));
//# sourceMappingURL=payment.js.map