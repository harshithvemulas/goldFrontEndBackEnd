import vine from '@vinejs/vine';
export const updateStatusSchema = vine.compile(vine.object({
    status: vine.enum(['pending', 'completed', 'failed']),
}));
//# sourceMappingURL=commission.js.map