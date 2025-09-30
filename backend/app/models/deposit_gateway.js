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
import { Filterable } from 'adonis-lucid-filter';
import { compose } from '@adonisjs/core/helpers';
import DepositGatewayFilter from './filters/deposit_gateway_filter.js';
export default class DepositGateway extends compose(BaseModel, Filterable) {
    static $filter = () => DepositGatewayFilter;
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], DepositGateway.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DepositGateway.prototype, "logoImage", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], DepositGateway.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], DepositGateway.prototype, "value", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DepositGateway.prototype, "apiKey", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DepositGateway.prototype, "secretKey", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], DepositGateway.prototype, "active", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], DepositGateway.prototype, "activeApi", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], DepositGateway.prototype, "isCrypto", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], DepositGateway.prototype, "recommended", void 0);
__decorate([
    column({ columnName: 'ex1' }),
    __metadata("design:type", Object)
], DepositGateway.prototype, "ex1", void 0);
__decorate([
    column({ columnName: 'ex2' }),
    __metadata("design:type", Object)
], DepositGateway.prototype, "ex2", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DepositGateway.prototype, "variables", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], DepositGateway.prototype, "allowedCurrencies", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], DepositGateway.prototype, "allowedCountries", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], DepositGateway.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], DepositGateway.prototype, "updatedAt", void 0);
__decorate([
    manyToMany(() => User, {
        pivotTable: 'blacklisted_gateways',
        localKey: 'id',
        pivotForeignKey: 'gateway_id',
        relatedKey: 'id',
        pivotRelatedForeignKey: 'user_id',
        pivotTimestamps: true,
    }),
    __metadata("design:type", Object)
], DepositGateway.prototype, "blackListedUsers", void 0);
//# sourceMappingURL=deposit_gateway.js.map