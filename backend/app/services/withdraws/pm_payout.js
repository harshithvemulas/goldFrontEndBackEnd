import notification_service from '#services/notification_service';
import env from '#start/env';
import axios from 'axios';
import { parse } from 'node-html-parser';
class PMPayout {
    accountID;
    passPhrase;
    accountCode;
    constructor(method) {
        this.accountID = method.apiKey;
        this.passPhrase = method.secretKey;
        this.accountCode = method.ex1;
    }
    async creditPM(withdraw) {
        try {
            const metaData = JSON.parse(withdraw?.metaData.toString());
            const data = {
                AccountID: this.accountID,
                PassPhrase: this.passPhrase,
                Payer_Account: this.accountCode,
                Payee_Account: metaData.extWallet,
                Amount: withdraw.total,
                Memo: `AWDPay Withdraw #${withdraw.id}`,
                PAYMENT_ID: withdraw.id,
            };
            const url = env.get('NODE_ENV') === 'production'
                ? `https://perfectmoney.com/acct/confirm.asp`
                : `https://perfectmoney.com/acct/verify.asp`;
            const { data: response } = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const root = parse(response);
            const error = root.querySelector("[name='ERROR']");
            if (error) {
                throw new Error(error.getAttribute('value'));
            }
            withdraw.status = 'completed';
            await withdraw.save();
            await notification_service.sendWithdrawCompletedNotification(withdraw);
            return 'success';
        }
        catch (error) {
            throw new Error(error?.response?.data?.message);
        }
    }
}
export default PMPayout;
//# sourceMappingURL=pm_payout.js.map