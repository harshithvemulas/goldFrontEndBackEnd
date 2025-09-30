import env from '#start/env';
import app from '@adonisjs/core/services/app';
import { defineConfig, services } from '@adonisjs/drive';
const driveConfig = defineConfig({
    default: env.get('DRIVE_DISK'),
    services: {
        fs: services.fs({
            location: app.makePath('storage'),
            serveFiles: true,
            routeBasePath: '/**',
            visibility: 'public',
        }),
    },
});
export default driveConfig;
//# sourceMappingURL=drive.js.map