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
import User from './user.js';
import { Filterable } from 'adonis-lucid-filter';
import { compose } from '@adonisjs/core/helpers';
import SaveFilter from './filters/save_filter.js';
export default class Save extends compose(BaseModel, Filterable) {
    static $filter = () => SaveFilter;
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Save.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Save.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Save.prototype, "type", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Save.prototype, "info", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Save.prototype, "value", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Save.prototype, "relatedModel", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Save.prototype, "relatedModelId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Save.prototype, "metaData", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Save.prototype, "isBookmarked", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Save.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Save.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Save.prototype, "user", void 0);
//# sourceMappingURL=save.js.map