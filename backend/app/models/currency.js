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
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import Wallet from './wallet.js';
export default class Currency extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Currency.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Currency.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Currency.prototype, "code", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Currency.prototype, "icon", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Currency.prototype, "usdRate", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Currency.prototype, "acceptApiRate", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Currency.prototype, "isCrypto", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Currency.prototype, "active", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Currency.prototype, "metaData", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Currency.prototype, "kycLimit", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Currency.prototype, "notificationLimit", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Currency.prototype, "minAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Currency.prototype, "maxAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Currency.prototype, "dailyTransferAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Currency.prototype, "dailyTransferLimit", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Currency.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Currency.prototype, "updatedAt", void 0);
__decorate([
    hasMany(() => Wallet),
    __metadata("design:type", Object)
], Currency.prototype, "wallets", void 0);
//# sourceMappingURL=currency.js.map