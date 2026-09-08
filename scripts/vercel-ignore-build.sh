#!/usr/bin/env bash
# Vercel `ignoreCommand`: exit 0 = SKIP build, exit 1 = RUN build.
#
# Preview builds are opt-in. Every deploy costs build minutes, and on Vercel each
# new deployment gets its own ISR cache — a production deploy leaves every
# not-prerendered page cold. So: build production, skip previews unless asked.
#
# Force a preview build by putting [preview] in the commit message.

set -euo pipefail

if [ "${VERCEL_ENV:-}" = "production" ]; then
  echo "production deploy — building"
  exit 1
fi

if printf '%s' "${VERCEL_GIT_COMMIT_MESSAGE:-}" | grep -qF '[preview]'; then
  echo "[preview] found in commit message — building preview"
  exit 1
fi

echo "preview build skipped (add [preview] to the commit message to force one)"
exit 0
