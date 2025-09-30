import Setting from '#models/setting';
import formatPrecision from '#utils/format_precision';
export const depositRequestCalculation = async (amount, user, agent) => {
    try {
        const depositSetting = await Setting.findBy({ key: 'deposit', value1: 'on' });
        if (!depositSetting) {
            throw new Error('This service is not available right now');
        }
        let regularFeePercentage = depositSetting ? formatPrecision(depositSetting.value2 ?? 0) : 0;
        if (agent.depositCharge !== null) {
            regularFeePercentage = regularFeePercentage + agent.depositCharge;
        }
        let fee = amount * (regularFeePercentage / 100);
        if (user.roleId === 3 && user.merchant) {
            if (user.merchant.depositFee !== null) {
                regularFeePercentage = user.merchant.depositFee;
                if (agent.depositCharge !== null) {
                    regularFeePercentage = regularFeePercentage + agent.depositCharge;
                }
                fee = amount * (regularFeePercentage / 100);
            }
        }
        return { amount: amount + fee, fee, totalAmount: amount };
    }
    catch (error) {
        console.error('Error in calculating deposit:', error);
        throw new Error(error.message);
    }
};
export const depositCalculation = async (amount, user) => {
    try {
        const depositSetting = await Setting.findBy({ key: 'deposit', value1: 'on' });
        if (!depositSetting) {
            throw new Error('This service is not available right now');
        }
        let regularFeePercentage = depositSetting ? formatPrecision(depositSetting.value2 ?? 0) : 0;
        let fee = amount * (regularFeePercentage / 100);
        if (user.roleId === 3 && user.merchant) {
            if (user.merchant.depositFee !== null) {
                fee = amount * (user.merchant.depositFee / 100);
            }
        }
        if (user.roleId === 4 && user.agent) {
            if (user.agent.depositFee !== null) {
                fee = amount * (user.agent.depositFee / 100);
            }
        }
        return { amount: amount + fee, fee, totalAmount: amount };
    }
    catch (error) {
        console.error('Error in calculation of deposit:', error);
        throw new Error(error.message);
    }
};
export const withdrawCalculation = async (amount, user, method) => {
    try {
        const withdrawSetting = await Setting.findBy({ key: 'withdraw', value1: 'on' });
        if (!withdrawSetting) {
            throw new Error('This service is not available right now');
        }
        let regularFeePercentage = withdrawSetting ? formatPrecision(withdrawSetting.value2 ?? 0) : 0;
        if (method.percentageCharge !== null) {
            regularFeePercentage = method.percentageCharge;
        }
        if (user.roleId === 3 && user.merchant) {
            if (user.merchant.isSuspend || user.merchant.status !== 'verified') {
                throw new Error('Your account is currently on hold. Please contact support');
            }
            if (user.merchant.withdrawalFee !== null) {
                regularFeePercentage = user.merchant.withdrawalFee;
            }
        }
        if (user.roleId === 4 && user.agent) {
            if (user.agent.isSuspend || user.agent.status !== 'verified') {
                throw new Error('Your account is currently on hold. Please contact support');
            }
            if (user.agent.withdrawalFee !== null) {
                regularFeePercentage = user.agent.withdrawalFee;
            }
        }
        let percentageFee = amount * (regularFeePercentage / 100);
        const fee = formatPrecision(percentageFee + method.fixedCharge);
        return { chargedAmount: formatPrecision(amount + fee), fee, recievedAmount: amount };
    }
    catch (error) {
        console.error('Error in calculation of withdraw:', error);
        throw new Error(error.message);
    }
};
//# sourceMappingURL=fees_calculation_service.js.map