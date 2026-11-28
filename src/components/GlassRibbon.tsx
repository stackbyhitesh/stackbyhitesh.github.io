import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks';

// A small real-time version of the hero sculpture: two translucent bands, shaded like glass (fresnel tint, glint, bright rim).
// Plain WebGL, no library. The still image is always rendered underneath, so the hero never looks empty
// (reduced motion, no WebGL, and the moment before the first frame all show the image).

const VERT = `
attribute vec3 aPos; attribute vec3 aNor; attribute vec3 aPar;
uniform mat3 uRot; uniform vec2 uScale;
varying vec3 vN; varying vec3 vPar;
void main() {
  vec3 p = uRot * aPos;
  float f = 7.0 / (7.0 - p.z);
  gl_Position = vec4(p.x * f * uScale.x, p.y * f * uScale.y, 0.0, 1.0);
  vN = uRot * aNor; vPar = aPar;
}`;

const FRAG = `
precision mediump float;
varying vec3 vN; varying vec3 vPar;
const vec3 PALE = vec3(.910, .933, .922); const vec3 GREEN = vec3(.329, .541, .424);
const vec3 DEEP = vec3(.118, .298, .220); const vec3 SLATE = vec3(.588, .643, .667);
void main() {
  vec3 n = normalize(vN); if (n.z < 0.0) n = -n;
  vec3 L = normalize(vec3(-.5, .7, .55)); vec3 L2 = normalize(vec3(.7, -.2, .5));
  float fres = pow(1.0 - n.z, 2.0);
  float diff = clamp(dot(n, L), 0.0, 1.0);
  float s1 = pow(clamp((2.0 * dot(n, L) * n - L).z, 0.0, 1.0), 38.0);
  float s2 = pow(clamp((2.0 * dot(n, L2) * n - L2).z, 0.0, 1.0), 60.0);
  float gm = clamp(.34 + .58 * fres + .18 * sin(vPar.x * 2.0 + vPar.z * 1.7) + .10 * vPar.y * (vPar.z < .5 ? 1.0 : -1.0), 0.0, 1.0);
  vec3 col = mix(PALE, GREEN, gm);
  float gsl = clamp(.35 * (1.0 - diff) * (1.0 - fres), 0.0, 1.0);
  col = mix(col, SLATE, gsl * .55);
  col = col * (.84 + .22 * diff) + DEEP * (.30 * fres);
  float a = .18 + .36 * fres + .07 * diff;
  float sp = clamp(s1 * .85 + s2 * .6, 0.0, .85);
  col = mix(col, vec3(1.0), sp); a = clamp(a + sp * .55, 0.0, .92);
  float rim = smoothstep(.92, 1.0, abs(vPar.y));
  col = mix(col, vec3(1.0), rim * .6); a = max(a, rim * .5);
  gl_FragColor = vec4(col * a, a);
}`;

const rot = (ax: number, ay: number, az: number): number[][] => {
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(ax), Math.sin(ax), Math.cos(ay), Math.sin(ay), Math.cos(az), Math.sin(az)];
  const Rx = [[1, 0, 0], [0, cx, -sx], [0, sx, cx]];
  const Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]];
  const Rz = [[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]];
  const mul = (A: number[][], B: number[][]) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
  return mul(Rz, mul(Ry, Rx));
};
const apply = (R: number[][], v: number[]) => R.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const deg = Math.PI / 180;
const NT = 200;
const NS = 10;

/** One band as a grid of vertices: position, smooth normal and (t, s, tint). */
function band(radius: number, width: number, k: number, phi0: number, R: number[][], wob: number, lift: number, tint: number) {
  const pos: number[][] = [];
  for (let i = 0; i <= NT; i++) {
    const t = (i / NT) * Math.PI * 2;
    const phi = k * t + phi0;
    const rad = radius * (1 + wob * Math.sin(2 * t + phi0));
    const c = [rad * Math.cos(t), rad * Math.sin(t), lift * Math.sin(2 * t + phi0)];
    const nrm = [Math.cos(t), Math.sin(t), 0];
    for (let j = 0; j <= NS; j++) {
      const s = -1 + (2 * j) / NS;
      const w = [Math.sin(phi) * nrm[0], Math.sin(phi) * nrm[1], Math.cos(phi)];
      pos.push(apply(R, [c[0] + s * width * w[0], c[1] + s * width * w[1], c[2] + s * width * w[2]]));
    }
  }
  const at = (i: number, j: number) => pos[Math.min(NT, Math.max(0, i)) * (NS + 1) + Math.min(NS, Math.max(0, j))];
  const verts: number[] = [];
  for (let i = 0; i <= NT; i++) {
    for (let j = 0; j <= NS; j++) {
      const a = at(i + 1, j), b = at(i - 1, j), c = at(i, j + 1), d = at(i, j - 1);
      const dt = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], ds = [c[0] - d[0], c[1] - d[1], c[2] - d[2]];
      const n = [dt[1] * ds[2] - dt[2] * ds[1], dt[2] * ds[0] - dt[0] * ds[2], dt[0] * ds[1] - dt[1] * ds[0]];
      const len = Math.hypot(n[0], n[1], n[2]) || 1;
      const p = at(i, j);
      verts.push(p[0], p[1], p[2], n[0] / len, n[1] / len, n[2] / len, (i / NT) * Math.PI * 2, -1 + (2 * j) / NS, tint);
    }
  }
  return verts;
}

