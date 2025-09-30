const gatewayFieldsConfig = {
    paydunya: [
        {
            key: 'apiKey',
            label: 'Public Key',
            type: 'text',
            required: true,
        },
        {
            key: 'secretKey',
            label: 'Private Key',
            type: 'text',
            required: true,
        },
        {
            key: 'ex1',
            label: 'Master Key',
            type: 'text',
            required: true,
        },
        {
            key: 'ex2',
            label: 'Token',
            type: 'text',
            required: true,
        },
    ],
    perfectmoney: [
        {
            key: 'ex1',
            label: 'USD Wallet ID',
            type: 'text',
            required: true,
        },
        {
            key: 'ex2',
            label: 'EUR Wallet ID',
            type: 'text',
            required: false,
        },
    ],
    wave: [
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
    ],
    stripe: [
        {
            key: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
        },
        {
            key: 'secretKey',
            label: 'Webhook Secret (Optional)',
            type: 'text',
            required: false,
        },
    ],
    coinbase: [
        {
            key: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
        },
    ],
    flutterwave: [
        {
            key: 'apiKey',
            label: 'Public Key',
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
    paypal: [
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
            key: 'ex2',
            label: 'Webhook Id',
            type: 'text',
            required: true,
        },
        {
            key: 'ex1',
            label: 'Mode',
            type: 'select',
            options: [
                { label: 'Sandbox', value: 'sandbox' },
                { label: 'Live', value: 'live' },
            ],
            required: true,
        },
    ],
    mollie: [
        {
            key: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
        },
        {
            key: 'ex1',
            label: 'Profile ID',
            type: 'text',
            required: true,
        },
    ],
    razorpay: [
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
    ],
    coingate: [
        {
            key: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
        },
        {
            key: 'ex1',
            label: 'Mode',
            type: 'select',
            options: [
                { label: 'Sandbox', value: 'sandbox' },
                { label: 'Live', value: 'live' },
            ],
            required: true,
        },
    ],
    nowpayments: [
        {
            key: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
        },
    ],
    bkash: [
        {
            key: 'ex1',
            label: 'Username',
            type: 'text',
            required: true,
        },
        {
            key: 'ex2',
            label: 'Password',
            type: 'text',
            required: true,
        },
        {
            key: 'apiKey',
            label: 'App Key',
            type: 'text',
            required: true,
        },
        {
            key: 'secretKey',
            label: 'App Secret Key',
            type: 'text',
            required: true,
        },
    ],
    paystack: [
        {
            key: 'apiKey',
            label: 'Public Key',
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
    cashfree: [
        {
            key: 'apiKey',
            label: 'Public Key',
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
    payfast: [
        {
            key: 'apiKey',
            label: 'Merchant ID',
            type: 'text',
            required: true,
        },
        {
            key: 'secretKey',
            label: 'Merchant Key',
            type: 'text',
            required: true,
        },
        {
            key: 'ex1',
            label: 'Mode',
            type: 'select',
            options: [
                { label: 'Sandbox', value: 'sandbox' },
                { label: 'Live', value: 'live' },
            ],
            required: true,
        },
    ],
};
export default gatewayFieldsConfig;
//# sourceMappingURL=gateway_fields_config.js.map