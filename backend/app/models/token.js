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
import string from '@adonisjs/core/helpers/string';
import { Encryption } from '@adonisjs/core/encryption';
import env from '#start/env';
const encryption = new Encryption({
    secret: env.get('APP_KEY'),
});
export default class Token extends BaseModel {
    static async generateVerifyEmailToken(user) {
        const token = string.generateRandom(64);
        const record = await user.related('tokens').create({
            type: 'VERIFY_EMAIL',
            expiresAt: DateTime.now().plus({ days: 7 }),
            token,
        });
        return record.token;
    }
    static async generatePasswordResetToken(user) {
        const token = string.generateRandom(64);
        if (!user)
            return token;
        const record = await user.related('tokens').create({
            type: 'PASSWORD_RESET',
            expiresAt: DateTime.now().plus({ hour: 1 }),
            token,
        });
        return record.token;
    }
    static async generateOtpToken(user) {
        const token = string.generateRandom(64);
        if (!user)
            return token;
        const record = await user.related('tokens').create({
            type: 'OTP',
            expiresAt: DateTime.now().plus({ minute: 5 }),
            token,
        });
        return record.token;
    }
    static async generatePaymentOtp(user, otp) {
        const token = encryption.encrypt(otp);
        if (!user)
            return token;
        const record = await user.related('tokens').create({
            type: 'PAYMENT_OTP',
            expiresAt: DateTime.now().plus({ minute: 5 }),
            token,
        });
        return record.token;
    }
    static async getTokenUser(token, type) {
        const record = await Token.query()
            .preload('user')
            .where('token', token)
            .where('type', type)
            .where('expiresAt', '>', DateTime.now().toSQL())
            .orderBy('createdAt', 'desc')
            .first();
        return record?.user;
    }
    static async verify(token, type) {
        const record = await Token.query()
            .where('expiresAt', '>', DateTime.now().toSQL())
            .where('token', token)
            .where('type', type)
            .first();
        return record;
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Token.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Token.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Token.prototype, "type", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Token.prototype, "token", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], Token.prototype, "expiresAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Token.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Token.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Token.prototype, "user", void 0);
//# sourceMappingURL=token.js.map