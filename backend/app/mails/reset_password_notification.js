import env from '#start/env';
import { BaseMail } from '@adonisjs/mail';
export default class ResetPasswordNotification extends BaseMail {
    from = env.get('SMTP_USERNAME');
    subject = 'Reset Password';
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
    <p>Please click the link below to reset your password:</p>
    <p>Thanks.</p>`,
            action: true,
            actionText: 'Reset Now',
            actionUrl: this.frontendUrl + '/reset-password?token=' + this.token,
        });
    }
}
//# sourceMappingURL=reset_password_notification.js.map