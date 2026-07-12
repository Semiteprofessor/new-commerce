import {
  format,
  addWeeks,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subWeeks,
  subYears,
  isBefore,
  addDays,
  subDays,
} from 'date-fns';

export const formatDate = (
  date: Date = new Date(),
  dateFormat: string = 'yyyy-MM-d',
) => {
  return format(new Date(date), dateFormat);
};

export const today = () => formatDate();

export const computeNextMonthlyDate = (date: Date, amount: number = 1) => {
  return formatDate(addMonths(date, amount));
};

export const computeNextWeeklyDate = (date: Date, amount: number = 1) => {
  return formatDate(addWeeks(date, amount));
};

export const computeNextQuarterlyDate = (date: Date) => {
  return formatDate(addMonths(date, 3));
};

export const getStartAndEndDateForThisWeek = (): {
  start_date: string;
  end_date: string;
} => {
  const now = new Date();
  const startDate = startOfWeek(now, { weekStartsOn: 0 });
  const endDate = endOfWeek(now, { weekStartsOn: 0 });

  const dateFormat = 'yyyy-MM-dd';

  const start_date = format(startDate, dateFormat);
  const end_date = format(endDate, dateFormat);

  return { start_date, end_date };
};

export const getStartAndEndDateForLastWeek = (): {
  start_date: string;
  end_date: string;
} => {
  const now = new Date();
  const startLastWeekDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
  const endLastWeekDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });

  const dateFormat = 'yyyy-MM-dd';

  const start_date = format(startLastWeekDate, dateFormat);
  const end_date = format(endLastWeekDate, dateFormat);

  return { start_date, end_date };
};

/**
 * Get the first and last days of a month in the current year
 * @param month
 * @param year
 * @returns
 */
export const getFirstAndLastDaysOfTheMonth = (
  month = new Date().getMonth() + 1,
  year: number | null = new Date().getFullYear(),
): { first_day: string; last_day: string } => {
  const firstDayDate = startOfMonth(new Date(year, month - 1, 1));
  const lastDayDate = endOfMonth(new Date(year, month - 1, 1));

  const dateFormat = 'yyyy-MM-dd'; // ISO date format without time

  const first_day = format(firstDayDate, dateFormat);
  const last_day = format(lastDayDate, dateFormat);

  return { first_day, last_day };
};

/**
 *
 */
export const getStartAndEndOfYear = (yearOffset) => {
  const currentYear = new Date().getFullYear();
  const givenYear = currentYear - yearOffset;

  const startOfGivenYear = startOfYear(new Date(givenYear, 0, 1)); // Month is zero-indexed, so January is 0
  const endOfGivenYear = endOfYear(new Date(givenYear, 11, 31)); // December is 11, and it's the 31st day

  const formattedStartOfGivenYear = format(startOfDay(startOfGivenYear), 'yyyy-MM-dd');
  const formattedEndOfGivenYear = format(endOfDay(endOfGivenYear), 'yyyy-MM-dd');

  return {
    start: formattedStartOfGivenYear,
    end: formattedEndOfGivenYear,
  };
};

export const computeNextYearlyDate = (date: Date) => {
  return formatDate(addYears(date, 1), 'yyyy-MM-dd');
};

export const computeBiAnnualDate = (date: Date, amount: number = 5) => {
  return formatDate(addMonths(date, amount));
};

export const computeMonthAndYear = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${year}`;
};

export const computeDOBFromAge = (age: number) => {
  return formatDate(subYears(new Date(), age));
};

export const isBeforeToday = (date: Date) => {
  return isBefore(date, startOfDay(new Date()));
};

export const getCurrentTimestamp = (
  dateFormat: string = 'yyyy-MM-dd HH:mm:ss',
): string => {
  return formatDate(undefined, dateFormat);
};

export const addDaysToDateObject = (
  date: Date | string,
  days: number,
): Date => {
  return addDays(new Date(date), days);
};

export const subtractDaysFromDate = (date: Date, days: number): string => {
  return formatDate(subDays(date, days), 'yyyy-MM-dd');
};
