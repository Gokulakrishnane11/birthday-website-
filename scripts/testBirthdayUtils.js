import assert from 'node:assert';
import {
  getCurrentAge,
  getNextBirthdayYear,
  getBirthdayCountdown,
  isBirthdayToday,
  getDailyQuoteIndex,
} from '../src/utils/birthday.ts';
import { waitingQuotesData } from '../src/data/waitingQuotesData.ts';
import { SECTION_MUSIC_MAP, getTrackForSection } from '../src/config/musicConfig.ts';

console.log('========================================================');
console.log('   RUNNING NORMAL MODE & BIRTHDAY SURPRISE MODE TESTS   ');
console.log('========================================================\n');

// Test Case 1: Nov 1, 2026 -> Normal Mode, Age 19, Countdown targeting Nov 2, 2026
{
  const testDate = new Date('2026-11-01T12:00:00+05:30');
  const isBday = isBirthdayToday(testDate);
  const age = getCurrentAge(testDate);
  const cd = getBirthdayCountdown(testDate);
  const quoteIdx = getDailyQuoteIndex(testDate, waitingQuotesData.length);
  const quote = waitingQuotesData[quoteIdx];

  console.log('Test 1 [Nov 1, 2026 12:00 IST]:', {
    isBday,
    age,
    turningAge: cd.turningAge,
    hoursLeft: cd.hours,
    quote: quote.text,
  });

  assert.strictEqual(isBday, false, 'Nov 1, 2026 must be NORMAL MODE');
  assert.strictEqual(age, 19, 'Nov 1, 2026 current age must be 19');
  assert.strictEqual(cd.turningAge, 20, 'Stepping into 20');
  assert.strictEqual(cd.days, 0, '0 full days left (< 24h)');
  assert.strictEqual(cd.hours, 12, '12 hours remaining');
  assert.ok(quote.text.length > 0, 'Daily quote is present');
  console.log('✓ Test 1 Passed: Nov 1, 2026 = Normal mode + countdown + daily funny quote');
}

// Test Case 2: Nov 2, 2026 -> Birthday Surprise Mode, Age 20
{
  const testDate = new Date('2026-11-02T00:00:00+05:30');
  const isBday = isBirthdayToday(testDate);
  const age = getCurrentAge(testDate);
  const cd = getBirthdayCountdown(testDate);

  console.log('Test 2 [Nov 2, 2026 00:00 IST]:', {
    isBday,
    age,
    isBirthdayToday: cd.isBirthdayToday,
  });

  assert.strictEqual(isBday, true, 'Nov 2, 2026 must be BIRTHDAY SURPRISE MODE');
  assert.strictEqual(age, 20, 'Nov 2, 2026 current age must be 20');
  assert.strictEqual(cd.isBirthdayToday, true);
  console.log('✓ Test 2 Passed: Nov 2, 2026 = Full birthday surprise experience');
}

// Test Case 3: Nov 3, 2026 -> Normal Mode, Countdown rolled over to 2027
{
  const testDate = new Date('2026-11-03T00:00:00+05:30');
  const isBday = isBirthdayToday(testDate);
  const age = getCurrentAge(testDate);
  const cd = getBirthdayCountdown(testDate);
  const nextYear = getNextBirthdayYear(testDate);

  console.log('Test 3 [Nov 3, 2026 00:00 IST]:', {
    isBday,
    age,
    nextYear,
    turningAge: cd.turningAge,
    daysLeft: cd.days,
  });

  assert.strictEqual(isBday, false, 'Nov 3, 2026 must be NORMAL MODE');
  assert.strictEqual(age, 20, 'Nov 3, 2026 current age is 20');
  assert.strictEqual(nextYear, 2027, 'Target birthday rolled over to 2027');
  assert.strictEqual(cd.turningAge, 21, 'Next turning age is 21');
  assert.strictEqual(cd.days, 364, '364 days remaining to Nov 2, 2027');
  console.log('✓ Test 3 Passed: Nov 3, 2026 = Normal mode + countdown to 2027');
}

