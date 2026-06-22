import { useState, useMemo } from "react";
import { Plus, X, Maximize2, Move, MonitorPlay } from "lucide-react";
import Plot from "react-plotly.js";
import * as math from "mathjs";
import { MathEq, COLORS } from "./graphing-utils";

interface GraphingCalculatorProps {
  darkMode: boolean;
}

export default function GraphingCalculator({ darkMode }: GraphingCalculatorProps) {
  const [equations, setEquations] = useState<MathEq[]>([
    { id: "1", text: "z = sin(x) + cos(y)", color: COLORS[1], extend3D: false, isVisible: true },
    { id: "2", text: "x^2 + y^2 = 16", color: COLORS[0], extend3D: false, isVisible: true }
  ]);
  const [activeTab, setActiveTab] = useState<"2D" | "3D">("3D");
  const [focusedEq, setFocusedEq] = useState<string>("1");

  const addEquation = () => {
    const newId = Date.now().toString();
    setEquations([...equations, { 
      id: newId, 
      text: "", 
      color: COLORS[equations.length % COLORS.length], 
      extend3D: false, 
      isVisible: true 
    }]);
    setFocusedEq(newId);
  };

  const removeEq = (id: string) => {
    setEquations(equations.filter(e => e.id !== id));
  };

  const updateEq = (id: string, updates: Partial<MathEq>) => {
    setEquations(equations.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const plotData = useMemo(() => {
    const traces: any[] = [];
    equations.forEach(eq => {
      if (!eq.isVisible || !eq.text.trim()) return;

      const cleanText = eq.text.toLowerCase().replace(/\s+/g, '');
      try {
        let isImplicit = false;
        let expressionStr = cleanText;
        let type = 'unknown';

        if (cleanText.includes('=')) {
          const [lhs, rhs] = cleanText.split('=');
          if (lhs === 'z') {
            type = 'z_explicit';
            expressionStr = rhs;
          } else if (lhs === 'y') {
            type = 'y_explicit';
            expressionStr = rhs;
          } else if (lhs === 'x') {
            type = 'x_explicit';
            expressionStr = rhs;
          } else {
             type = 'implicit';
             expressionStr = `(${lhs}) - (${rhs})`;
          }
        } else {
             if (cleanText.includes('x') && cleanText.includes('y')) {
                type = 'z_explicit';
             } else if (cleanText.includes('y')) {
                type = 'x_explicit';
             } else {
                type = 'y_explicit';
             }
        }

        const compiled = math.parse(expressionStr).compile();

        if (activeTab === "3D") {
          if (type === 'z_explicit') {
            const xData = [], yData = [], zData = [];
            for (let i = -10; i <= 10; i += 0.5) {
               xData.push(i);
               yData.push(i);
            }
            for (let y = 0; y < yData.length; y++) {
               const row = [];
               for (let x = 0; x < xData.length; x++) {
                   try {
                     row.push(compiled.evaluate({ x: xData[x], y: yData[y] }));
                   } catch(e) {
                     row.push(null);
                   }
               }
               zData.push(row);
            }
            traces.push({
               type: 'surface',
               x: xData, y: yData, z: zData,
               colorscale: [[0, eq.color], [1, eq.color]],
               opacity: 0.85,
               showscale: false,
               name: eq.text
            });
          } else if (type === 'implicit') {
             if (eq.extend3D) {
                const xGrid = [], yGrid = [], zGrid = [], valGrid = [];
                for (let z = -10; z <= 10; z += 2) {
                   for (let y = -10; y <= 10; y += 1) {
                      for (let x = -10; x <= 10; x += 1) {
                         try {
                           const val = compiled.evaluate({x, y});
                           xGrid.push(x); yGrid.push(y); zGrid.push(z); valGrid.push(val);
                         } catch(e) { }
                      }
                   }
                }
                traces.push({
                   type: 'isosurface',
                   x: xGrid, y: yGrid, z: zGrid, value: valGrid,
                   isomin: -0.5, isomax: 0.5,
                   surface: {show: true, count: 1, fill: 0.5},
                   colorscale: [[0, eq.color], [1, eq.color]],
                   showscale: false
                });
             } else {
                // Not supported easily in Plotly out of the box without dense points
             }
          } else if (type === 'y_explicit') {
             const xArr = [], yArr = [], zArr = [];
             for(let x=-10; x<=10; x+=0.2) {
                try {
                  const yVal = compiled.evaluate({x, y: 0});
                  if(typeof yVal === 'number' && !isNaN(yVal)){
                    xArr.push(x);
                    yArr.push(yVal);
                    zArr.push(0);
                  }
                } catch(e) {}
             }
             
             if (eq.extend3D) {
                const zMatrix = [];
                const zHeights = [-10, 10];
                for(let i=0; i<zHeights.length; i++) {
                   const row = [];
                   for(let j=0; j<xArr.length; j++) row.push(zHeights[i]);
                   zMatrix.push(row);
                }
                const yMatrix = [yArr, yArr];
                const xMatrix = [xArr, xArr];
                traces.push({
                   type: 'surface',
                   x: xMatrix, y: yMatrix, z: zMatrix,
                   colorscale: [[0, eq.color], [1, eq.color]],
                   opacity: 0.5, showscale: false
                });
             } else {
                traces.push({
                   type: 'scatter3d',
                   mode: 'lines',
                   x: xArr, y: yArr, z: zArr,
                   line: { color: eq.color, width: 4 },
                   name: eq.text
                });
             }
          }
        } else {
          if (type === 'y_explicit') {
             const xArr = [], yArr = [];
             for(let x=-20; x<=20; x+=0.1) {
                try {
                  const yVal = compiled.evaluate({x, y: 0});
                  xArr.push(x);
                  yArr.push(yVal);
                } catch(e) {}
             }
             traces.push({
                type: 'scatter',
                mode: 'lines',
                x: xArr, y: yArr,
                line: { color: eq.color, width: 3 },
                name: eq.text
             });
          } else if (type === 'implicit') {
             const xData = [], yData = [], zData = [];
             for (let i = -15; i <= 15; i += 0.5) { xData.push(i); yData.push(i); }
             for (let y = 0; y < yData.length; y++) {
                const row = [];
                for (let x = 0; x < xData.length; x++) {
                   try { row.push(compiled.evaluate({ x: xData[x], y: yData[y] })); } catch(e) { row.push(null); }
                }
                zData.push(row);
             }
             traces.push({
                type: 'contour',
                x: xData, y: yData, z: zData,
                contours: { start: 0, end: 0, size: 1, coloring: 'lines' },
                line: { color: eq.color, width: 3 },
                showscale: false
             });
          }
        }
      } catch(err) {
        // Parse error, ignore
      }
    });
    return traces;
  }, [equations, activeTab]);

  const insertChar = (char: string) => {
     updateEq(focusedEq, { text: (equations.find(e => e.id === focusedEq)?.text || '') + char });
  };

  const keyboardRows = [
    ['x', 'y', 'z', '^', '^2', '7', '8', '9', '÷'],
    ['sin', 'cos', 'tan', 'sqrt(', 'pi', '4', '5', '6', '×'],
    ['(', ')', '=', 'e', 'abs(', '1', '2', '3', '-'],
    ['<', '>', ',', '!', '.', '0', '+', 'Clear']
  ];

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-2xl overflow-hidden border ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
       
       {/* Left Panel: Equation Editor */}
       <div className={`lg:w-1/3 flex flex-col border-r ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="p-4 flex justify-between items-center">
             <span className={`text-xs font-bold tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SURFACE / EQUATIONS</span>
             <button onClick={addEquation} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium text-xs hover:bg-emerald-500/20 transition-colors">
               <Plus className="w-3.5 h-3.5" /> Add
             </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
             {equations.map(eq => (
                <div key={eq.id} onClick={() => setFocusedEq(eq.id)} className={`p-3 rounded-xl border flex flex-col gap-2 transition-colors cursor-text ${focusedEq === eq.id ? (darkMode ? 'bg-slate-900 border-emerald-500/30 ring-1 ring-emerald-500/20' : 'bg-slate-50 border-emerald-500/40 ring-1 ring-emerald-500/20') : (darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200')}`}>
                   <div className="flex items-center justify-between gap-3">
                      <div 
                         style={{ backgroundColor: eq.color }}
                         className="w-4 h-4 rounded mt-1 shrink-0 cursor-pointer shadow-sm"
                         onClick={(e) => { e.stopPropagation(); updateEq(eq.id, { isVisible: !eq.isVisible }); }}
                      >
                         {!eq.isVisible && <div className="w-full h-full bg-black/40 rounded flex items-center justify-center"><X className="w-3 h-3 text-white" /></div>}
                      </div>
                      <input 
                         type="text" 
                         value={eq.text} 
                         onChange={(e) => updateEq(eq.id, { text: e.target.value })}
                         className={`flex-1 bg-transparent border-none outline-none font-mono text-base w-full ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}
                         placeholder="e.g. z = sin(x)"
                      />
                      <button onClick={(e) => { e.stopPropagation(); removeEq(eq.id); }} className="text-slate-400 hover:text-red-500 p-1">
                         <X className="w-4 h-4" />
                      </button>
                   </div>
                   
                   <label className="flex items-center gap-2 text-xs text-slate-500 pl-7 cursor-pointer hover:text-slate-400 transition-colors">
                      <input type="checkbox" checked={eq.extend3D} onChange={(e) => updateEq(eq.id, { extend3D: e.target.checked })} className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20" />
                      Extend to 3D
                   </label>
                </div>
             ))}
          </div>

          {/* Educational Note */}
          <div className={`p-4 text-[11px] leading-relaxed border-t ${darkMode ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
             <span className="text-emerald-500 font-mono font-medium">z = f(x,y)</span> দিলে surface আঁকবে; <span className="text-emerald-500 font-mono font-medium">x^2+y^2=1</span> বা <span className="text-emerald-500 font-mono font-medium">y=x^2</span> দিলে মেঝতে (z=0) 2D curve আঁকবে। <strong className={darkMode ? 'text-slate-200' : 'text-slate-800'}>Extend to 3D</strong> দিলে সেটা উপরে টেনে 3D দেয়াল বানাবে। ঘোরাতে drag, scroll-এ zoom.
          </div>

          {/* Custom On-screen Keyboard */}
          <div className={`p-3 grid grid-cols-9 gap-1.5 border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
             {keyboardRows.map((row, i) => (
                <div key={i} className="contents">
                   {row.map(btn => (
                      <button 
                         key={btn}
                         onClick={() => {
                            if (btn === 'Clear') updateEq(focusedEq, { text: '' });
                            else if (btn === '÷') insertChar('/');
                            else if (btn === '×') insertChar('*');
                            else insertChar(btn);
                         }}
                         className={`py-2.5 px-1 text-[13px] rounded-lg font-mono transition-transform active:scale-95 shadow-sm ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-b border-slate-950' : 'bg-white text-slate-700 hover:bg-slate-50 border-b border-slate-200'} ${['x', 'y', 'z', 'sin', 'cos', 'tan', 'pi', 'e'].includes(btn) ? 'text-emerald-600 font-semibold dark:text-emerald-400' : ''} ${btn === 'Clear' ? 'col-span-2 text-red-500 font-medium' : ''}`}
                      >
                         {btn}
                      </button>
                   ))}
                </div>
             ))}
          </div>
       </div>

       {/* Right Panel: Plot Canvas */}
       <div className={`lg:w-2/3 h-[60vh] lg:h-auto relative bg-black overflow-hidden flex flex-col`}>
          
          {/* Top Floating Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
             <div className={`flex items-center gap-1 p-1 rounded-xl backdrop-blur border shadow-sm ${darkMode ? 'bg-[#151720]/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <button 
                  onClick={() => setActiveTab("2D")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === '2D' ? 'bg-emerald-500 text-white shadow-md' : (darkMode ? 'text-slate-400 hover:bg-[#252836] hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100')}`}
                >
                  <MonitorPlay className="w-4 h-4 inline-block mr-1.5 -mt-0.5" /> 2D
                </button>
                <button 
                  onClick={() => setActiveTab("3D")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === '3D' ? 'bg-emerald-500 text-white shadow-md' : (darkMode ? 'text-slate-400 hover:bg-[#252836] hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100')}`}
                >
                  <Maximize2 className="w-4 h-4 inline-block mr-1.5 -mt-0.5" /> 3D
                </button>
             </div>
          </div>
          
          <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[12px] font-medium px-4 py-1.5 rounded-full backdrop-blur border flex items-center gap-2 shadow-lg ${darkMode ? 'bg-[#151720]/80 border-slate-700/50 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-600'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? "text-emerald-400" : "text-emerald-600"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ঘোরাতে ড্র্যাগ • scroll = zoom • 2D মেঝেতে দেখাবে
          </div>

          {/* Bottom Right Controls */}
          <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
             <button onClick={() => {
                const plot = document.querySelector('.js-plotly-plot') as any;
                if (!plot?.layout) return;
                // Basic zoom logic would go here if we had access to Plotly easily
             }} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm ${darkMode ? 'bg-[#151720] text-slate-300 hover:bg-[#252836] border border-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
                <Plus className="w-5 h-5" />
             </button>
             <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm ${darkMode ? 'bg-[#151720] text-slate-300 hover:bg-[#252836] border border-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
                <span className="text-xl font-bold -mt-0.5">-</span>
             </button>
             <button className={`w-10 h-10 mt-1 rounded-xl flex items-center justify-center transition-colors shadow-sm ${darkMode ? 'bg-[#151720] text-slate-300 hover:bg-[#252836] border border-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
             </button>
          </div>

          <div className="flex-1 w-full h-full relative">
            <Plot
               data={plotData}
               layout={{
                  autosize: true,
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
                  scene: activeTab === "3D" ? {
                     xaxis: { gridcolor: darkMode ? '#1e2028' : '#e2e8f0', zerolinecolor: darkMode ? '#333745' : '#cbd5e1', tickfont: {color: darkMode ? '#64748b' : '#94a3b8'}, title: {text: 'x', font: {color: darkMode ? '#64748b' : '#94a3b8'}} },
                     yaxis: { gridcolor: darkMode ? '#1e2028' : '#e2e8f0', zerolinecolor: darkMode ? '#333745' : '#cbd5e1', tickfont: {color: darkMode ? '#64748b' : '#94a3b8'}, title: {text: 'y', font: {color: darkMode ? '#64748b' : '#94a3b8'}} },
                     zaxis: { gridcolor: darkMode ? '#1e2028' : '#e2e8f0', zerolinecolor: darkMode ? '#333745' : '#cbd5e1', tickfont: {color: darkMode ? '#64748b' : '#94a3b8'}, title: {text: 'z', font: {color: darkMode ? '#64748b' : '#94a3b8'}} },
                     camera: { eye: { x: 1.5, y: -1.5, z: 1.2 } },
                     aspectmode: "cube"
                  } : undefined,
                  xaxis: activeTab === "2D" ? { gridcolor: darkMode ? '#1e2028' : '#e2e8f0', zerolinecolor: darkMode ? '#333745' : '#cbd5e1', tickfont: {color: darkMode ? '#64748b' : '#94a3b8'}, range: [-20, 20] } : undefined,
                  yaxis: activeTab === "2D" ? { gridcolor: darkMode ? '#1e2028' : '#e2e8f0', zerolinecolor: darkMode ? '#333745' : '#cbd5e1', tickfont: {color: darkMode ? '#64748b' : '#94a3b8'}, range: [-20, 20], scaleanchor: "x", scaleratio: 1 } : undefined,
                  showlegend: false
               }}
               config={{ displayModeBar: false, responsive: true }}
               style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
               useResizeHandler={true}
            />
          </div>
       </div>
    </div>
  );
}
