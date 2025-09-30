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
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm';
import User from './user.js';
import Address from './address.js';
import { generateNanoId } from '../utils/generate_unique_id.js';
import { Filterable } from 'adonis-lucid-filter';
import { compose } from '@adonisjs/core/helpers';
import MerchantFilter from './filters/merchant_filter.js';
export default class Merchant extends compose(BaseModel, Filterable) {
    static $filter = () => MerchantFilter;
    static assingMerchantId(merchant) {
        merchant.merchantId = generateNanoId();
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Merchant.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Merchant.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Merchant.prototype, "merchantId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Merchant.prototype, "storeProfileImage", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Merchant.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Merchant.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Merchant.prototype, "url", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Merchant.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Merchant.prototype, "isSuspend", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Merchant.prototype, "proof", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Merchant.prototype, "depositFee", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Merchant.prototype, "withdrawalFee", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Merchant.prototype, "exchangeFee", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Merchant.prototype, "transferFee", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Merchant.prototype, "paymentFee", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Merchant.prototype, "apiKey", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Merchant.prototype, "allowedIp", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Merchant.prototype, "addressId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Merchant.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Merchant.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Merchant.prototype, "user", void 0);
__decorate([
    belongsTo(() => Address),
    __metadata("design:type", Object)
], Merchant.prototype, "address", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Merchant]),
    __metadata("design:returntype", void 0)
], Merchant, "assingMerchantId", null);
//# sourceMappingURL=merchant.js.map