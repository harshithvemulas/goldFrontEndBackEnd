import brandingService from '#services/branding_service';
class PerfectMoney {
    usdWallet;
    eurWallet;
    constructor(gateway) {
        this.usdWallet = gateway?.ex1;
        this.eurWallet = gateway?.ex2;
    }
    async createPayment(deposit, trxSecret, urls) {
        try {
            const branding = await brandingService();
            const paymentData = {
                PAYEE_ACCOUNT: deposit.metaData.currency === 'USD' ? this.usdWallet : this.eurWallet,
                PAYEE_NAME: branding.siteName,
                PAYMENT_AMOUNT: deposit.amount,
                PAYMENT_UNITS: deposit.metaData.currency,
                PAYMENT_ID: trxSecret,
                PAYMENT_URL: urls.success,
                NOPAYMENT_URL: urls.failed,
                STATUS_URL: `${branding.apiUrl}/webhooks/perfectmoney`,
            };
            return paymentData;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
export default PerfectMoney;
//# sourceMappingURL=perfectmoney.js.map