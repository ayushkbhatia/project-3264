// The hero painting: the home page's hero-valley.png, as encoded in public/ (the handoff's copy is
// byte-identical). The <img> and the logic's greyscale veil (initVeil) both draw this file, and
// the route preloads it as the LCP. Its own module so the server route can import it without
// pulling in the client-only logic class.
export const HERO_SRC = "/img/hero-valley.webp";
