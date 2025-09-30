import vine from '@vinejs/vine';
export const storeSchema = vine.compile(vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    isActive: vine.boolean(),
    isFeatured: vine.boolean(),
    isRange: vine.boolean(),
    minAmount: vine.number(),
    maxAmount: vine.number().optional().requiredWhen('isRange', '=', true),
    currency: vine.string(),
    interestRate: vine.number(),
    duration: vine.number(),
    durationType: vine.enum(['daily', 'weekly', 'monthly', 'yearly']),
    withdrawAfterMatured: vine.boolean(),
}));
export const updateSchema = vine.compile(vine.object({
    name: vine.string().optional(),
    description: vine.string().optional(),
    isActive: vine.boolean().optional(),
    isFeatured: vine.boolean().optional(),
    isRange: vine.boolean().optional(),
    minAmount: vine.number().optional(),
    maxAmount: vine.number().optional().requiredWhen('isRange', '=', true),
    currency: vine.string(),
    interestRate: vine.number().optional(),
    duration: vine.number().optional(),
    durationType: vine.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    withdrawAfterMatured: vine.boolean().optional(),
}));
//# sourceMappingURL=investment_plan.js.map