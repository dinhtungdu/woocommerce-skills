# Changes that break other plugins

Load when a change touches PHP that other code can call, implement, extend or
unhook, adds or changes a hook callback, adds types to hook values, or changes
script handles, templates, AJAX payloads or upgrade-time code. The target
checkout's `.ai/review/guidelines/` owns each pattern's details; read the named
file there. This page adds the checks those files leave out: they stop at
in-tree greps, and the callers that break live in other plugins.

## Search other plugins first

Run `scripts/plugin-callers.sh '<RE2 regex>'` from this skill's directory. It
searches every WordPress.org plugin through veloria.dev and lists matches with
the most installs first. For private marketplace extensions, also run
`gh search code --owner woocommerce '<symbol>'`. Report the plugins found, or
the exact searches that found none. An empty in-tree grep is not evidence.

## Patterns

1. **Changed PHP that other plugins call, implement or unhook.** Guideline:
   `public-php-api-bc.md`. Search `->method\(`, `ClassName::`,
   `implements Interface` and `extends Class`, including `Internal\` code. Add
   new parameters last with a default; add a new interface instead of new
   methods on an old one. Do not count a caller's `try`/`catch ( Exception )`
   as safety: `ArgumentCountError` and `TypeError` are `Error`s and pass
   through. Example: #68787 made `mark_verified()` need a second argument;
   Germanized 4.1.6 (70K installs) called it with one, so 11.3.0-rc.1 was
   rolled back. Fix #70787.
2. **A new callback on a busy hook that re-enters itself through another
   plugin.** Guidelines: `hook-callback-reentrancy.md`, `hpos-sync-on-read.md`.
   For each read in the callback (meta, option, GUID, permalink, template),
   search for plugins that call the hooked function, such as `get_the_guid\(`.
   Open the top results and check whether they call it from a filter on the
   data your callback reads. Reproduce with the top match in wp-env. Example:
   #70198's `get_the_guid` callback read `_wp_attached_file`; Real Media
   Library filters that meta and calls `get_the_guid()`, and 125 Atomic sites
   ran out of memory. Fix #70782.
3. **Strict types on values a plugin controls.** Guideline:
   `php-loose-type-juggling.md`. A filter callback returns what it received,
   so give it no scalar return type. Cast or check filtered values before
   typed code. Example: #64859 returned the filtered mail callback's `null`
   from a `: bool` method; fixed in 10.9.3 by #66186.
4. **Same hook, handle or markup, different contract.** Guidelines:
   `hook-payload-contract.md`, `classic-jquery-contract.md`,
   `script-handle-loading-contract.md`, `template-and-js-default.md`. Search for
   the hook, handle or `ajaxPrefilter` users. Keep old handles as aliases.
   Prefer markup that still works when core's JS is absent. Example: #68365
   sent checkout AJAX data as a string and broke prefilters that read an
   object; reverted in 11.2.1 by #69644.
5. **Code that loads during the in-place update or depends on bundled
   libraries.** Guidelines: `upgrade-time-class-load.md`,
   `action-scheduler-lifecycle.md`. Update a site in place from the previous
   release. Use `ActionSchedulerUtil`, not bare `as_*` calls. Example: #64091's
   new enum fatalled during the 10.7 to 10.8 update; fixed in 10.8.1 by #65337.
6. **Code that never ran before now runs.** A default flip or a fixed dispatch
   runs extension callbacks for the first time. Review it like a new feature
   and search for the callbacks it now reaches. Example: #67884 turned on the
   variation gallery from #64524 for every store, and Flatsome with WooThumbs
   looped until timeout; fixed in 11.1.2 by #68939.

## Closing a compatibility finding

Do not close an AI regression review or Roave BC finding because the symbol is
`@internal` or every in-tree caller was updated. Close it only after an
ecosystem search finds no caller. WOOAIRR-430 flagged #68787 as High/BLOCK and
was closed four minutes later on that reasoning; the search above lists
Germanized.