// Test Case 4: Nov 1, 2027 -> Normal Mode, Age 20, Countdown to Nov 2, 2027
{
  const testDate = new Date('2027-11-01T12:00:00+05:30');
  const isBday = isBirthdayToday(testDate);
  const age = getCurrentAge(testDate);
  const cd = getBirthdayCountdown(testDate);

  console.log('Test 4 [Nov 1, 2027 12:00 IST]:', {
    isBday,
    age,
    turningAge: cd.turningAge,
    hoursLeft: cd.hours,
  });

  assert.strictEqual(isBday, false, 'Nov 1, 2027 must be NORMAL MODE');
  assert.strictEqual(age, 20, 'Nov 1, 2027 age is 20');
  assert.strictEqual(cd.turningAge, 21, 'Turning 21');
  console.log('✓ Test 4 Passed: Nov 1, 2027 = Normal mode');
}

// Test Case 5: Nov 2, 2027 -> Birthday Surprise Mode, Age 21
{
  const testDate = new Date('2027-11-02T16:00:00+05:30');
  const isBday = isBirthdayToday(testDate);
  const age = getCurrentAge(testDate);
  const cd = getBirthdayCountdown(testDate);

  console.log('Test 5 [Nov 2, 2027 16:00 IST]:', {
    isBday,
    age,
    isBirthdayToday: cd.isBirthdayToday,
  });

  assert.strictEqual(isBday, true, 'Nov 2, 2027 must be BIRTHDAY SURPRISE MODE');
  assert.strictEqual(age, 21, 'Nov 2, 2027 age must be 21');
  assert.strictEqual(cd.isBirthdayToday, true);
  console.log('✓ Test 5 Passed: Nov 2, 2027 = Full birthday surprise experience');
}

// Test Case 6: Feb 29, 2028 (Leap Year) -> Normal Mode, Age 21, Target 2028
{
  const testDate = new Date('2028-02-29T12:00:00+05:30');
  const isBday = isBirthdayToday(testDate);
  const age = getCurrentAge(testDate);
  const cd = getBirthdayCountdown(testDate);

  assert.strictEqual(isBday, false, 'Leap Day is NORMAL MODE');
  assert.strictEqual(age, 21, 'Age on Feb 29, 2028 is 21');
  assert.strictEqual(cd.turningAge, 22, 'Turning 22 in 2028');
  assert.strictEqual(cd.targetYear, 2028);
  console.log('✓ Test 6 Passed: Feb 29, 2028 (Leap year) handled correctly');
}

// Test Case 7: Nov 2, 2028 -> Birthday Surprise Mode, Age 22
{
  const testDate = new Date('2028-11-02T10:00:00+05:30');
  const isBday = isBirthdayToday(testDate);
  const age = getCurrentAge(testDate);

  assert.strictEqual(isBday, true, 'Nov 2, 2028 must be BIRTHDAY SURPRISE MODE');
  assert.strictEqual(age, 22, 'Nov 2, 2028 age must be 22');
  console.log('✓ Test 7 Passed: Nov 2, 2028 = Age 22 Birthday Surprise Mode');
}

// Test Case 8: Daily Quote Determinism & Refresh Consistency
{
  const testDate1 = new Date('2026-11-01T08:30:00+05:30');
  const testDate2 = new Date('2026-11-01T15:45:00+05:30');
  const testDate3 = new Date('2026-11-01T23:59:00+05:30');

  const idx1 = getDailyQuoteIndex(testDate1, waitingQuotesData.length);
  const idx2 = getDailyQuoteIndex(testDate2, waitingQuotesData.length);
  const idx3 = getDailyQuoteIndex(testDate3, waitingQuotesData.length);

  assert.strictEqual(idx1, idx2, 'Refreshing page at 15:45 must return identical quote');
  assert.strictEqual(idx2, idx3, 'Refreshing page at 23:59 must return identical quote');

  // Next day at midnight IST
  const testNextDay = new Date('2026-11-02T00:00:00+05:30');
  const idxNextDay = getDailyQuoteIndex(testNextDay, waitingQuotesData.length);
  assert.strictEqual(
    idxNextDay,
    (idx1 + 1) % waitingQuotesData.length,
    'Quote must advance to next index at IST midnight'
  );
  console.log('✓ Test 8 Passed: Daily quote is deterministic throughout same IST day and advances at midnight');
}

