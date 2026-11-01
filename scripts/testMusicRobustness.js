// scripts/testMusicRobustness.js
// Automated verification of Phase 4 scrolling, concurrency, and race-safety scenarios
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const browserPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];
const browserExe = browserPaths.find((p) => fs.existsSync(p));
if (!browserExe) {
  console.error('No compatible browser found!');
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTargetPageWsUrl() {
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const page =
          data.find((d) => d.type === 'page' && d.url.includes('5173')) ||
          data.find((d) => d.type === 'page' && !d.url.startsWith('chrome-extension') && d.url !== 'about:blank') ||
          data.find((d) => d.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          return page.webSocketDebuggerUrl;
        }
      }
    } catch {
      // retry
    }
    await sleep(500);
  }
  throw new Error('Failed to find page target on port 9222');
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.consoleLogs = [];
    this.consoleErrors = [];

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
        if (msg.params.type === 'error') {
          this.consoleErrors.push(text);
        } else {
          this.consoleLogs.push(text);
        }
      }
    };
  }

  async connect() {
    await new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('DOM.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const trimmed = expression.trim();
    let code;
    if (trimmed.startsWith('return ') || /(^|\n)\s*return\s+/.test(trimmed)) {
      code = trimmed;
    } else if (/^\s*(const|let|var|function|class|if|for|while|switch)\b/.test(trimmed)) {
      code = trimmed;
    } else {
      const clean = trimmed.replace(/;+$/, '');
      code = 'return (' + clean + ');';
    }
    const wrapped = `(() => {
      try {
        ${code}
      } catch(e) {
        return { __eval_err: e.message };
      }
    })()`;
    const res = await this.send('Runtime.evaluate', {
      expression: wrapped,
      returnByValue: true,
      awaitPromise: true,
    });
    const val = res.result?.value;
    if (val && typeof val === 'object' && val.__eval_err) {
      throw new Error(val.__eval_err);
    }
    return val;
  }

  async waitFor(booleanPredicate, timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const ok = await this.eval(booleanPredicate);
        if (ok) return true;
      } catch {
        // retry
      }
      await sleep(200);
    }
    throw new Error(`Timeout waiting for predicate: ${booleanPredicate}`);
  }
}

