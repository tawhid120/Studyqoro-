import { useState, useMemo, useRef, useCallback } from "react";
import { Plus, X, Minus, Crosshair, ChevronLeft } from "lucide-react";
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-ignore
import Plotly from "plotly.js-dist-min";
const Plot = createPlotlyComponent(Plotly);
import * as math from "mathjs";
import { MathEq, COLORS, detectParams, traceImplicitCurve } from "./graphing-utils";

interface Props { darkMode: boolean; }

// ── per-equation colorscales for 3D surfaces ─────────────────────────────────
const SCALES: [number, string][][] = [
  [[0,"#6ee7b7"],[0.5,"#10b981"],[1,"#065f46"]],
  [[0,"#fca5a5"],[0.5,"#ef4444"],[1,"#7f1d1d"]],
  [[0,"#93c5fd"],[0.5,"#3b82f6"],[1,"#1e3a8a"]],
  [[0,"#fde68a"],[0.5,"#f59e0b"],[1,"#78350f"]],
  [[0,"#d8b4fe"],[0.5,"#a855f7"],[1,"#4c1d95"]],
  [[0,"#fed7aa"],[0.5,"#f97316"],[1,"#7c2d12"]],
];

// ─── buildTraces ─────────────────────────────────────────────────────────────
function buildTraces(equations: MathEq[], mode: "2D" | "3D"): any[] {
  const traces: any[] = [];
  equations.forEach((eq, eqIdx) => {
    if (!eq.isVisible || !eq.text.trim()) return;
    const raw = eq.text.trim();
    const lower = raw.toLowerCase().replace(/\s+/g, "");
    const scope = eq.params || {};
    try {
      let type = "unknown", expr = lower;
      if (lower.includes("=")) {
        const i = lower.indexOf("=");
        const lhs = lower.slice(0, i).trim(), rhs = lower.slice(i + 1).trim();
        if (lhs === "z") { type = "z_explicit"; expr = rhs; }
        else if (lhs === "y") { type = "y_explicit"; expr = rhs; }
        else if (lhs === "x") { type = "x_explicit"; expr = rhs; }
        else { type = "implicit"; expr = `(${lhs})-(${rhs})`; }
      } else {
        const hx = /\bx\b/.test(lower), hy = /\by\b/.test(lower);
        type = (hx && hy) ? "z_explicit" : hy ? "x_explicit" : "y_explicit";
      }
      const compiled = math.parse(expr).compile();
      const safe = (s: object): number | null => {
        try { const v = compiled.evaluate(s); return (typeof v === "number" && isFinite(v)) ? v : null; }
        catch { return null; }
      };
      const cs = SCALES[eqIdx % SCALES.length];

      if (mode === "3D") {
        const N = 70, R = 8, step = (2 * R) / N;
        const xs = Array.from({length: N+1}, (_, i) => -R + i * step);
        const ys = Array.from({length: N+1}, (_, i) => -R + i * step);

        if (type === "z_explicit") {
          const z = ys.map(y => xs.map(x => safe({ x, y, ...scope })));
          traces.push({
            type: "surface", x: xs, y: ys, z,
            colorscale: cs, showscale: false, opacity: 0.92, name: raw,
            contours: { z: { show: true, color: "rgba(255,255,255,0.18)", width: 1 } },
            lighting: { ambient: 0.7, diffuse: 0.9, roughness: 0.35, specular: 0.1 },
            lightposition: { x: 200, y: 200, z: 1000 },
          });
        } else if (type === "y_explicit") {
          const ptX: number[] = [], ptY: number[] = [], ptZ: number[] = [];
          for (let x = -R; x <= R; x += 0.08) {
            const y = safe({ x, y: 0, ...scope });
            if (y !== null) { ptX.push(x); ptY.push(y); ptZ.push(0); }
            else if (ptX.length) { ptX.push(NaN); ptY.push(NaN); ptZ.push(NaN); }
          }
          if (eq.extend3D) {
            const n = ptX.length;
            traces.push({ type: "surface", x: [ptX, ptX], y: [ptY, ptY], z: [Array(n).fill(-R), Array(n).fill(R)], colorscale: cs, showscale: false, opacity: 0.6 });
          } else {
            traces.push({ type: "scatter3d", mode: "lines", x: ptX, y: ptY, z: ptZ, line: { color: eq.color, width: 5 }, showlegend: false, name: raw });
          }
        } else if (type === "x_explicit") {
          const ptX: number[] = [], ptY: number[] = [], ptZ: number[] = [];
          for (let y = -R; y <= R; y += 0.08) {
            const x = safe({ x: 0, y, ...scope });
            if (x !== null) { ptX.push(x); ptY.push(y); ptZ.push(0); }
            else if (ptX.length) { ptX.push(NaN); ptY.push(NaN); ptZ.push(NaN); }
          }
          traces.push({ type: "scatter3d", mode: "lines", x: ptX, y: ptY, z: ptZ, line: { color: eq.color, width: 5 }, showlegend: false, name: raw });
        } else if (type === "implicit") {
          const segs = traceImplicitCurve((x, y) => { try { return compiled.evaluate({ x, y, ...scope }); } catch { return NaN; } }, R, 0.18);
          if (eq.extend3D) {
            segs.forEach(s => {
              if (s.x.length < 2) return;
              const n = s.x.length;
              traces.push({ type: "surface", x: [s.x, s.x], y: [s.y, s.y], z: [Array(n).fill(-R), Array(n).fill(R)], colorscale: cs, showscale: false, opacity: 0.55 });
            });
          } else {
            const ax: number[] = [], ay: number[] = [], az: number[] = [];
            segs.forEach((s, i) => {
              if (i > 0) { ax.push(NaN); ay.push(NaN); az.push(NaN); }
              s.x.forEach((v, j) => { ax.push(v); ay.push(s.y[j]); az.push(0); });
            });
            traces.push({ type: "scatter3d", mode: "lines", x: ax, y: ay, z: az, line: { color: eq.color, width: 4 }, showlegend: false, name: raw });
          }
        }
      } else {
        // 2D
        const R2 = 40, s2 = 0.04;
        if (type === "y_explicit" || type === "z_explicit") {
          const xs: number[] = [], ys: number[] = [];
          for (let x = -R2; x <= R2; x += s2) {
            const y = safe({ x, y: 0, ...scope });
            if (y !== null && Math.abs(y) < 1e6) { xs.push(x); ys.push(y); }
            else if (xs.length) { xs.push(NaN); ys.push(NaN); }
          }
          traces.push({ type: "scatter", mode: "lines", x: xs, y: ys, line: { color: eq.color, width: 2.5 }, name: raw, showlegend: false });
          if (eq.showDerivative) {
            try {
              const dC = math.derivative(expr, "x").compile();
              const dx: number[] = [], dy: number[] = [];
              for (let x = -R2; x <= R2; x += s2) {
                try {
                  const d = dC.evaluate({ x, y: 0, ...scope });
                  if (typeof d === "number" && isFinite(d) && Math.abs(d) < 1e6) { dx.push(x); dy.push(d); }
                  else if (dx.length) { dx.push(NaN); dy.push(NaN); }
                } catch { if (dx.length) { dx.push(NaN); dy.push(NaN); } }
              }
              traces.push({ type: "scatter", mode: "lines", x: dx, y: dy, line: { color: eq.color, width: 1.5, dash: "dash" }, showlegend: false });
            } catch { /**/ }
          }
        } else if (type === "x_explicit") {
          const xs: number[] = [], ys: number[] = [];
          for (let y = -R2; y <= R2; y += s2) {
            const x = safe({ x: 0, y, ...scope });
            if (x !== null && Math.abs(x) < 1e6) { xs.push(x); ys.push(y); }
            else if (xs.length) { xs.push(NaN); ys.push(NaN); }
          }
          traces.push({ type: "scatter", mode: "lines", x: xs, y: ys, line: { color: eq.color, width: 2.5 }, name: raw, showlegend: false });
        } else if (type === "implicit") {
          const segs = traceImplicitCurve((x, y) => { try { return compiled.evaluate({ x, y, ...scope }); } catch { return NaN; } }, 20, 0.1);
          const ax: number[] = [], ay: number[] = [];
          segs.forEach((s, i) => {
            if (i > 0) { ax.push(NaN); ay.push(NaN); }
            s.x.forEach((v, j) => { ax.push(v); ay.push(s.y[j]); });
          });
          traces.push({ type: "scatter", mode: "lines", x: ax, y: ay, line: { color: eq.color, width: 2.5 }, name: raw, showlegend: false });
        }
      }
    } catch { /**/ }
  });
  return traces;
}

