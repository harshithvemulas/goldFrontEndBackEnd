import env from '#start/env';
import { BaseMail } from '@adonisjs/mail';
export default class SendPaymentOtpNotification extends BaseMail {
    from = env.get('SMTP_USERNAME');
    subject = 'Your OTP Code For Payment';
    user;
    otp;
    logo;
    amount;
    currency;
    branding;
    constructor(user, otp, amount, currency, branding) {
        super();
        this.user = user;
        this.otp = otp;
        this.logo = env.get('HOST_URL') + '/uploads/' + branding.logo;
        this.branding = branding;
        this.amount = amount;
        this.currency = currency;
    }
    prepare() {
        this.message.to(this.user.email);
        this.message.from(this.from, this.branding.siteName);
        this.message.subject(this.subject);
        this.message.htmlView('emails/generic_email', {
            logo: this.logo,
            title: this.subject,
            body: `Hello, <br/>Your OTP code is <b>${this.otp}</b> for paying ${this.amount} ${this.currency}.<br/>Thanks.`,
            action: false,
            actionText: '',
            actionUrl: '',
        });
    }
}
//# sourceMappingURL=send_payment_otp_notification.js.map