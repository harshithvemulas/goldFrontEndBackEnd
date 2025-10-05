import errorHandler from '#exceptions/error_handler';
import ExternalPlugin from '#models/external_plugin';
import Setting from '#models/setting';
import brandingService from '#services/branding_service';
import { brandingUpdateSchema } from '#validators/settings';
import { cuid } from '@adonisjs/core/helpers';
import app from '@adonisjs/core/services/app';
export default class SettingsController {
    parseSettings(data, key) {
        return data.find((s) => s.key === key);
    }
    async getBranding(ctx) {
        const { response } = ctx;
        try {
            const branding = await brandingService();
            return response.json(branding);
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Branding Error');
        }
    }
    async getGlobalSettings(ctx) {
        try {
            const data = await Setting.query();
            return ctx.response.json({
                deposit: {
                    status: this.parseSettings(data, 'deposit')?.value1,
                    fee: Number.parseFloat(this.parseSettings(data, 'deposit')?.value2),
                },
                withdraw: {
                    status: this.parseSettings(data, 'withdraw')?.value1,
                    fee: Number.parseFloat(this.parseSettings(data, 'withdraw')?.value2),
                },
                transfer: {
                    status: this.parseSettings(data, 'transfer')?.value1,
                    fee: Number.parseFloat(this.parseSettings(data, 'transfer')?.value2),
                },
                payment: {
                    status: this.parseSettings(data, 'payment')?.value1,
                    fee: Number.parseFloat(this.parseSettings(data, 'payment')?.value2),
                },
                exchange: {
                    status: this.parseSettings(data, 'exchange')?.value1,
                    fee: Number.parseFloat(this.parseSettings(data, 'exchange')?.value2),
                },
                topup: {
                    status: this.parseSettings(data, 'topup')?.value1,
                    fee: Number.parseFloat(this.parseSettings(data, 'topup')?.value2),
                },
                electricity_bill: {
                    status: this.parseSettings(data, 'electricity_bill')?.value1,
                    fee: Number.parseFloat(this.parseSettings(data, 'electricity_bill')?.value2),
                },
                investment: {
                    status: this.parseSettings(data, 'investment')?.value1,
                    fee: Number.parseFloat(this.parseSettings(data, 'investment')?.value2),
                },
                virtual_card: {
                    status: this.parseSettings(data, 'virtual_card')?.value1,
                },
                langs: JSON.parse(this.parseSettings(data, 'langs')?.value5),
            });
        }
        catch (error) {
            errorHandler(error, ctx, 'Get Global Settings Error');
        }
    }
    async adminIndex(ctx) {
        try {
            const data = await Setting.query().orderBy('key', 'asc');
            return ctx.response.json(data);
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async updateSettings(ctx) {
        const { request, response } = ctx;
        try {
            const { key, value1, value2, value3, value4, value5 } = request.body();
            const feeIncludeList = [
                'deposit',
                'withdraw',
                'transfer',
                'payment',
                'exchange',
                'topup',
                'electricity_bill',
                'deposit_commission',
                'withdraw_commission',
            ];
            if (value2 !== undefined &&
                feeIncludeList.includes(key) &&
                (value2 === null || value2 === '' || Number.isNaN(Number.parseFloat(value2)))) {
                return response.badRequest({ status: false, message: 'Input value is null or invalid' });
            }
            if (key === 'electricity_bill' && value1 === 'on') {
                const billPlugin = await ExternalPlugin.findBy('value', 'reloadly');
                if (!billPlugin?.active) {
                    return response.badRequest({
                        status: false,
                        message: 'Reloadly plugin is not active. Please activate it first.',
                    });
                }
            }
            if (key === 'virtual_card' && value1 === 'on') {
                if (value2 === 'sudo-africa') {
                    const sudoAfricaPlugin = await ExternalPlugin.findBy('value', 'sudo-africa');
                    if (!sudoAfricaPlugin?.active) {
                        return response.badRequest({
                            status: false,
                            message: 'Sudo Africa plugin is not active. Please activate it first.',
                        });
                    }
                }
                else if (value2 === 'stripe-cards') {
                    const stripePlugin = await ExternalPlugin.findBy('value', 'stripe-cards');
                    if (!stripePlugin?.active) {
                        return response.badRequest({
                            status: false,
                            message: 'Stripe Card plugin is not active. Please activate it first.',
                        });
                    }
                }
            }
            const setting = await Setting.findBy('key', key);
            if (!setting) {
                return response.notFound({ success: false, message: 'Setting not found' });
            }
            setting.value1 = value1;
            setting.value2 = value2;
            setting.value3 = value3;
            setting.value4 = value4;
            setting.value5 = value5;
            await setting.save();
            return response.json({ success: true, message: 'Settings updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'index Error');
        }
    }
    async updateBranding(ctx) {
        const { request, response } = ctx;
        try {
            const { siteName, siteUrl, apiUrl, defaultCurrency, defaultLanguage, logo, favicon, authBanner, cardBg, referralBonusAmount, referralBonusReceiver, referralApplyOn, customerRegistration, agentRegistration, merchantRegistration, } = await request.validateUsing(brandingUpdateSchema);
            const settings = await Setting.query().whereIn('key', [
                'branding',
                'favicon',
                'authBanner',
                'cardBg',
                'referral',
                'customer_registration',
                'agent_registration',
                'merchant_registration',
            ]);
            const settingsMap = new Map(settings.map((setting) => [setting.key, setting]));
            const brandingSetting = settingsMap.get('branding');
            if (brandingSetting) {
                brandingSetting.value1 = siteName;
                brandingSetting.value2 = siteUrl;
                brandingSetting.value3 = apiUrl;
                brandingSetting.value4 = defaultCurrency;
                brandingSetting.value5 = defaultLanguage;
                if (logo) {
                    const logoFileName = `${cuid()}.${logo.extname}`;
                    await logo.move(app.makePath('public/uploads'), { name: logoFileName });
                    brandingSetting.file = logoFileName;
                }
            }
            const faviconSetting = settingsMap.get('favicon');
            if (faviconSetting && favicon) {
                const faviconFileName = `${cuid()}.${favicon.extname}`;
                await favicon.move(app.makePath('public/uploads'), { name: faviconFileName });
                faviconSetting.file = faviconFileName;
            }
            const authBannerSetting = settingsMap.get('authBanner');
            if (authBannerSetting && authBanner) {
                const authBannerFileName = `${cuid()}.${authBanner.extname}`;
                await authBanner.move(app.makePath('public/uploads'), { name: authBannerFileName });
                authBannerSetting.file = authBannerFileName;
            }
            const cardBgSetting = settingsMap.get('cardBg');
            if (cardBgSetting && cardBg) {
                const cardBgFileName = `${cuid()}.${cardBg.extname}`;
                await cardBg.move(app.makePath('public/uploads'), { name: cardBgFileName });
                cardBgSetting.file = cardBgFileName;
            }
            const referralSetting = settingsMap.get('referral');
            if (referralSetting) {
                referralSetting.value1 = referralBonusAmount;
                referralSetting.value2 = referralBonusReceiver;
                referralSetting.value3 = referralApplyOn;
            }
            const updateRegistrationSetting = (setting, isEnabled) => {
                setting.value1 = isEnabled ? 'on' : 'off';
            };
            const customerRegistrationSetting = settingsMap.get('customer_registration');
            const agentRegistrationSetting = settingsMap.get('agent_registration');
            const merchantRegistrationSetting = settingsMap.get('merchant_registration');
            if (customerRegistrationSetting) {
                updateRegistrationSetting(customerRegistrationSetting, customerRegistration);
            }
            if (agentRegistrationSetting) {
                updateRegistrationSetting(agentRegistrationSetting, agentRegistration);
            }
            if (merchantRegistrationSetting) {
                updateRegistrationSetting(merchantRegistrationSetting, merchantRegistration);
            }
            await Promise.all(settings.map((setting) => setting.save()));
            return response.json({ success: true, message: 'Branding settings updated successfully' });
        }
        catch (error) {
            errorHandler(error, ctx, 'Branding Update Error');
        }
    }
}
//# sourceMappingURL=settings_controller.js.map