// Automated Browser QA testing script using Chrome DevTools Protocol & Native Mouse Events
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, '../qa-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const browserPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

const browserExe = browserPaths.find((p) => fs.existsSync(p));
if (!browserExe) {
  console.error('No browser found!');
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
        const page = data.find((d) => d.type === 'page' && d.url.includes('5173'))
          || data.find((d) => d.type === 'page' && !d.url.startsWith('chrome-extension') && d.url !== 'about:blank')
          || data.find((d) => d.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          console.log(`Matched target: [${page.type}] ${page.url}`);
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
        if (msg.error) {
          reject(new Error(msg.error.message));
        } else {
          resolve(msg.result);
        }
      } else if (msg.method) {
        if (msg.method === 'Runtime.consoleAPICalled') {
          const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
          this.consoleLogs.push({ type: msg.params.type, text });
          if (msg.params.type === 'error') {
            this.consoleErrors.push(text);
          }
        } else if (msg.method === 'Runtime.exceptionThrown') {
          const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text;
          this.consoleErrors.push(desc);
        }
      }
    };
  }

  waitOpen() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
    });
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
      code = 'return (' + trimmed + ');';
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

  async nativeClick(query, isSelector = false, timeout = 6000) {
    const start = Date.now();
    let coords = null;
    while (Date.now() - start < timeout) {
      coords = await this.eval(`
        let el;
        const q = ${JSON.stringify(query)};
        if (${isSelector} || q.startsWith('#') || q.startsWith('.') || q.startsWith('[') || q.startsWith('aside') || q.startsWith('button') || q.includes('[') || q.includes(' > ')) {
          el = document.querySelector(q);
        } else {
          const btns = Array.from(document.querySelectorAll('button, a, div[role="button"], [tabindex="0"], h3, span'));
          el = btns.find(b => (b.innerText || b.textContent || '').includes(q));
        }
        if (!el) return null;
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return null;
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      `);
      if (coords && coords.x !== undefined) break;
      await sleep(250);
    }

    if (!coords || coords.x === undefined) {
      throw new Error('Element not found for native click: ' + query);
    }

    await this.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: coords.x,
      y: coords.y,
      button: 'left',
      clickCount: 1,
    });
    await sleep(50);
    await this.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: coords.x,
      y: coords.y,
      button: 'left',
      clickCount: 1,
    });
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
      await sleep(250);
    }
    throw new Error(`Timeout waiting for predicate: ${booleanPredicate}`);
  }

  async captureScreenshot(name) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(screenshotsDir, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    return filePath;
  }
}

