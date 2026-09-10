"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  BoxGeometry,
  Color,
  DirectionalLight,
  Fog,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

export type NetworkSphereProps = {
  /** Number of cube nodes. Cost is roughly linear in this. */
  nodeCount?: number;
  /** Extra long chords drawn across the sphere, on top of nearest-neighbour links. */
  chordCount?: number;
  /** Colour of an unconverted node. */
  chaosColor?: string;
  /** Colour of a converted node. */
  orderColor?: string;
  /** Canvas background. Edges fade toward this to fake per-edge opacity. */
  background?: string;
  /** Seconds for the wave to cross the graph once. */
  sweepDuration?: number;
  /** Seconds to hold the resolved sphere before reversing. */
  holdDuration?: number;
  /** Radians per second of idle Y rotation. */
  rotationSpeed?: number;
  /** Width of the conversion wavefront, in normalised x. Larger = softer. */
  waveBand?: number;
  /** Fixes the layout so tweaks are reproducible. */
  seed?: number;
  className?: string;
};

/** Mulberry32 — small deterministic PRNG so the layout is stable across reloads. */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Samples per edge polyline. Higher = smoother arcs in the tangled state. */
const EDGE_SAMPLES = 8;
const SPHERE_RADIUS = 5;
/** Camera distance. Fog is derived from this — the two must stay in step. */
const CAMERA_Z = 28;

