import { BaseSeeder } from '@adonisjs/lucid/seeders';
import User from '#models/user';
import Customer from '#models/customer';
import Merchant from '#models/merchant';
import Agent from '#models/agent';
import Address from '#models/address';
import Wallet from '#models/wallet';
import AgentMethod from '#models/agent_method';
import Permission from '#models/permission';
export default class extends BaseSeeder {
    async run() {
        await User.createMany([
            {
                email: 'admin@test.com',
                password: '12345678',
                status: true,
                isEmailVerified: true,
                acceptTermsCondition: true,
                limitTransfer: false,
                dailyTransferLimit: null,
                roleId: 1,
            },
            {
                email: 'customer@test.com',
                password: '12345678',
                status: true,
                isEmailVerified: true,
                acceptTermsCondition: true,
                limitTransfer: false,
                dailyTransferLimit: 10,
                roleId: 2,
            },
            {
                email: 'merchant@test.com',
                password: '12345678',
                status: true,
                isEmailVerified: true,
                acceptTermsCondition: true,
                limitTransfer: true,
                dailyTransferLimit: 10,
                roleId: 3,
            },
            {
                email: 'agent@test.com',
                password: '12345678',
                status: true,
                isEmailVerified: true,
                acceptTermsCondition: true,
                limitTransfer: false,
                dailyTransferLimit: null,
                roleId: 4,
            },
        ]);
        await Permission.createMany([{ userId: 1 }, { userId: 2 }, { userId: 3 }, { userId: 4 }]);
        await Wallet.createMany([
            {
                balance: 5000,
                default: true,
                currencyId: 1,
                userId: 1,
                dailyTransferAmount: 1500000,
            },
            {
                balance: 5000,
                default: true,
                currencyId: 1,
                userId: 2,
                dailyTransferAmount: 1500000,
            },
            {
                balance: 5000,
                default: true,
                currencyId: 1,
                userId: 3,
                dailyTransferAmount: 1500000,
            },
            {
                balance: 5000,
                default: true,
                currencyId: 1,
                userId: 4,
                dailyTransferAmount: 1500000,
            },
        ]);
        await Address.createMany([
            {
                type: 'mailing',
                addressLine: 'Some address 1',
                zipCode: '2000',
                countryCode: 'BD',
                city: 'Dhaka',
            },
            {
                type: 'mailing',
                addressLine: 'Some address 2',
                zipCode: '2000',
                countryCode: 'CI',
                city: 'Dhaka',
            },
            {
                type: 'mailing',
                addressLine: 'Some address 3',
                zipCode: '2000',
                countryCode: 'CI',
                city: 'Dhaka',
            },
            {
                type: 'mailing',
                addressLine: 'Some address 4',
                zipCode: '2000',
                countryCode: 'CI',
                city: 'Dhaka',
            },
            {
                type: 'mailing',
                addressLine: 'Some address 5',
                zipCode: '2000',
                countryCode: 'CI',
                city: 'Dhaka',
            },
            {
                type: 'mailing',
                addressLine: 'Some address 6',
                zipCode: '2000',
                countryCode: 'CI',
                city: 'Dhaka',
            },
        ]);
        await Customer.createMany([
            {
                firstName: 'Test',
                lastName: 'Admin',
                phone: '88017000000001',
                gender: 'male',
                dob: new Date('2000-01-01'),
                userId: 1,
                addressId: 1,
            },
            {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '88017000000002',
                gender: 'male',
                dob: new Date('1999-01-01'),
                userId: 2,
                addressId: 2,
            },
            {
                firstName: 'Test',
                lastName: 'Merchant',
                phone: '88017000000003',
                gender: 'male',
                dob: new Date('1998-01-01'),
                userId: 3,
                addressId: 3,
            },
            {
                firstName: 'Test',
                lastName: 'Agent',
                phone: '88017000000004',
                gender: 'male',
                dob: new Date('1997-01-01'),
                userId: 4,
                addressId: 4,
            },
        ]);
        await Merchant.create({
            name: 'Demo Merchant',
            email: 'test@merchant.com',
            status: 'verified',
            proof: 'some proof',
            userId: 3,
            addressId: 5,
        });
        await Agent.create({
            name: 'Demo Agent',
            email: 'test@agent.com',
            occupation: 'Businessman',
            status: 'verified',
            proof: 'some proof',
            userId: 4,
            addressId: 6,
        });
        await AgentMethod.create({
            agentId: 1,
            name: 'hand to hand',
            value: '',
            countryCode: 'CI',
            currencyCode: 'XOF',
        });
    }
}
//# sourceMappingURL=user_seeder.js.map