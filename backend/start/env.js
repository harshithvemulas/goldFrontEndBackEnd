import { Env } from '@adonisjs/core/env';
export default await Env.create(new URL('../', import.meta.url), {
    NODE_ENV: Env.schema.enum(['development', 'production', 'test']),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    HOST_URL: Env.schema.string(),
    HOST: Env.schema.string({ format: 'host' }),
    LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
    DB_HOST: Env.schema.string({ format: 'host' }),
    DB_PORT: Env.schema.number(),
    DB_USER: Env.schema.string(),
    DB_PASSWORD: Env.schema.string.optional(),
    DB_DATABASE: Env.schema.string(),
    SESSION_DRIVER: Env.schema.enum(['cookie', 'memory']),
    SMTP_HOST: Env.schema.string(),
    SMTP_PORT: Env.schema.string(),
    SMTP_USERNAME: Env.schema.string(),
    SMTP_PASSWORD: Env.schema.string(),
    DRIVE_DISK: Env.schema.enum(['fs']),
    DEMO_OTP: Env.schema.boolean.optional(),
});
//# sourceMappingURL=env.js.map