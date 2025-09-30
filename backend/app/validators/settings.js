import vine from '@vinejs/vine';
export const brandingUpdateSchema = vine.compile(vine.object({
    siteName: vine.string(),
    siteUrl: vine.string(),
    apiUrl: vine.string(),
    defaultCurrency: vine.string(),
    defaultLanguage: vine.string(),
    referralBonusAmount: vine.string().nullable(),
    referralBonusReceiver: vine.enum(['referrer', 'both']),
    referralApplyOn: vine.enum(['verify_email', 'kyc', 'first_deposit']),
    customerRegistration: vine.boolean(),
    agentRegistration: vine.boolean(),
    merchantRegistration: vine.boolean(),
    logo: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
    })
        .nullable()
        .optional(),
    favicon: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
    })
        .nullable()
        .optional(),
    authBanner: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
    })
        .nullable()
        .optional(),
    cardBg: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
    })
        .nullable()
        .optional(),
}));
//# sourceMappingURL=settings.js.map