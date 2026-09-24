# 06 · §05 Investors (`#investors`): "Every deal matched to the money that can hold it."

Not pinned. One faux-app window where each deal is tested against four mandates and split
across the vehicles that can hold it. It loops through three deals.

## Markup

`section#investors[data-screen-label="Investor routing"]`: `position: relative; padding: clamp(40px,6vh,92px) 40px; border-bottom: 1px solid var(--line2)`.

* Background (absolute, fills the section, overflow hidden): `routing-band.png` at
  `100%×100%; object-fit: fill`. The stretch is deliberate, because the band is an abstract
  wash. Over it goes a scrim, `linear-gradient(180deg, rgba(252,251,249,0.5), rgba(252,251,249,0.3) 50%, rgba(252,251,249,0.52))`.
* Content: `position: relative; max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center`.
  * `lpHead`: `flex: 0 0 auto; max-width: 820px; margin: 0 auto; text-align: center`, with h2 at
    `clamp(21px,2.3vw,34px) / −0.032em / 1.1 / pretty`.
  * `lpFit`: `flex: 0 0 auto; margin: clamp(18px,3.2vh,48px) 0 0`
    * `lpHost`: **empty**, `transform-origin: top center`

## Motion

`buildLp()` / `loopLp()` / `lpFitNow()`. See `ANIMATIONS.md` §7.

The module builds the window. Its title bar is `#F2EFE8`, with lights, a centred title and a
right tag reading "ALLOCATION". The body is a
`grid-template-columns: minmax(140px,230px) minmax(190px,1fr) 40px minmax(250px,400px)` on
white, with these columns:
1. **Queue**: "Ready to allocate", the three deals, and the active one marked with a 2px ink bar.
2. **Deal**: borrower, facility, size, rating, class and security.
3. **Connector**, 40px.
4. **Vehicles**: four rows, each 116px tall with a 14px gap and 34px top:

| Code | Vehicle | Descriptor | Mandate |
| --- | --- | --- | --- |
| MC | Meridian Credit II | Flagship fund · $1.2bn | Direct lending · min B− · max 12% single |
| NS | Nordea SMA | Managed account · $300m | Senior secured only · min B · max 8% |
| CO | Credit Opportunities | Sleeve · $450m | Junior and opportunistic · min CCC+ |
| IS | Insurance SMA | Rated feeder · $250m | No PIK · min B+ · max 6% single |

`lpFitNow()` writes `transform` on `lpHost` and `height` / `overflow` on `lpFit`. Do not style
those properties.

**DOM contract:** `lpHead lpFit lpHost`.

## Verify (freeze with `?t=`)

| t | Expect |
| --- | --- |
| 0.4 | Northgate entering |
| 2.4 | Northgate: mandates under test; Nordea failing "senior secured only" |
| 5.5 | Northgate: allocation filling 40.0 / 12.5 / 10.0 |
| 7.8 | Northgate settled |
| 16.0 | Estree: allocation almost complete (13.0 / 5.0) |
| 26.3 | Garrow settled: Nordea 24.0, Meridian 16.0 |

* At 1440×900 and 1280×800, the headline and the whole window are visible together without scrolling.
* At 1440×760 the window is scaled down, but never below 0.62.
