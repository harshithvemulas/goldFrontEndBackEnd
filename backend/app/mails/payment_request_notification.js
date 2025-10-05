import env from '#start/env';
import { BaseMail } from '@adonisjs/mail';
export default class PaymentRequestNotification extends BaseMail {
    from = env.get('SMTP_USERNAME');
    to = '';
    subject = 'Payment Request';
    merchant;
    logo;
    data;
    branding;
    constructor(merchant, data, to, branding) {
        super();
        this.merchant = merchant;
        this.data = data;
        this.to = to;
        this.logo = env.get('HOST_URL') + '/uploads/' + branding?.logo;
        this.branding = branding;
    }
    prepare() {
        this.message.to(this.to);
        this.message.from(this.from, this.branding?.siteName);
        this.message.subject(this.subject);
        this.message.htmlView('emails/generic_email', {
            logo: this.logo,
            title: this.subject,
            siteName: this.branding?.siteName,
            body: `<p>Hello ${this?.data?.customerName},</p>
    <br>
    <p><b>${this?.merchant?.name}</b> request a payment from you. Click the below "Pay Now" button to complete the payment. Payment details: </p>
    <p>- Amount: <b>${this.data?.amount}<b></p>
    <p>- Currency: <b>${this.data?.currencyCode}<b></p>
    <br>`,
            action: true,
            actionText: 'Pay Now',
            actionUrl: this?.data?.link,
        });
    }
}
//# sourceMappingURL=payment_request_notification.js.map