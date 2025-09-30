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
import { BaseModel, column, belongsTo, beforeCreate, hasMany } from '@adonisjs/lucid/orm';
import { generateNanoId } from '../utils/generate_unique_id.js';
import User from '#models/user';
import Address from '#models/address';
import AgentMethod from '#models/agent_method';
import { Filterable } from 'adonis-lucid-filter';
import { compose } from '@adonisjs/core/helpers';
import AgentFilter from './filters/agent_filter.js';
import Commission from './commission.js';
export default class Agent extends compose(BaseModel, Filterable) {
    static $filter = () => AgentFilter;
    static assingAgentId(agent) {
        agent.agentId = generateNanoId();
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Agent.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Agent.prototype, "agentId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Agent.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Agent.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Agent.prototype, "occupation", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Agent.prototype, "whatsapp", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Agent.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "processingTime", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Agent.prototype, "isRecommended", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Agent.prototype, "isSuspend", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Agent.prototype, "proof", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "depositCharge", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "withdrawalCharge", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "depositCommission", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "withdrawalCommission", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "depositFee", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "withdrawalFee", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Agent.prototype, "exchangeFee", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Agent.prototype, "addressId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Agent.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Agent.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Agent.prototype, "user", void 0);
__decorate([
    belongsTo(() => Address),
    __metadata("design:type", Object)
], Agent.prototype, "address", void 0);
__decorate([
    hasMany(() => AgentMethod),
    __metadata("design:type", Object)
], Agent.prototype, "agentMethods", void 0);
__decorate([
    hasMany(() => Commission),
    __metadata("design:type", Object)
], Agent.prototype, "commissions", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Agent]),
    __metadata("design:returntype", void 0)
], Agent, "assingAgentId", null);
//# sourceMappingURL=agent.js.map