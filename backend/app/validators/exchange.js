import vine from '@vinejs/vine';
export const storeSchema = vine.compile(vine.object({
    currencyFrom: vine.string().trim(),
    currencyTo: vine.string().trim(),
    amountFrom: vine.number(),
}));
export const updateSchema = vine.compile(vine.object({
    exchangeRate: vine.number(),
}));
//# sourceMappingURL=exchange.js.map