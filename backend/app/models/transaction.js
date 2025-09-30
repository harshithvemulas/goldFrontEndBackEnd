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
import { BaseModel, column, beforeCreate, belongsTo, hasMany, computed } from '@adonisjs/lucid/orm';
import { generateNanoId } from '../utils/generate_unique_id.js';
import User from './user.js';
import { Filterable } from 'adonis-lucid-filter';
import { compose } from '@adonisjs/core/helpers';
import TransactionFilter from './filters/transaction_filter.js';
import Commission from './commission.js';
export default class Transaction extends compose(BaseModel, Filterable) {
    static $filter = () => TransactionFilter;
    get currency() {
        let metaData = typeof this.metaData !== 'object' ? JSON.parse(this?.metaData) : this?.metaData;
        if (this.type === 'exchange') {
            return metaData?.currencyFrom;
        }
        return metaData?.currency;
    }
    get metaDataParsed() {
        return typeof this.metaData !== 'object' ? JSON.parse(this?.metaData) : this?.metaData;
    }
    static assignTrxId(transaction) {
        transaction.trxId = generateNanoId(12);
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Transaction.prototype, "trxId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Transaction.prototype, "from", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Transaction.prototype, "to", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Transaction.prototype, "fee", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Transaction.prototype, "total", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Transaction.prototype, "method", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Transaction.prototype, "isBookmarked", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Transaction.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Transaction.prototype, "metaData", void 0);
__decorate([
    computed(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Transaction.prototype, "currency", null);
__decorate([
    computed(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Transaction.prototype, "metaDataParsed", null);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Transaction.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Transaction.prototype, "user", void 0);
__decorate([
    hasMany(() => Commission),
    __metadata("design:type", Object)
], Transaction.prototype, "commissions", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Transaction]),
    __metadata("design:returntype", void 0)
], Transaction, "assignTrxId", null);
//# sourceMappingURL=transaction.js.map