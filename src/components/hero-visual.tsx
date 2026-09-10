"use client";

import dynamic from "next/dynamic";
import type { NetworkSphereProps } from "./network-sphere";

// three.js is ~150KB gzipped. Keeping it out of the initial route bundle means the
// hero text paints without waiting on it; the canvas fades in once the chunk lands.
// `ssr: false` only works inside a Client Component, which is why this wrapper exists.
const NetworkSphere = dynamic(() => import("./network-sphere"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

export default function HeroVisual(props: NetworkSphereProps) {
  return <NetworkSphere {...props} />;
}
