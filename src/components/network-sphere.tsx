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
  PCFSoftShadowMap,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

export type NetworkSphereProps = {
  /** Number of cube nodes. Also sets how many build steps there are. */
  nodeCount?: number;
  /** Links per node in the resolved lattice. Higher = denser blue interconnection. */
  neighbours?: number;
  /** Extra long chords drawn across the sphere on top of the lattice. */
  chordCount?: number;
  /** Colour of an unbuilt node. */
  chaosColor?: string;
  /** Colour of a built node. */
  orderColor?: string;
  /** Colour of an unbuilt link. */
  chaosEdgeColor?: string;
  /** Colour of a built link. */
  orderEdgeColor?: string;
  /** Canvas background. Links fade toward this to fake per-link opacity. */
  background?: string;
  /** Seconds for the traversal to visit every node. The build runs once. */
  buildDuration?: number;
  /** Seconds a single node takes to travel into place. Governs how many are ever
   *  in flight at once: nodeCount / buildDuration * nodeTransition. */
  nodeTransition?: number;
  /** Quiet beat on the tangled state before the first node fires. */
  startDelay?: number;
  /** Radians per second of Y rotation. */
  rotationSpeed?: number;
  /** Self-shadowing between cubes. Costs a shadow pass. */
  shadows?: boolean;
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

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Ease-out cubic: nodes arrive gently rather than snapping into the shell. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Samples per link polyline. Higher = smoother arcs in the tangled state. */
const EDGE_SAMPLES = 8;
const SPHERE_RADIUS = 5;
/** Camera distance. Fog is derived from this — the two must stay in step. */
const CAMERA_Z = 28;

export default function NetworkSphere({
  nodeCount = 180,
  neighbours = 3,
  chordCount = 22,
  chaosColor = "#2f2f33",
  orderColor = "#2162df",
  chaosEdgeColor = "#3f3f46",
  orderEdgeColor = "#6f92dd",
  background = "#fbfbfa",
  buildDuration = 30,
  nodeTransition = 0.6,
  startDelay = 0.8,
  rotationSpeed = 0.05,
  shadows = true,
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
    if (shadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
    }
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

    // Low ambient against a strong key is what gives each cube three clearly
    // different face values — that read, more than cast shadows, is what makes
    // the cubes look solid.
    scene.add(new AmbientLight(0xffffff, 0.55));
    const key = new DirectionalLight(0xffffff, 3.1);
    key.position.set(-6, 8, 7);
    if (shadows) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      const s = key.shadow.camera;
      s.left = -SPHERE_RADIUS * 1.4;
      s.right = SPHERE_RADIUS * 1.4;
      s.top = SPHERE_RADIUS * 1.4;
      s.bottom = -SPHERE_RADIUS * 1.4;
      s.near = 1;
      s.far = 40;
      key.shadow.bias = -0.0015;
    }
    scene.add(key);
    const fill = new DirectionalLight(0xffffff, 0.55);
    fill.position.set(7, -4, 3);
    scene.add(fill);

    const group = new Group();
    scene.add(group);

    // ---- node layouts -----------------------------------------------------
    // orderPos: Fibonacci sphere, the built state.
    // chaosPos: a flattened, jittered annulus, the tangled state.
    const orderPos = new Float32Array(nodeCount * 3);
    const chaosPos = new Float32Array(nodeCount * 3);
    const scales = new Float32Array(nodeCount);

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
      // Neighbours on the sphere stay neighbours here, which keeps links short —
      // random chaos positions turn every link into a long chord and the whole
      // thing collapses into a hairball.
      const ox = orderPos[i * 3];
      const oy = orderPos[i * 3 + 1];
      const ang = Math.atan2(oy, ox);
      const projR = Math.hypot(ox, oy) / SPHERE_RADIUS;
      const ring = SPHERE_RADIUS * (0.5 + projR * 0.55) * (0.88 + rng() * 0.3);
      chaosPos[i * 3] = Math.cos(ang) * ring + (rng() - 0.5) * 0.9;
      chaosPos[i * 3 + 1] = Math.sin(ang) * ring + (rng() - 0.5) * 0.9;
      chaosPos[i * 3 + 2] = (rng() - 0.5) * 2.4;

      // Cubed random: mostly small nodes, a few large hubs. Range is tuned so the
      // largest cube is ~3.5% of the sphere's diameter, matching the reference.
      scales[i] = 0.05 + Math.pow(rng(), 3) * 0.3;
    }

    // ---- links ------------------------------------------------------------
    // Nearest neighbours in the *built* layout, so at rest it reads as a lattice.
    const pairs: Array<[number, number]> = [];
    const seen = new Set<string>();
    const adjacency: number[][] = Array.from({ length: nodeCount }, () => []);
    const addPair = (a: number, b: number) => {
      if (a === b) return;
      const k = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (seen.has(k)) return;
      seen.add(k);
      pairs.push([a, b]);
      adjacency[a].push(b);
      adjacency[b].push(a);
    };

    for (let i = 0; i < nodeCount; i++) {
      const best: Array<{ j: number; d: number }> = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;
        const dx = orderPos[i * 3] - orderPos[j * 3];
        const dy = orderPos[i * 3 + 1] - orderPos[j * 3 + 1];
        const dz = orderPos[i * 3 + 2] - orderPos[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (best.length < neighbours) {
          best.push({ j, d });
          best.sort((p, q) => p.d - q.d);
        } else if (d < best[neighbours - 1].d) {
          best[neighbours - 1] = { j, d };
          best.sort((p, q) => p.d - q.d);
        }
      }
      for (const b of best) addPair(i, b.j);
    }
    for (let c = 0; c < chordCount; c++) {
      addPair(Math.floor(rng() * nodeCount), Math.floor(rng() * nodeCount));
    }

    // ---- build order ------------------------------------------------------
    // The reference does not sweep space — it walks the graph. Blue nodes are
    // always adjacent to blue nodes, spreading out from one seed. Breadth-first
    // from the leftmost node reproduces that, and because each node fires on its
    // own beat the structure assembles link by link instead of all at once.
    let seedNode = 0;
    for (let i = 1; i < nodeCount; i++) {
      if (chaosPos[i * 3] < chaosPos[seedNode * 3]) seedNode = i;
    }

    const rank = new Int32Array(nodeCount).fill(-1);
    const order: number[] = [];
    const queue = [seedNode];
    rank[seedNode] = 0;
    order.push(seedNode);
    for (let head = 0; head < queue.length; head++) {
      const cur = queue[head];
      // Visit a node's neighbours nearest-first so growth looks deliberate
      // rather than jumping across the shell.
      const nbrs = adjacency[cur].slice().sort((a, b) => {
        const da =
          (orderPos[a * 3] - orderPos[cur * 3]) ** 2 +
          (orderPos[a * 3 + 1] - orderPos[cur * 3 + 1]) ** 2 +
          (orderPos[a * 3 + 2] - orderPos[cur * 3 + 2]) ** 2;
        const db =
          (orderPos[b * 3] - orderPos[cur * 3]) ** 2 +
          (orderPos[b * 3 + 1] - orderPos[cur * 3 + 1]) ** 2 +
          (orderPos[b * 3 + 2] - orderPos[cur * 3 + 2]) ** 2;
        return da - db;
      });
      for (const nb of nbrs) {
        if (rank[nb] !== -1) continue;
        rank[nb] = order.length;
        order.push(nb);
        queue.push(nb);
      }
    }
    // Anything the traversal could not reach still has to be built.
    for (let i = 0; i < nodeCount; i++) {
      if (rank[i] === -1) {
        rank[i] = order.length;
        order.push(i);
      }
    }

    const interval = buildDuration / Math.max(1, nodeCount);
    const activateAt = new Float32Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) {
      activateAt[i] = startDelay + rank[i] * interval;
    }
    const buildEnds = startDelay + (nodeCount - 1) * interval + nodeTransition;

    const edgeCount = pairs.length;
    const vertsPerEdge = (EDGE_SAMPLES - 1) * 2;
    const edgePositions = new Float32Array(edgeCount * vertsPerEdge * 3);
    const edgeColors = new Float32Array(edgeCount * vertsPerEdge * 3);

    // Control points that bow each link out into an arc while tangled.
    const ctrl = new Float32Array(edgeCount * 3);
    for (let e = 0; e < edgeCount; e++) {
      const [a, b] = pairs[e];
      const mx = (chaosPos[a * 3] + chaosPos[b * 3]) / 2;
      const my = (chaosPos[a * 3 + 1] + chaosPos[b * 3 + 1]) / 2;
      const mz = (chaosPos[a * 3 + 2] + chaosPos[b * 3 + 2]) / 2;

      // Bow perpendicular to the link, scaled by its own length, so every one
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
    const edgeMat = new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 });
    const lines = new LineSegments(edgeGeom, edgeMat);
    group.add(lines);

    const nodeGeom = new BoxGeometry(1, 1, 1);
    const nodeMat = new MeshStandardMaterial({ roughness: 0.45, metalness: 0.05 });
    const mesh = new InstancedMesh(nodeGeom, nodeMat, nodeCount);
    if (shadows) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
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
    const chaosEdge = new Color(chaosEdgeColor);
    const orderEdge = new Color(orderEdgeColor);
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

    /** Writes the whole scene for a given point in the build, in seconds. */
    function build(elapsed: number) {
      for (let i = 0; i < nodeCount; i++) {
        const p = clamp01((elapsed - activateAt[i]) / nodeTransition);
        progress[i] = p;
        const e = easeOut(p);

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
        // A link only counts as built once *both* its ends are, so the lattice
        // visibly closes behind the traversal instead of running ahead of it.
        const mix = Math.min(pa, pb);

        const ea = easeOut(pa);
        const eb = easeOut(pb);
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

        // Fading toward the background stands in for per-link opacity, which
        // LineBasicMaterial cannot vary per segment.
        edgeColA.copy(chaosEdge).lerp(orderEdge, pa).lerp(bgColor, 0.06 + pa * 0.32);
        edgeColB.copy(chaosEdge).lerp(orderEdge, pb).lerp(bgColor, 0.06 + pb * 0.32);

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

    // Draw the tangled state up front so the canvas is never empty while the
    // hero waits to be scrolled into view.
    build(0);
    renderer.render(scene, camera);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let visible = false;
    let last = performance.now();
    let clock = 0;
    // The build runs once per page load. Once it finishes there is nothing left
    // to rebuild, so the loop drops to rotating an already-written scene.
    let settled = false;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      clock += dt;
      group.rotation.y += dt * rotationSpeed;
      if (!settled) {
        build(clock);
        if (clock >= buildEnds) settled = true;
      }
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
        // Jump straight to the finished sphere — no travel, no rotation.
        group.rotation.y = 0.4;
        build(buildEnds);
        settled = true;
        renderer.render(scene, camera);
      } else if (visible) {
        start();
      }
    }

    // Hold the tangled state until the hero is actually on screen, so the build
    // is not already over by the time anyone looks at it. Also keeps the loop
    // off while scrolled away.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.15 },
    );
    io.observe(host);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    reduceMotion.addEventListener("change", applyMotionPreference);
    if (reduceMotion.matches) applyMotionPreference();

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
    neighbours,
    chordCount,
    chaosColor,
    orderColor,
    chaosEdgeColor,
    orderEdgeColor,
    background,
    buildDuration,
    nodeTransition,
    startDelay,
    rotationSpeed,
    shadows,
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
