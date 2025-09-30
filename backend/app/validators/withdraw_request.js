import vine from '@vinejs/vine';
export const storeRequestSchema = vine.compile(vine.object({
    agentId: vine.string().trim(),
    method: vine.string().trim(),
    inputValue: vine.string().trim().nullable(),
    amount: vine.number().positive(),
    currencyCode: vine.string().trim(),
    countryCode: vine.string(),
}));
//# sourceMappingURL=withdraw_request.js.map