// ─── main component ───────────────────────────────────────────────────────────
export default function GraphingCalculator({ darkMode }: Props) {
  const [equations, setEquations] = useState<MathEq[]>([
    { id: "1", text: "y = sin(x)", color: COLORS[0], extend3D: false, isVisible: true },
    { id: "2", text: "z = sin(x) * cos(y)", color: COLORS[1], extend3D: false, isVisible: true },
  ]);
  const [mode, setMode] = useState<"2D" | "3D">("2D");
  const [focusedEq, setFocusedEq] = useState<string>("1");
  const [showFuncs, setShowFuncs] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const plotRef = useRef<any>(null);

  const addEquation = () => {
    const id = Date.now().toString();
    setEquations(p => [...p, { id, text: "", color: COLORS[p.length % COLORS.length], extend3D: false, isVisible: true }]);
    setFocusedEq(id);
    setTimeout(() => inputRefs.current[id]?.focus(), 50);
  };

  const removeEq = (id: string) => setEquations(p => p.filter(e => e.id !== id));
  const updateEq = (id: string, patch: Partial<MathEq>) =>
    setEquations(p => p.map(e => e.id === id ? { ...e, ...patch } : e));
  const updateParam = (id: string, letter: string, value: number) =>
    setEquations(p => p.map(e => e.id === id ? { ...e, params: { ...e.params, [letter]: value } } : e));

  const insertChar = useCallback((char: string) => {
    const input = inputRefs.current[focusedEq];
    const old = equations.find(e => e.id === focusedEq)?.text ?? "";
    if (!input) { updateEq(focusedEq, { text: old + char }); return; }
    const s = input.selectionStart ?? old.length, en = input.selectionEnd ?? s;
    const next = old.slice(0, s) + char + old.slice(en);
    updateEq(focusedEq, { text: next });
    setTimeout(() => { input.focus(); input.setSelectionRange(s + char.length, s + char.length); }, 0);
  }, [focusedEq, equations]);

  const handleBackspace = useCallback(() => {
    const input = inputRefs.current[focusedEq];
    const old = equations.find(e => e.id === focusedEq)?.text ?? "";
    if (!input) { updateEq(focusedEq, { text: old.slice(0, -1) }); return; }
    const s = input.selectionStart ?? old.length, en = input.selectionEnd ?? s;
    let next: string;
    if (s === en && s > 0) { next = old.slice(0, s - 1) + old.slice(s); }
    else { next = old.slice(0, s) + old.slice(en); }
    updateEq(focusedEq, { text: next });
    const pos = s === en ? Math.max(0, s - 1) : s;
    setTimeout(() => { input.focus(); input.setSelectionRange(pos, pos); }, 0);
  }, [focusedEq, equations]);

  const plotData = useMemo(() => buildTraces(equations, mode), [equations, mode]);

  // ── theme ────────────────────────────────────────────────────────────────────
  const panelBg  = darkMode ? "#111318" : "#ffffff";
  const panelBd  = darkMode ? "#1e2230" : "#e5e7eb";
  const graphBg  = darkMode ? "#0d0f14" : "#ffffff";
  const inputBg  = darkMode ? "#1a1d27" : "#f9fafb";
  const inputFg  = darkMode ? "#f3f4f6" : "#111827";
  const mutedFg  = darkMode ? "#6b7280" : "#9ca3af";
  const toolBg   = darkMode ? "#161922" : "#f3f4f6";
  const kbBg     = darkMode ? "#1a1d27" : "#f3f4f6";
  const kbBtn    = darkMode ? "#242838" : "#ffffff";
  const kbBtnFg  = darkMode ? "#d1d5db" : "#374151";
  const kbNumBg  = darkMode ? "#1e2230" : "#f9fafb";
  const kbBorder = darkMode ? "#2d3348" : "#d1d5db";

  // ── Plotly layout ────────────────────────────────────────────────────────────
  const gridColor  = darkMode ? "#1e2230" : "#e5e7eb";
  const zeroColor  = darkMode ? "#374151" : "#9ca3af";
  const tickColor  = darkMode ? "#6b7280" : "#6b7280";

  const scene3D = {
    xaxis: { gridcolor: gridColor, zerolinecolor: zeroColor, tickfont: { color: tickColor, size: 10 }, showbackground: true, backgroundcolor: darkMode ? "#0d0f14" : "#f8fafc", linecolor: panelBd, linewidth: 1, title: { text: "x", font: { color: tickColor } } },
    yaxis: { gridcolor: gridColor, zerolinecolor: zeroColor, tickfont: { color: tickColor, size: 10 }, showbackground: true, backgroundcolor: darkMode ? "#0d0f14" : "#f8fafc", linecolor: panelBd, linewidth: 1, title: { text: "y", font: { color: tickColor } } },
    zaxis: { gridcolor: gridColor, zerolinecolor: zeroColor, tickfont: { color: tickColor, size: 10 }, showbackground: true, backgroundcolor: darkMode ? "#0d0f14" : "#f8fafc", linecolor: panelBd, linewidth: 1, title: { text: "z", font: { color: tickColor } } },
    camera: { eye: { x: 1.6, y: -1.6, z: 1.2 } },
    aspectmode: "cube" as const,
    bgcolor: graphBg,
  };

  const axis2D = {
    showgrid: true, gridcolor: darkMode ? "#1e2230" : "#e5e7eb", gridwidth: 1,
    zeroline: true, zerolinecolor: darkMode ? "#374151" : "#374151", zerolinewidth: 1.5,
    showline: false, ticks: "outside" as const, ticklen: 4, tickwidth: 1, tickcolor: tickColor,
    tickfont: { color: tickColor, size: 10, family: "Inter, system-ui, sans-serif" },
    fixedrange: false, automargin: false, title: { text: "" },
  };

  const layout2D = {
    dragmode: "pan" as const,
    xaxis: { ...axis2D, range: [-10, 10] },
    yaxis: { ...axis2D, range: [-10, 10], scaleanchor: "x", scaleratio: 1 },
  };

  const plotLayout = {
    autosize: true,
    paper_bgcolor: graphBg,
    plot_bgcolor: graphBg,
    showlegend: false,
    font: { family: "Inter, system-ui, sans-serif" },
    ...(mode === "3D" ? { scene: scene3D } : layout2D),
  };

  const plotConfig = {
    displayModeBar: false,
    responsive: true,
    scrollZoom: true,
    doubleClick: "reset" as const,
  };

  // ── panel content (shared mobile/desktop) ─────────────────────────────────
  const panelContent = (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ background: toolBg, borderBottom: `1px solid ${panelBd}` }}>
        <button onClick={addEquation} className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:opacity-80" style={{ background: COLORS[equations.length % COLORS.length], color: "#fff" }}>
          <Plus size={16} />
        </button>
        <span className="text-xs font-semibold ml-1" style={{ color: mutedFg }}>Equations</span>
        <div className="flex-1" />
        {/* 2D/3D toggle */}
        <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: panelBd }}>
          {(["2D","3D"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className="px-3 py-1 text-xs font-bold transition-colors" style={{ background: mode === m ? (darkMode ? "#10b981" : "#10b981") : toolBg, color: mode === m ? "#fff" : mutedFg }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Equation list */}
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ background: panelBg }}>
        {equations.map((eq, idx) => {
          const params = detectParams(eq.text);
          return (
            <div key={eq.id}>
              <div className="flex items-stretch" style={{ borderBottom: `1px solid ${panelBd}`, borderLeft: `3px solid ${eq.id === focusedEq ? eq.color : "transparent"}`, background: eq.id === focusedEq ? (darkMode ? "#1a1d27" : "#f0fdf4") : panelBg }}>
                <div className="flex items-center justify-center w-7 shrink-0" style={{ background: eq.color + "22" }}>
                  <span className="text-xs font-bold" style={{ color: eq.color }}>{idx + 1}</span>
                </div>
                <input
                  ref={el => { inputRefs.current[eq.id] = el; }}
                  value={eq.text}
                  onChange={e => updateEq(eq.id, { text: e.target.value })}
                  onFocus={() => setFocusedEq(eq.id)}
                  placeholder={mode === "3D" ? "z = sin(x)*cos(y)" : "y = sin(x)"}
                  className="flex-1 px-2 py-2.5 text-sm outline-none font-mono"
                  style={{ background: "transparent", color: inputFg, caretColor: eq.color }}
                  spellCheck={false}
                />
                <div className="flex items-center gap-1 pr-2">
                  <button onClick={() => updateEq(eq.id, { isVisible: !eq.isVisible })} className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: eq.color, background: eq.isVisible ? eq.color : "transparent" }} />
                  <button onClick={() => removeEq(eq.id)} className="opacity-40 hover:opacity-80 transition-opacity">
                    <X size={13} style={{ color: mutedFg }} />
                  </button>
                </div>
              </div>
              {/* derivative / extend3D toggles */}
              {eq.id === focusedEq && (
                <div className="flex gap-3 px-3 py-1.5 text-[10px]" style={{ background: darkMode ? "#161922" : "#f9fafb", borderBottom: `1px solid ${panelBd}`, color: mutedFg }}>
                  {mode === "2D" && (
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={!!eq.showDerivative} onChange={e => updateEq(eq.id, { showDerivative: e.target.checked })} className="accent-emerald-500" />
                      f′(x)
                    </label>
                  )}
                  {mode === "3D" && (
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={!!eq.extend3D} onChange={e => updateEq(eq.id, { extend3D: e.target.checked })} className="accent-emerald-500" />
                      Extend to 3D
                    </label>
                  )}
                </div>
              )}
              {/* param sliders */}
              {params.length > 0 && eq.id === focusedEq && (
                <div className="px-3 py-1.5" style={{ background: darkMode ? "#161922" : "#f9fafb", borderBottom: `1px solid ${panelBd}` }}>
                  {params.map(p => (
                    <div key={p} className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono w-4" style={{ color: eq.color }}>{p}</span>
                      <input type="range" min="-5" max="5" step="0.1"
                        value={eq.params?.[p] ?? 1}
                        onChange={e => updateParam(eq.id, p, parseFloat(e.target.value))}
                        className="flex-1 accent-emerald-500 h-1"
                      />
                      <span className="text-xs w-8 text-right" style={{ color: mutedFg }}>{(eq.params?.[p] ?? 1).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Keyboard */}
      <div className="shrink-0" style={{ background: kbBg, borderTop: `1px solid ${panelBd}` }}>
        {showFuncs
          ? <FuncsPanel onKey={k => { insertChar(k); }} onBack={() => setShowFuncs(false)} kbBtn={kbBtn} kbBtnFg={kbBtnFg} kbBorder={kbBorder} kbBg={kbBg} darkMode={darkMode} />
          : <MainKeyboard onKey={k => {
              if (k === "⌫") { handleBackspace(); return; }
              if (k === "funcs") { setShowFuncs(true); return; }
              if (k === "←") { const inp = inputRefs.current[focusedEq]; if (inp) { const p = Math.max(0, (inp.selectionStart ?? 1) - 1); setTimeout(() => { inp.focus(); inp.setSelectionRange(p, p); }, 0); } return; }
              if (k === "→") { const inp = inputRefs.current[focusedEq]; if (inp) { const p = (inp.selectionStart ?? inp.value.length) + 1; setTimeout(() => { inp.focus(); inp.setSelectionRange(p, p); }, 0); } return; }
              const map: Record<string, string> = { "÷": "/", "×": "*", "x²": "x^2", "xʸ": "^", "√": "sqrt(", "π": "pi", "e": "e", "|a|": "abs(" };
              insertChar(map[k] ?? k);
            }} kbBtn={kbBtn} kbBtnFg={kbBtnFg} kbBorder={kbBorder} kbNumBg={kbNumBg} kbBg={kbBg} />
        }
      </div>
    </div>
  );

  return (
    <div className="w-full h-full overflow-hidden flex flex-col lg:flex-row" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Graph area — top on mobile (42%), right on desktop (flex-1) */}
      <div
        className="relative shrink-0 order-1 lg:order-2 lg:shrink lg:flex-1"
        style={{ height: "42%", minHeight: 180 }}
      >
        <style>{`@media(min-width:1024px){.gc-g{height:100%!important}}`}</style>
        <div className="gc-g absolute inset-0" style={{ background: graphBg }}>
          {/* 2D/3D badge top-right */}
          <div className="absolute top-3 right-3 z-10 flex gap-1">
            {(["2D","3D"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className="px-3 py-1 rounded-full text-xs font-bold shadow transition-colors" style={{ background: mode === m ? "#10b981" : darkMode ? "rgba(20,23,32,0.85)" : "rgba(255,255,255,0.9)", color: mode === m ? "#fff" : mutedFg, border: `1px solid ${mode === m ? "#10b981" : panelBd}` }}>
                {m}
              </button>
            ))}
          </div>
          {/* Zoom buttons */}
          <div className="absolute z-10 bottom-4 right-3 flex flex-col gap-2">
            {[
              { icon: <Plus size={14}/>, fn: () => { const el = plotRef.current?.el; if (!el) return; if (mode==="2D") { const xr=el.layout?.xaxis?.range??[-10,10]; const yr=el.layout?.yaxis?.range??[-10,10]; const cx=(xr[0]+xr[1])/2,cy=(yr[0]+yr[1])/2,hx=(xr[1]-xr[0])/2*.75,hy=(yr[1]-yr[0])/2*.75; Plotly.relayout(el,{"xaxis.range":[cx-hx,cx+hx],"yaxis.range":[cy-hy,cy+hy]}); } else { const eye=el.layout?.scene?.camera?.eye??{x:1.6,y:-1.6,z:1.2}; Plotly.relayout(el,{"scene.camera.eye":{x:eye.x*.85,y:eye.y*.85,z:eye.z*.85}}); } } },
              { icon: <Minus size={14}/>, fn: () => { const el = plotRef.current?.el; if (!el) return; if (mode==="2D") { const xr=el.layout?.xaxis?.range??[-10,10]; const yr=el.layout?.yaxis?.range??[-10,10]; const cx=(xr[0]+xr[1])/2,cy=(yr[0]+yr[1])/2,hx=(xr[1]-xr[0])/2*1.3,hy=(yr[1]-yr[0])/2*1.3; Plotly.relayout(el,{"xaxis.range":[cx-hx,cx+hx],"yaxis.range":[cy-hy,cy+hy]}); } else { const eye=el.layout?.scene?.camera?.eye??{x:1.6,y:-1.6,z:1.2}; Plotly.relayout(el,{"scene.camera.eye":{x:eye.x*1.18,y:eye.y*1.18,z:eye.z*1.18}}); } } },
              { icon: <Crosshair size={13}/>, fn: () => { const el = plotRef.current?.el; if (!el) return; if (mode==="2D") Plotly.relayout(el,{"xaxis.range":[-10,10],"yaxis.range":[-10,10]}); else Plotly.relayout(el,{"scene.camera.eye":{x:1.6,y:-1.6,z:1.2}}); } },
            ].map(({ icon, fn }, i) => (
              <button key={i} onClick={fn} className="w-9 h-9 flex items-center justify-center rounded-xl shadow transition-colors hover:opacity-80" style={{ background: darkMode ? "#1a1d27" : "#fff", color: mutedFg, border: `1px solid ${panelBd}` }}>
                {icon}
              </button>
            ))}
          </div>
          <Plot
            ref={plotRef}
            data={plotData}
            layout={{ ...plotLayout, margin: { l: 8, r: 8, b: 8, t: 8, pad: 0 } }}
            config={plotConfig}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler
          />
        </div>
      </div>

      {/* Panel — bottom on mobile (flex-1), left on desktop (300px) */}
      <div className="order-2 lg:order-1 flex-1 min-h-0 lg:flex-none" style={{ borderTop: `1px solid ${panelBd}` }}>
        <style>{`@media(min-width:1024px){.gc-p{width:300px!important;height:100%!important;border-top:none!important;border-right:1px solid ${panelBd}!important}}`}</style>
        <div className="gc-p h-full overflow-hidden" style={{ background: panelBg }}>
          {panelContent}
        </div>
      </div>
    </div>
  );
}

// ─── Main Keyboard ────────────────────────────────────────────────────────────
function MainKeyboard({ onKey, kbBtn, kbBtnFg, kbBorder, kbNumBg, kbBg }: {
  onKey: (k: string) => void;
  kbBtn: string; kbBtnFg: string; kbBorder: string; kbNumBg: string; kbBg: string;
}) {
  const rows = [
    ["x", "y", "x²", "xʸ", "7", "8", "9", "÷", "funcs"],
    ["(", ")", "<", ">",  "4", "5", "6", "×", "←"],
    ["|a|", ",", "≤", "≥", "1", "2", "3", "-", "⌫"],
    ["√", "π", "e", "=",  "0", ".", "^", "+", "→"],
  ];
  const btn = (k: string) => {
    const isNum = /^[0-9.]$/.test(k);
    const isSpecial = k === "funcs";
    const isBack = k === "⌫";
    const isEnter = k === "→";
    return (
      <button
        key={k}
        onPointerDown={e => { e.preventDefault(); onKey(k); }}
        className="flex items-center justify-center rounded-lg text-xs font-semibold h-9 transition-colors active:opacity-60 select-none"
        style={{
          background: isSpecial ? "#10b981" : isBack ? "#ef4444" : isNum ? kbNumBg : kbBtn,
          color: isSpecial || isBack ? "#fff" : kbBtnFg,
          border: `1px solid ${kbBorder}`,
          fontFamily: /^[a-z]+$/.test(k) && k.length > 1 ? "monospace" : "inherit",
          fontSize: k.length > 2 ? "10px" : "12px",
        }}
      >
        {k}
      </button>
    );
  };

  return (
    <div className="p-1.5 grid gap-1" style={{ gridTemplateColumns: "repeat(9, 1fr)", background: kbBg }}>
      {rows.flatMap(row => row.map(k => btn(k)))}
    </div>
  );
}

// ─── Funcs Panel ──────────────────────────────────────────────────────────────
function FuncsPanel({ onKey, onBack, kbBtn, kbBtnFg, kbBorder, kbBg, darkMode }: {
  onKey: (k: string) => void; onBack: () => void;
  kbBtn: string; kbBtnFg: string; kbBorder: string; kbBg: string; darkMode: boolean;
}) {
  const groups = [
    { label: "Trig", keys: ["sin(","cos(","tan(","csc(","sec(","cot("] },
    { label: "Inverse", keys: ["asin(","acos(","atan(","sinh(","cosh(","tanh("] },
    { label: "Log/Exp", keys: ["ln(","log(","log2(","exp(","10^(","e^("] },
    { label: "Misc", keys: ["sqrt(","cbrt(","abs(","sign(","floor(","ceil("] },
  ];
  const btn = (k: string, label?: string) => (
    <button key={k}
      onPointerDown={e => { e.preventDefault(); onKey(k); }}
      className="flex items-center justify-center rounded-lg text-[10px] font-mono h-9 transition-colors active:opacity-60 select-none"
      style={{ background: kbBtn, color: kbBtnFg, border: `1px solid ${kbBorder}` }}>
      {label ?? k}
    </button>
  );
  return (
    <div className="p-1.5 flex flex-col gap-1.5" style={{ background: kbBg }}>
      <div className="flex items-center gap-2 mb-0.5">
        <button onPointerDown={e => { e.preventDefault(); onBack(); }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
          style={{ background: darkMode ? "#1a1d27" : "#e5e7eb", color: kbBtnFg, border: `1px solid ${kbBorder}` }}>
          <ChevronLeft size={12} /> Back
        </button>
        <span className="text-[10px] font-semibold" style={{ color: kbBtnFg, opacity: 0.6 }}>Functions</span>
      </div>
      {groups.map(g => (
        <div key={g.label}>
          <div className="text-[9px] font-semibold px-0.5 mb-0.5" style={{ color: kbBtnFg, opacity: 0.5 }}>{g.label}</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(6,1fr)" }}>
            {g.keys.map(k => btn(k))}
          </div>
        </div>
      ))}
    </div>
  );
}
