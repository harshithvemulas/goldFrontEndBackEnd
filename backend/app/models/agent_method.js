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
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Agent from '#models/agent';
export default class AgentMethod extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], AgentMethod.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], AgentMethod.prototype, "agentId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AgentMethod.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AgentMethod.prototype, "value", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AgentMethod.prototype, "countryCode", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AgentMethod.prototype, "currencyCode", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], AgentMethod.prototype, "active", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], AgentMethod.prototype, "allowDeposit", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], AgentMethod.prototype, "allowWithdraw", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], AgentMethod.prototype, "requiredInput", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AgentMethod.prototype, "inputType", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AgentMethod.prototype, "otherName", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], AgentMethod.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], AgentMethod.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => Agent),
    __metadata("design:type", Object)
], AgentMethod.prototype, "agent", void 0);
//# sourceMappingURL=agent_method.js.map