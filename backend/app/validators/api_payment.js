import vine from '@vinejs/vine';
export const createApiPaymentSchema = vine.compile(vine.object({
    amount: vine.number(),
    currency: vine.string(),
    logo: vine.string().url(),
    callbackUrl: vine.string().url(),
    successUrl: vine.string().url(),
    cancelUrl: vine.string().url(),
    sandbox: vine.boolean(),
    custom: vine.object({}).allowUnknownProperties(),
    customerName: vine.string(),
    customerEmail: vine.string().email(),
    feeByCustomer: vine.boolean(),
    merchant: vine.object({}).allowUnknownProperties(),
}));
export const createApiPaymentQrSchema = vine.compile(vine.object({
    amount: vine.number(),
    currency: vine.string(),
    customerName: vine.string(),
    customerEmail: vine.string().email(),
    feeByCustomer: vine.boolean(),
    merchantId: vine.string(),
}));
//# sourceMappingURL=api_payment.js.map