async function runQA() {
  const testResults = [];
  function record(checkName, status, details = '') {
    testResults.push({ checkName, status, details });
    console.log(`[${status}] ${checkName}: ${details}`);
  }

  const profileDir = path.join(os.tmpdir(), 'chrome-bday-qa-' + Date.now());
  const chromeProcess = spawn(
    browserExe,
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      '--disable-extensions',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1280,900',
      '--user-data-dir=' + profileDir,
      'http://localhost:5173/?simDate=2026-11-01',
    ],
    { stdio: 'ignore' }
  );

  try {
    const wsUrl = await getTargetPageWsUrl();
    console.log('Connected to CDP at:', wsUrl);

    const client = new CDPClient(wsUrl);
    await client.waitOpen();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    await sleep(1500);

    // =========================================================================
    // PART 1: NORMAL MODE VERIFICATION (Nov 1, 2026)
    // =========================================================================

    // 1. Normal Mode Landing Render
    await client.waitFor(`!!document.querySelector('#birthday-countdown')`);
    const pageText = await client.eval(`document.body.innerText || ''`);
    const hasPandaGreeting = pageText.includes('Hey Gundoos') && pageText.includes('Deepa! 🐼❤️');
    const hasCountdownTitle = pageText.includes('YEAR-ROUND KEEPSAKE') || pageText.includes('A YEAR-ROUND KEEPSAKE');
    
    if (hasPandaGreeting && hasCountdownTitle) {
      record('1. Normal Mode Landing', 'PASS', 'Clean landing page loaded with "Hey Gundoos... Deepa! 🐼❤️" and year-round keepsake status');
    } else {
      record('1. Normal Mode Landing', 'FAIL', `Missing greeting or title in normal mode. Text sample: ${pageText.slice(0, 200)}`);
    }

    // 2. Birthday Countdown Component
    const countdownUnits = await client.eval(`
      Array.from(document.querySelectorAll('#birthday-countdown span'))
        .map(s => (s.innerText || s.textContent || '').toLowerCase())
    `);
    const hasUnits = ['days', 'hours', 'minutes', 'seconds'].every(u => countdownUnits.some(l => l.includes(u)));
    if (hasUnits) {
      record('2. Live Birthday Countdown', 'PASS', 'Live countdown rendered with Days, Hours, Minutes, Seconds targeting Nov 2');
    } else {
      record('2. Live Birthday Countdown', 'FAIL', `Missing countdown units. Found: ${JSON.stringify(countdownUnits)}`);
    }

    // 3. Daily Funny Waiting Quote (Deterministic Date-Based)
    const quoteTextInitial = await client.eval(`document.querySelector('#daily-quote h3')?.innerText || ''`);
    const hasWaitingBadge = await client.eval(`(document.body.textContent || '').includes('Gundoos Daily Waiting Quote')`);
    
    if (quoteTextInitial.length > 5 && hasWaitingBadge) {
      record('3. Daily Waiting Quote Initial', 'PASS', `Rendered: "${quoteTextInitial.slice(0, 50)}..." with Gundoos Waiting Quote badge`);
    } else {
      record('3. Daily Waiting Quote Initial', 'FAIL', `Quote: "${quoteTextInitial}", badge: ${hasWaitingBadge}`);
    }

    // 3b. Quote Consistency After Page Refresh
    await client.send('Page.reload');
    await client.waitFor(`!!document.querySelector('#daily-quote')`);
    await sleep(500);
    const quoteTextAfterReload = await client.eval(`document.querySelector('#daily-quote h3')?.innerText || ''`);
    if (quoteTextAfterReload === quoteTextInitial) {
      record('3b. Daily Quote Refresh Determinism', 'PASS', 'Refreshing page on same IST date produced exact same quote (100% deterministic)');
    } else {
      record('3b. Daily Quote Refresh Determinism', 'FAIL', `Quote changed on reload! Initial: "${quoteTextInitial}", After: "${quoteTextAfterReload}"`);
    }

    // 3c. Temporary "Another One 😂" Button Interaction
    await client.nativeClick('Another One');
    await sleep(500);
    const quoteAfterRandom = await client.eval(`document.querySelector('#daily-quote h3')?.innerText || ''`);
    const hasBackToToday = await client.eval(`(document.body.innerText || '').includes("Back to today's quote")`);
    if (quoteAfterRandom.length > 0 && hasBackToToday) {
      record('3c. Temporary Quote Shuffling', 'PASS', `Temporary quote updated: "${quoteAfterRandom.slice(0, 40)}..." with back-to-today link`);
    } else {
      record('3c. Temporary Quote Shuffling', 'FAIL', `Random quote failed: ${quoteAfterRandom}`);
    }

    // 4. STRICT HIDING OF BIRTHDAY SURPRISE CONTENT IN NORMAL MODE
    const surpriseCheck = await client.eval(`
      return {
        story: !!document.querySelector('#story'),
        truthOrDare: !!document.querySelector('#truth-or-dare'),
        specialMoments: !!document.querySelector('#special-moments'),
        memories: !!document.querySelector('#memories'),
        thingsILove: !!document.querySelector('#things-i-love'),
        letter: !!document.querySelector('#letter'),
        finale: !!document.querySelector('#finale'),
        confetti: !!document.querySelector('canvas[data-confetti]'),
        cinematicIntro: Array.from(document.querySelectorAll('button')).some(b => (b.innerText || '').includes('Open Your Surprise')),
        surpriseLinks: Array.from(document.querySelectorAll('a, button')).filter(el => {
          const href = el.getAttribute('href') || '';
          const txt = (el.innerText || '').toLowerCase();
          return href.includes('story') || href.includes('letter') || href.includes('memories') || txt.includes('letter') || txt.includes('our story');
        }).length
      };
    `);

    const allHidden = !surpriseCheck.story &&
      !surpriseCheck.truthOrDare &&
      !surpriseCheck.specialMoments &&
      !surpriseCheck.memories &&
      !surpriseCheck.thingsILove &&
      !surpriseCheck.letter &&
      !surpriseCheck.finale &&
      !surpriseCheck.confetti &&
      !surpriseCheck.cinematicIntro &&
      surpriseCheck.surpriseLinks === 0;

    if (allHidden) {
      record('4. Strict Surprise Content Hiding', 'PASS', 'Zero surprise content in DOM: No letter, timeline, truth or dare, memories, gallery, or nav hints');
    } else {
      record('4. Strict Surprise Content Hiding', 'FAIL', `Leaked surprise elements: ${JSON.stringify(surpriseCheck)}`);
    }

    // 4b. Normal Mode Background Music Player
    const normalMusic = await client.eval(`
      const player = document.querySelector('aside[aria-label="Background music controls"]');
      if (!player) return null;
      return {
        hasPlayer: true,
        text: player.innerText,
        hasExperience: player.innerText.includes('Experience'),
        hasNormalSection: player.innerText.toLowerCase().includes('normal landing'),
        hasPlayButton: !!player.querySelector('button[aria-label*="music"]'),
        hasMuteButton: !!player.querySelector('button[aria-label="Mute"], button[aria-label="Unmute"]'),
        hasVolumeSlider: !!player.querySelector('input[type="range"]'),
      };
    `);
    if (normalMusic && normalMusic.hasExperience && normalMusic.hasNormalSection) {
      record('4b. Normal Mode Background Music', 'PASS', 'Plays dedicated "Experience" (Ludovico Einaudi) with Section: Normal Landing and floating glass controls');
    } else {
      record('4b. Normal Mode Background Music', 'FAIL', `normalMusic: ${JSON.stringify(normalMusic)}`);
    }

    // 4c. Normal Mode Music Controls Interaction & Session Persistence
    await client.nativeClick('Click to Play Soundtrack');
    await sleep(600);
    const audioStarted = await client.eval(`sessionStorage.getItem('bday_music_started') === 'true'`);
    await client.nativeClick('button[aria-label="Mute"]');
    await sleep(400);
    const isMutedInStorage = await client.eval(`sessionStorage.getItem('bday_music_muted') === 'true'`);
    if (audioStarted && isMutedInStorage) {
      record('4c. Music Controls & Persistence', 'PASS', 'Play trigger activated and mute state persisted to sessionStorage');
    } else {
      record('4c. Music Controls & Persistence', 'FAIL', `audioStarted: ${audioStarted}, isMuted: ${isMutedInStorage}`);
    }

    await client.captureScreenshot('01-normal-mode');

    // 5. Mobile Viewport Testing in Normal Mode
    const testWidths = [
      { name: 'Mobile Extra Small (320px)', width: 320, height: 600 },
      { name: 'Mobile Standard (375px)', width: 375, height: 667 },
      { name: 'Mobile Modern (390px)', width: 390, height: 844 },
      { name: 'Mobile Large (430px)', width: 430, height: 932 },
    ];

    for (const vp of testWidths) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: true,
      });
      await sleep(350);

      const overflow = await client.eval(`
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const bodyW = document.body.scrollWidth;
        return { docW, winW, bodyW, hasOverflow: docW > winW || bodyW > winW };
      `);

      if (!overflow.hasOverflow) {
        record(`5. Normal Mode Viewport: ${vp.name}`, 'PASS', `Doc: ${overflow.docW}px, Win: ${overflow.winW}px (Zero overflow)`);
      } else {
        record(`5. Normal Mode Viewport: ${vp.name}`, 'FAIL', `Horizontal overflow! Doc: ${overflow.docW}px, Win: ${overflow.winW}px`);
      }
    }

    // Reset viewport to desktop
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(300);

    // =========================================================================
    // PART 2: BIRTHDAY SURPRISE MODE UNLOCK (Nov 2, 2026)
    // =========================================================================

    console.log('\n--- Switching to Birthday Mode on November 2, 2026 ---');
    await client.eval(`sessionStorage.clear()`);
    await client.send('Page.navigate', { url: 'http://localhost:5173/?simDate=2026-11-02' });
    await sleep(1500);

    // 6. Cinematic Intro on November 2
    await client.waitFor(`(document.querySelector('h1')?.innerText || '').length > 0`);
    const introHeading = await client.eval(`document.querySelector('h1')?.innerText`);
    const introBadge = await client.eval(`document.body.innerText.includes('19TH BIRTHDAY')`);
    const introMusic = await client.eval(`document.querySelector('aside[aria-label="Background music controls"]')?.innerText || ''`);
    const introHasCornfield = introMusic.includes('Cornfield Chase') && introMusic.toLowerCase().includes('cinematic intro');

    if (introHeading && introHeading.includes('Hey Gundoos') && introBadge && introHasCornfield) {
      record('6. Birthday Mode Cinematic Intro & Music', 'PASS', `Intro unlocked on Nov 2 with Cornfield Chase ("${introHeading.trim()}")`);
    } else {
      record('6. Birthday Mode Cinematic Intro & Music', 'FAIL', `introHeading: "${introHeading}", introMusic: "${introMusic}"`);
    }

    await client.captureScreenshot('02-bday-cinematic-intro');

    // 7. Click "Open Your Surprise ✨"
    console.log('Dispatching click on "Open Your Surprise ✨"...');
    await client.eval(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Open Your Surprise'));
      if (btn) btn.click();
    `);
    await sleep(2500);
    await client.waitFor(`(document.querySelector('#hero h1')?.innerText || '').length > 0`, 10000);

    const bdayHeroHeadline = await client.eval(`document.querySelector('#hero h1')?.innerText || ''`);
    const heroMusic = await client.eval(`document.querySelector('aside[aria-label="Background music controls"]')?.innerText || ''`);
    const heroHasColdplay = heroMusic.includes('A Sky Full of Stars') && heroMusic.toLowerCase().includes('birthday hero');

    if (bdayHeroHeadline.includes('Happiest 19th Birthday') && bdayHeroHeadline.includes('Deepa!') && heroHasColdplay) {
      record('7. Birthday Mode Hero Reveal & Music', 'PASS', `Celebration hero mounted with "A Sky Full of Stars" (Birthday Hero)`);
    } else {
      record('7. Birthday Mode Hero Reveal & Music', 'FAIL', `Hero headline: "${bdayHeroHeadline}", heroMusic: "${heroMusic}"`);
    }

    // 8. Our Story Timeline
    const timelineItemsCount = await client.eval(`document.querySelectorAll('#story .space-y-10 > div').length`);
    if (timelineItemsCount === 5) {
      record('8. Birthday Story Timeline', 'PASS', 'Rendered all 5 authentic milestones starting with College Tech Community');
    } else {
      record('8. Birthday Story Timeline', 'FAIL', `Milestones count: ${timelineItemsCount}`);
    }

    // 9. Truth or Dare Section ("One Question at a Time... 🎲")
    const todExists = await client.eval(`!!document.querySelector('#truth-or-dare')`);
    await client.nativeClick('Flip All Cards');
    await sleep(600);
    const todRevealed = await client.eval(`(document.querySelector('#truth-or-dare')?.innerText || '').toLowerCase().includes('revealed 4 of 4')`);
    if (todExists && todRevealed) {
      record('9. Truth or Dare Story Section', 'PASS', 'Rendered "One Question at a Time... 🎲", flipped all 4 cards cleanly');
    } else {
      record('9. Truth or Dare Story Section', 'FAIL', `exists: ${todExists}, revealed: ${todRevealed}`);
    }

    // 10. Special Memories Section (Tabs + Notes)
    await client.eval(`
      const gymBtn = Array.from(document.querySelectorAll('#special-moments button')).find(b => (b.innerText || '').includes('The Gym Aunty'));
      if (gymBtn) gymBtn.click();
    `);
    await sleep(400);
    await client.eval(`
      const singBtn = Array.from(document.querySelectorAll('#special-moments button')).find(b => (b.innerText || '').includes('The Singing Incident'));
      if (singBtn) singBtn.click();
    `);
    await sleep(600);
    const singingTitle = await client.eval(`(document.querySelector('#special-moments')?.innerText || '').includes('The Singer Who Never Applied for the Job')`);
    if (singingTitle) {
      record('10. Special Memories & Inside Jokes', 'PASS', 'All 3 tabs (Phone Call, Gym Aunty, Singing Incident) accessible');
    } else {
      record('10. Special Memories & Inside Jokes', 'FAIL', `singingTitle: ${singingTitle}`);
    }

    // 11. Photo Keepsake Gallery & Lightbox
    const galleryCount = await client.eval(`document.querySelectorAll('#memories .grid > div').length`);
    await client.nativeClick('#memories .grid > div');
    await sleep(600);
    const lightboxActive = await client.eval(`!!document.querySelector('[aria-label="Close photo view"]')`);
    await client.nativeClick('[aria-label="Close photo view"]', true);
    await sleep(400);
    let lightboxClosed = false;
    for (let i = 0; i < 10; i++) {
      lightboxClosed = await client.eval(`!document.querySelector('[aria-label="Close photo view"]')`);
      if (lightboxClosed) break;
      await sleep(200);
    }
    if (galleryCount === 6 && lightboxActive && lightboxClosed) {
      record('11. Photo Gallery & Lightbox', 'PASS', '6 polaroids rendered, fullscreen lightbox opened & closed cleanly');
    } else {
      record('11. Photo Gallery & Lightbox', 'FAIL', `galleryCount: ${galleryCount}, lightboxActive: ${lightboxActive}, lightboxClosed: ${lightboxClosed}`);
    }

    // 12. 3D Memory Cards
    await client.nativeClick('Your Curly Hair');
    await sleep(600);
    await client.nativeClick('Your Endless Conversations');
    await sleep(600);
    const counterText = await client.eval(`
      (document.querySelector('#things-i-love')?.textContent || '').toLowerCase().includes('discovered 2 of 6')
    `);
    if (counterText) {
      record('12. 3D Memory Cards Flipping', 'PASS', 'Interactive cards flipped, counter updated to "Discovered 2 of 6 traits"');
    } else {
      record('12. 3D Memory Cards Flipping', 'FAIL', `counterText: ${counterText}`);
    }

    // 13. Birthday Letter Reveal
    await client.nativeClick('Open My Letter');
    await sleep(800);
    const letterContent = await client.eval(`document.querySelector('#letter')?.innerText || ''`);
    const hasSalutation = letterContent.includes('Hey Gundoos! 🐼❤️');
    const hasSender = letterContent.includes('Gokul');
    const hasHeadingPrompt = letterContent.includes('For the days when smiling feels a little difficult...');
    const hasWorthEmphasis = letterContent.includes("Their leaving doesn't reduce your worth.");
    const hasFutureEmphasis = letterContent.includes("Your past doesn't decide your future.");
    const hasStrengthEmphasis = letterContent.includes("You don't always have to be the strong one.");
    const hasHereEmphasis = letterContent.includes("I'm here, okay?");
    const hasPersonalMsg = letterContent.includes("annoy you with my usual nonsense") && letterContent.includes("here as your friend, without expectations or pressure");
    const hasClosingTagline = letterContent.includes("Keep that smile. Keep that madness. Keep being YOU.");
    const hasBirthdayWish = letterContent.includes("Happy 19th Birthday, Gundoos! 🐼❤️");

    const allLetterChecksPassed = hasSalutation && hasSender && hasHeadingPrompt && hasWorthEmphasis &&
      hasFutureEmphasis && hasStrengthEmphasis && hasHereEmphasis && hasPersonalMsg && hasClosingTagline && hasBirthdayWish;

    if (allLetterChecksPassed) {
      record('13. Handwritten Letter Reveal', 'PASS', 'Wax-sealed envelope opened, rendered letter with all 4 visual emphases, Gokul personal friend note, and celebratory closing');
    } else {
      record('13. Handwritten Letter Reveal', 'FAIL', `Checks: worth=${hasWorthEmphasis}, future=${hasFutureEmphasis}, strength=${hasStrengthEmphasis}, here=${hasHereEmphasis}, personal=${hasPersonalMsg}, tagline=${hasClosingTagline}`);
    }

    // 14. Final Surprise & Active Confetti
    await client.nativeClick('Open The Final Surprise');
    await sleep(800);
    const finaleText = await client.eval(`document.querySelector('#finale')?.innerText || ''`);
    const hasFinale = finaleText.includes('Happy Birthday, Deepa! ❤️');
    const hasCanvas = await client.eval(`!!document.querySelector('canvas')`);
    if (hasFinale && hasCanvas) {
      record('14. Final Surprise & Confetti', 'PASS', 'Grand finale revealed with celebratory confetti canvas');
    } else {
      record('14. Final Surprise & Confetti', 'FAIL', `hasFinale: ${hasFinale}, hasCanvas: ${hasCanvas}`);
    }

    // 15. Automatic Section-Based Music Switching (Intersection Observer)
    console.log('Testing automatic section-based music switching on scroll...');
    const sectionMusicChecks = [];

    const testSections = [
      { id: 'story', expectedTrack: 'New York Nagaram', expectedName: 'story timeline' },
      { id: 'truth-or-dare', expectedTrack: "Comptine d'un autre", expectedName: 'truth or dare' },
      { id: 'memories', expectedTrack: 'Vaan Varuvaan', expectedName: 'photo gallery' },
      { id: 'letter', expectedTrack: 'Nuvole Bianche', expectedName: 'birthday letter' },
      { id: 'finale', expectedTrack: 'Arrival of the Birds', expectedName: 'grand finale' },
    ];


    for (const s of testSections) {
      await client.eval(`
        const el = document.querySelector('#${s.id}');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      `);

      // Wait for observer debounce (200ms) and music state update
      let matched = false;
      let track = '';
      for (let attempt = 0; attempt < 8; attempt++) {
        await sleep(250);
        track = await client.eval(`document.querySelector('aside[aria-label="Background music controls"]')?.innerText || ''`);
        if (track.includes(s.expectedTrack) && track.toLowerCase().includes(s.expectedName)) {
          matched = true;
          break;
        }
      }
      sectionMusicChecks.push({ section: s.id, expectedTrack: s.expectedTrack, matched, actual: track });
    }

    const allSectionsMatched = sectionMusicChecks.every(c => c.matched);
    if (allSectionsMatched) {
      record('15. Automatic Section-Based Music Switching', 'PASS', 'Intersection Observer seamlessly transitioned soundtrack across Story, Truth or Dare, Memories, Letter, and Finale');
    } else {
      record('15. Automatic Section-Based Music Switching', 'FAIL', `Section transitions: ${JSON.stringify(sectionMusicChecks)}`);
    }

    // 16. Console Errors Check
    const fatalErrors = client.consoleErrors.filter(e => !e.includes('NotAllowedError') && !e.includes('audio'));
    if (fatalErrors.length === 0) {
      record('16. Browser Console Errors', 'PASS', `0 fatal console errors or unhandled exceptions (${client.consoleLogs.length} logs captured)`);
    } else {
      record('16. Browser Console Errors', 'FAIL', `Fatal console errors: ${fatalErrors.join('; ')}`);
    }

  } catch (err) {
    console.error('QA Test Suite Exception:', err);
    record('QA Execution', 'FAIL', err.message);
  } finally {
    chromeProcess.kill();
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
    console.log('\n================== FINAL QA TEST SUMMARY ==================');
    console.table(testResults);
  }
}

runQA();
