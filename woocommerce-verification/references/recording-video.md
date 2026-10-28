# Record a polished browser demo

Use for a requested demo or a user flow that benefits from motion. This is the
recording workflow bundled with Woo verification; no global recording skill is
required. Standalone extensions may reuse this technique with their own setup,
evidence harness and publication rules. It grants no site or publication authority.

## Plan one outcome

- Show one useful change, not a tour of every control or a target runtime.
  Follow the approved test path; identify setup done off-camera and steps omitted.
  Capture an asserted starting state, the meaningful interaction and its result.
- Use the assigned real app and appropriate retained data. Do not seed, reset,
  restyle or move someone else's environment to improve a shot. Authenticate
  off-camera. Exclude secrets, personal records and unrelated tabs.
- Persist a passing dry run using the owning project's
  [browser-evidence contract](browser-harness/README.md). Require at least one
  behavior-distinguishing assertion, all required assertions passing and reviewed
  diagnostics. Empty assertions or merely catching no exception are not proof.
  Rerun assertions during capture; a preflight pass does not bless a failed take.
- Set viewport **and** `recordVideo.size` explicitly to the scenario's dimensions
  (for example 1440×900 for a desktop editor). Do not force mobile/responsive work
  into desktop or square framing. Playwright otherwise fits video into a default
  800×800 box, making text unnecessarily small.

## Capture real-time, deliberate input

Use the installed Playwright and browser established by the environment check.
Record the real top-level page, not a screenshot slideshow or a stage iframe.
Keep app clocks, CSS animations, network and loading behavior unchanged. Do not
copy a frame-by-frame recorder that slows CSS while JavaScript runs at wall time.

- Place the pointer near the first target before the opening shot. Move the actual
  browser pointer with eased, wall-clock-paced intermediate positions; allow more
  time for longer travel. `mouse.move({ steps })` alone does not pace time.
  Pause briefly on the target before activating it. Use real locator clicks,
  keyboard input and wheel events; never `element.click()`, `dispatchEvent`, forced
  clicks or API state changes as substitutes for the user interaction shown.
- Add a small pointer and click ring with `pointer-events: none`, driven by actual
  pointer events. Keep this overlay out of layout and disclose the addition.
  Do not bake large PASS banners into the app. Preserve native keyboard focus;
  keyboard-only demos need no invented pointer motion or clicks.
- Type visible non-secret text with `pressSequentially(text, { delay: 65 })` when
  typing is part of the story. Scroll in small paced wheel steps, then wait for
  the target and assert its state. Never smooth a resize, scroll or animation in
  a way that conceals the bug being demonstrated.
- Wait for observable UI/response state first; holds are for reading, not proof.
  Allow roughly 300ms to acquire a target and 1–2 seconds to read an outcome.
  Avoid frantic clicks, cursor wandering and dead loading footage.
- Install the pointer with `page.addInitScript` **before navigation** so it survives
  real page loads. This minimal overlay follows actual input, not predicted clicks:

```js
await page.addInitScript(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const pointer = document.createElement('div');
    pointer.setAttribute('aria-hidden', 'true');
    pointer.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;' +
      'pointer-events:none;display:none;width:24px;height:24px;';
    pointer.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 2v18l5-5 4 7 3-2-4-7h8Z" ' +
      'fill="#111" stroke="white" stroke-width="1.5"/></svg>';
    document.documentElement.append(pointer);
    document.addEventListener('pointermove', event => {
      pointer.style.display = 'block';
      pointer.style.transform = `translate(${event.clientX - 4}px,${event.clientY - 2}px)`;
    }, true);
    document.addEventListener('pointerdown', event => {
      const ring = document.createElement('div');
      ring.style.cssText = `position:fixed;left:${event.clientX - 18}px;top:${event.clientY - 18}px;` +
        'width:36px;height:36px;border:2px solid #7c3aed;border-radius:50%;' +
        'pointer-events:none;z-index:2147483646;';
      document.documentElement.append(ring);
      ring.animate([{ transform: 'scale(.4)', opacity: .8 },
        { transform: 'scale(1.3)', opacity: 0 }], { duration: 400 }).finished
        .then(() => ring.remove());
    }, true);
  });
});
```

For a stationary target, use its dry-run-verified bounding box and a known current
pointer position. Scroll it into view first; recheck geometry if layout changes.
This is a paced movement recipe, not an actionability bypass:

```js
await target.scrollIntoViewIfNeeded();
await target.waitFor({ state: 'visible' });
const box = await target.boundingBox();
if (!box) throw new Error('Recording target is not visible');
const to = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
const duration = Math.min(1000, Math.max(450, Math.hypot(to.x - from.x, to.y - from.y)));
const steps = Math.ceil(duration / (1000 / 60));
const started = performance.now();
for (let i = 1; i <= steps; i++) {
  const p = i / steps;
  const eased = p * p * (3 - 2 * p);
  await new Promise(resolve => setTimeout(resolve,
    Math.max(0, started + p * duration - performance.now())));
  await page.mouse.move(from.x + (to.x - from.x) * eased,
    from.y + (to.y - from.y) * eased);
}
await page.waitForTimeout(300); // Presentation dwell on the visible target.
await target.click(); // Rechecks actionability; record the actual resulting state.
```

Do not precede the glide with `click({ trial: true })`: Playwright can move the
pointer during that check, producing the very teleport this recipe avoids.

Retain browser/console/request diagnostics, including reviewed navigation
cancellations. Do not treat every `ERR_ABORTED` as harmless. Write failure results
and finalize capture in `finally`: close the recording context, then await
`video.path()`. Do not swallow close/export errors or label a partial take passing.

