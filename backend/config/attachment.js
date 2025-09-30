import { defineConfig } from '@jrmc/adonis-attachment';
const attachmentConfig = defineConfig({
    converters: {
        thumbnail: {
            converter: () => import('@jrmc/adonis-attachment/converters/image_converter'),
            options: {
                resize: 300,
            },
        },
    },
});
export default attachmentConfig;
//# sourceMappingURL=attachment.js.map