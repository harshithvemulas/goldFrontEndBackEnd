import vine from '@vinejs/vine';
export const storeRequestSchema = vine.compile(vine.object({
    agentId: vine.string().trim(),
    method: vine.string().trim(),
    inputValue: vine.string().trim().nullable(),
    amount: vine.number().positive(),
    currencyCode: vine.string().trim(),
    countryCode: vine.string(),
}));
export const storeRequestByAgentSchema = vine.compile(vine.object({
    email: vine.string().email(),
    amount: vine.number().positive(),
    currencyCode: vine.string().trim(),
    countryCode: vine.string(),
}));
//# sourceMappingURL=deposit_request.js.map