## Finish with HyperFrames

Polished demos use this finishing pass by default. Raw capture remains evidence,
not the finished demo. If tooling is unavailable, retain raw footage and report
the missing finishing step; do not quietly deliver the old rough style as final.

1. Use the installed CLI (`hyperframes --version`), not an implicit `npx` update.
   Keep the project under task-local `tmp/prepare-pr/`. Set
   `HYPERFRAMES_SKIP_SKILLS=1`, `HYPERFRAMES_NO_TELEMETRY=1` and
   `HYPERFRAMES_NO_UPDATE_CHECK=1`. Scaffold with
   `hyperframes init <project> --non-interactive --example=blank --skill=general-video`.
   Do not install global skill packs or upload to analysis/render services.
2. Copy [video-composition.html](video-composition.html) to the project's
   `index.html`. It frames **real footage**, with a plain background, compact
   captions and a static camera. Supply a local
   `gsap.min.js` from the installed toolchain, or fetch the pinned upstream runtime
   asset `https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js` into this project.
   Record its version/hash; keep footage and authentication off external services.
3. Convert the finalized raw WebM into seekable source media, preserving it too:

   ```sh
   ffmpeg -i raw.webm -c:v libx264 -crf 17 -preset slow \
     -pix_fmt yuv420p -g 30 -movflags +faststart -an source.mp4
   ```

   `-g 30` is a short keyframe interval, not a claim about source frame rate.
   Probe actual rate/resolution; re-encoding cannot repair dropped frames.
4. Adapt the template to the take: match camera/video dimensions to the source and
   **all** clip durations to the edit. Keep action and result legible at the intended
   player size (also inspect at about 800px wide), not just full-resolution stills.
   Trim empty margins with a fixed crop if the whole flow fits: shorten `#frame`,
   move `#caption`, and shorten the root CSS, viewport and `data-height` together;
   keep `#camera` at source size so the crop does not squash or rescale the app.
   Preserve navigation, status and context needed to understand the result.
   Replace placeholder captions/times: introduce the action before pointer travel,
   switch to the outcome when it appears, and hold only as long as reading needs.
   Inspect initial source frames; trim blank recording preroll with
   `data-media-start` and account for that offset in captions and the edit map.
   Do not restyle app content, fake browser chrome or replay a still as moving UI.
5. Keep the camera still by default. A zoom that does not make a necessary detail
   readable is just distraction. If focus needs to change, use one eased move over
   600–900ms, finish before pointer travel, then hold through the result. Choose the
   scale and origin from the actual bounds of both control and outcome, not a fixed
   zoom preset. Return only when the next action needs context. Animate the inner
   camera wrapper with the paused timeline, never the framework's timed clip. No
   continuous auto-pan, whip zooms, bouncing cursor, splash screen, music or voice
   generation by default. Keep a real content frame visible at the beginning/end.
6. Trim only dead time. Retain raw footage, assertions and an edit map with source
   and output time ranges, caption/assertion IDs and zoom targets. Make cuts or
   speed-ups explicit; never imply edited duration is product latency. Do not
   remove failure, causal actions or intermediate states needed to prove timing,
   focus or loading behavior. Prefer a continuous take when that behavior matters.
7. Check and snapshot the **adapted** composition, then render strictly:

   ```sh
   hyperframes check <project>
   hyperframes snapshot <project> --at 0,3,7,10 --describe false
   hyperframes render <project> --fps 60 --quality delivery \
     --video-frame-format png --no-best-effort --strict --output <final.mp4>
   ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt \
     -show_entries format=duration,size -of json <final.mp4>
   ffmpeg -v error -i <final.mp4> -f null -
   ```

   Choose snapshot times inside the actual take. Inspect them before final export;
   inspect frames from the **exported MP4** too. A 60fps output smooths authored
   camera movement; it does not turn lower-rate source interactions into 60fps.

## Accept the motion, not just the file

- Watch the full export at normal speed. If playback cannot be inspected with
  available tools, report that limitation rather than claim smoothness.
- Inspect a contact sheet for framing, first/last frames and every action/result.
  Also inspect a short full-rate segment across the busiest pointer/scroll/zoom
  transition. Sampled stills alone cannot verify smooth motion.
- Reject: tiny text, pointer jumps, stuttering scrolls, zooms arriving after the
  click, captions covering controls, blank/missing media, a black opening or an
  outcome too brief to read. Fix capture pacing when source is bad; don't hide it
  with interpolation. Check diagnostic failures separately from visual quality.
- Deliver the inspected H.264/yuv420p fast-start MP4 and a poster from a real result
  frame, plus the take script, edit map, results, render log and exact rerender
  command. Keep raw media and private evidence task-local. Use the owning project's
  authorized native GitHub attachments for publication, not automatic uploads.

## Sources and limits

- [Playwright video](https://playwright.dev/docs/videos): recording dimensions and
  finalization. Video is not itself an assertion log.
- [Paralect product demo](https://www.paralect.com/skills/product-demo): useful
  cursor acquisition, dwell, uncluttered framing and posters. Do not inherit its
  iframe capture, independent CSS-clock retuning or product CSS alterations.
- [Om Patel's playbook](https://x.com/om_patel5/article/2072396948506816895): one
  outcome, actual data, intentional pacing and code-based edits. Its marketing
  conversion claims are not verification evidence; demos do not replace tests.
- [HyperFrames skills](https://github.com/heygen-com/hyperframes/tree/main/skills):
  consult `general-video`, `hyperframes-core`, `hyperframes-keyframes` and
  `hyperframes-cli` for installed-version syntax. `pr-to-video` and website
  screenshot reconstruction do not record an authenticated live user flow.
