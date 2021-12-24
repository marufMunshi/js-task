const cashOut = require('./cashOut');
const CASH_OUT_CONFIG = require('../constant/cashOutConfig');
const USER_TYPES = require('../constant/userTypes');
const { getWeek, getYear } = require('date-fns');

test.each([
  {
    date: '2016-02-15',
    userId: 1,
    userType: 'natural',
    amount: 300,
    expected: '0.00',
    userTypes: USER_TYPES,
    config: CASH_OUT_CONFIG,
  },
  {
    date: '2016-02-17',
    userId: 1,
    userType: 'natural',
    amount: 400,
    expected: '0.00',
    userTypes: USER_TYPES,
    config: CASH_OUT_CONFIG,
  },
  {
    date: '2016-02-18',
    userId: 1,
    userType: 'natural',
    amount: 200,
    expected: '0.00',
    userTypes: USER_TYPES,
    config: CASH_OUT_CONFIG,
  },
  {
    date: '2016-02-18',
    userId: 1,
    userType: 'natural',
    amount: 400,
    expected: '0.90',
    userTypes: USER_TYPES,
    config: CASH_OUT_CONFIG,
  },
  {
    date: '2016-03-18',
    userId: 1,
    userType: 'natural',
    amount: 700,
    expected: '0.00',
    userTypes: USER_TYPES,
    config: CASH_OUT_CONFIG,
  },
])(
  'weekly cashOut limit test for natural user ($amount, $date, $userType, $userId)',
  ({ userTypes, config, expected, ...params }) => {
    expect(cashOut(params, userTypes, config)).toBe(expected);
  },
);

test.each([
  {
    date: '2016-05-12',
    userId: 10,
    userType: 'natural',
    amount: 30000,
    expected: '87.00',
    userTypes: USER_TYPES,
    config: CASH_OUT_CONFIG,
  },
  {
    date: '2016-05-13',
    userId: 10,
    userType: 'natural',
    amount: 1000.0,
    expected: '3.00',
    userTypes: USER_TYPES,
    config: CASH_OUT_CONFIG,
  },
])(
  'weekly cashOut limit test for natural user when first transaction exceeded free limit',
  ({ userTypes, config, expected, ...params }) => {
    expect(cashOut(params, userTypes, config)).toBe(expected);
  },
);

test('minimum cash out commission fee legal user', () => {
  expect(
    cashOut(
      {
        date: '2016-01-06',
        userId: 2,
        userType: 'juridical',
        type: 'cash_out',
        amount: 10.0,
      },
      USER_TYPES,
      CASH_OUT_CONFIG,
    ),
  ).toBe(`${CASH_OUT_CONFIG[USER_TYPES.legalTypeUser].minimumCommissionFeePerTransaction}0`);
});

test('cash out commission fee legal user', () => {
  expect(
    cashOut(
      {
        date: '2016-01-06',
        userId: 2,
        userType: 'juridical',
        type: 'cash_out',
        amount: 300.0,
      },
      USER_TYPES,
      CASH_OUT_CONFIG,
    ),
  ).toBe('0.90');
});
