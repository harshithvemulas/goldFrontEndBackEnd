import brandingService from '#services/branding_service';
import axios from 'axios';
class Paydunya {
    baseUrl;
    storeName = '';
    masterKey;
    privateKey;
    token;
    isTest;
    constructor(gateway) {
        this.masterKey = gateway.ex1;
        this.privateKey = gateway.secretKey;
        this.token = gateway.ex2;
        this.isTest = !(gateway?.secretKey).includes('live');
        this.baseUrl = !this.isTest
            ? 'https://app.paydunya.com/api/v1'
            : 'https://app.paydunya.com/sandbox-api/v1';
    }
    async generateInvoice(deposit, trxSecret, urls) {
        try {
            const branding = await brandingService();
            this.storeName = branding.siteName;
            const data = {
                invoice: {
                    total_amount: deposit.amount,
                    description: `Deposit #${deposit.trxId}`,
                },
                store: { name: this.storeName },
                custom_data: { paymentSecret: trxSecret },
                actions: {
                    cancel_url: urls.failed,
                    return_url: urls.success,
                    callback_url: `${urls.apiUrl}/webhooks/paydunya`,
                },
            };
            const headers = {
                'Content-Type': 'application/json',
                'PAYDUNYA-MASTER-KEY': this.masterKey,
                'PAYDUNYA-PRIVATE-KEY': this.privateKey,
                'PAYDUNYA-TOKEN': this.token,
            };
            const { data: generateInvoice } = await axios.post(`${this.baseUrl}/checkout-invoice/create`, data, {
                headers,
            });
            if (generateInvoice?.response_code !== '00') {
                throw new Error(generateInvoice?.response_text);
            }
            return {
                token: generateInvoice?.token,
                trxSecret: trxSecret,
                redirect: generateInvoice?.response_text,
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
export default Paydunya;
//# sourceMappingURL=paydunya.js.map