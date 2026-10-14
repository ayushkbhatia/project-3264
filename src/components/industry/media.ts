// The hero painting: the home page's hero-valley.png, as encoded in public/ (both industry
// handoffs' copies are byte-identical). The <img> and the logic's greyscale veil (initVeil) both
// draw this file, and each route preloads it as the LCP. Its own module so the server routes can
// import it without pulling in the client-only logic class. A page that wants its own painting
// must change both: the base and the colour layer have to be the same artwork (handoff).
export const HERO_SRC = "/img/hero-valley.webp";
