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
import { BaseModel, column, belongsTo, computed } from '@adonisjs/lucid/orm';
import User from './user.js';
import Address from './address.js';
import { Filterable } from 'adonis-lucid-filter';
import { compose } from '@adonisjs/core/helpers';
import CustomerFilter from './filters/customer_filter.js';
export default class Customer extends compose(BaseModel, Filterable) {
    static $filter = () => CustomerFilter;
    get name() {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Customer.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Customer.prototype, "profileImage", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Customer.prototype, "lastName", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Customer.prototype, "phone", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Customer.prototype, "dob", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Customer.prototype, "cardholderId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Customer.prototype, "addressId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Customer.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Customer.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Customer.prototype, "user", void 0);
__decorate([
    belongsTo(() => Address),
    __metadata("design:type", Object)
], Customer.prototype, "address", void 0);
__decorate([
    computed(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Customer.prototype, "name", null);
//# sourceMappingURL=customer.js.map