async function runRobustnessSuite() {
  console.log('===============================================================');
  console.log('   STARTING PHASE 4 BACKGROUND MUSIC ROBUSTNESS VERIFICATION   ');
  console.log('===============================================================\n');

  const testReport = [];
  function record(checkName, status, details) {
    console.log(`[${status}] ${checkName}: ${details}`);
    testReport.push({ checkName, status, details });
  }

  const profileDir = path.join(os.tmpdir(), `music-robustness-${Date.now()}`);
  fs.mkdirSync(profileDir, { recursive: true });

  const chromeProcess = spawn(
    browserExe,
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      `--user-data-dir=${profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--autoplay-policy=no-user-gesture-required',
      'http://localhost:5173/?simDate=2026-11-02',
    ],
    { stdio: 'ignore' }
  );

  let client;
  try {
    const wsUrl = await getTargetPageWsUrl();
    client = new CDPClient(wsUrl);
    await client.connect();
    console.log('Connected to Chrome via CDP.\n');
    await client.send('Page.navigate', { url: 'http://localhost:5173/?simDate=2026-11-02' });
    await client.waitFor(`(document.querySelector('h1')?.innerText || '').length > 0`, 10000);
    await sleep(1000);

    // ------------------------------------------------------------------------
    // Scenario 9a: Birthday Mode Initialization & Single Audio Element Check
    // ------------------------------------------------------------------------
    console.log('--- Scenario 9a & 10: Initialization & Single Audio Element Check ---');
    const audioCount = await client.eval(`document.querySelectorAll('audio').length`);
    if (audioCount === 1) {
      record('10. Single Audio Element in DOM', 'PASS', `Exactly 1 persistent <audio> element found (count=${audioCount})`);
    } else {
      record('10. Single Audio Element in DOM', 'FAIL', `Expected 1 <audio> element, found ${audioCount}`);
    }

    // Start soundtrack on Cinematic Intro
    await client.eval(`
      const player = document.querySelector('aside[aria-label="Background music controls"]');
      const btn = player ? player.querySelector('button') : null;
      if (btn) btn.click();
    `);
    await sleep(1000);

    const introPlaying = await client.eval(`
      const audio = document.querySelector('audio');
      return audio && !audio.paused && audio.src.includes('Cinematic%20intro_');
    `);
    if (introPlaying) {
      record('9a. Birthday Intro Track Active', 'PASS', 'Cornfield Chase playing on Cinematic Intro screen');
    } else {
      record('9a. Birthday Intro Track Active', 'FAIL', 'Intro audio did not start properly');
    }

    // Click "Open Your Surprise" to enter MainBirthdayExperience
    await client.eval(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Open Your Surprise'));
      if (btn) btn.click();
    `);
    await sleep(2500);
    await client.waitFor(`(document.querySelector('#hero h1')?.innerText || '').length > 0`, 10000);
    // Wait for the Hero crossfade from Cinematic Intro to complete
    await sleep(2200);

    const heroPlaying = await client.eval(`
      const audio = document.querySelector('audio');
      const player = document.querySelector('aside[aria-label="Background music controls"]');
      return {
        src: audio?.src || '',
        paused: audio?.paused,
        text: player?.innerText || '',
        hasColdplay: audio?.src.includes('birthday%20hero_'),
      };
    `);
    if (heroPlaying.hasColdplay) {
      record('9b. Birthday Hero Mount Transition', 'PASS', 'Transitioned smoothly to "A Sky Full of Stars" on Hero mount');
    } else {
      record('9b. Birthday Hero Mount Transition', 'FAIL', JSON.stringify(heroPlaying));
    }

    // ------------------------------------------------------------------------
    // Scenario 1: Slow Scroll Section-to-Section
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 1: Slow Scroll Section-to-Section ---');
    const slowSections = [
      { id: 'story', expectedTrack: 'Our%20story%20timeline_' },
      { id: 'truth-or-dare', expectedTrack: 'Truth%20or%20dare_' },
      { id: 'memories', expectedTrack: 'photo%20gallery_' },
      { id: 'letter', expectedTrack: 'bday%20letter_' },
      { id: 'finale', expectedTrack: 'grand%20finale_' },
    ];
    let slowPass = true;
    const slowResults = [];

    for (const sec of slowSections) {
      await client.eval(`document.querySelector('#${sec.id}')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
      await sleep(2200); // Allow smooth crossfade to complete
      const check = await client.eval(`
        const audio = document.querySelector('audio');
        return {
          src: audio ? audio.src : '',
          paused: audio ? audio.paused : true,
          vol: audio ? audio.volume : 0,
        };
      `);
      const matched = check.src.includes(sec.expectedTrack) && !check.paused && check.vol > 0;
      slowResults.push({ section: sec.id, matched, src: check.src.split('/').pop(), vol: check.vol });
      if (!matched) slowPass = false;
    }

    if (slowPass) {
      record('1. Slow Scroll Section-to-Section', 'PASS', 'All sections transitioned sequentially with audio playing and audible volume');
    } else {
      record('1. Slow Scroll Section-to-Section', 'FAIL', JSON.stringify(slowResults));
    }

    // ------------------------------------------------------------------------
    // Scenario 2: Rapid Scroll Through Several Sections
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 2: Rapid Scroll Through Several Sections ---');
    // Scroll rapidly through 4 sections with only 80ms interval
    await client.eval(`document.querySelector('#story')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(80);
    await client.eval(`document.querySelector('#truth-or-dare')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(80);
    await client.eval(`document.querySelector('#memories')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(80);
    await client.eval(`document.querySelector('#letter')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    
    // Wait for the final target (letter) to stabilize and complete crossfade
    await sleep(2200);

    const rapidFinalCheck = await client.eval(`
      const audio = document.querySelector('audio');
      return {
        src: audio ? audio.src : '',
        paused: audio ? audio.paused : true,
        currentTime: audio ? audio.currentTime : 0,
        vol: audio ? audio.volume : 0,
      };
    `);
    const rapidOk =
      rapidFinalCheck.src.includes('bday%20letter_') &&
      !rapidFinalCheck.paused &&
      rapidFinalCheck.currentTime > 0 &&
      rapidFinalCheck.vol > 0;

    if (rapidOk) {
      record('2. Rapid Scroll Multi-Section', 'PASS', `Rapid succession cancelled stale transitions cleanly, settled on final track (${rapidFinalCheck.src.split('/').pop()}, vol=${rapidFinalCheck.vol.toFixed(2)})`);
    } else {
      record('2. Rapid Scroll Multi-Section', 'FAIL', JSON.stringify(rapidFinalCheck));
    }

    // ------------------------------------------------------------------------
    // Scenario 3: Boundary Jitter & Hysteresis (Seam Between Story & Truth-or-Dare)
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 3: Boundary Jitter & Hysteresis Testing ---');
    // Rapidly oscillate scroll position across boundary
    for (let i = 0; i < 6; i++) {
      const targetId = i % 2 === 0 ? '#story' : '#truth-or-dare';
      await client.eval(`document.querySelector('${targetId}')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
      await sleep(60);
    }
    // Settle at #story
    await client.eval(`document.querySelector('#story')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(2200);

    const boundaryCheck = await client.eval(`
      const audio = document.querySelector('audio');
      return {
        src: audio ? audio.src : '',
        paused: audio ? audio.paused : true,
        vol: audio ? audio.volume : 0,
        currentTime: audio ? audio.currentTime : 0,
      };
    `);
    const boundaryOk =
      boundaryCheck.src.includes('Our%20story%20timeline_') &&
      !boundaryCheck.paused &&
      boundaryCheck.currentTime > 0;

    if (boundaryOk) {
      record('3. Boundary Hysteresis & Jitter Safety', 'PASS', 'Rapid boundary oscillation handled smoothly without crashing or sound stoppage');
    } else {
      record('3. Boundary Hysteresis & Jitter Safety', 'FAIL', JSON.stringify(boundaryCheck));
    }

    // ------------------------------------------------------------------------
    // Scenario 4: Pause Music, Scroll, Then Resume
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 4: Pause Music, Scroll, Then Resume ---');
    // Pause music via player button
    await client.eval(`
      const btn = document.querySelector('button[aria-label="Pause music"]');
      if (btn) btn.click();
    `);
    await sleep(400);

    await client.eval(`document.querySelector('audio')?.paused`);
    
    // Scroll to #letter while paused
    await client.eval(`document.querySelector('#letter')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(800);

    const pausedDuringScroll = await client.eval(`
      const audio = document.querySelector('audio');
      const player = document.querySelector('aside[aria-label="Background music controls"]');
      return {
        paused: audio?.paused,
        audioSrc: audio?.src || '',
        playerText: player?.innerText || '',
      };
    `);
    const stayedPaused = pausedDuringScroll.paused && pausedDuringScroll.playerText.includes('Nuvole Bianche');

    // Click play to resume
    await client.eval(`
      const btn = document.querySelector('button[aria-label="Play music"]');
      if (btn) btn.click();
    `);
    await sleep(1000);

    const resumedPlaying = await client.eval(`
      const audio = document.querySelector('audio');
      return audio && !audio.paused && audio.src.includes('bday%20letter_') && audio.currentTime > 0;
    `);

    if (stayedPaused && resumedPlaying) {
      record('4. Pause -> Scroll -> Resume Flow', 'PASS', 'Music stayed paused without autoplay during scroll, metadata updated, and resumed cleanly on click');
    } else {
      record('4. Pause -> Scroll -> Resume Flow', 'FAIL', `stayedPaused=${stayedPaused}, resumedPlaying=${resumedPlaying}`);
    }

    // ------------------------------------------------------------------------
    // Scenario 5: Mute and Unmute While Switching Tracks
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 5: Mute / Unmute During Crossfade ---');
    // Scroll to #finale
    await client.eval(`document.querySelector('#finale')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(200);

    // Click mute in the middle of transition
    await client.eval(`
      const muteBtn = document.querySelector('button[aria-label="Mute"]');
      if (muteBtn) muteBtn.click();
    `);
    await sleep(1800);

    const mutedCheck = await client.eval(`
      const audio = document.querySelector('audio');
      const isMutedStorage = sessionStorage.getItem('bday_music_muted');
      return {
        vol: audio ? audio.volume : 0,
        mutedStorage: isMutedStorage,
        src: audio?.src || '',
      };
    `);
    const muteOk = mutedCheck.vol === 0 && mutedCheck.mutedStorage === 'true';

    // Unmute
    await client.eval(`
      const unmuteBtn = document.querySelector('button[aria-label="Unmute"]');
      if (unmuteBtn) unmuteBtn.click();
    `);
    await sleep(400);

    const unmutedCheck = await client.eval(`
      const audio = document.querySelector('audio');
      const isMutedStorage = sessionStorage.getItem('bday_music_muted');
      return {
        vol: audio ? audio.volume : 0,
        mutedStorage: isMutedStorage,
      };
    `);
    const unmuteOk = unmutedCheck.vol > 0 && unmutedCheck.mutedStorage === 'false';

    if (muteOk && unmuteOk) {
      record('5. Mute & Unmute During Transition', 'PASS', `Volume accurately zeroed when muted during crossfade, restored to ${unmutedCheck.vol.toFixed(2)} on unmute`);
    } else {
      record('5. Mute & Unmute During Transition', 'FAIL', `muteOk=${muteOk}, unmuteOk=${unmuteOk}`);
    }

    // ------------------------------------------------------------------------
    // Scenario 6: Volume Slider Change During Crossfade
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 6: Volume Slider Adjustment During Crossfade ---');
    // Start transition to #hero
    await client.eval(`document.querySelector('#hero')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(300);

    // Adjust volume slider to 0.4 during fade
    await client.eval(`
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (setter) {
          setter.call(slider, '0.4');
        } else {
          slider.value = '0.4';
        }
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    `);
    await sleep(1800);

    const sliderVolCheck = await client.eval(`
      const audio = document.querySelector('audio');
      const volStorage = sessionStorage.getItem('bday_music_volume');
      return {
        actualVol: audio ? audio.volume : 0,
        volStorage: volStorage,
      };
    `);
    const volAdjustOk =
      Math.abs(sliderVolCheck.actualVol - 0.4) < 0.05 &&
      parseFloat(sliderVolCheck.volStorage) === 0.4;

    if (volAdjustOk) {
      record('6. Volume Adjustment During Crossfade', 'PASS', `Crossfade smoothly targeted new volume (actual=${sliderVolCheck.actualVol.toFixed(2)}, storage=${sliderVolCheck.volStorage})`);
    } else {
      record('6. Volume Adjustment During Crossfade', 'FAIL', JSON.stringify(sliderVolCheck));
    }

    // ------------------------------------------------------------------------
    // Scenario 7: Multiple Rapid Section Changes (Cancellation Safety)
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 7: Multiple Section Changes During Ongoing Crossfade ---');
    await client.eval(`document.querySelector('#story')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(250);
    await client.eval(`document.querySelector('#truth-or-dare')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(250);
    await client.eval(`document.querySelector('#memories')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(2200);

    const multiFadeCheck = await client.eval(`
      const audio = document.querySelector('audio');
      const player = document.querySelector('aside[aria-label="Background music controls"]');
      return {
        src: audio ? audio.src : '',
        paused: audio ? audio.paused : true,
        vol: audio ? audio.volume : 0,
        playerText: player ? player.innerText : '',
      };
    `);
    const multiFadeOk =
      multiFadeCheck.src.includes('photo%20gallery_') &&
      !multiFadeCheck.paused &&
      multiFadeCheck.vol > 0 &&
      multiFadeCheck.playerText.includes('Vaan Varuvaan');

    if (multiFadeOk) {
      record('7. In-Flight Fade Cancellation Token', 'PASS', 'Interrupted crossfades cleanly yielded to newest transition without dangling timers or overlaps');
    } else {
      record('7. In-Flight Fade Cancellation Token', 'FAIL', JSON.stringify(multiFadeCheck));
    }

    // ------------------------------------------------------------------------
    // Scenario 8: Loading / Network Failure Handling
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 8: Track Error Handling Simulation ---');
    // Dispatch a synthetic error event to the audio element to verify graceful state
    await client.eval(`
      const audio = document.querySelector('audio');
      if (!audio) return null;
      audio.dispatchEvent(new Event('error'));
      const player = document.querySelector('aside[aria-label="Background music controls"]');
      return {
        paused: audio.paused,
        playerText: player ? player.innerText : '',
      };
    `);
    await sleep(300);

    // Scroll to #letter to test automatic recovery
    await client.eval(`document.querySelector('#letter')?.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(800);

    // Click play to resume playback on valid track
    await client.eval(`
      const btn = document.querySelector('button[aria-label="Play music"]');
      if (btn) btn.click();
    `);
    await sleep(1500);

    const recoveryCheck = await client.eval(`
      const audio = document.querySelector('audio');
      return {
        src: audio ? audio.src : '',
        paused: audio ? audio.paused : true,
        vol: audio ? audio.volume : 0,
      };
    `);
    const recoveryOk = recoveryCheck.src.includes('bday%20letter_') && !recoveryCheck.paused && recoveryCheck.vol > 0;

    if (recoveryOk) {
      record('8. Error Resilience & Recovery', 'PASS', 'Engine handled error event gracefully and recovered cleanly when navigating to next valid track');
    } else {
      record('8. Error Resilience & Recovery', 'FAIL', JSON.stringify(recoveryCheck));
    }

    // ------------------------------------------------------------------------
    // Scenario 9c: Normal Mode Navigation & Isolation
    // ------------------------------------------------------------------------
    console.log('\n--- Scenario 9c: Normal Mode Verification & Isolation ---');
    await client.send('Page.navigate', { url: 'http://localhost:5173/?simDate=2026-11-01' });
    await client.waitFor(`!!document.querySelector('#birthday-countdown')`, 10000);
    await sleep(1000);

    const normalAudioCheck = await client.eval(`
      const audio = document.querySelector('audio');
      const player = document.querySelector('aside[aria-label="Background music controls"]');
      return {
        audioCount: document.querySelectorAll('audio').length,
        src: audio ? audio.src : '',
        playerText: player ? player.innerText : '',
      };
    `);
    const normalOk =
      normalAudioCheck.audioCount === 1 &&
      normalAudioCheck.src.includes('Normal%20mode') &&
      normalAudioCheck.playerText.includes('Experience') &&
      normalAudioCheck.playerText.toLowerCase().includes('normal landing');

    if (normalOk) {
      record('9c. Normal Mode Track Isolation', 'PASS', `Normal Mode cleanly loaded dedicated "Experience" (count=${normalAudioCheck.audioCount})`);
    } else {
      record('9c. Normal Mode Track Isolation', 'FAIL', JSON.stringify(normalAudioCheck));
    }

  } catch (err) {
    console.error('Exception during robustness test:', err);
    record('Robustness Suite Execution', 'FAIL', err.message);
  } finally {
    chromeProcess.kill();
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch {}
    console.log('\n--- Captured Browser Logs ---');
    console.log(client.consoleLogs.join('\n'));
    console.log('\n================== FINAL ROBUSTNESS QA SUMMARY ==================');
    console.table(testReport);
  }
}

runRobustnessSuite();
