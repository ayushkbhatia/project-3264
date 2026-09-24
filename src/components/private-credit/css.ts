import type { CSSProperties } from "react";

// The Private Credit markup is set from the reference prototype's inline styles
// (design_handoff_private_credit/reference/Private Credit.dc.html). Rather than hand-convert
// hundreds of declarations into React style objects — where a dropped unit or a mistyped
// property is invisible until a screenshot diff — each element carries the reference's CSS
// text verbatim and css() turns it into a style object. Parsed once per distinct string.
//
//   <div style={css("position:absolute; left:44px; top:62px; width:572px")} />
//
// Hover states (the prototype's style-hover) are NOT expressible inline; those properties go
// in className instead, and are left out of the css() string so the class can win.

const cache = new Map<string, CSSProperties>();

function prop(name: string): string {
  const n = name.trim();
  if (n.startsWith("--")) return n; // custom property: keep as written
  // -webkit-mask-image -> WebkitMaskImage; background-clip -> backgroundClip
  return n.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** Split on semicolons that are not inside parentheses or quotes. */
function declarations(text: string): string[] {
  const out: string[] = [];
  let depth = 0, quote = "", start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === quote) quote = "";
    } else if (c === "'" || c === '"') quote = c;
    else if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (c === ";" && depth === 0) {
      out.push(text.slice(start, i));
      start = i + 1;
    }
  }
  out.push(text.slice(start));
  return out.map((d) => d.trim()).filter(Boolean);
}

export function css(text: string): CSSProperties {
  const hit = cache.get(text);
  if (hit) return hit;
  const style: Record<string, string> = {};
  for (const d of declarations(text)) {
    const i = d.indexOf(":");
    if (i < 0) continue;
    style[prop(d.slice(0, i))] = d.slice(i + 1).trim();
  }
  cache.set(text, style as CSSProperties);
  return style as CSSProperties;
}
