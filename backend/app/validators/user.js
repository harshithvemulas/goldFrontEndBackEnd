import vine from '@vinejs/vine';
export const updateUserPermissionSchema = vine.compile(vine.object({
    permission: vine.enum([
        'deposit',
        'withdraw',
        'payment',
        'exchange',
        'transfer',
        'addAccount',
        'addRemoveBalance',
    ]),
}));
export const sendMailSchema = vine.compile(vine.object({
    ids: vine.array(vine.number()).optional(),
    subject: vine.string().trim(),
    message: vine.string(),
    attachments: vine
        .array(vine.file({
        size: '10mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
    }))
        .nullable()
        .optional(),
}));
export const updateTransferLimitSchema = vine.compile(vine.object({
    limitTransfer: vine.boolean().optional().requiredIfMissing('dailyTransferLimit'),
    dailyTransferLimit: vine
        .number()
        .withoutDecimals()
        .optional()
        .requiredIfMissing('limitTransfer'),
}));
export const createAdminSchema = vine.compile(vine.object({
    email: vine
        .string()
        .trim()
        .email()
        .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first();
        return !user;
    }),
    password: vine.string().trim().minLength(8).confirmed({
        confirmationField: 'passwordConfirmation',
    }),
    addressLine: vine.string().trim(),
    zipCode: vine.string().trim(),
    countryCode: vine.string(),
    city: vine.string(),
    firstName: vine
        .string()
        .trim()
        .minLength(2)
        .maxLength(50)
        .regex(/^[\p{L}\s.'-]+$/u),
    lastName: vine
        .string()
        .trim()
        .minLength(2)
        .maxLength(50)
        .regex(/^[\p{L}\s.'-]+$/u),
    phone: vine.string().trim(),
    gender: vine.enum(['male', 'female']),
    dob: vine.date(),
}));
export const updateAdminSchema = vine.compile(vine.object({
    email: vine.string().trim().email().optional(),
    password: vine.string().trim().minLength(8).optional(),
    addressLine: vine.string().trim().optional(),
    zipCode: vine.string().trim().optional(),
    countryCode: vine.string().optional(),
    city: vine.string().optional(),
    firstName: vine
        .string()
        .trim()
        .minLength(2)
        .maxLength(50)
        .regex(/^[\p{L}\s.'-]+$/u)
        .optional(),
    lastName: vine
        .string()
        .trim()
        .minLength(2)
        .maxLength(50)
        .regex(/^[\p{L}\s.'-]+$/u)
        .optional(),
    phone: vine.string().trim().optional(),
    gender: vine.enum(['male', 'female']).optional(),
    dob: vine.date().optional(),
}));
//# sourceMappingURL=user.js.map