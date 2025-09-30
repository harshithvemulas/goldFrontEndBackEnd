import vine from '@vinejs/vine';
export const storeSchema = vine.compile(vine.object({
    investmentPlanId: vine.number(),
    amountInvested: vine.number(),
}));
export const updateSchema = vine.compile(vine.object({
    name: vine.string().optional(),
    interestRate: vine.number().optional(),
    duration: vine.number().optional(),
    durationType: vine.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    withdrawAfterMatured: vine.boolean().optional(),
    status: vine.enum(['active', 'completed', 'withdrawn', 'on_hold']).optional(),
}));
//# sourceMappingURL=investment.js.map