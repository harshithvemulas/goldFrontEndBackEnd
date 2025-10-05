import env from '#start/env';
import { BaseMail } from '@adonisjs/mail';
export default class VerifyEmailNotification extends BaseMail {
    from = env.get('SMTP_USERNAME');
    subject = 'Verify Your Email';
    user;
    token;
    logo;
    frontendUrl = '';
    branding;
    constructor(user, token, branding) {
        super();
        this.user = user;
        this.token = token;
        this.logo = env.get('HOST_URL') + '/uploads/' + branding?.logo;
        this.frontendUrl = branding?.siteUrl;
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
    <p>Please click the link below to verify your email address:</p>
    <p>Thanks.</p>`,
            action: true,
            actionText: 'Verify Now',
            actionUrl: this.frontendUrl + '/register/email-verification-status?token=' + this.token,
        });
    }
}
//# sourceMappingURL=verify_email_notification.js.map