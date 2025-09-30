import Investment from '#models/investment';
import { DateTime } from 'luxon';
import { addBalance } from './wallet_service.js';
import User from '#models/user';
const investmentService = async (type) => {
    try {
        const activeInvestments = await Investment.query()
            .where('status', 'active')
            .andWhere('durationType', type);
        activeInvestments.forEach(async (investment) => {
            if (investment.endsAt <= DateTime.now()) {
                await addBalance(investment.amountInvested + investment.profit, investment.currency, investment.userId);
                investment.status = 'completed';
                investment.save();
                const user = await User.query().where('id', investment.userId).preload('customer').first();
                await user?.related('transactions').create({
                    type: 'investment',
                    from: { label: 'Investment' },
                    to: { label: user?.customer.name, email: user?.email },
                    amount: investment.amountInvested + investment.profit,
                    total: investment.amountInvested + investment.profit,
                    status: 'completed',
                    fee: 0,
                    metaData: { currency: investment.currency },
                    userId: investment.userId,
                });
            }
            else {
                investment.profit += investment.amountInvested * (investment.interestRate / 100);
                investment.save();
            }
        });
    }
    catch (error) {
        throw new Error(error);
    }
};
export default investmentService;
//# sourceMappingURL=investment_service.js.map