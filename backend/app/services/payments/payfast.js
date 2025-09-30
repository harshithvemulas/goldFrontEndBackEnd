import DepositGateway from '#models/deposit_gateway';
import brandingService from '#services/branding_service';
const payfastPayment = async (deposit) => {
    try {
        const branding = await brandingService();
        const gateway = await DepositGateway.findByOrFail('value', 'payfast');
        return (branding.apiUrl +
            `/payment-gateway/payfast?merchantId=${gateway.apiKey}&merchantKey=${gateway.secretKey}&amount=${deposit.amount}&itemName=${branding.siteName}&trxId=${deposit.trxId}&mode=${gateway.ex1}`);
    }
    catch {
        throw new Error('Error processing payfast');
    }
};
export default payfastPayment;
//# sourceMappingURL=payfast.js.map