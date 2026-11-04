#!/usr/bin/env node
// Writes a HyperFrames index.html that wraps real footage in a drawn browser frame.
// The tab title, address bar and loading state follow the navigations logged during capture.
// The address bar always shows https://example.com plus the real path, never the real host.
//
// usage: node browser-frame.mjs <take.json> <project-dir> --media-start <s> --duration <s> [--width 1440 --height 900]
//
// take.json, with every t in source-video seconds:
//   { "nav": [{ "kind": "start", "t": 0.5, "url": "..." }, { "kind": "commit", "t": 0.9, "url": "..." },
//             { "kind": "load", "t": 1.6, "title": "..." }],
//     "asserts": [{ "id": "cart-has-item", "t": 11.2 }],
//     "captions": [{ "id": "open-product", "text": "Open a product", "from": { "t": 0 } },
//                  { "id": "check-cart", "text": "The cart lists it", "from": { "assert": "cart-has-item" } }] }
// A caption "from" is { t }, { visit: n } (when page n commits) or { assert: id } (when it passed).
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const { values: opt, positionals: [takePath, project] } = parseArgs({
  allowPositionals: true,
  options: {
    'media-start': { type: 'string' }, duration: { type: 'string' },
    width: { type: 'string', default: '1440' }, height: { type: 'string', default: '900' },
  },
});
if (!takePath || !project || !opt['media-start'] || !opt.duration) {
  throw new Error('usage: browser-frame.mjs <take.json> <project-dir> --media-start <s> --duration <s>');
}
const take = JSON.parse(readFileSync(takePath, 'utf8'));
const mediaStart = Number(opt['media-start']);
const duration = +(Number(opt.duration) - mediaStart).toFixed(3);
const W = Number(opt.width), H = Number(opt.height);
const ORIGIN = 'example.com';
// The chrome is drawn at 1.4x so the URL stays readable at player size.
const S = 1.4, TABS = 40, BAR = 48, PAD = 32, CAP = 64;
const CW = +(W / S).toFixed(2), CHROME = Math.round((TABS + BAR) * S), WIN_H = CHROME + H;
const CANVAS_W = W + PAD * 2, CANVAS_H = PAD + WIN_H + CAP + 8;

const visits = [];
for (const e of take.nav) {
  if (e.kind === 'start') visits.push({ start: e.t, commit: e.t, load: e.t, url: e.url, title: '' });
  const v = visits.at(-1);
  if (!v) continue;
  if (e.kind === 'commit') { v.commit = e.t; v.url = e.url; }
  if (e.kind === 'load') { v.load = e.t; v.title = e.title; }
}
if (!visits.length) throw new Error('take.json has no navigation start events');

