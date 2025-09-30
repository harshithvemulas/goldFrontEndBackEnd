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
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
import WithdrawMethodFilter from './filters/withdraw_method_filter.js';
import { Filterable } from 'adonis-lucid-filter';
import { compose } from '@adonisjs/core/helpers';
export default class WithdrawMethod extends compose(BaseModel, Filterable) {
    static $filter = () => WithdrawMethodFilter;
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], WithdrawMethod.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], WithdrawMethod.prototype, "logoImage", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], WithdrawMethod.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], WithdrawMethod.prototype, "value", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], WithdrawMethod.prototype, "apiKey", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], WithdrawMethod.prototype, "secretKey", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], WithdrawMethod.prototype, "params", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], WithdrawMethod.prototype, "currencyCode", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], WithdrawMethod.prototype, "countryCode", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], WithdrawMethod.prototype, "active", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], WithdrawMethod.prototype, "activeApi", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], WithdrawMethod.prototype, "recommended", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], WithdrawMethod.prototype, "variable", void 0);
__decorate([
    column({ columnName: 'ex1' }),
    __metadata("design:type", Object)
], WithdrawMethod.prototype, "ex1", void 0);
__decorate([
    column({ columnName: 'ex2' }),
    __metadata("design:type", Object)
], WithdrawMethod.prototype, "ex2", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], WithdrawMethod.prototype, "minAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], WithdrawMethod.prototype, "maxAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], WithdrawMethod.prototype, "fixedCharge", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], WithdrawMethod.prototype, "percentageCharge", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], WithdrawMethod.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], WithdrawMethod.prototype, "updatedAt", void 0);
__decorate([
    manyToMany(() => User, {
        pivotTable: 'blacklisted_methods',
        localKey: 'id',
        pivotForeignKey: 'method_id',
        relatedKey: 'id',
        pivotRelatedForeignKey: 'user_id',
        pivotTimestamps: true,
    }),
    __metadata("design:type", Object)
], WithdrawMethod.prototype, "blackListedUsers", void 0);
//# sourceMappingURL=withdraw_method.js.map