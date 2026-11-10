#!/usr/bin/env bash
# List WordPress.org plugins whose PHP matches a regex, most installs first.
# Uses veloria.dev (formerly wpdirectory.net). Searches are private.
# Usage: plugin-callers.sh '<RE2 regex>' [max rows]
# Example: plugin-callers.sh '->mark_verified\(' 20
set -euo pipefail

term=${1:?usage: plugin-callers.sh '<RE2 regex>' [max rows]}
rows=${2:-30}
base=https://veloria.dev

path=$(curl -fsSL -i -X POST "$base/search" -H 'HX-Request: true' \
	--data-urlencode "term=$term" -d repo=plugins -d filetype=php \
	-d visibility=private -d exclude_minified=on |
	tr -d '\r' | awk 'tolower($1) == "hx-redirect:" { print $2 }')
[ -n "$path" ] || { echo "veloria.dev did not start a search" >&2; exit 1; }

for _ in $(seq 1 30); do
	curl -fsSL "$base$path" | grep -q 'completed' && break
	sleep 5
done

echo "$base$path"
curl -fsSL "$base$path/extensions" | sed 's/<[^>]*>/\n/g' |
	grep -Ev '^[[:space:]]*$|Loading|›|…' |
	awk '/^[a-z0-9-]+\/[^ ]+$/ { slug = $0 } / installs$/ && slug { print $0 "\t" slug; slug = ""; n++ }
		END { if (!n) print "no matching plugins" }' |
	head -n "$rows"
