import vine from '@vinejs/vine';
export const updateSchema = vine.compile(vine.object({
    name: vine.string().trim(),
    email: vine.string().trim().email(),
    url: vine.string().url().optional(),
    proof: vine.string().trim().optional(),
    addressLine: vine.string().trim(),
    zipCode: vine.string().trim(),
    countryCode: vine.string(),
    city: vine.string(),
    storeProfileImage: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })
        .nullable(),
}));
export const updateFeesSchema = vine.compile(vine.object({
    depositFee: vine.number().nullable(),
    withdrawalFee: vine.number().nullable(),
    exchangeFee: vine.number().nullable(),
    transferFee: vine.number().nullable(),
    paymentFee: vine.number().nullable(),
}));
export const paymentRequestSchema = vine.compile(vine.object({
    name: vine.string().trim(),
    email: vine.string().trim().email(),
    address: vine.string().trim(),
    feeByCustomer: vine.boolean(),
    amount: vine.number(),
    countryCode: vine.string().trim(),
    currencyCode: vine.string().trim(),
}));
//# sourceMappingURL=merchant.js.map