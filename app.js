const fs = require('fs');
const cashIn = require('./utils/cashIn');
const cashOut = require('./utils/cashOut');
const CASH_IN_CONFIG = require('./constant/cashInConfig');
const CASH_OUT_CONFIG = require('./constant/cashOutConfig');
const USER_TYPES = require('./constant/userTypes');
const TRANSACTION_TYPES = require('./constant/transactionTypes');

function main() {
  const inputFileName = process.argv[2];

  if (!inputFileName) {
    console.log('Please provide a file name to read json data');
    return;
  }

  let data = [];

  try {
    const stringifiedData = fs.readFileSync(inputFileName).toString();
    data = JSON.parse(stringifiedData);
  } catch (error) {
    console.log('File not found!');
  }

  for (let index = 0; index < data.length; index += 1) {
    const item = data[index];

    let commission;

    if (item.type === TRANSACTION_TYPES.cashIn) {
      commission = cashIn(
        item.operation.amount,
        CASH_IN_CONFIG.commissionFee,
        CASH_IN_CONFIG.maximumCommissionFee,
      );
    }

    if (item.type === TRANSACTION_TYPES.cashOut) {
      commission = cashOut(
        {
          amount: item.operation.amount,
          date: item.date,
          userId: item.user_id,
          userType: item.user_type,
        },
        USER_TYPES,
        CASH_OUT_CONFIG,
      );
    }

    console.log(commission);
  }
}

main();
