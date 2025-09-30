import InvestmentPlan from '#models/investment_plan';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
export default class extends BaseSeeder {
    async run() {
        await InvestmentPlan.createMany([
            {
                name: 'Basic Plan',
                isActive: true,
                isFeatured: true,
                isRange: true,
                minAmount: 10,
                maxAmount: 1000,
                interestRate: 2.5,
                duration: 30,
                durationType: 'daily',
                currency: 'usd',
                withdrawAfterMatured: true,
            },
            {
                name: 'Silver Plan',
                isActive: true,
                isFeatured: true,
                isRange: true,
                minAmount: 1000,
                maxAmount: 5000,
                interestRate: 3.5,
                duration: 30,
                durationType: 'weekly',
                currency: 'usd',
                withdrawAfterMatured: true,
            },
            {
                name: 'Gold Plan',
                isActive: true,
                isFeatured: true,
                isRange: true,
                minAmount: 5000,
                maxAmount: 10000,
                interestRate: 4.5,
                duration: 30,
                durationType: 'daily',
                currency: 'usd',
                withdrawAfterMatured: true,
            },
            {
                name: 'Platinum Plan',
                isActive: true,
                isFeatured: true,
                isRange: false,
                minAmount: 5000,
                interestRate: 4.5,
                duration: 30,
                durationType: 'daily',
                currency: 'usd',
                withdrawAfterMatured: true,
            },
            {
                name: 'Diamond Plan',
                isActive: true,
                isFeatured: true,
                isRange: true,
                minAmount: 50000,
                maxAmount: 100000,
                interestRate: 3.5,
                duration: 30,
                durationType: 'daily',
                currency: 'usd',
                withdrawAfterMatured: true,
            },
        ]);
    }
}
//# sourceMappingURL=investment_plan_seeder.js.map