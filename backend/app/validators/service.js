import vine from '@vinejs/vine';
export const topUpSchema = vine.compile(vine.object({
    number: vine.string().trim(),
    amount: vine.number(),
    countryCode: vine.string().trim(),
    currencyCode: vine.string().trim(),
}));
export const uitilitySchema = vine.compile(vine.object({
    meterNumber: vine.string().trim(),
    amount: vine.number(),
    currencyCode: vine.string().trim(),
    billerId: vine.number().positive(),
}));
export const savePhoneSchema = vine.compile(vine.object({
    number: vine.string().trim(),
    name: vine.string().trim(),
}));
export const saveElectricitySchema = vine.compile(vine.object({
    meterNumber: vine.string().trim(),
    billerId: vine.number(),
}));
//# sourceMappingURL=service.js.map