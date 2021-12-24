const mathjs = require('mathjs');

function cashIn(amount, commissionFee, maximumCommissionFee) {
  let commission = mathjs.ceil((amount * commissionFee) / 100, 2);

  if (commission > maximumCommissionFee) {
    commission = 5.0;
  }

  return Number(commission).toFixed(2);
}

module.exports = cashIn;
