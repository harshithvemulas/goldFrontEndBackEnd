const HealthChecksController = () => import('#controllers/health_checks_controller');
import router from '@adonisjs/core/services/router';
import transmit from '@adonisjs/transmit/services/main';
import '../app/routes/auth_route.js';
import '../app/routes/translations_route.js';
import '../app/routes/currencies_route.js';
import '../app/routes/wallets_route.js';
import '../app/routes/customer_route.js';
import '../app/routes/kyc_route.js';
import '../app/routes/merchant_route.js';
import '../app/routes/agent_route.js';
import '../app/routes/contacts_route.js';
import '../app/routes/exchange_route.js';
import '../app/routes/transfer_route.js';
import '../app/routes/deposit_route.js';
import '../app/routes/withdraw_route.js';
import '../app/routes/callbacks_route.js';
import '../app/routes/saves_route.js';
import '../app/routes/payment_route.js';
import '../app/routes/transaction_route.js';
import '../app/routes/setting_route.js';
import '../app/routes/services_route.js';
import '../app/routes/agent_method_route.js';
import '../app/routes/deposit_request_route.js';
import '../app/routes/withdraw_request_route.js';
import '../app/routes/user_route.js';
import '../app/routes/gateway_route.js';
import '../app/routes/method_route.js';
import '../app/routes/login_session_route.js';
import '../app/routes/disbursement_route.js';
import '../app/routes/commission_route.js';
import '../app/routes/notification_route.js';
import '../app/routes/api_route.js';
import '../app/routes/investment_plan_route.js';
import '../app/routes/investment_route.js';
import '../app/routes/card_route.js';
import '../app/routes/external_plugin_route.js';
import { middleware } from './kernel.js';
transmit.registerRoutes((route) => {
    if (route.getPattern() === '__transmit/events') {
        route.middleware(middleware.auth());
        return;
    }
});
router.get('/', [HealthChecksController]);
//# sourceMappingURL=routes.js.map