// Resolves three.js for the motion modules.
//
// PORT NOTE (Next.js): the prototype pulled three from a CDN at runtime because it had no
// bundler. In the app, install three (`npm i three`) and swap the body of loadThree() for:
//
//     let p; export function loadThree() { return (p ||= import("three")); }
//
// Keep it a dynamic import and keep it lazy: every module that calls this runs in an effect,
// after mount, so three never enters the server bundle or the initial client chunk.

let pending = null;
export function loadThree() {
  if (!pending) pending = import(/* webpackIgnore: true */ "https://esm.sh/three@0.161.0");
  return pending;
}
