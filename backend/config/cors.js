import { defineConfig } from '@adonisjs/cors';
const corsConfig = defineConfig({
    enabled: true,
    origin: [
        'https://goldpe.app',
        'https://www.goldpe.app',
    ],    
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: true,
    exposeHeaders: [
        'cache-control',
        'content-language',
        'content-type',
        'expires',
        'last-modified',
        'pragma',
    ],
    credentials: true,
    maxAge: 90,
});
export default corsConfig;
//# sourceMappingURL=cors.js.map