export default function NetworkSphere({
  nodeCount = 260,
  chordCount = 18,
  chaosColor = "#0e0e10",
  orderColor = "#2162df",
  background = "#fbfbfa",
  sweepDuration = 7,
  holdDuration = 6,
  rotationSpeed = 0.055,
  waveBand = 0.18,
  seed = 20260910,
  className,
}: NetworkSphereProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      // No WebGL — leave the container empty rather than throwing during render.
      return;
    }

    const rng = makeRng(seed);
    const bgColor = new Color(background);
    const cChaos = new Color(chaosColor);
    const cOrder = new Color(orderColor);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(bgColor, 1);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new Scene();
    // Fog is measured from the camera, not the origin: the sphere sits between
    // CAMERA_Z - R and CAMERA_Z + R, so the range has to straddle that band or it
    // either does nothing or flattens everything into the background.
    scene.fog = new Fog(
      bgColor.getHex(),
      CAMERA_Z - SPHERE_RADIUS * 1.1,
      CAMERA_Z + SPHERE_RADIUS * 2.8,
    );

    // Low FOV pulled back: edges stay near-parallel (isometric read) but keep depth cues.
    const camera = new PerspectiveCamera(22, 1, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z);

    scene.add(new AmbientLight(0xffffff, 0.95));
    const key = new DirectionalLight(0xffffff, 2.0);
    key.position.set(-4, 6, 8);
    scene.add(key);
    const fill = new DirectionalLight(0xffffff, 0.7);
    fill.position.set(6, -3, 4);
    scene.add(fill);

    const group = new Group();
    scene.add(group);

    // ---- node layouts -----------------------------------------------------
    // orderPos: Fibonacci sphere, the resolved state.
    // chaosPos: a flattened, jittered ring with a hollow middle, the tangled state.
    const orderPos = new Float32Array(nodeCount * 3);
    const chaosPos = new Float32Array(nodeCount * 3);
    const scales = new Float32Array(nodeCount);
    const nx = new Float32Array(nodeCount); // normalised x of the chaos layout, drives the wave

    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      orderPos[i * 3] = Math.cos(theta) * r * SPHERE_RADIUS;
      orderPos[i * 3 + 1] = y * SPHERE_RADIUS;
      orderPos[i * 3 + 2] = Math.sin(theta) * r * SPHERE_RADIUS;

      // Derive the tangle from the sphere rather than randomising independently:
      // flatten to the XY projection, push the disc out into an annulus, jitter.
      // Neighbours on the sphere stay neighbours here, which keeps edges short —
      // random chaos positions turn every edge into a long chord and the whole
      // thing collapses into a hairball.
      const ox = orderPos[i * 3];
      const oy = orderPos[i * 3 + 1];
      const ang = Math.atan2(oy, ox);
      const projR = Math.hypot(ox, oy) / SPHERE_RADIUS;
      const ring = SPHERE_RADIUS * (0.5 + projR * 0.55) * (0.88 + rng() * 0.3);
      chaosPos[i * 3] = Math.cos(ang) * ring + (rng() - 0.5) * 0.85;
      chaosPos[i * 3 + 1] = Math.sin(ang) * ring + (rng() - 0.5) * 0.85;
      chaosPos[i * 3 + 2] = (rng() - 0.5) * 1.6;

      // Cubed random: mostly small nodes, a few large hubs. Range is tuned so the
      // largest cube is ~3.5% of the sphere's diameter, matching the reference.
      scales[i] = 0.05 + Math.pow(rng(), 3) * 0.3;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < nodeCount; i++) {
      minX = Math.min(minX, chaosPos[i * 3]);
      maxX = Math.max(maxX, chaosPos[i * 3]);
    }
    for (let i = 0; i < nodeCount; i++) {
      nx[i] = (chaosPos[i * 3] - minX) / (maxX - minX);
    }

    // ---- edges ------------------------------------------------------------
    // Nearest neighbours in the *ordered* layout, so at rest it reads as a lattice.
    const pairs: Array<[number, number]> = [];
    const seen = new Set<string>();
    const addPair = (a: number, b: number) => {
      if (a === b) return;
      const k = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (seen.has(k)) return;
      seen.add(k);
      pairs.push([a, b]);
    };

    for (let i = 0; i < nodeCount; i++) {
      const best: Array<{ j: number; d: number }> = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;
        const dx = orderPos[i * 3] - orderPos[j * 3];
        const dy = orderPos[i * 3 + 1] - orderPos[j * 3 + 1];
        const dz = orderPos[i * 3 + 2] - orderPos[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (best.length < 2) {
          best.push({ j, d });
          best.sort((p, q) => p.d - q.d);
        } else if (d < best[1].d) {
          best[1] = { j, d };
          best.sort((p, q) => p.d - q.d);
        }
      }
      for (const b of best) addPair(i, b.j);
    }
    for (let c = 0; c < chordCount; c++) {
      addPair(Math.floor(rng() * nodeCount), Math.floor(rng() * nodeCount));
    }

    const edgeCount = pairs.length;
    const vertsPerEdge = (EDGE_SAMPLES - 1) * 2;
    const edgePositions = new Float32Array(edgeCount * vertsPerEdge * 3);
    const edgeColors = new Float32Array(edgeCount * vertsPerEdge * 3);

    // Control points that bow each edge out into an arc while tangled.
    const ctrl = new Float32Array(edgeCount * 3);
    for (let e = 0; e < edgeCount; e++) {
      const [a, b] = pairs[e];
      const mx = (chaosPos[a * 3] + chaosPos[b * 3]) / 2;
      const my = (chaosPos[a * 3 + 1] + chaosPos[b * 3 + 1]) / 2;
      const mz = (chaosPos[a * 3 + 2] + chaosPos[b * 3 + 2]) / 2;

      // Bow perpendicular to the edge, scaled by its own length, so every link
      // reads as an arc instead of a near-straight line.
      const dx = chaosPos[b * 3] - chaosPos[a * 3];
      const dy = chaosPos[b * 3 + 1] - chaosPos[a * 3 + 1];
      const len = Math.hypot(dx, dy) || 1e-6;
      const side = rng() < 0.5 ? -1 : 1;
      const bow = len * (0.22 + rng() * 0.3) * side;
      ctrl[e * 3] = mx + (-dy / len) * bow;
      ctrl[e * 3 + 1] = my + (dx / len) * bow;
      ctrl[e * 3 + 2] = mz + (rng() - 0.5) * 0.9;
    }

    const edgeGeom = new BufferGeometry();
    edgeGeom.setAttribute("position", new BufferAttribute(edgePositions, 3));
    edgeGeom.setAttribute("color", new BufferAttribute(edgeColors, 3));
    const edgeMat = new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 });
    const lines = new LineSegments(edgeGeom, edgeMat);
    group.add(lines);

    const nodeGeom = new BoxGeometry(1, 1, 1);
    const nodeMat = new MeshStandardMaterial({ roughness: 0.52, metalness: 0.05 });
    const mesh = new InstancedMesh(nodeGeom, nodeMat, nodeCount);
    group.add(mesh);

    // Scratch objects, reused every frame to keep the loop allocation-free.
    const m4 = new Matrix4();
    const pos = new Vector3();
    const quat = new Quaternion();
    const scl = new Vector3();
    const col = new Color();
    const pA = new Vector3();
    const pB = new Vector3();
    const pC = new Vector3();
    const sampleA = new Vector3();
    const sampleB = new Vector3();
    const edgeColA = new Color();
    const edgeColB = new Color();
    const chaosEdge = new Color("#3f3f46");
    const orderEdge = new Color("#93a9d8");
    const progress = new Float32Array(nodeCount);

    /** Point on a quadratic bezier at t, written into `out`. */
    const bezier = (out: Vector3, a: Vector3, c: Vector3, b: Vector3, t: number) => {
      const u = 1 - t;
      out.set(
        u * u * a.x + 2 * u * t * c.x + t * t * b.x,
        u * u * a.y + 2 * u * t * c.y + t * t * b.y,
        u * u * a.z + 2 * u * t * c.z + t * t * b.z,
      );
    };

    function build(wave: number) {
      // The wavefront has width, so it has to start a full band before the leftmost
      // node and finish a band past the rightmost — otherwise wave=0 leaves the left
      // edge already half-converted and wave=1 never finishes the right edge.
      const w = wave * (1 + 2 * waveBand) - waveBand;
      for (let i = 0; i < nodeCount; i++) {
        // As `w` sweeps past a node's normalised x, that node converts.
        const p = smoothstep(nx[i] - waveBand, nx[i] + waveBand, w);
        progress[i] = p;
        const e = p * p * (3 - 2 * p);

        pos.set(
          chaosPos[i * 3] + (orderPos[i * 3] - chaosPos[i * 3]) * e,
          chaosPos[i * 3 + 1] + (orderPos[i * 3 + 1] - chaosPos[i * 3 + 1]) * e,
          chaosPos[i * 3 + 2] + (orderPos[i * 3 + 2] - chaosPos[i * 3 + 2]) * e,
        );
        const s = scales[i];
        scl.set(s, s, s);
        m4.compose(pos, quat, scl);
        mesh.setMatrixAt(i, m4);

        col.copy(cChaos).lerp(cOrder, p);
        mesh.setColorAt(i, col);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      let v = 0;
      for (let e = 0; e < edgeCount; e++) {
        const [a, b] = pairs[e];
        const pa = progress[a];
        const pb = progress[b];
        const mix = (pa + pb) / 2;

        // Endpoints follow their nodes; the arc straightens as the pair converts.
        const ea = pa * pa * (3 - 2 * pa);
        const eb = pb * pb * (3 - 2 * pb);
        pA.set(
          chaosPos[a * 3] + (orderPos[a * 3] - chaosPos[a * 3]) * ea,
          chaosPos[a * 3 + 1] + (orderPos[a * 3 + 1] - chaosPos[a * 3 + 1]) * ea,
          chaosPos[a * 3 + 2] + (orderPos[a * 3 + 2] - chaosPos[a * 3 + 2]) * ea,
        );
        pB.set(
          chaosPos[b * 3] + (orderPos[b * 3] - chaosPos[b * 3]) * eb,
          chaosPos[b * 3 + 1] + (orderPos[b * 3 + 1] - chaosPos[b * 3 + 1]) * eb,
          chaosPos[b * 3 + 2] + (orderPos[b * 3 + 2] - chaosPos[b * 3 + 2]) * eb,
        );
        // Control point collapses to the midpoint, turning the arc into a line.
        pC.set(
          ctrl[e * 3] + ((pA.x + pB.x) / 2 - ctrl[e * 3]) * mix,
          ctrl[e * 3 + 1] + ((pA.y + pB.y) / 2 - ctrl[e * 3 + 1]) * mix,
          ctrl[e * 3 + 2] + ((pA.z + pB.z) / 2 - ctrl[e * 3 + 2]) * mix,
        );

        // Fading toward the background stands in for per-edge opacity.
        edgeColA.copy(chaosEdge).lerp(orderEdge, pa).lerp(bgColor, 0.08 + pa * 0.66);
        edgeColB.copy(chaosEdge).lerp(orderEdge, pb).lerp(bgColor, 0.08 + pb * 0.66);

        for (let s = 0; s < EDGE_SAMPLES - 1; s++) {
          const t0 = s / (EDGE_SAMPLES - 1);
          const t1 = (s + 1) / (EDGE_SAMPLES - 1);
          bezier(sampleA, pA, pC, pB, t0);
          bezier(sampleB, pA, pC, pB, t1);

          edgePositions[v * 3] = sampleA.x;
          edgePositions[v * 3 + 1] = sampleA.y;
          edgePositions[v * 3 + 2] = sampleA.z;
          col.copy(edgeColA).lerp(edgeColB, t0);
          edgeColors[v * 3] = col.r;
          edgeColors[v * 3 + 1] = col.g;
          edgeColors[v * 3 + 2] = col.b;
          v++;

          edgePositions[v * 3] = sampleB.x;
          edgePositions[v * 3 + 1] = sampleB.y;
          edgePositions[v * 3 + 2] = sampleB.z;
          col.copy(edgeColA).lerp(edgeColB, t1);
          edgeColors[v * 3] = col.r;
          edgeColors[v * 3 + 1] = col.g;
          edgeColors[v * 3 + 2] = col.b;
          v++;
        }
      }
      edgeGeom.attributes.position.needsUpdate = true;
      edgeGeom.attributes.color.needsUpdate = true;
      edgeGeom.computeBoundingSphere();
    }

    function resize() {
      const w = host!.clientWidth || 1;
      const h = host!.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Keep the sphere a constant share of the shorter edge across aspect ratios.
      camera.fov = 22 * Math.max(1, 1.15 / camera.aspect);
      camera.updateProjectionMatrix();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // Draw one frame up front. Without this the canvas can sit empty: the
    // IntersectionObserver below fires with its real state right after mount and
    // may stop the loop before it has ever rendered.
    build(0);
    renderer.render(scene, camera);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let visible = true;
    let last = performance.now();
    let clock = 0;

    // Ping-pong instead of a hard cut, so the loop has no visible jump.
    const cycle = sweepDuration * 2 + holdDuration * 2;
    const waveAt = (t: number) => {
      const u = t % cycle;
      if (u < sweepDuration) return smoothstep(0, 1, u / sweepDuration);
      if (u < sweepDuration + holdDuration) return 1;
      if (u < sweepDuration * 2 + holdDuration) {
        return 1 - smoothstep(0, 1, (u - sweepDuration - holdDuration) / sweepDuration);
      }
      return 0;
    };

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      clock += dt;
      group.rotation.y += dt * rotationSpeed;
      build(waveAt(clock));
      renderer.render(scene, camera);
    }

    function start() {
      if (raf || reduceMotion.matches) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function applyMotionPreference() {
      if (reduceMotion.matches) {
        stop();
        // Static resolved sphere — the end state, with no movement.
        group.rotation.y = 0.4;
        build(1);
        renderer.render(scene, camera);
      } else {
        start();
      }
    }

    // Don't burn a render loop (or battery) while the hero is scrolled out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    io.observe(host);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    reduceMotion.addEventListener("change", applyMotionPreference);
    applyMotionPreference();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      reduceMotion.removeEventListener("change", applyMotionPreference);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      nodeGeom.dispose();
      nodeMat.dispose();
      edgeGeom.dispose();
      edgeMat.dispose();
      mesh.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [
    nodeCount,
    chordCount,
    chaosColor,
    orderColor,
    background,
    sweepDuration,
    holdDuration,
    rotationSpeed,
    waveBand,
    seed,
  ]);

  // The host must fill its parent on its own — callers position the parent, and a
  // bare div would collapse to zero height and render nothing.
  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
