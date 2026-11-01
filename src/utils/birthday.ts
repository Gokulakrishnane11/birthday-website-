// Dynamic Birthday & Timezone Utilities for Deepa Dharshini
// Timezone: Asia/Kolkata (IST = UTC+05:30)
// Date of Birth: November 2, 2007 (2007-11-02)

export const BIRTH_YEAR = 2007;
export const BIRTH_MONTH = 11; // November
export const BIRTH_DAY = 2;
export const TIMEZONE = 'Asia/Kolkata';

export interface ISTDateParts {
  year: number;
  month: number; // 1 - 12
  day: number;   // 1 - 31
  hour: number;  // 0 - 23
  minute: number;
  second: number;
}

export interface BirthdayCountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthdayToday: boolean;
  currentAge: number;
  turningAge: number;
  targetYear: number;
  formattedTargetDate: string;
}

/**
 * Returns an injectable reference date (or current Date).
 * Supports simulation via URL parameter ?simDate=YYYY-MM-DD or sessionStorage.
 * Restricted to development and local testing environments.
 */
export function getEffectiveDate(injectedDate?: Date | string): Date {
  if (injectedDate) {
    return typeof injectedDate === 'string' ? new Date(injectedDate) : injectedDate;
  }

  // Check browser query string or storage for mock testing in development/testing only
  if (typeof window !== 'undefined') {
    const isDevelopment = Boolean(
      import.meta.env?.DEV ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === ''
    );

    if (isDevelopment) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const simDate = urlParams.get('simDate');
        if (simDate) {
          const parsed = new Date(simDate);
          if (!isNaN(parsed.getTime())) return parsed;
        }
        const stored = sessionStorage.getItem('bday_mock_date');
        if (stored) {
          const parsed = new Date(stored);
          if (!isNaN(parsed.getTime())) return parsed;
        }
      } catch {
        // Ignore URL/storage access errors
      }
    }
  }

  return new Date();
}

/**
 * Returns a deterministic quote index for any given date in Asia/Kolkata.
 * Stays completely identical throughout the same IST day, even upon multiple page refreshes.
 * Automatically advances to the next quote at midnight IST.
 */
export function getDailyQuoteIndex(dateInput?: Date | string, totalQuotes: number = 36): number {
  if (totalQuotes <= 0) return 0;
  const parts = getISTParts(dateInput);
  const dayEpoch = Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / 86400000);
  return ((dayEpoch % totalQuotes) + totalQuotes) % totalQuotes;
}

/**
 * Parses any Date into calendar components in Asia/Kolkata timezone.
 */
export function getISTParts(dateInput?: Date | string): ISTDateParts {
  const date = getEffectiveDate(dateInput);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, number> = {};

  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = parseInt(part.value, 10);
    }
  }

  return {
    year: map.year ?? date.getUTCFullYear(),
    month: map.month ?? date.getUTCMonth() + 1,
    day: map.day ?? date.getUTCDate(),
    hour: map.hour ?? 0,
    minute: map.minute ?? 0,
    second: map.second ?? 0,
  };
}

/**
 * Returns true if today in Asia/Kolkata is November 2.
 */
export function isBirthdayToday(dateInput?: Date | string): boolean {
  const parts = getISTParts(dateInput);
  return parts.month === BIRTH_MONTH && parts.day === BIRTH_DAY;
}

/**
 * Calculates Deepa's current age in completed years in Asia/Kolkata.
 */
export function getCurrentAge(dateInput?: Date | string): number {
  const parts = getISTParts(dateInput);

  if (parts.year < BIRTH_YEAR) return 0;

  // Before November 2 in the current year, she has not yet reached her birthday
  if (parts.month < BIRTH_MONTH || (parts.month === BIRTH_MONTH && parts.day < BIRTH_DAY)) {
    return parts.year - BIRTH_YEAR - 1;
  }

  // On or after November 2
  return parts.year - BIRTH_YEAR;
}

/**
 * Returns UTC timestamp representing midnight IST (00:00:00) on November 2 of targetYear.
 * Since IST is UTC+05:30, 00:00:00 IST on Nov 2 is 18:30:00 UTC on Nov 1.
 */
