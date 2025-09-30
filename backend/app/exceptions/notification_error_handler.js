import logger from '@adonisjs/core/services/logger';
export default function notificationErrorHandler(error, log = 'Controller Error') {
    logger.error(log + ': %j', error);
    return {
        success: false,
        message: error.message || 'An unexpected error occurred',
    };
}
//# sourceMappingURL=notification_error_handler.js.map