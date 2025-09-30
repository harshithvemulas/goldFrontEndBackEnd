import vine from '@vinejs/vine';
export const createUpdateSchema = vine.compile(vine.object({
    documentType: vine.enum(['nid', 'passport', 'driving']),
    front: vine.file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
    }),
    back: vine
        .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })
        .nullable(),
    selfie: vine.file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp'],
    }),
}));
//# sourceMappingURL=kyc.js.map