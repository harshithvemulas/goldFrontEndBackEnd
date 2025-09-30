import vine from '@vinejs/vine';
export const methodSchema = vine.compile(vine.object({
    name: vine.string().trim(),
    value: vine.string().trim().nullable(),
    countryCode: vine.string().trim(),
    currencyCode: vine.string().trim(),
    allowDeposit: vine.boolean(),
    active: vine.boolean().optional(),
    allowWithdraw: vine.boolean(),
    requiredInput: vine.boolean(),
    inputType: vine
        .enum(['email', 'phone', 'other'])
        .optional()
        .requiredWhen('requiredInput', '=', true),
    otherName: vine.string().optional().requiredWhen('inputType', '=', 'other').nullable(),
}));
export const methodUpdateSchema = vine.compile(vine.object({
    name: vine.string().trim().optional(),
    value: vine.string().trim().nullable().optional(),
    countryCode: vine.string().trim().optional(),
    currencyCode: vine.string().trim().optional(),
    allowDeposit: vine.boolean().optional(),
    allowWithdraw: vine.boolean().optional(),
    active: vine.boolean().optional(),
    requiredInput: vine.boolean().optional(),
    inputType: vine
        .enum(['email', 'phone', 'other'])
        .optional()
        .requiredWhen('requiredInput', '=', true),
    otherName: vine.string().optional().requiredWhen('inputType', '=', 'other').nullable(),
}));
//# sourceMappingURL=agent_method.js.map