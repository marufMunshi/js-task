const USER_TYPES = require('./userTypes');

const CASH_OUT_CONFIG = {
  [USER_TYPES.naturalTypeUser]: {
    commissionFee: 0.3,
    weeklyFreeCashOutThreshold: 1000.0,
  },
  [USER_TYPES.legalTypeUser]: {
    commissionFee: 0.3,
    minimumCommissionFeePerTransaction: 0.5,
  },
};

module.exports = CASH_OUT_CONFIG;
