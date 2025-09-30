import env from '#start/env';
import { BaseMail } from '@adonisjs/mail';
export default class DeviceLoginNotification extends BaseMail {
    from = env.get('SMTP_USERNAME');
    subject = 'New Device Login';
    user;
    logo;
    data;
    branding;
    constructor(user, data, branding) {
        super();
        this.user = user;
        this.data = data;
        this.logo = env.get('HOST_URL') + '/uploads/' + branding.logo;
        this.branding = branding;
    }
    prepare() {
        this.message.to(this.user.email);
        this.message.from(this.from, this.branding?.siteName);
        this.message.subject(this.subject);
        this.message.htmlView('emails/generic_email', {
            logo: this.logo,
            title: this.subject,
            body: `<h1>Hello ${this.user?.customer?.firstName},</h1>
    <br>
    <p>We noticed a login to your account from a new device:</p>
    <p>- Device Name: <b>${this.data?.deviceName}<b></p>
    <p>- IP Address: <b>${this.data?.ipAddress}<b></p>
    <p>- Country: <b>${this.data?.country}<b></p>
    <p>- Time: <b>${this.data?.time}<b></p>
    <br>
    <p>If this wasn't you, we recommend updating your password immediately.</p>`,
            action: false,
            actionText: '',
            actionUrl: '',
        });
    }
}
//# sourceMappingURL=device_login_notification.js.map