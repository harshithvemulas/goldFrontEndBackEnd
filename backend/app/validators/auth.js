import vine from '@vinejs/vine';
export const registerValidator = vine.compile(vine.object({
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
    roleId: vine.number().in([1, 2, 3, 4]),
    acceptTermsCondition: vine.accepted(),
    referralCode: vine.string().nullable().optional(),
    merchant: vine
        .object({
        name: vine.string().trim(),
        email: vine.string().trim().email(),
        url: vine.string().url().optional(),
        proof: vine.string().trim(),
        addressLine: vine.string().trim(),
        zipCode: vine.string().trim(),
        countryCode: vine.string(),
        city: vine.string(),
    })
        .optional(),
    agent: vine
        .object({
        name: vine.string().trim(),
        email: vine.string().trim().email(),
        occupation: vine.string().trim(),
        proof: vine.string().trim(),
        addressLine: vine.string().trim(),
        zipCode: vine.string().trim(),
        countryCode: vine.string(),
        city: vine.string(),
    })
        .optional(),
}));
export const loginValidator = vine.compile(vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8),
}));
export const otpValidator = vine.compile(vine.object({
    otp: vine.string().trim().fixedLength(4).regex(/^\d+$/),
    token: vine.string().trim(),
    isRememberMe: vine.boolean(),
    fingerprint: vine.string().trim().optional().nullable(),
}));
export const changePasswordValidator = vine.compile(vine.object({
    currentPassword: vine.string().trim().minLength(6),
    newPassword: vine.string().trim().minLength(6).notSameAs('currentPassword').confirmed({
        confirmationField: 'newPasswordConfirmation',
    }),
}));
export const resetPasswordValidator = vine.compile(vine.object({
    password: vine.string().trim().minLength(8).confirmed({
        confirmationField: 'passwordConfirmation',
    }),
    token: vine.string().trim(),
}));
export const resendVerifyEmail = vine.compile(vine.object({
    email: vine.string().trim().email(),
}));
//# sourceMappingURL=auth.js.map