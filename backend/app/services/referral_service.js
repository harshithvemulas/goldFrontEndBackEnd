import { addBalance } from './wallet_service.js';
import Setting from '#models/setting';
import notification_service from './notification_service.js';
import mail from '@adonisjs/mail/services/main';
import ReferralBonusNotification from '#mails/referral_bonus_notification';
import brandingService from './branding_service.js';
const createReferralBonus = async (referralUser, amount, currency, referredUserId) => {
    const bonus = await referralUser.related('transactions').create({
        type: 'referral_bonus',
        from: { label: 'system' },
        to: { label: referralUser.customer.name, email: referralUser.email },
        amount,
        fee: 0,
        total: amount,
        metaData: { currency, referredUserId },
        status: 'completed',
    });
    await addBalance(bonus.amount, currency, bonus.userId);
    await notification_service.sendReferralBonusReceivedNotification(bonus.id);
    const branding = await brandingService();
    await mail.sendLater(new ReferralBonusNotification(referralUser, { amount: bonus.amount, currency }, branding));
};
const referralService = async (user, type) => {
    try {
        await user.load('referralUser');
        await user.load('customer');
        if (!user.referredBy || !user.referralUser || user.referralHandled) {
            return;
        }
        const referralSettings = await Setting.query().where('key', 'referral').first();
        if (referralSettings && referralSettings?.value3 !== type)
            return;
        const brandingSettings = await Setting.query().where('key', 'branding').first();
        const referralAmount = Number.parseFloat(referralSettings?.value1 || '0');
        const referralType = referralSettings?.value2 || 'referrer';
        const currency = brandingSettings?.value4 || 'USD';
        if (referralAmount <= 0) {
            return;
        }
        await handleReferralBonus(user, referralAmount, currency, referralType);
        user.referralHandled = true;
        await user.save();
    }
    catch (error) {
        console.error('Referral Service Error:', error);
        throw error;
    }
};
const handleReferralBonus = async (user, amount, currency, referralType) => {
    await user.referralUser.load('customer');
    await createReferralBonus(user.referralUser, amount, currency, user.id);
    if (referralType === 'both') {
        const userBonus = await user.related('transactions').create({
            type: 'referral_bonus',
            from: { label: 'system' },
            to: { label: user.customer.name, email: user.email },
            amount,
            fee: 0,
            total: amount,
            metaData: { currency },
            status: 'completed',
        });
        await addBalance(userBonus.amount, currency, userBonus.userId);
        await notification_service.sendReferralBonusReceivedNotification(userBonus.id);
        const branding = await brandingService();
        await mail.sendLater(new ReferralBonusNotification(user, { amount: userBonus.amount, currency }, branding));
    }
};
export default referralService;
//# sourceMappingURL=referral_service.js.map