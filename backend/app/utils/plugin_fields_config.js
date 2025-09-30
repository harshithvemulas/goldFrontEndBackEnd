const pluginFieldsConfig = {
    'currency-api': {
        description: 'Used to get currency exchange rates (https://currencyapi.com)',
        documentation: 'https://paysnap-docs.circlecodes.co/external-plugins/currency-api',
        fields: [
            {
                key: 'apiKey',
                label: 'API Key',
                type: 'text',
                required: true,
            },
            {
                key: 'apiKey2',
                label: 'Used Quota',
                type: 'text',
                required: true,
                disable: true,
            },
            {
                key: 'apiKey3',
                label: 'Available Quota',
                type: 'text',
                required: true,
                disable: true,
            },
        ],
    },
    'stripe-cards': {
        description: 'Used to generate virtual cards for customers',
        documentation: 'https://paysnap-docs.circlecodes.co/external-plugins/stripe-cards',
        fields: [
            {
                key: 'apiKey',
                label: 'API Key',
                type: 'text',
                required: true,
            },
            {
                key: 'secretKey',
                label: 'Secret Key',
                type: 'text',
                required: true,
            },
            {
                key: 'apiKey2',
                label: 'Webhook Secret (Optional)',
                type: 'text',
                required: false,
            },
        ],
    },
    'sudo-africa': {
        description: 'Used to generate virtual cards for customers',
        documentation: 'https://paysnap-docs.circlecodes.co/external-plugins/sudo-africa',
        fields: [
            {
                key: 'apiKey',
                label: 'API Key',
                type: 'text',
                required: true,
            },
            {
                key: 'apiKey3',
                label: 'Debit Account ID',
                type: 'text',
                required: true,
            },
            {
                key: 'ex1',
                label: 'Funding Source ID',
                required: true,
            },
            {
                key: 'secretKey',
                label: 'Card Brand',
                type: 'select',
                options: [
                    { label: 'Verve', value: 'Verve' },
                    { label: 'Visa', value: 'Visa' },
                    { label: 'MasterCard', value: 'MasterCard' },
                ],
                required: true,
            },
            {
                key: 'apiKey2',
                label: 'Environment',
                type: 'select',
                options: [
                    { label: 'Sandbox', value: 'sandbox' },
                    { label: 'Live', value: 'live' },
                ],
                required: true,
            },
        ],
    },
    'google-analytics': {
        description: 'Used to track user activities',
        documentation: 'https://paysnap-docs.circlecodes.co/external-plugins/google-analytics',
        fields: [
            {
                key: 'apiKey',
                label: 'App ID',
                type: 'text',
                required: true,
            },
        ],
    },
    'reloadly': {
        description: 'Used to send airtime topup to customers',
        documentation: 'https://paysnap-docs.circlecodes.co/external-plugins/reloadly',
        fields: [
            {
                key: 'apiKey',
                label: 'Client ID',
                type: 'text',
                required: true,
            },
            {
                key: 'secretKey',
                label: 'Client Secret',
                type: 'text',
                required: true,
            },
            {
                key: 'apiKey2',
                label: 'Environment',
                type: 'select',
                options: [
                    { label: 'Sandbox', value: 'sandbox' },
                    { label: 'Live', value: 'live' },
                ],
                required: true,
            },
        ],
    },
    'recaptcha': {
        description: 'Used to verify user authenticity',
        documentation: 'https://paysnap-docs.circlecodes.co/external-plugins/recaptcha',
        fields: [
            {
                key: 'apiKey',
                label: 'Site Key',
                type: 'text',
                required: true,
            },
            {
                key: 'secretKey',
                label: 'Secret Key',
                type: 'text',
                required: true,
            },
        ],
    },
    'tawk-to': {
        description: 'Used to provide chat support to customers',
        documentation: 'https://paysnap-docs.circlecodes.co/external-plugins/tawk-to',
        fields: [
            {
                key: 'apiKey',
                label: 'Widget ID',
                type: 'text',
                required: true,
            },
            {
                key: 'secretKey',
                label: 'Property ID',
                type: 'text',
                required: true,
            },
        ],
    },
};
export default pluginFieldsConfig;
//# sourceMappingURL=plugin_fields_config.js.map