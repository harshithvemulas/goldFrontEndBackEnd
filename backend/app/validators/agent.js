import vine from '@vinejs/vine';
export const updateSchema = vine.compile(vine.object({
    name: vine.string().trim().optional(),
    email: vine.string().trim().email().optional(),
    occupation: vine.string().trim(),
    whatsapp: vine.string().trim().nullable().optional(),
    proof: vine.string().trim().optional(),
    addressLine: vine.string().trim().optional(),
    zipCode: vine.string().trim().optional(),
    countryCode: vine.string().optional(),
    city: vine.string().optional(),
    processingTime: vine.number().optional(),
}));
export const updateFeesCommissionsSchema = vine.compile(vine.object({
    depositCharge: vine.number().nullable().optional(),
    withdrawalCharge: vine.number().nullable().optional(),
    depositCommission: vine.number().nullable().optional(),
    withdrawalCommission: vine.number().nullable().optional(),
    depositFee: vine.number().nullable().optional(),
    withdrawalFee: vine.number().nullable().optional(),
    exchangeFee: vine.number().nullable().optional(),
}));
export const updateStatusSchema = vine.compile(vine.object({
    isSuspend: vine.boolean().optional(),
    isRecommended: vine.boolean().optional(),
}));
//# sourceMappingURL=agent.js.map