import Setting from '#models/setting';
const SETTING_KEYS = {
    BRANDING: 'branding',
    FAVICON: 'favicon',
    AUTH_BANNER: 'authBanner',
    CARD_BG: 'cardBg',
    REFERRAL: 'referral',
    CUSTOMER_REGISTRATION: 'customer_registration',
    AGENT_REGISTRATION: 'agent_registration',
    MERCHANT_REGISTRATION: 'merchant_registration',
};
const brandingService = async () => {
    try {
        const settings = await Setting.query().whereIn('key', [
            SETTING_KEYS.BRANDING,
            SETTING_KEYS.FAVICON,
            SETTING_KEYS.AUTH_BANNER,
            SETTING_KEYS.CARD_BG,
            SETTING_KEYS.REFERRAL,
            SETTING_KEYS.CUSTOMER_REGISTRATION,
            SETTING_KEYS.AGENT_REGISTRATION,
            SETTING_KEYS.MERCHANT_REGISTRATION,
        ]);
        const settingsMap = new Map(settings.map((setting) => [setting.key, setting]));
        const brandingSetting = settingsMap.get(SETTING_KEYS.BRANDING);
        if (!brandingSetting) {
            throw new Error('Branding settings not found');
        }
        const faviconSetting = settingsMap.get(SETTING_KEYS.FAVICON);
        if (!faviconSetting) {
            throw new Error('Favicon settings not found');
        }
        const authBannerSetting = settingsMap.get(SETTING_KEYS.AUTH_BANNER);
        const cardBgSetting = settingsMap.get(SETTING_KEYS.CARD_BG);
        const referralSetting = settingsMap.get(SETTING_KEYS.REFERRAL);
        if (!referralSetting) {
            throw new Error('Referral settings not found');
        }
        const customerRegistrationSetting = settingsMap.get(SETTING_KEYS.CUSTOMER_REGISTRATION);
        const agentRegistrationSetting = settingsMap.get(SETTING_KEYS.AGENT_REGISTRATION);
        const merchantRegistrationSetting = settingsMap.get(SETTING_KEYS.MERCHANT_REGISTRATION);
        if (!customerRegistrationSetting || !agentRegistrationSetting || !merchantRegistrationSetting) {
            throw new Error('Registration settings not found');
        }
        return {
            siteName: brandingSetting.value1,
            siteUrl: brandingSetting.value2,
            apiUrl: brandingSetting.value3,
            defaultCurrency: brandingSetting.value4,
            defaultLanguage: brandingSetting.value5,
            logo: brandingSetting.file,
            favicon: faviconSetting.file,
            referral: {
                bonusAmount: referralSetting.value1,
                bonusReceiver: referralSetting.value2,
                applyOn: referralSetting.value3,
            },
            customerRegistration: customerRegistrationSetting.value1 === 'on',
            agentRegistration: agentRegistrationSetting.value1 === 'on',
            merchantRegistration: merchantRegistrationSetting.value1 === 'on',
            authBanner: authBannerSetting?.file,
            cardBg: cardBgSetting?.file,
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch branding settings: ${error.message}`);
    }
};
export default brandingService;
//# sourceMappingURL=branding_service.js.map