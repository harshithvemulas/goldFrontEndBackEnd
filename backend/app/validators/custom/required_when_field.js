import vine from '@vinejs/vine';
async function requiredObjectRule(value, options, field) {
    if (typeof value !== 'object') {
        return;
    }
    const targetFieldValue = vine.helpers.getNestedValue(options.targetField, field);
    if (options.operator === '=' && targetFieldValue === options.expectedValue && !value) {
        field.report(`Field ${field} is required when ${options.targetField} is ${options.expectedValue}`, 'requiredObjectWhen', field);
    }
}
export const requiredObjectWhen = vine.createRule(requiredObjectRule);
//# sourceMappingURL=required_when_field.js.map