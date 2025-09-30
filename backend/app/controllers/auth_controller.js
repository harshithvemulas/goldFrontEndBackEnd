import mail from '@adonisjs/mail/services/main';
import { registerValidator, loginValidator, otpValidator, changePasswordValidator, resetPasswordValidator, resendVerifyEmail, } from '#validators/auth';
import Token from '#models/token';
import User from '#models/user';
import hash from '@adonisjs/core/services/hash';
import { DateTime } from 'luxon';
import errorHandler from '#exceptions/error_handler';
import Address from '#models/address';
import Currency from '#models/currency';
import { geoIp } from '#services/geoip_service';
import string from '@adonisjs/core/helpers/string';
import UAParser from 'ua-parser-js';
import notification_service from '#services/notification_service';
import SendOtpNotification from '#mails/send_otp_notification';
import DeviceLoginNotification from '#mails/device_login_notification';
import VerifyEmailNotification from '#mails/verify_email_notification';
import ResetPasswordNotification from '#mails/reset_password_notification';
import referralService from '#services/referral_service';
import brandingService from '#services/branding_service';
import env from '#start/env';
export default class AuthController {
    async register(ctx) {
        const { request, response } = ctx;
        try {
            const payload = await request.validateUsing(registerValidator);
            const branding = await brandingService();
            if (!branding.customerRegistration && payload.roleId === 2) {
                return response.badRequest({
                    success: false,
                    message: 'Customer registration is not allowed',
                });
            }
            if (!branding.merchantRegistration && payload.roleId === 3) {
                return response.badRequest({
                    success: false,
                    message: 'Merchant registration is not allowed',
                });
            }
            if (!branding.agentRegistration && payload.roleId === 4) {
                return response.badRequest({
                    success: false,
                    message: 'Agent registration is not allowed',
                });
            }
            if (payload.roleId === 3 && !payload.merchant) {
                return response.badRequest({ success: false, message: 'Must need to input merchant info' });
            }
            if (payload.roleId === 4 && !payload.agent) {
                return response.badRequest({ success: false, message: 'Must need to input agent info' });
            }
            let reffereduser = null;
            if (payload.referralCode) {
                reffereduser = await User.findBy({ referralCode: payload.referralCode });
            }
            const currency = await Currency.findBy('code', branding.defaultCurrency);
            const user = new User();
            user.email = payload.email;
            user.password = payload.password;
            user.status = false;
            user.limitTransfer = [1, 3].includes(payload.roleId) ? false : true;
            user.dailyTransferLimit = currency?.dailyTransferLimit ?? 10;
            user.roleId = payload.roleId;
            user.referredBy = reffereduser ? reffereduser.id : null;
            user.acceptTermsCondition = payload.acceptTermsCondition;
            await user.save();
            user.related('permission').create({});
            await user.related('wallets').create({
                balance: 0,
                default: true,
                currencyId: currency?.id ?? 1,
                dailyTransferAmount: currency?.dailyTransferAmount ?? 1500000,
            });
            const customerAddress = await Address.create({
                type: 'mailing',
                addressLine: payload.addressLine,
                zipCode: payload.zipCode,
                countryCode: payload.countryCode,
                city: payload.city,
            });
            await user.related('customer').create({
                addressId: customerAddress.id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                phone: payload.phone,
                gender: payload.gender,
                dob: payload.dob,
            });
            if (payload.roleId === 3) {
                const merchantAddress = await Address.create({
                    type: 'mailing',
                    addressLine: payload.merchant?.addressLine,
                    zipCode: payload.merchant?.zipCode,
                    countryCode: payload.merchant?.countryCode,
                    city: payload.merchant?.city,
                });
                await user.related('merchant').create({
                    addressId: merchantAddress.id,
                    name: payload.merchant?.name,
                    email: payload.merchant?.email,
                    status: 'pending',
                    proof: payload.merchant?.proof,
                    url: payload.merchant?.url || null,
                });
            }
            if (payload.roleId === 4) {
                const agentAddress = await Address.create({
                    type: 'mailing',
                    addressLine: payload.agent?.addressLine,
                    zipCode: payload.agent?.zipCode,
                    countryCode: payload.agent?.countryCode,
                    city: payload.agent?.city,
                });
                await user.related('agent').create({
                    addressId: agentAddress.id,
                    name: payload.agent?.name,
                    email: payload.agent?.email,
                    occupation: payload.agent?.occupation,
                    status: 'pending',
                    proof: payload.agent?.proof,
                });
            }
            await user.load('customer');
            const token = await Token.generateVerifyEmailToken(user);
            await mail.sendLater(new VerifyEmailNotification(user, token, branding));
            await notification_service.sendNewRegistraionNotification(user);
            return response.created({
                message: 'User registered successfully. Please check your email to verify your account.',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Register Error');
        }
    }
    async verifyEmail(ctx) {
        const { request, response } = ctx;
        try {
            const { token } = request.all();
            if (!token) {
                return response.badRequest({ success: false, message: 'Token is not provided' });
            }
            const record = await Token.verify(token, 'VERIFY_EMAIL');
            if (!record) {
                return response.badRequest({ success: false, message: 'Token is invalid' });
            }
            const user = await User.find(record.userId);
            if (!user) {
                return response.badRequest({ success: false, message: 'User is not found' });
            }
            user.isEmailVerified = true;
            user.status = true;
            user.save();
            await record.delete();
            await referralService(user, 'verify_email');
            return response.json({ success: true, message: 'Email is verified' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Verify Email Error');
        }
    }
    async resendVerifyEmail(ctx) {
        const { request, response } = ctx;
        try {
            const { email } = await request.validateUsing(resendVerifyEmail);
            const user = await User.findBy('email', email);
            if (!user) {
                return response.badRequest({ success: false, message: 'User is not found' });
            }
            if (user?.isEmailVerified) {
                throw new Error('User is already verified');
            }
            const token = await user
                .related('tokens')
                .query()
                .where('type', 'VERIFY_EMAIL')
                .where('expiresAt', '>', DateTime.now().toSQL())
                .orderBy('createdAt', 'desc')
                .first();
            if (token) {
                await token.delete();
            }
            const newToken = await Token.generateVerifyEmailToken(user);
            await user.load('customer');
            const branding = await brandingService();
            await mail.sendLater(new VerifyEmailNotification(user, newToken, branding));
            return response.json({
                success: true,
                message: 'We sent a verification link to your email. Please check your email to verify your account.',
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Resend Verify Email Error');
        }
    }
    async login(ctx) {
        const { request, response } = ctx;
        try {
            const { email, password } = await request.validateUsing(loginValidator);
            const user = await User.verifyCredentials(email, password);
            const branding = await brandingService();
            if (!user) {
                return response.badRequest({ success: false, message: 'Invalid user credentials' });
            }
            if (!user.isEmailVerified) {
                return response.ok({
                    success: true,
                    message: 'Email not verified, redirecting to verify email page',
                    redirectUrl: `${branding.siteUrl}/register/email-verification-message?email=${email}`,
                });
            }
            if (!user.status) {
                return response.unauthorized({ success: false, message: 'Account is not active' });
            }
            const token = await Token.generateOtpToken(user);
            let otp = '1111';
            if (!env.get('DEMO_OTP')) {
                otp = Math.floor(1000 + Math.random() * 9000).toString();
            }
            user.otpCode = otp;
            await user.save();
            await user.load('customer');
            await mail.sendLater(new SendOtpNotification(user, otp, branding));
            return response.ok({ success: true, message: 'OTP sent to your email', token });
        }
        catch (error) {
            errorHandler(error, ctx, 'Login Error');
        }
    }
    async resendOtp(ctx) {
        const { request, response } = ctx;
        try {
            const { token } = request.only(['token']);
            if (!token) {
                return response.badRequest({ success: false, message: 'Token is not provided' });
            }
            const record = await Token.query()
                .where('token', token)
                .where('type', 'OTP')
                .andWhereNotNull('expiresAt')
                .first();
            if (!record || !record.expiresAt || !record.createdAt) {
                return response.badRequest({ success: false, message: 'Token is invalid' });
            }
            const otpExpirationTime = 5 * 60 * 1000;
            const now = DateTime.now();
            const timeSinceCreation = now.diff(record.createdAt).milliseconds;
            if (timeSinceCreation > 10 * 60 * 1000) {
                return response.status(401).json({
                    success: false,
                    message: 'Session expired. Please sign in again.',
                });
            }
            if (timeSinceCreation < otpExpirationTime) {
                const timeLeft = otpExpirationTime - timeSinceCreation;
                const minutesLeft = Math.floor(timeLeft / (60 * 1000));
                const secondsLeft = Math.floor((timeLeft % (60 * 1000)) / 1000);
                let timeLeftMessage = '';
                if (minutesLeft > 0) {
                    timeLeftMessage += `${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} `;
                }
                timeLeftMessage += `${secondsLeft} second${secondsLeft > 1 ? 's' : ''}`;
                return response.badRequest({
                    success: false,
                    message: `Please wait ${timeLeftMessage} before requesting a new OTP.`,
                    timeLeft: {
                        minutes: minutesLeft,
                        seconds: secondsLeft,
                    },
                });
            }
            const user = await User.find(record.userId);
            if (!user) {
                return response.badRequest({ success: false, message: 'User is not found' });
            }
            const newToken = await Token.generateOtpToken(user);
            let otp = '1111';
            if (!env.get('DEMO_OTP')) {
                otp = Math.floor(1000 + Math.random() * 9000).toString();
            }
            user.otpCode = otp;
            await user.save();
            await user.load('customer');
            const branding = await brandingService();
            await mail.sendLater(new SendOtpNotification(user, otp, branding));
            await record.delete();
            return response.ok({ success: true, message: 'OTP sent to your email.', token: newToken });
        }
        catch (error) {
            errorHandler(error, ctx, 'Resend OTP Error');
        }
    }
    async verifyOtp(ctx) {
        const { auth, request, response, session } = ctx;
        try {
            const ipAddress = request.ip();
            const geo = await geoIp(ipAddress);
            const userAgent = request.header('User-Agent');
            const parser = new UAParser(userAgent);
            const deviceName = parser.getOS().name ?? 'Unknown';
            const sessionToken = string.generateRandom(20);
            const { token, otp, isRememberMe, fingerprint } = await request.validateUsing(otpValidator);
            if (!token) {
                return response.badRequest({ success: false, message: 'Token is not provided' });
            }
            const record = await Token.verify(token, 'OTP');
            if (!record) {
                return response.badRequest({ success: false, message: 'Token is invalid' });
            }
            const user = await User.find(record.userId);
            if (!user) {
                return response.badRequest({ success: false, message: 'User is not found' });
            }
            if (user.otpCode !== otp) {
                return response.badRequest({ success: false, message: 'Invalid OTP code.' });
            }
            user.otpCode = null;
            user.lastCountryName = geo?.country;
            user.lastIpAddress = ipAddress;
            await user.save();
            await auth.use('api').login(user, isRememberMe);
            const data = {
                sessionId: session.sessionId,
                sessionToken,
                ipAddress: env.get('NODE_ENV') === 'development' ? geo?.query : ipAddress,
                country: geo?.country,
                deviceName,
                fingerprint,
            };
            const existingSession = fingerprint
                ? await user.related('loginSessions').query().where({ fingerprint }).first()
                : null;
            if (!existingSession) {
                user.load('customer');
                const branding = await brandingService();
                await notification_service.newDeviceLoginNotification(user.id);
                await mail.sendLater(new DeviceLoginNotification(user, {
                    deviceName: data.deviceName,
                    ipAddress: data.ipAddress,
                    country: data.country,
                    time: DateTime.now().toFormat('yyyy LLL dd, HH:mm'),
                }, branding));
            }
            await user.related('loginSessions').create(data);
            session.put('session-token', sessionToken);
            await record.delete();
            return response.ok({ success: true, message: 'Logged in successfully.' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Verify OTP Error');
        }
    }
    async checkAuth(ctx) {
        const { auth, response } = ctx;
        if (auth.user) {
            const user = await User.query()
                .where('email', auth?.user?.email)
                .preload('role')
                .preload('customer', (customerQuery) => {
                customerQuery.preload('address');
            })
                .preload('merchant', (merchantQuery) => {
                merchantQuery.preload('address');
            })
                .preload('agent', (agentQuery) => {
                agentQuery.preload('address');
            })
                .preload('permission')
                .preload('kyc')
                .first();
            return response.json({ login: true, user });
        }
        else {
            return response.badRequest({ login: false });
        }
    }
    async logout(ctx) {
        const { auth, response, session } = ctx;
        try {
            const loginSession = await auth
                .user.related('loginSessions')
                .query()
                .where({ sessionToken: session.get('session-token') || 'NOT_AVAILABLE', active: true })
                .first();
            if (loginSession) {
                loginSession.active = false;
                await loginSession.save();
            }
            await auth.use('api').logout();
            return response.json({ success: true, message: 'Logout successful' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Logout Error');
        }
    }
    async changePassword(ctx) {
        const { auth, request, response } = ctx;
        try {
            const { currentPassword, newPassword } = await request.validateUsing(changePasswordValidator);
            const userId = auth.user.id;
            const user = await User.findOrFail(userId);
            const isPasswordValid = await hash.verify(user.password, currentPassword);
            if (isPasswordValid) {
                user.password = newPassword;
                await user.save();
                return response.json({ success: true });
            }
            else {
                return response.json({ success: false, message: 'Invalid password' });
            }
        }
        catch (error) {
            errorHandler(error, ctx, 'Change Password Error');
        }
    }
    async forgotPassword(ctx) {
        const { request, response } = ctx;
        try {
            const { email } = request.all();
            if (!email) {
                return response.badRequest({
                    success: false,
                    message: 'email is not found',
                });
            }
            const user = await User.findByOrFail('email', email);
            if (!user) {
                return response.badRequest({ success: false, message: 'User is not found' });
            }
            const token = await Token.generatePasswordResetToken(user);
            const branding = await brandingService();
            await user.load('customer');
            await mail.sendLater(new ResetPasswordNotification(user, token, branding));
            return response.json({ success: true, message: 'A token is sent to your mail' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Forgot Password Error');
        }
    }
    async resetPassword(ctx) {
        const { request, response } = ctx;
        try {
            const { password, token } = await request.validateUsing(resetPasswordValidator);
            const record = await Token.verify(token, 'PASSWORD_RESET');
            if (!record) {
                return response.badRequest({ success: false, message: 'Token is invalid' });
            }
            const user = await User.find(record.userId);
            if (!user) {
                return response.badRequest({ success: false, message: 'User is not found' });
            }
            user.password = password;
            user.save();
            await record.delete();
            return response.json({ success: true, message: 'Password updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Reset Password Error');
        }
    }
    async getGeoLocation(ctx) {
        const { request, response } = ctx;
        try {
            const ipAddress = request.ip();
            const data = await geoIp(ipAddress);
            return response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Geo Location Error');
        }
    }
}
//# sourceMappingURL=auth_controller.js.map