export function getBirthdayTargetUtc(targetYear: number): Date {
  return new Date(Date.UTC(targetYear, BIRTH_MONTH - 1, BIRTH_DAY - 1, 18, 30, 0, 0));
}

/**
 * Returns the year of the next upcoming birthday.
 * If today is Nov 2 (Birthday today), returns current year.
 * If today is Nov 3 onwards, returns next year.
 */
export function getNextBirthdayYear(dateInput?: Date | string): number {
  const parts = getISTParts(dateInput);

  if (parts.month === BIRTH_MONTH && parts.day === BIRTH_DAY) {
    return parts.year;
  }

  if (parts.month > BIRTH_MONTH || (parts.month === BIRTH_MONTH && parts.day > BIRTH_DAY)) {
    return parts.year + 1;
  }

  return parts.year;
}

/**
 * Returns full countdown and state metrics for the next birthday.
 */
export function getBirthdayCountdown(dateInput?: Date | string): BirthdayCountdownResult {
  const date = getEffectiveDate(dateInput);
  const parts = getISTParts(date);
  const isToday = parts.month === BIRTH_MONTH && parts.day === BIRTH_DAY;

  // If today is Nov 2, target is today's birthday celebration;
  // If Nov 3 onwards, target is next year's Nov 2;
  // If before Nov 2, target is this year's Nov 2.
  let targetYear = parts.year;
  if (!isToday && (parts.month > BIRTH_MONTH || (parts.month === BIRTH_MONTH && parts.day > BIRTH_DAY))) {
    targetYear = parts.year + 1;
  }

  const targetDate = getBirthdayTargetUtc(targetYear);
  const diffMs = targetDate.getTime() - date.getTime();

  // If birthday is today or difference is zero/negative
  if (isToday || diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isBirthdayToday: isToday,
      currentAge: getCurrentAge(date),
      turningAge: targetYear - BIRTH_YEAR,
      targetYear,
      formattedTargetDate: `November 2, ${targetYear}`,
    };
  }

  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isBirthdayToday: false,
    currentAge: getCurrentAge(date),
    turningAge: targetYear - BIRTH_YEAR,
    targetYear,
    formattedTargetDate: `November 2, ${targetYear}`,
  };
}

/**
 * Returns a human-friendly formatted current IST date string.
 * e.g., "Sunday, November 1, 2026"
 */
export function getFormattedCurrentISTDate(dateInput?: Date | string): string {
  const date = getEffectiveDate(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Returns contextual greeting mode text based on current date in IST.
 */
export function getBirthdayGreetingContext(dateInput?: Date | string): {
  headline: string;
  badge: string;
  tagline: string;
} {
  const cd = getBirthdayCountdown(dateInput);

  if (cd.isBirthdayToday) {
    return {
      badge: `🎉 TODAY IS YOUR ${cd.currentAge}TH BIRTHDAY!`,
      headline: `Happiest ${cd.currentAge}th Birthday, Deepa! ❤️`,
      tagline: `Today is all about celebrating the wonderful, bubbly, caring person you are.`,
    };
  }

  if (cd.days === 0 && cd.hours <= 12) {
    return {
      badge: `⏳ ALMOST TIME • JUST A FEW HOURS AWAY!`,
      headline: `The Countdown is Almost Over, Gundoos! 🐼`,
      tagline: `Your ${cd.turningAge}th birthday begins tonight at midnight IST!`,
    };
  }

  if (cd.days <= 7) {
    return {
      badge: `✨ BIRTHDAY WEEK IS HERE!`,
      headline: `Only ${cd.days} ${cd.days === 1 ? 'Day' : 'Days'} Until Your Birthday! 🐼`,
      tagline: `Counting down the final days to November 2, ${cd.targetYear}.`,
    };
  }

  return {
    badge: `🐼 A DIGITAL KEEPSAKE FOR GUNDOOS`,
    headline: `Hey Gundoos... 🐼`,
    tagline: `Just a little corner of the internet made especially for you, counting down to November 2.`,
  };
}
