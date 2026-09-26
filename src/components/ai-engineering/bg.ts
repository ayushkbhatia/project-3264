import { getImageProps, type StaticImageData } from "next/image";

// The reference paints its cards' and tiles' pictures as CSS backgrounds
// (`background: <colour> url(…) center / cover no-repeat`). They stay CSS backgrounds here, so
// they sit under the 1px border and load as the reference's do, but through the image
// optimiser: an image-set() of the optimised URLs at 1x and 2x of the drawn width (Next's
// documented pattern for background images), in AVIF or WebP by the browser's Accept header.
//
// Quality 90: these are soft, grainy washes; at the default 75 AVIF visibly shifts their colour
// against the reference (qa/ai-scrub.mjs, strict metric), and at 90 each is still ~70–110KB.

/** Every painted background here is drawn at most the 1280px column wide. */
const DRAWN_WIDTH = 1280;

export function bgImage(src: StaticImageData | string, aspect = 1) {
  const { srcSet = "" } = getImageProps({
    src,
    alt: "",
    width: DRAWN_WIDTH,
    height: Math.round(DRAWN_WIDTH / aspect),
    quality: 90,
  }).props;
  const set = srcSet
    .split(", ")
    .map((entry) => {
      const [url, dpr] = entry.split(" ");
      return `url("${url}") ${dpr}`;
    })
    .join(", ");
  return `image-set(${set})`;
}
