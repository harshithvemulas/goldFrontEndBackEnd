import env from '#start/env';
import { BaseMail } from '@adonisjs/mail';
export default class SendOtpNotification extends BaseMail {
    from = env.get('SMTP_USERNAME');
    subject = 'Your OTP Code';
    user;
    otp;
    logo;
    branding;
    constructor(user, otp, branding) {
        super();
        this.user = user;
        this.otp = otp;
        this.logo = env.get('HOST_URL') + '/uploads/' + branding.logo;
        this.branding = branding;
    }
    prepare() {
        this.message.to(this.user.email);
        this.message.from(this.from, this.branding.siteName);
        this.message.subject(this.subject);
        this.message.htmlView('emails/generic_email', {
            logo: this.logo,
            title: this.subject,
            siteName: this.branding?.siteName,
            body: `Hello, <br/>Your OTP code is <b>${this.otp}</b>.<br/>Thanks.`,
            action: false,
            actionText: '',
            actionUrl: '',
        });
    }
}
//# sourceMappingURL=send_otp_notification.js.map