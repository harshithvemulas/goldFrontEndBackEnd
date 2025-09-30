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
import { attachment, Attachmentable } from '@jrmc/adonis-attachment';
import { compose } from '@adonisjs/core/helpers';
export default class SiteSetting extends compose(BaseModel, Attachmentable) {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], SiteSetting.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "phone", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "address", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "country", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], SiteSetting.prototype, "timeZone", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], SiteSetting.prototype, "timeFormat", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], SiteSetting.prototype, "maintenanceMode", void 0);
__decorate([
    attachment({ preComputeUrl: true }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "logo", void 0);
__decorate([
    attachment({ preComputeUrl: true }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "minimizedLogo", void 0);
__decorate([
    attachment({ preComputeUrl: true }),
    __metadata("design:type", Object)
], SiteSetting.prototype, "favicon", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "theme", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "companySlogan", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "copyrightText", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "facebook", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "instagram", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "twitter", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "termsAndConditions", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SiteSetting.prototype, "privacyPolicy", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], SiteSetting.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], SiteSetting.prototype, "updatedAt", void 0);
//# sourceMappingURL=site_setting.js.map