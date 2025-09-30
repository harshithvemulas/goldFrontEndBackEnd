import vine from '@vinejs/vine';
export const updateSchema = vine.compile(vine.object({
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
    profileImage: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })
        .nullable(),
    email: vine.string().trim().email().optional(),
}));
export const updateAddressSchema = vine.compile(vine.object({
    addressLine: vine.string(),
    zipCode: vine.string().trim(),
    countryCode: vine.string(),
    city: vine.string(),
}));
export const convertAccountSchema = vine.compile(vine.object({
    roleId: vine.number().in([3, 4]),
    merchant: vine
        .object({
        name: vine.string().trim(),
        email: vine.string().trim().email(),
        url: vine.string().url().optional(),
        addressLine: vine.string().trim(),
        zipCode: vine.string().trim(),
        countryCode: vine.string(),
        city: vine.string(),
    })
        .optional(),
    agent: vine
        .object({
        name: vine.string().trim(),
        email: vine.string().trim().email().optional(),
        occupation: vine.string().trim().nullable(),
        whatsapp: vine.string().trim().nullable(),
    })
        .optional(),
}));
//# sourceMappingURL=customer.js.map