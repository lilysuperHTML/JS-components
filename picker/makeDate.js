const MIN_YEAR = 2000;
const MAX_YEAR = new Date().getFullYear() + 15;

const isLeapYear = (year) => (year % 100 !== 0 && year % 4 === 0 || year % 400 === 0);

const generateArray = (m, n) => {
  let result = [];
  let tmp;
  for (let i = m; i <= n; i++) {
    tmp = String(i).length === 1 ? `0${i}` : String(i);
    result.push(tmp);
  }
  return result;
};

const getYears = (min = MIN_YEAR, max = MAX_YEAR) => generateArray(min, max);

const getMonths = () => generateArray(1, 12);

const getDays = (year, month) => {
  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      return generateArray(1, 31);
    case '04':
    case '06':
    case '09':
    case '11':
      return generateArray(1, 30);
    case '02':
      return generateArray(1, isLeapYear(year) ? 29 : 28);
    default:
      return [];
  }
};

export {
  getYears,
  getMonths,
  getDays,
};
