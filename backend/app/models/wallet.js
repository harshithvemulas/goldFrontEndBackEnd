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
import { BaseModel, column, belongsTo, beforeCreate, beforeSave, hasMany, } from '@adonisjs/lucid/orm';
import User from './user.js';
import { generateUniqueWalletID } from '../utils/generate_unique_id.js';
import Currency from './currency.js';
import formatPrecision from '../utils/format_precision.js';
export default class Wallet extends BaseModel {
    static async assignWalletId(wallet) {
        wallet.walletId = await generateUniqueWalletID();
    }
    static async formatBalance(wallet) {
        wallet.balance = formatPrecision(wallet.balance);
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Wallet.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Wallet.prototype, "walletId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Wallet.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Wallet.prototype, "balance", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Wallet.prototype, "default", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Wallet.prototype, "pinDashboard", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Wallet.prototype, "dailyTransferAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Wallet.prototype, "currencyId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Wallet.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Wallet.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Wallet.prototype, "user", void 0);
__decorate([
    belongsTo(() => Currency),
    __metadata("design:type", Object)
], Wallet.prototype, "currency", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Wallet]),
    __metadata("design:returntype", Promise)
], Wallet, "assignWalletId", null);
__decorate([
    beforeSave(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Wallet]),
    __metadata("design:returntype", Promise)
], Wallet, "formatBalance", null);
//# sourceMappingURL=wallet.js.map