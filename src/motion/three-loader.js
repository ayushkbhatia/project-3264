// Resolves three.js for the motion modules.
//
// PORT NOTE (Next.js): the prototype pulled three@0.161.0 from a CDN at runtime because it had
// no bundler. Here it is an npm dependency, installed under the alias `three-r161`
// (npm:three@0.161.0) because these modules were written against 0.161. The unaliased `three`
// package stays on the version src/components/network-sphere.tsx needs.
//
// Keep it a dynamic import and keep it lazy: every module that calls this runs in an effect,
// after mount, so three never enters the server bundle or the initial client chunk.

let pending = null;
export function loadThree() {
  return (pending ||= import("three-r161"));
}
