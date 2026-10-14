import { Fragment } from "react";

/** Lines of a title, broken with <br /> as the prototypes write them. */
export function Br({ lines }: { lines: string[] }) {
  return lines.map((l, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {l}
    </Fragment>
  ));
}