function start(canvas: HTMLCanvasElement, onFrame: () => void): (() => void) | null {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return null;
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src); gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const a = band(1.0, 0.62, 0.5, 0.2, rot(72 * deg, -16 * deg, -18 * deg), 0.05, 0.10, 0);
  const b = band(0.80, 0.34, -1.0, 1.4, rot(-40 * deg, 28 * deg, 30 * deg), -0.06, -0.08, 1);
  const vertData = new Float32Array([...a, ...b]);
  const perBand = (NT + 1) * (NS + 1);
  const quadCount = NT * NS * 2;
  const centres = new Float32Array(quadCount * 3);
  const quadVerts = new Uint16Array(quadCount * 4);
  let q = 0;
  for (let bi = 0; bi < 2; bi++) {
    for (let i = 0; i < NT; i++) {
      for (let j = 0; j < NS; j++) {
        const ids = [i * (NS + 1) + j, (i + 1) * (NS + 1) + j, (i + 1) * (NS + 1) + j + 1, i * (NS + 1) + j + 1].map((v) => v + bi * perBand);
        quadVerts.set(ids, q * 4);
        for (let c = 0; c < 3; c++) centres[q * 3 + c] = ids.reduce((s, id) => s + vertData[id * 9 + c], 0) / 4;
        q++;
      }
    }
  }
  const vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, vertData, gl.STATIC_DRAW);
  const attr = (name: string, off: number) => {
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 36, off);
  };
  attr('aPos', 0); attr('aNor', 12); attr('aPar', 24);
  const ibo = gl.createBuffer();
  const indices = new Uint16Array(quadCount * 6);
  const keys = new Uint32Array(quadCount);
  const uRot = gl.getUniformLocation(prog, 'uRot'), uScale = gl.getUniformLocation(prog, 'uScale');
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  let raf = 0, visible = true, px = 0, py = 0, tx = 0, ty = 0;
  const onMove = (e: PointerEvent) => { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; };
  window.addEventListener('pointermove', onMove, { passive: true });
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(canvas);

  const frame = (ms: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); gl.viewport(0, 0, canvas.width, canvas.height); }
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    const t = ms / 1000;
    const yaw = 0.7 * Math.sin(t * 0.28) + px * 0.5, pitch = 0.1 * Math.sin(t * 0.37 + 1) + py * 0.3;
    const R = rot(pitch, yaw, 0);
    // Column-major mat3 for the shader
    gl.uniformMatrix3fv(uRot, false, new Float32Array([R[0][0], R[1][0], R[2][0], R[0][1], R[1][1], R[2][1], R[0][2], R[1][2], R[2][2]]));
    const aspect = w / h, half = 1.4;
    gl.uniform2f(uScale, 1 / (half * aspect), 1 / half);
    // Far quads first, so the translucent layers blend in the right order
    for (let i = 0; i < quadCount; i++) {
      const z = R[2][0] * centres[i * 3] + R[2][1] * centres[i * 3 + 1] + R[2][2] * centres[i * 3 + 2];
      keys[i] = ((Math.max(0, Math.min(1, (z + 2.5) / 5)) * 0x7ffff) << 13 >>> 0) | i;
    }
    keys.sort();
    for (let k = 0; k < quadCount; k++) {
      const id = keys[k] & 0x1fff, o = id * 4, n = k * 6;
      indices[n] = quadVerts[o]; indices[n + 1] = quadVerts[o + 1]; indices[n + 2] = quadVerts[o + 2];
      indices[n + 3] = quadVerts[o]; indices[n + 4] = quadVerts[o + 2]; indices[n + 5] = quadVerts[o + 3];
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, quadCount * 6, gl.UNSIGNED_SHORT, 0);
    onFrame();
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('pointermove', onMove); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
}

interface Props { src: string; width: number; height: number }

export default function GlassRibbon({ src, width, height }: Props) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (reduced || !canvas) return;
    let first = true;
    const stop = start(canvas, () => { if (first) { first = false; setLive(true); } });
    return () => { stop?.(); setLive(false); };
  }, [reduced]);

  return (
    <div className={`ribbon${live ? ' ribbon--live' : ''}`}>
      <img src={src} alt="" width={width} height={height} decoding="async" {...{ fetchpriority: 'high' }} />
      {!reduced && <canvas ref={canvasRef} className="ribbon__canvas" />}
    </div>
  );
}
