import notificationErrorHandler from '#exceptions/notification_error_handler';
import Notification from '#models/notification';
import Transaction from '#models/transaction';
import User from '#models/user';
import transmit from '@adonisjs/transmit/services/main';
import Roles from '../enum/roles.js';
class NotificationService {
    constructor() { }
    async newDeviceLoginNotification(userId) {
        try {
            const notification = await Notification.create({
                userId: userId,
                title: 'New Device Login',
                body: 'A new device has been logged into your account',
                type: 'new_device_login',
                navigate: 'settings/login-sessions',
            });
            transmit.broadcast(`users/${userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'newDeviceLoginNotification Error');
        }
    }
    async sendDepositRequestNotification(transactionId) {
        try {
            const transaction = await Transaction.query().where('id', transactionId).firstOrFail();
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const toData = JSON.parse(transaction?.to?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'New Deposit Request',
                body: `You have got a deposit request of ${transaction.amount} ${metaData.currency} from ${toData.label}`,
                type: 'deposit_request',
                navigate: 'deposit-request?status=pending',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendDepositCompletedNotification Error');
        }
    }
    async sendWithdrawRequestNotification(transactionId) {
        try {
            const transaction = await Transaction.query().where('id', transactionId).firstOrFail();
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const toData = JSON.parse(transaction?.to?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'New Withdraw Request',
                body: `You have got a withdraw request of ${transaction.amount} ${metaData.currency} from ${toData.label}`,
                type: 'withdraw_request',
                navigate: 'withdraw-request?status=pending',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendWithdrawRequestNotification Error');
        }
    }
    async sendDepositCompletedNotification(transaction) {
        try {
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Deposit Completed',
                body: `Your deposit of ${transaction.amount} ${metaData.currency} has been completed successfully`,
                type: 'deposit_completed',
                navigate: 'transaction-history?type=deposit',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendDepositCompletedNotification Error');
        }
    }
    async sendDepositFailedNotification(transaction) {
        try {
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Deposit Failed',
                body: `Your deposit of ${transaction.amount} ${metaData.currency} failed`,
                type: 'deposit_failed',
                navigate: 'transaction-history?type=deposit',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendDepositFailedNotification Error');
        }
    }
    async sendWithdrawCompletedNotification(transaction) {
        try {
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Withdraw Completed',
                body: `Your withdraw of ${transaction.amount} ${metaData.currency} has been completed successfully`,
                type: 'withdraw_completed',
                navigate: 'transaction-history?type=withdraw',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendWithdrawCompletedNotification Error');
        }
    }
    async sendWithdrawFailedNotification(transaction) {
        try {
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Withdraw Failed',
                body: `Your withdraw of ${transaction.amount} ${metaData.currency} failed`,
                type: 'withdraw_failed',
                navigate: 'transaction-history?type=withdraw',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendWithdrawFailedNotification Error');
        }
    }
    async sendKycAcceptedNotification(userId) {
        try {
            const notification = await Notification.create({
                userId: userId,
                title: 'Kyc Accepted',
                body: 'Your submitted kyc documents has been accepted successfully',
                type: 'kyc_completed',
                navigate: 'settings/kyc-verification-settings',
            });
            transmit.broadcast(`users/${userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendKycAcceptedNotification Error');
        }
    }
    async sendKycDeclinedNotification(userId) {
        try {
            const notification = await Notification.create({
                userId: userId,
                title: 'Kyc Declined',
                body: 'Your submitted kyc documents has been declined',
                type: 'kyc_failed',
                navigate: 'settings/kyc-verification-settings',
            });
            transmit.broadcast(`users/${userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendKycDeclinedNotification Error');
        }
    }
    async sendTransferReceivedNotification(transactionId) {
        try {
            const transaction = await Transaction.query().where('id', transactionId).firstOrFail();
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const fromData = JSON.parse(transaction?.from?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Received Money',
                body: `You have received ${transaction.amount} ${metaData.currency} from ${fromData.label}`,
                type: 'transfer_completed',
                navigate: 'transaction-history?type=transfer',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendTransferReceivedNotification Error');
        }
    }
    async sendPaymentReceivedNotification(transactionId) {
        try {
            const transaction = await Transaction.query().where('id', transactionId).firstOrFail();
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const fromData = JSON.parse(transaction?.from?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Received Payment',
                body: `You have received a payment of ${transaction.amount} ${metaData.currency} from ${fromData.label}`,
                type: 'payment_completed',
                navigate: 'transaction-history?type=payment',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendPaymentReceivedNotification Error');
        }
    }
    async sendExchangeAcceptedNotification(transaction) {
        try {
            const fromData = JSON.parse(transaction?.from?.toString());
            const toData = JSON.parse(transaction?.to?.toString());
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Exchange Approved',
                body: `Your exchange request from ${metaData.amountFrom} ${fromData.currency} to ${transaction.total} ${toData.currency} has been approved successfully`,
                type: 'exchange_completed',
                navigate: 'transaction-history?type=exchange',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendExchangeAcceptedNotification Error');
        }
    }
    async sendExchangeDelinedNotification(transaction) {
        try {
            const fromData = JSON.parse(transaction?.from?.toString());
            const toData = JSON.parse(transaction?.to?.toString());
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Exchange Declined',
                body: `Your exchange request from ${metaData.amountFrom} ${fromData.currency} to ${transaction.total} ${toData.currency} has been declined`,
                type: 'exchange_failed',
                navigate: 'transaction-history?type=exchange',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendExchangeDelinedNotification Error');
        }
    }
    async sendSuspensionNotification(userId) {
        try {
            const notification = await Notification.create({
                userId: userId,
                title: 'Account Suspended',
                body: 'Your account has been suspended. Please contact with support',
                type: 'account_suspended',
                navigate: 'settings',
            });
            transmit.broadcast(`users/${userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendSuspensionNotification Error');
        }
    }
    async sendSuspensionRemovedNotification(userId) {
        try {
            const notification = await Notification.create({
                userId: userId,
                title: 'Suspension Removed',
                body: 'Your account suspension has been removed',
                type: 'removed_suspension',
                navigate: 'settings',
            });
            transmit.broadcast(`users/${userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendSuspensionRemovedNotification Error');
        }
    }
    async sendTransactionWarningNotification(transactionId) {
        try {
            const transaction = await Transaction.query().where('id', transactionId).firstOrFail();
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                const notification = await Notification.create({
                    userId: admin.id,
                    title: '⚠️ Transaction Warning',
                    body: `User #${transaction.userId} has made ${transaction.type} transaction of ${transaction.type === 'exchange' ? `${metaData.amountFrom} ${metaData.currencyFrom}` : `${transaction.amount} ${metaData.currency}`}`,
                    type: 'transaction_warning',
                    navigate: this.getAdminNavigation(transaction.type, transaction.id),
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendTransactionWarningNotification Error');
        }
    }
    async sendExchangeRequestNotification(transactionId) {
        try {
            const transaction = await Transaction.query().where('id', transactionId).firstOrFail();
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                const notification = await Notification.create({
                    userId: admin.id,
                    title: 'Exchange Request',
                    body: `User #${transaction.userId} has made an exchange request of ${metaData.amountFrom} ${metaData.currencyFrom}`,
                    type: 'exchange_request',
                    navigate: `exchanges/${transaction.id}`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendExchangeRequestNotification Error');
        }
    }
    async sendNewRegistraionNotification(user) {
        try {
            await user.load('merchant');
            await user.load('agent');
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                const notification = await Notification.create({
                    userId: admin.id,
                    title: 'New Registration',
                    body: `A new user has create ${user.roleId === 2 ? 'a customer' : user.roleId === 3 ? 'a merchant' : 'an agent'} account. User id #${user.id}`,
                    type: 'new_registration',
                    navigate: user.roleId === 2
                        ? `customers/${user.customer.id}?name=${user.customer.name}`
                        : user.roleId === 3
                            ? `merchants/${user.roleId}/${user.merchant.id}?name=${user.merchant.name}`
                            : `agents/${user.roleId}/${user.agent.id}?name=${user.agent.name}`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendNewRegistraionNotification Error');
        }
    }
    async sendKycSubmitNotification(user) {
        try {
            await user.load('customer');
            await user.load('merchant');
            await user.load('agent');
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                const notification = await Notification.create({
                    userId: admin.id,
                    title: 'New Kyc Submitted',
                    body: `User #${user.id} has submitted the kyc documents.`,
                    type: 'kyc_submission',
                    navigate: user.roleId === 2
                        ? `customers/${user.customer.id}/kyc?name=${user.customer.name}`
                        : user.roleId === 3
                            ? `merchants/${user.roleId}/${user.merchant.id}/kyc?name=${user.merchant.name}`
                            : `agents/${user.roleId}/${user.agent.id}/kyc?name=${user.agent.name}`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendKycSubmitNotification Error');
        }
    }
    async sendAddBalanceNotification(user, amount, currency, adminId) {
        try {
            await user.load('merchant');
            await user.load('agent');
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                if (admin.id === adminId)
                    return;
                const notification = await Notification.create({
                    userId: admin.id,
                    title: 'Balance Added',
                    body: `Admin id #${adminId} has made a deposit of ${amount} ${currency} to user #${user.id}`,
                    type: 'add_balance',
                    navigate: user.roleId === 2
                        ? `customers/${user.customer.id}?name=${user.customer.name}`
                        : user.roleId === 3
                            ? `merchants/${user.roleId}/${user.merchant.id}?name=${user.merchant.name}`
                            : `agents/${user.roleId}/${user.agent.id}?name=${user.agent.name}`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendAddBalanceNotification Error');
        }
    }
    async sendRemoveBalanceNotification(user, amount, currency, adminId) {
        try {
            await user.load('merchant');
            await user.load('agent');
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                if (admin.id === adminId)
                    return;
                const notification = await Notification.create({
                    userId: admin.id,
                    title: 'Balance Removed',
                    body: `Admin id #${adminId} has made a withdraw of ${amount} ${currency} from user #${user.id}`,
                    type: 'remove_balance',
                    navigate: user.roleId === 2
                        ? `customers/${user.customer.id}?name=${user.customer.name}`
                        : user.roleId === 3
                            ? `merchants/${user.roleId}/${user.merchant.id}?name=${user.merchant.name}`
                            : `agents/${user.roleId}/${user.agent.id}?name=${user.agent.name}`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendRemoveBalanceNotification Error');
        }
    }
    async sendAgentMerchantWithdrawNotification(user, amount, currency, transactionId) {
        try {
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                if (user.roleId === Roles.CUSTOMER) {
                    return;
                }
                const notification = await Notification.create({
                    userId: admin.id,
                    title: 'New Withdraw Request',
                    body: `${user.roleId === 3 ? `Merchant #${user.merchant.merchantId}` : `Agent #${user.agent.agentId}`} has made a withdraw request of ${amount} ${currency}`,
                    type: 'withdraw_request',
                    navigate: `withdraws/${transactionId}`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendAgentMerchantWithdrawNotification Error');
        }
    }
    async sendUserDeleteNotification(user, adminId) {
        try {
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                if (admin.id === adminId)
                    return;
                const notification = await Notification.create({
                    userId: admin.id,
                    title: 'User Deleted',
                    body: `Admin #${adminId} has deleted User #${user.id}`,
                    type: 'user_deleted',
                    navigate: user.roleId === 2 ? `customers` : user.roleId === 3 ? `merchants` : `agents`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendUserDeleteNotification Error');
        }
    }
    async sendUserStatusUpdateNotification(user, status, adminId) {
        try {
            await user.load('customer');
            await user.load('merchant');
            await user.load('agent');
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                if (admin.id === adminId)
                    return;
                const notification = await Notification.create({
                    userId: admin.id,
                    title: `User ${status}`,
                    body: `Admin #${adminId} has ${status} User #${user.id}`,
                    type: 'user_status_update',
                    navigate: user.roleId === 2
                        ? `customers/${user.customer.id}?name=${user.customer.name}`
                        : user.roleId === 3
                            ? `merchants/${user.roleId}/${user.merchant.id}?name=${user.merchant.name}`
                            : `agents/${user.roleId}/${user.agent.id}?name=${user.agent.name}`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendUserStatusUpdateNotification Error');
        }
    }
    async sendAgentMerchantSuspensionNotification(user, status, adminId) {
        try {
            await user.load('customer');
            await user.load('merchant');
            await user.load('agent');
            const admins = await User.query().where('roleId', 1);
            admins.forEach(async (admin) => {
                if (admin.id === adminId)
                    return;
                const notification = await Notification.create({
                    userId: admin.id,
                    title: `${status}`,
                    body: `Admin #${adminId} has ${status.toLowerCase()} #${user.roleId === 2 ? user?.merchant?.merchantId : user?.agent?.agentId}`,
                    type: 'suspension_status_update',
                    navigate: user.roleId === 3
                        ? `merchants/${user.roleId}/${user.merchant.id}?name=${user.merchant.name}`
                        : `agents/${user.roleId}/${user.agent.id}?name=${user.agent.name}`,
                });
                transmit.broadcast(`users/${admin.id}`, notification.serialize());
            });
        }
        catch (err) {
            notificationErrorHandler(err, 'sendAgentMerchantSuspensionNotification Error');
        }
    }
    async sendReferralBonusReceivedNotification(transactionId) {
        try {
            const transaction = await Transaction.query().where('id', transactionId).firstOrFail();
            const metaData = JSON.parse(transaction?.metaData?.toString());
            const notification = await Notification.create({
                userId: transaction.userId,
                title: 'Referral Bonus Received',
                body: `You have received a referral bonus of ${transaction.amount} ${metaData.currency}`,
                type: 'referral_bonus',
                navigate: 'transaction-history?type=referral_bonus',
            });
            transmit.broadcast(`users/${transaction.userId}`, notification.serialize());
        }
        catch (err) {
            notificationErrorHandler(err, 'sendReferralBonusReceivedNotification Error');
        }
    }
    getAdminNavigation(type, id) {
        switch (type) {
            case 'deposit':
                return `deposits/${id}`;
            case 'withdraw':
                return `withdraws/${id}`;
            case 'transfer':
                return `transfers/${id}`;
            case 'exchange':
                return `exchanges/${id}`;
            case 'payment':
                return `payments/${id}`;
            default:
                return '/';
        }
    }
}
export default new NotificationService();
//# sourceMappingURL=notification_service.js.map