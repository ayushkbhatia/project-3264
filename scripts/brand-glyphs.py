#!/usr/bin/env python3
"""Set short runs of Instrument Sans as SVG path data, for scripts/brand-assets.mjs.

    python3 scripts/brand-glyphs.py <font.woff2> < runs.json > paths.json
    python3 scripts/brand-glyphs.py --find <dir>...

--find prints the upright Latin Instrument Sans file among the woff2 files next/font has
downloaded (identified by its name table, not its hashed filename), or exits non-zero.

Each run in the input array is {text, weight, size, tracking, x, y, precision}: size in px,
tracking in em (the site's letter-spacing), (x, y) the pen start on the baseline. Each result
is {d, advance, bbox}: the outline as one SVG path, y down, plus the advance and ink box in px.

Setting mirrors how Chrome lays out the same text: the variable font is instanced at the
requested weight, pair kerning comes from the font's GPOS 'kern' feature, and letter-spacing
is added after every character, the last one included. There is no shaping beyond that, so
keep runs to plain Latin without ligatures (Chrome turns ligatures off under letter-spacing).

Needs fontTools and brotli (for woff2).
"""

import glob
import json
import os
import sys

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer


def number_formatter(precision):
    def ntos(v):
        s = f"{v:.{precision}f}".rstrip("0").rstrip(".")
        return "0" if s in ("-0", "") else s

    return ntos


def kern_subtables(font):
    """PairPos subtables of the 'kern' feature, in lookup order, unwrapped from extensions."""
    gpos = font["GPOS"].table
    indices = []
    for record in gpos.FeatureList.FeatureRecord:
        if record.FeatureTag == "kern":
            indices += [i for i in record.Feature.LookupListIndex if i not in indices]
    tables = []
    for i in sorted(indices):
        for sub in gpos.LookupList.Lookup[i].SubTable:
            if sub.LookupType == 9:
                sub = sub.ExtSubTable
            if sub.LookupType == 2:
                tables.append(sub)
    return tables


def pair_adjustment(tables, left, right):
    """X-advance adjustment for a glyph pair, in font units. The first subtable that covers
    the pair decides, as in OpenType lookup processing."""
    for sub in tables:
        if left not in sub.Coverage.glyphs:
            continue
        if sub.Format == 1:
            pair_set = sub.PairSet[sub.Coverage.glyphs.index(left)]
            for record in pair_set.PairValueRecord:
                if record.SecondGlyph == right:
                    value = record.Value1
                    return getattr(value, "XAdvance", 0) or 0 if value else 0
            continue
        class1 = sub.ClassDef1.classDefs.get(left, 0)
        class2 = sub.ClassDef2.classDefs.get(right, 0)
        value = sub.Class1Record[class1].Class2Record[class2].Value1
        return getattr(value, "XAdvance", 0) or 0 if value else 0
    return 0


def set_run(font, run):
    upm = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()
    hmtx = font["hmtx"]
    kern = kern_subtables(font)
    size = float(run["size"])
    scale = size / upm
    tracking = float(run.get("tracking", 0)) * size
    ntos = number_formatter(int(run.get("precision", 2)))

    names = []
    for ch in run["text"]:
        if ord(ch) not in cmap:
            raise SystemExit(f"brand-glyphs: {ch!r} is not in this font")
        names.append(cmap[ord(ch)])

    path = SVGPathPen(glyphs, ntos=ntos)
    bounds = BoundsPen(glyphs)
    x0, y0 = float(run.get("x", 0)), float(run.get("y", 0))
    pen_x = x0
    for i, name in enumerate(names):
        matrix = (scale, 0, 0, -scale, pen_x, y0)
        glyphs[name].draw(TransformPen(path, matrix))
        glyphs[name].draw(TransformPen(bounds, matrix))
        pen_x += hmtx[name][0] * scale + tracking
        if i + 1 < len(names):
            pen_x += pair_adjustment(kern, name, names[i + 1]) * scale

    return {"d": path.getCommands(), "advance": pen_x - x0, "bbox": list(bounds.bounds or (x0, y0, x0, y0))}


def find_font(dirs):
    """The upright, variable Instrument Sans with the widest character set: next/font splits
    the family into subsets, and the Latin one is the largest the page uses."""
    best = None
    for d in dirs:
        for path in sorted(glob.glob(os.path.join(d, "*.woff2"))):
            font = TTFont(path)
            if font["name"].getDebugName(1) != "Instrument Sans" or font["post"].italicAngle != 0:
                continue
            if "fvar" not in font or not all(ord(c) in font.getBestCmap() for c in "0123456789.abz"):
                continue
            count = len(font.getBestCmap())
            if best is None or count > best[0]:
                best = (count, path)
    if best is None:
        raise SystemExit("brand-glyphs: no Instrument Sans woff2 found; run `npm run dev` or `npm run build` once first")
    print(best[1])


def main():
    if len(sys.argv) >= 3 and sys.argv[1] == "--find":
        return find_font(sys.argv[2:])
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    runs = json.load(sys.stdin)
    base = TTFont(sys.argv[1])
    instances = {}
    out = []
    for run in runs:
        weight = float(run.get("weight", 400))
        if weight not in instances:
            instances[weight] = instancer.instantiateVariableFont(TTFont(sys.argv[1]), {"wght": weight}) if "fvar" in base else base
        out.append(set_run(instances[weight], run))
    json.dump(out, sys.stdout)


if __name__ == "__main__":
    main()
