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
import { BaseModel, column } from '@adonisjs/lucid/orm';
export default class InvestmentPlan extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], InvestmentPlan.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], InvestmentPlan.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], InvestmentPlan.prototype, "description", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], InvestmentPlan.prototype, "isActive", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], InvestmentPlan.prototype, "isFeatured", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], InvestmentPlan.prototype, "isRange", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], InvestmentPlan.prototype, "minAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], InvestmentPlan.prototype, "maxAmount", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], InvestmentPlan.prototype, "currency", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], InvestmentPlan.prototype, "interestRate", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], InvestmentPlan.prototype, "duration", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], InvestmentPlan.prototype, "durationType", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], InvestmentPlan.prototype, "withdrawAfterMatured", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], InvestmentPlan.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], InvestmentPlan.prototype, "updatedAt", void 0);
//# sourceMappingURL=investment_plan.js.map