const SECRET = /nonce|token|key|auth|pass|secret|session|code|sig|hash|login|email/i;
function shownPath(raw) {
  const u = new URL(raw);
  for (const k of [...u.searchParams.keys()]) if (SECRET.test(k)) u.searchParams.set(k, '•••');
  return u.pathname + (u.search ? decodeURIComponent(u.search) : '');
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const out = t => Math.max(0, +(t - mediaStart).toFixed(3));
const toggles = [];
// A frame state is a hidden layer the paused timeline shows and hides. A set() at time 0
// does not fire on seek(0), so a state that starts at 0 is visible by default.
function state(id, from, to, cls, html) {
  const s = out(from), e = Math.min(duration, out(to));
  if (e <= s) return '';
  if (s > 0) toggles.push(`timeline.set('#${id}', { autoAlpha: 1 }, ${s});`);
  if (e < duration) toggles.push(`timeline.set('#${id}', { autoAlpha: 0 }, ${+e.toFixed(3)});`);
  return `<div id="${id}" class="${s > 0 ? 'state ' : ''}${cls}">${html}</div>`;
}

const icon = (d, extra = '') => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#474747" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const ICON = {
  back: icon('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
  fwd: icon('<path d="M5 12h14M13 6l6 6-6 6"/>', 'opacity=".35"'),
  reload: icon('<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'),
  stop: icon('<path d="M6 6l12 12M18 6 6 18"/>'),
  globe: icon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>'),
  lock: icon('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  star: icon('<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.7l6.2-.9Z"/>'),
  menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#474747"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
  spinner: '<svg class="spinner" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="9" fill="none" stroke="#1a73e8" stroke-width="3" stroke-dasharray="40 60" stroke-linecap="round"/></svg>',
};

const urls = [], titles = [], spinners = [], stops = [];
visits.forEach((v, i) => {
  const until = visits[i + 1]?.commit ?? Infinity;
  const path = shownPath(v.url);
  urls.push(state(`url-${i}`, v.commit, until, 'omni-text', `${ICON.lock}<span class="host">${ORIGIN}</span><span class="path">${esc(path)}</span>`));
  titles.push(state(`title-${i}`, v.commit, until, 'tab-text', `${ICON.globe}<span>${esc(v.title || ORIGIN + path)}</span>`));
  spinners.push(state(`spin-${i}`, v.start, v.load, 'tab-spin', ICON.spinner));
  stops.push(state(`stop-${i}`, v.start, v.load, 'reload-stop', ICON.stop));
});

const startOf = c => {
  if (!c) return Infinity;
  if ('visit' in c.from) return visits[c.from.visit].commit;
  if ('assert' in c.from) {
    const a = take.asserts.find(x => x.id === c.from.assert);
    if (!a) throw new Error(`caption ${c.id} names unknown assertion ${c.from.assert}`);
    return a.t;
  }
  return c.from.t;
};
const captions = take.captions.map((c, i) => {
  const s = out(startOf(c)), e = Math.min(duration, out(startOf(take.captions[i + 1])));
  return e > s ? `<div id="${c.id}" class="beat clip" data-start="${s}" data-duration="${+(e - s).toFixed(3)}" data-track-index="1"><span class="text">${esc(c.text)}</span></div>` : '';
});

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=${CANVAS_W}, height=${CANVAS_H}" />
    <script src="./gsap.min.js"></script>
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; width: ${CANVAS_W}px; height: ${CANVAS_H}px; overflow: hidden; }
      body { background: #edf0f5; font-family: ui-sans-serif, system-ui, sans-serif; color: #272239; }
      #main { position: relative; width: ${CANVAS_W}px; height: ${CANVAS_H}px; }
      #window { position: absolute; left: ${PAD}px; top: ${PAD}px; width: ${W}px; height: ${WIN_H}px;
        border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 0 0 1px #2722391f, 0 12px 32px #27223920; }
      #chrome { position: absolute; left: 0; top: 0; width: ${CW}px; height: ${TABS + BAR}px; transform: scale(${S}); transform-origin: 0 0; }
      #tabs { position: absolute; left: 0; top: 0; width: ${CW}px; height: ${TABS}px; background: #dfe3eb; }
      .dots { position: absolute; left: 16px; top: 14px; display: flex; gap: 8px; }
      .dots i { width: 12px; height: 12px; border-radius: 50%; background: #c4c9d2; }
      #tab { position: absolute; left: 76px; top: 6px; width: 260px; height: 34px; background: #fff; border-radius: 10px 10px 0 0; }
      .tab-text, .tab-spin { position: absolute; left: 12px; top: 0; height: 34px; display: flex; align-items: center; gap: 8px;
        font-size: 13px; color: #1f1f1f; width: 210px; white-space: nowrap; overflow: hidden; }
      .tab-text span { overflow: hidden; text-overflow: ellipsis; }
      .tab-spin { width: 20px; background: #fff; }
      .tab-close { position: absolute; right: 10px; top: 10px; font-size: 14px; color: #5f6368; line-height: 14px; }
      .newtab { position: absolute; left: 348px; top: 8px; font-size: 22px; color: #5f6368; }
      #toolbar { position: absolute; left: 0; top: ${TABS}px; width: ${CW}px; height: ${BAR}px; background: #fff;
        border-bottom: 1px solid #dadce0; display: flex; align-items: center; gap: 14px; padding: 0 14px; }
      .nav { display: flex; gap: 18px; position: relative; }
      .reload-stop { position: absolute; left: 76px; top: 0; background: #fff; }
      #omni { position: relative; flex: 1; height: 34px; border-radius: 17px; background: #f1f3f4; }
      .omni-text { position: absolute; inset: 0 44px 0 14px; display: flex; align-items: center; gap: 8px; font-size: 15px; white-space: nowrap; overflow: hidden; }
      .omni-text svg { width: 16px; height: 16px; }
      .host { color: #1f1f1f; } .path { color: #5f6368; margin-left: -8px; }
      .star { position: absolute; right: 12px; top: 7px; }
      .spinner { transform-origin: 50% 50%; }
      .state { visibility: hidden; opacity: 0; }
      #viewport { position: absolute; left: 0; top: ${CHROME}px; width: ${W}px; height: ${H}px; overflow: hidden; }
      #camera { width: ${W}px; height: ${H}px; }
      video { display: block; width: 100%; height: 100%; object-fit: contain; }
      #caption { position: absolute; left: ${PAD}px; top: ${PAD + WIN_H + 8}px; width: ${W}px; height: ${CAP - 8}px; }
      .beat { position: absolute; inset: 0; display: flex; align-items: center; }
      .text { font-size: 26px; font-weight: 550; letter-spacing: -.02em; }
    </style>
  </head>
  <body>
    <!-- Drawn browser frame from browser-frame.mjs. Only the page area is real footage. -->
    <main id="main" data-composition-id="main" data-start="0" data-duration="${duration}"
      data-width="${CANVAS_W}" data-height="${CANVAS_H}" data-fps="60">
      <div id="window">
        <div id="chrome" data-layout-ignore>
          <div id="tabs">
            <div class="dots"><i></i><i></i><i></i></div>
            <div id="tab">
              ${titles.join('\n              ')}
              ${spinners.join('\n              ')}
              <span class="tab-close">✕</span>
            </div>
            <span class="newtab">+</span>
          </div>
          <div id="toolbar">
            <div class="nav">${ICON.back}${ICON.fwd}${ICON.reload}
              ${stops.join('\n              ')}
            </div>
            <div id="omni">
              ${urls.join('\n              ')}
              <span class="star">${ICON.star}</span>
            </div>
            ${ICON.menu}
          </div>
        </div>
        <div id="viewport">
          <div id="camera" data-layout-allow-overflow>
            <video id="footage" class="clip" src="./source.mp4" muted playsinline
              data-start="0" data-duration="${duration}" data-media-start="${mediaStart}" data-track-index="0"></video>
          </div>
        </div>
      </div>
      <div id="caption">
        ${captions.join('\n        ')}
      </div>
    </main>
    <script>
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo('.spinner', { rotation: 0 }, { rotation: ${Math.round(duration / 0.9) * 360}, ease: 'none', duration: ${duration} }, 0);
      ${toggles.join('\n      ')}
      timeline.set('#camera', { scale: 1 }, ${duration});
      window.__timelines = window.__timelines || {};
      window.__timelines.main = timeline;
      timeline.seek(0);
    </script>
  </body>
</html>
`;
writeFileSync(`${project}/index.html`, html);
writeFileSync(`${project}/edit-map.json`, JSON.stringify({
  mediaStart, duration,
  visits: visits.map(v => ({ start: v.start, commit: v.commit, load: v.load, shown: ORIGIN + shownPath(v.url), title: v.title })),
  captions: take.captions.map(c => ({ id: c.id, sourceStart: startOf(c) })),
}, null, 2));
