var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, belongsTo, hasOne, hasMany, beforeCreate, manyToMany, } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session';
import { generateNanoId } from '../utils/generate_unique_id.js';
import Role from './role.js';
import Customer from './customer.js';
import Merchant from './merchant.js';
import Agent from './agent.js';
import Permission from './permission.js';
import Token from './token.js';
import Address from './address.js';
import Wallet from './wallet.js';
import Kyc from './kyc.js';
import Transaction from './transaction.js';
import Save from './save.js';
import WithdrawMethod from './withdraw_method.js';
import DepositGateway from './deposit_gateway.js';
import LoginSession from './login_session.js';
import { Filterable } from 'adonis-lucid-filter';
import UserFilter from './filters/user_filter.js';
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
});
export default class User extends compose(BaseModel, AuthFinder, Filterable) {
    static $filter = () => UserFilter;
    static rememberMeTokens = DbRememberMeTokensProvider.forModel(User);
    static assingReferralCode(user) {
        user.referralCode = generateNanoId();
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], User.prototype, "roleId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "status", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "kycStatus", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "lastIpAddress", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "lastCountryName", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], User.prototype, "passwordUpdated", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "referralCode", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "referredBy", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "referralHandled", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "otpCode", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "acceptTermsCondition", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "limitTransfer", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "dailyTransferLimit", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], User.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => Role),
    __metadata("design:type", Object)
], User.prototype, "role", void 0);
__decorate([
    belongsTo(() => Address),
    __metadata("design:type", Object)
], User.prototype, "address", void 0);
__decorate([
    hasMany(() => User, { foreignKey: 'referredBy' }),
    __metadata("design:type", Object)
], User.prototype, "referralUsers", void 0);
__decorate([
    belongsTo(() => User, { foreignKey: 'referredBy' }),
    __metadata("design:type", Object)
], User.prototype, "referralUser", void 0);
__decorate([
    hasOne(() => Kyc),
    __metadata("design:type", Object)
], User.prototype, "kyc", void 0);
__decorate([
    hasOne(() => Customer),
    __metadata("design:type", Object)
], User.prototype, "customer", void 0);
__decorate([
    hasOne(() => Merchant),
    __metadata("design:type", Object)
], User.prototype, "merchant", void 0);
__decorate([
    hasOne(() => Agent),
    __metadata("design:type", Object)
], User.prototype, "agent", void 0);
__decorate([
    hasOne(() => Permission),
    __metadata("design:type", Object)
], User.prototype, "permission", void 0);
__decorate([
    hasMany(() => Token),
    __metadata("design:type", Object)
], User.prototype, "tokens", void 0);
__decorate([
    hasMany(() => Token, {
        onQuery: (query) => query.where('type', 'PASSWORD_RESET'),
    }),
    __metadata("design:type", Object)
], User.prototype, "passwordResetTokens", void 0);
__decorate([
    hasMany(() => Token, {
        onQuery: (query) => query.where('type', 'VERIFY_EMAIL'),
    }),
    __metadata("design:type", Object)
], User.prototype, "verifyEmailTokens", void 0);
__decorate([
    hasMany(() => Wallet),
    __metadata("design:type", Object)
], User.prototype, "wallets", void 0);
__decorate([
    hasMany(() => Transaction),
    __metadata("design:type", Object)
], User.prototype, "transactions", void 0);
__decorate([
    hasMany(() => Save),
    __metadata("design:type", Object)
], User.prototype, "saves", void 0);
__decorate([
    hasMany(() => LoginSession),
    __metadata("design:type", Object)
], User.prototype, "loginSessions", void 0);
__decorate([
    manyToMany(() => DepositGateway, {
        pivotTable: 'blacklisted_gateways',
        localKey: 'id',
        pivotForeignKey: 'user_id',
        relatedKey: 'id',
        pivotRelatedForeignKey: 'gateway_id',
        pivotTimestamps: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "blackListedGateways", void 0);
__decorate([
    manyToMany(() => WithdrawMethod, {
        pivotTable: 'blacklisted_methods',
        localKey: 'id',
        pivotForeignKey: 'user_id',
        relatedKey: 'id',
        pivotRelatedForeignKey: 'method_id',
        pivotTimestamps: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "blackListedMethods", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", void 0)
], User, "assingReferralCode", null);
//# sourceMappingURL=user.js.map