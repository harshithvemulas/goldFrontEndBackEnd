import PDFDocument from 'pdfkit';
import Transaction from '#models/transaction';
import { promisify } from 'node:util';
import brandingService from './branding_service.js';
class ReceiptPDFGenerator {
    transactionId;
    user;
    doc;
    buffers;
    constructor(transactionId, user) {
        this.transactionId = transactionId;
        this.user = user;
        this.doc = new PDFDocument({ margin: 50 });
        this.buffers = [];
        this.doc.on('data', this.buffers.push.bind(this.buffers));
        this.doc.on('end', () => this.buffers);
    }
    generateHeader() {
        this.doc.fontSize(20).text('RECEIPT', { align: 'center' }).stroke().moveDown(2);
    }
    generateUserInfo() {
        const tableTop = 100;
        const column1 = 50;
        const column2 = 250;
        const tableWidth = 500;
        const rowHeight = 25;
        this.doc.fontSize(14).text('User Information', column1, tableTop - 20);
        const userInfoData = [
            { label: 'Name', value: this.user.customer.name },
            { label: 'Phone Number', value: this.user.customer.phone || 'N/A' },
        ];
        userInfoData.forEach((item, index) => {
            const rowY = tableTop + index * rowHeight;
            this.doc.rect(column1, rowY, tableWidth, rowHeight).stroke();
            this.doc
                .moveTo(column2, rowY)
                .lineTo(column2, rowY + rowHeight)
                .stroke();
            this.doc.text(`${item.label}:`, column1 + 10, rowY + 5);
            this.doc.text(`${item.value}`, column2 + 10, rowY + 5);
        });
    }
    generatePaymentInfo(transaction) {
        const tableTop = 100;
        const column1 = 50;
        const column2 = 250;
        const tableWidth = 500;
        const rowHeight = 25;
        const paymentTableTop = tableTop + 50 + 30;
        this.doc.fontSize(14).text('Transaction Information', column1, paymentTableTop - 20);
        const paymentInfoData = this.getTableData(transaction);
        paymentInfoData.forEach((item, index) => {
            const rowY = paymentTableTop + index * rowHeight;
            this.doc.rect(column1, rowY, tableWidth, rowHeight).stroke();
            this.doc
                .moveTo(column2, rowY)
                .lineTo(column2, rowY + rowHeight)
                .stroke();
            this.doc.text(`${item.label}:`, column1 + 10, rowY + 5);
            this.doc.text(`${item.value}`, column2 + 10, rowY + 5);
        });
    }
    async generateLogo() {
        const tableTop = 100;
        const column1 = 50;
        const tableWidth = 500;
        const paymentInfoLength = 7;
        const rowHeight = 25;
        const branding = await brandingService();
        const logoPositionTop = tableTop + paymentInfoLength * rowHeight + 140;
        if (branding.logo?.includes('.svg')) {
            return;
        }
        this.doc.image('public/uploads/' + branding.logo, column1 + tableWidth / 2 - 30, logoPositionTop, {
            fit: [80, 80],
        });
    }
    generateFooter() {
        const tableTop = 100;
        const paymentInfoLength = 7;
        const rowHeight = 25;
        const logoHeight = 80;
        const column1 = 50;
        const footerTop = tableTop + paymentInfoLength * rowHeight + logoHeight + 85;
        this.doc
            .fontSize(12)
            .text('This receipt has been generated electronically.', column1, footerTop, {
            align: 'center',
        });
    }
    getTableData(transaction) {
        const metaData = JSON.parse(transaction.metaData);
        const from = JSON.parse(transaction.from);
        const to = JSON.parse(transaction.to);
        switch (transaction.type) {
            case 'deposit':
            case 'withdraw':
            case 'direct_deposit':
                return [
                    { label: 'Transaction Type', value: transaction.type },
                    { label: 'Transaction ID', value: transaction.trxId },
                    { label: 'Date', value: transaction.createdAt.toFormat('dd/MM/yyyy') },
                    { label: 'Status', value: transaction.status },
                    { label: 'Gateway/Methods', value: transaction.method || 'N/A' },
                    { label: 'Amount', value: `${transaction.amount} ${metaData.currency}` },
                    { label: 'Fee', value: `${transaction.fee} ${metaData.currency}` },
                    {
                        label: transaction.type === 'direct_deposit' ? 'User get' : 'You Get',
                        value: `${transaction.total} ${metaData.currency}`,
                    },
                ];
            case 'transfer':
            case 'payment':
                return [
                    { label: 'Transaction Type', value: transaction.type },
                    { label: 'Transaction ID', value: transaction.trxId },
                    { label: 'Date', value: transaction.createdAt.toFormat('dd/MM/yyyy') },
                    { label: 'Status', value: transaction.status },
                    {
                        label: transaction.type === 'transfer' ? 'Recipient' : 'Merchant',
                        value: to.label || 'N/A',
                    },
                    { label: 'Amount', value: `${transaction.amount} ${metaData.currency}` },
                    { label: 'Fee', value: `${transaction.fee} ${metaData.currency}` },
                    { label: 'After Processing', value: `${transaction.total} ${metaData.currency}` },
                ];
            case 'exchange':
                return [
                    { label: 'Transaction Type', value: transaction.type },
                    { label: 'Transaction ID', value: transaction.trxId },
                    { label: 'Date', value: transaction.createdAt.toFormat('dd/MM/yyyy') },
                    { label: 'Status', value: transaction.status },
                    { label: 'Exchange Rate', value: metaData.exchangeRate },
                    { label: 'Amount From', value: `${transaction.amount} ${from.currency}` },
                    { label: 'Fee', value: `${transaction.fee} ${metaData.currency}` },
                    { label: 'User get', value: `${transaction.total} ${metaData.currency}` },
                ];
            case 'services':
                return [
                    { label: 'Transaction Type', value: transaction.type + ` (${metaData.type || ''})` },
                    { label: 'Transaction ID', value: transaction.trxId },
                    { label: 'Date', value: transaction.createdAt.toFormat('dd/MM/yyyy') },
                    { label: 'Status', value: transaction.status },
                    metaData.type === 'electricity'
                        ? { label: 'Meter Number', value: to.label + ` (${metaData.serviceType || ''})` }
                        : { label: 'Phone Number', value: to.label },
                    { label: 'Amount', value: `${transaction.amount} ${metaData.currency}` },
                    { label: 'Fee', value: `${transaction.fee} ${metaData.currency}` },
                    { label: 'After Processing', value: `${transaction.total} ${metaData.currency}` },
                ];
            default:
                return [
                    { label: 'Transaction Type', value: transaction.type },
                    { label: 'Transaction ID', value: transaction.trxId },
                    { label: 'Date', value: transaction.createdAt.toFormat('dd/MM/yyyy') },
                    { label: 'Status', value: transaction.status },
                    { label: 'Gateway/Methods', value: transaction.method || 'N/A' },
                    { label: 'Amount', value: `${transaction.amount} ${metaData.currency}` },
                    { label: 'Fee', value: `${transaction.fee} ${metaData.currency}` },
                    { label: 'User Get', value: `${transaction.total} ${metaData.currency}` },
                ];
        }
    }
    async generatePDF() {
        const transaction = await Transaction.findBy({ id: this.transactionId, userId: this.user.id });
        if (!transaction) {
            return Buffer.concat(this.buffers);
        }
        this.generateHeader();
        this.generateUserInfo();
        this.generatePaymentInfo(transaction);
        await this.generateLogo();
        this.generateFooter();
        this.doc.end();
        return promisify(this.doc.on.bind(this.doc))('end').then(() => Buffer.concat(this.buffers));
    }
}
export default ReceiptPDFGenerator;
//# sourceMappingURL=pdf_service.js.map