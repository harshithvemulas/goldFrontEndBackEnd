import env from '#start/env';
import { BaseMail } from '@adonisjs/mail';
export default class ReferralBonusNotification extends BaseMail {
    from = env.get('SMTP_USERNAME');
    subject = 'Referral bonus received';
    user;
    logo;
    data;
    branding;
    constructor(user, data, branding) {
        super();
        this.user = user;
        this.data = data;
        this.logo = env.get('HOST_URL') + '/uploads/' + branding?.logo;
        this.branding = branding;
    }
    prepare() {
        this.message.to(this.user.email);
        this.message.from(this.from, this.branding?.siteName);
        this.message.subject(this.subject);
        this.message.htmlView('emails/generic_email', {
            logo: this.logo,
            title: this.subject,
            siteName: this.branding?.siteName,
            body: `<h1>Hello ${this.user?.customer?.firstName},</h1>
    <p>You have received a referral bonus: </p>
    <p>- Amount: <b>${this.data?.amount}<b></p>
    <p>- Currency: <b>${this.data?.currencyCode}<b></p>
    <p>Thanks.</p>`,
            action: false,
            actionText: '',
            actionUrl: '',
        });
    }
}
//# sourceMappingURL=referral_bonus_notification.js.map