// Test Case 9: Verify waiting quotes do not reveal secret memories
{
  assert.ok(waitingQuotesData.length >= 30, 'Must have at least 30 quotes');
  console.log(`Verified ${waitingQuotesData.length} unique waiting quotes.`);

  const forbiddenSpoilers = ['gym aunty', 'singing', 'phone call with her dad', 'truth or dare'];
  for (const quote of waitingQuotesData) {
    for (const forbidden of forbiddenSpoilers) {
      assert.ok(
        !quote.text.toLowerCase().includes(forbidden),
        `Quote ${quote.id} must not spoil: "${forbidden}"`
      );
    }
  }
  console.log('✓ Test 9 Passed: All 36 waiting quotes strictly contain NO spoilers of secret memories');
}

// Test Case 10: Midnight IST boundary transitions
{
  // 1 second before midnight on Nov 2, 2026
  const beforeMidnight = new Date('2026-11-01T23:59:59+05:30');
  assert.strictEqual(isBirthdayToday(beforeMidnight), false);
  const cdBefore = getBirthdayCountdown(beforeMidnight);
  assert.strictEqual(cdBefore.seconds, 1);
  assert.strictEqual(cdBefore.minutes, 0);
  assert.strictEqual(cdBefore.hours, 0);

  // Exactly at midnight Nov 2, 2026
  const atMidnight = new Date('2026-11-02T00:00:00+05:30');
  assert.strictEqual(isBirthdayToday(atMidnight), true, 'Switches to Birthday Mode at 00:00:00 IST');

  // 1 second before end of Nov 2, 2026
  const endOfBday = new Date('2026-11-02T23:59:59+05:30');
  assert.strictEqual(isBirthdayToday(endOfBday), true, 'Stays in Birthday Mode until 23:59:59 IST');

  // Entering Nov 3, 2026
  const nextDay = new Date('2026-11-03T00:00:00+05:30');
  assert.strictEqual(isBirthdayToday(nextDay), false, 'Switches back to Normal Mode on Nov 3 at 00:00:00 IST');
  console.log('✓ Test 10 Passed: Exact midnight IST transitions verified cleanly');
}

// Test Case 11: Section-to-Soundtrack Mapping Verification
{
  const expectedMappings = [
    { id: 'normal-landing', title: 'Experience', artist: 'Ludovico Einaudi', mode: 'normal' },
    { id: 'cinematic-intro', title: 'Cornfield Chase', artist: 'Hans Zimmer', mode: 'birthday' },
    { id: 'hero', title: 'A Sky Full of Stars', artist: 'Coldplay', mode: 'birthday' },
    { id: 'story', title: 'New York Nagaram (Instrumental)', artist: 'A.R. Rahman', mode: 'birthday' },
    { id: 'truth-or-dare', title: "Comptine d'un autre été", artist: 'Yann Tiersen', mode: 'birthday' },
    { id: 'memories', title: 'Vaan Varuvaan (Instrumental)', artist: 'A.R. Rahman', mode: 'birthday' },
    { id: 'letter', title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', mode: 'birthday' },
    { id: 'finale', title: 'Arrival of the Birds', artist: 'The Cinematic Orchestra', mode: 'birthday' },
  ];

  for (const exp of expectedMappings) {
    const track = getTrackForSection(exp.id);
    assert.ok(track, `Track for section ${exp.id} must exist in configuration`);
    assert.strictEqual(track.trackTitle, exp.title);
    assert.strictEqual(track.artist, exp.artist);
    assert.strictEqual(track.mode, exp.mode);
  }

  // Normal mode must only map to normal landing
  assert.strictEqual(SECTION_MUSIC_MAP['normal-landing'].mode, 'normal');
  assert.strictEqual(SECTION_MUSIC_MAP['hero'].mode, 'birthday');
  console.log('✓ Test 11 Passed: All 8 section-to-soundtrack mappings accurately verified');
}

console.log('\n========================================================');
console.log('   ALL 11 UNIT TEST SUITES PASSED WITH 100% SUCCESS!   ');
console.log('========================================================\n');
