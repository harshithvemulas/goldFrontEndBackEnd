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
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm';
import { Filterable } from 'adonis-lucid-filter';
import { compose } from '@adonisjs/core/helpers';
import CommissionFilter from './filters/commission_filter.js';
import Transaction from './transaction.js';
import Agent from './agent.js';
import formatPrecision from '../utils/format_precision.js';
export default class Commission extends compose(BaseModel, Filterable) {
    static $filter = () => CommissionFilter;
    static async formatAmount(commission) {
        commission.amount = formatPrecision(commission.amount);
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Commission.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Commission.prototype, "agentId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Commission.prototype, "transactionId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Commission.prototype, "amount", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Commission.prototype, "status", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Commission.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Commission.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => Agent),
    __metadata("design:type", Object)
], Commission.prototype, "agent", void 0);
__decorate([
    belongsTo(() => Transaction),
    __metadata("design:type", Object)
], Commission.prototype, "transaction", void 0);
__decorate([
    beforeSave(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Commission]),
    __metadata("design:returntype", Promise)
], Commission, "formatAmount", null);
//# sourceMappingURL=commission.js.map