const cashIn = require('./cashIn');
const CASH_IN_CONFIG = require('../constant/cashInConfig');

test('200 amount cash_in commission would be 0.06', () => {
  expect(cashIn(200.0, CASH_IN_CONFIG.commissionFee, CASH_IN_CONFIG.maximumCommissionFee)).toBe(
    '0.06',
  );
});

test(`commission is not more than ${CASH_IN_CONFIG.maximumCommissionFee}0`, () => {
  expect(
    cashIn(2000000000000.0, CASH_IN_CONFIG.commissionFee, CASH_IN_CONFIG.maximumCommissionFee),
  ).toBe(Number(CASH_IN_CONFIG.maximumCommissionFee).toFixed(2));
});
