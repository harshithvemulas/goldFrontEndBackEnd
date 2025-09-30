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
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from './user.js';
import Wallet from './wallet.js';
export default class Card extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Card.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "cardId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Card.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Card.prototype, "walletId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "lastFour", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "brand", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "expMonth", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "expYear", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "type", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "number", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "cvc", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Card.prototype, "status", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Card.prototype, "user", void 0);
__decorate([
    belongsTo(() => Wallet),
    __metadata("design:type", Object)
], Card.prototype, "wallet", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Card.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Card.prototype, "updatedAt", void 0);
//# sourceMappingURL=card.js.map