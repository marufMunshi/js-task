const mathjs = require('mathjs');
const { getWeek, getYear } = require('date-fns');

/**
{
  'userId': {
    'year-weekNumberOfTheYear': {
      isWeeklyFreeCashOutThresholdExceeded: boolean,
      totalCashOutAmount: float
    }
  }
}
*/
const weeklyCashOutAmountCheckForNaturalPerson = {};

function checkWeeklyFreeCashOutThresholdExceeded(amount, amountToBeChecked) {
  return parseInt(amount, 10) > amountToBeChecked;
}

function calculateCashOutCommissionForNaturalUser({ amount, date, userId, config }) {
  const givenDate = new Date(date);
  const weekNumber = getWeek(givenDate, { weekStartsOn: 1 }); // week starts on monday
  const year = getYear(givenDate);

  const weekKey = `${year}-${weekNumber}`;

  const transactionHistory = weeklyCashOutAmountCheckForNaturalPerson[userId];

  let commission = 0.0;
  let amountToBeCalculated = amount;

  if (!transactionHistory) {
    const isWeeklyFreeCashOutThresholdExceeded = checkWeeklyFreeCashOutThresholdExceeded(
      amount,
      config.weeklyFreeCashOutThreshold,
    );

    if (isWeeklyFreeCashOutThresholdExceeded) {
      amountToBeCalculated = amount - config.weeklyFreeCashOutThreshold;
    }

    weeklyCashOutAmountCheckForNaturalPerson[userId] = {
      [weekKey]: {
        isWeeklyFreeCashOutThresholdExceeded,
        totalCashOutAmount: amount,
      },
    };
  } else {
    const transactionHistoryForGivenWeek = transactionHistory[weekKey];

    if (!transactionHistoryForGivenWeek) {
      const isWeeklyFreeCashOutThresholdExceeded = checkWeeklyFreeCashOutThresholdExceeded(
        amount,
        config.weeklyFreeCashOutThreshold,
      );

      if (isWeeklyFreeCashOutThresholdExceeded) {
        amountToBeCalculated = amount - config.weeklyFreeCashOutThreshold;
      }

      const newWeekEntry = {
        [weekKey]: {
          isWeeklyFreeCashOutThresholdExceeded,
          totalCashOutAmount: amount,
        },
      };

      weeklyCashOutAmountCheckForNaturalPerson[userId] = {
        ...transactionHistory,
        ...newWeekEntry,
      };
    } else {
      const totalCashOutAmount = transactionHistoryForGivenWeek.totalCashOutAmount + amount;

      // checking if this transaction would surpass weekly free threshold
      if (
        transactionHistoryForGivenWeek.isWeeklyFreeCashOutThresholdExceeded === false &&
        totalCashOutAmount > config.weeklyFreeCashOutThreshold
      ) {
        amountToBeCalculated = totalCashOutAmount - config.weeklyFreeCashOutThreshold;
      }

      weeklyCashOutAmountCheckForNaturalPerson[userId] = {
        ...transactionHistory,
        [weekKey]: {
          isWeeklyFreeCashOutThresholdExceeded: checkWeeklyFreeCashOutThresholdExceeded(
            totalCashOutAmount,
            config.weeklyFreeCashOutThreshold,
          ),
          totalCashOutAmount,
        },
      };
    }
  }

  const cashOutHistory = weeklyCashOutAmountCheckForNaturalPerson[userId][weekKey];

  if (cashOutHistory.isWeeklyFreeCashOutThresholdExceeded) {
    commission = mathjs.ceil((amountToBeCalculated * config.commissionFee) / 100, 2);
  }

  return commission;
}

function calculateCommissionForLegalUser(amount, config) {
  let commission = 0.0;

  commission = mathjs.ceil((amount * config.commissionFee) / 100, 2);

  if (commission < config.minimumCommissionFeePerTransaction) {
    return config.minimumCommissionFeePerTransaction;
  }

  return commission;
}

function cashOut(params, userTypes, cashOutConfig) {
  const { date, amount, userType, userId } = params;

  let commission = 0.0;

  if (userType === userTypes.naturalTypeUser) {
    commission = calculateCashOutCommissionForNaturalUser({
      amount,
      date,
      userId,
      config: cashOutConfig[userType],
    });
  }

  if (userType === userTypes.legalTypeUser) {
    commission = calculateCommissionForLegalUser(amount, cashOutConfig[userType]);
  }

  return Number(commission).toFixed(2);
}

module.exports = cashOut;
