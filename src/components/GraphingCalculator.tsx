import { useState, useMemo } from "react";
import { Plus, X, Maximize2, Move, MonitorPlay, ChevronLeft, Hexagon, LineChart, Box, Target, Minus } from "lucide-react";
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-ignore
import Plotly from "plotly.js-dist-min";

const Plot = createPlotlyComponent(Plotly);
import * as math from "mathjs";
import { MathEq, COLORS, detectParams, traceImplicitCurve } from "./graphing-utils";

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

  const updateParam = (id: string, letter: string, value: number) => {
    setEquations(equations.map(e => e.id === id ? { ...e, params: { ...e.params, [letter]: value } } : e));
  };

  const plotData = useMemo(() => {
    const traces: any[] = [];
    equations.forEach(eq => {
      if (!eq.isVisible || !eq.text.trim()) return;

      const cleanText = eq.text.toLowerCase().replace(/\s+/g, '');
      const paramScope = eq.params || {};
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
                     row.push(compiled.evaluate({ x: xData[x], y: yData[y], ...paramScope }));
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
             const segs = traceImplicitCurve(
                (x, y) => compiled.evaluate({ x, y, ...paramScope }),
                15, 0.3
             );
             if (eq.extend3D) {
                // Sweep each segment along z to build a smooth surface "wall"
                segs.forEach(seg => {
                   const zHeights = [-10, 10];
                   const xMatrix = [seg.x, seg.x];
                   const yMatrix = [seg.y, seg.y];
                   const zMatrix = [
                      [zHeights[0], zHeights[0]],
                      [zHeights[1], zHeights[1]]
                   ];
                   traces.push({
                      type: 'surface',
                      x: xMatrix, y: yMatrix, z: zMatrix,
                      colorscale: [[0, eq.color], [1, eq.color]],
                      opacity: 0.55, showscale: false
                   });
                });
             } else {
                segs.forEach(seg => {
                   traces.push({
                      type: 'scatter3d',
                      mode: 'lines',
                      x: seg.x, y: seg.y, z: [0, 0],
                      line: { color: eq.color, width: 5 },
                      showlegend: false
                   });
                });
             }
          } else if (type === 'y_explicit') {
             const xArr = [], yArr = [], zArr = [];
             for(let x=-10; x<=10; x+=0.2) {
                try {
                  const yVal = compiled.evaluate({x, y: 0, ...paramScope});
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
                  const yVal = compiled.evaluate({x, y: 0, ...paramScope});
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

             if (eq.showDerivative) {
                try {
                  const derivExpr = math.derivative(expressionStr, 'x');
                  const derivCompiled = derivExpr.compile();
                  const dxArr: number[] = [], dyArr: number[] = [];
                  for (let x = -20; x <= 20; x += 0.1) {
                     try {
                        const dVal = derivCompiled.evaluate({ x, y: 0, ...paramScope });
                        dxArr.push(x);
                        dyArr.push(dVal);
                     } catch (e) {}
                  }
                  traces.push({
                     type: 'scatter',
                     mode: 'lines',
                     x: dxArr, y: dyArr,
                     line: { color: eq.color, width: 2, dash: 'dash' },
                     name: `f'(x) of ${eq.text}`
                  });
                } catch (e) {}
             }
          } else if (type === 'implicit') {
             const xData = [], yData = [], zData = [];
             for (let i = -15; i <= 15; i += 0.5) { xData.push(i); yData.push(i); }
             for (let y = 0; y < yData.length; y++) {
                const row = [];
                for (let x = 0; x < xData.length; x++) {
                   try { row.push(compiled.evaluate({ x: xData[x], y: yData[y], ...paramScope })); } catch(e) { row.push(null); }
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
    ['x', 'y', '7', '8', '9', '÷'],
    ['^', '√', '4', '5', '6', '×'],
    ['(', ')', '1', '2', '3', '-'],
    ['π', 'e', '0', '.', '=', '+'],
    ['sin', 'cos', 'tan', 'ln', 'log', 'abs']
  ];

  return (
    <div className={`flex flex-col lg:flex-row h-full rounded-2xl overflow-hidden ${darkMode ? 'bg-[#0f111a] border-[#1e2028]' : 'bg-slate-50 border-slate-200'} border`}>
       
       {/* Left Panel: Equation Editor */}
       <div className={`lg:w-[360px] flex flex-col border-r ${darkMode ? 'border-[#1e2028] bg-[#161822]' : 'border-slate-200 bg-white'}`}>
          <div className="p-4 flex justify-between items-center">
             <span className={`text-[12px] font-bold tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{activeTab === '3D' ? 'SURFACE' : 'EQUATIONS'}</span>
             <div className="flex gap-2">
               <button onClick={addEquation} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium text-xs hover:bg-emerald-500/20 transition-colors">
                 <Plus className="w-3.5 h-3.5" /> Add
               </button>
               <button className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'bg-[#1e2028] text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
                 <ChevronLeft className="w-4 h-4" />
               </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
             {equations.map(eq => (
                <div key={eq.id} onClick={() => setFocusedEq(eq.id)} className={`p-3 rounded-2xl border flex flex-col gap-2 transition-colors cursor-text ${focusedEq === eq.id ? (darkMode ? 'bg-[#1e2028] border-emerald-500/30' : 'bg-slate-50 border-emerald-500/40') : (darkMode ? 'bg-transparent border-[#1e2028]' : 'bg-white border-slate-200')}`}>
                   <div className="flex items-center justify-between gap-3">
                      <div 
                         style={{ backgroundColor: eq.color }}
                         className={`w-3.5 h-3.5 rounded shrink-0 cursor-pointer shadow-sm ${!eq.isVisible ? 'opacity-30' : ''}`}
                         onClick={(e) => { e.stopPropagation(); updateEq(eq.id, { isVisible: !eq.isVisible }); }}
                      ></div>
                      <input 
                         type="text" 
                         value={eq.text} 
                         onChange={(e) => updateEq(eq.id, { text: e.target.value })}
                         className={`flex-1 bg-transparent border-none outline-none text-[17px] w-full ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}
                         style={{ fontFamily: '"Cambria Math", "Times New Roman", serif', fontStyle: 'italic' }}
                         placeholder="z = ..."
                      />
                      <button onClick={(e) => { e.stopPropagation(); removeEq(eq.id); }} className="text-slate-600 hover:text-red-500 p-1">
                         <X className="w-3.5 h-3.5" />
                      </button>
                   </div>
                   
                   {activeTab === '3D' ? (
                      <label className="flex items-center gap-2 text-[12px] text-slate-500 pl-6 cursor-pointer hover:text-slate-400 transition-colors">
                         <div className={`relative flex items-center justify-center w-3.5 h-3.5 rounded-sm border ${darkMode ? 'border-slate-600 bg-[#161822]' : 'border-slate-300 bg-white'}`}>
                            <input type="checkbox" className="peer sr-only" checked={eq.extend3D} onChange={(e) => updateEq(eq.id, { extend3D: e.target.checked })} />
                            <div className="absolute inset-0 rounded-sm bg-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            <svg className="w-2.5 h-2.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                         </div>
                         Extend to 3D
                      </label>
                   ) : (
                      <label className="flex items-center gap-2 text-[12px] text-slate-500 pl-6 cursor-pointer hover:text-slate-400 transition-colors">
                         <div className={`relative flex items-center justify-center w-3.5 h-3.5 rounded-sm border ${darkMode ? 'border-slate-600 bg-[#161822]' : 'border-slate-300 bg-white'}`}>
                            <input type="checkbox" className="peer sr-only" checked={!!eq.showDerivative} onChange={(e) => updateEq(eq.id, { showDerivative: e.target.checked })} />
                            <div className="absolute inset-0 rounded-sm bg-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            <svg className="w-2.5 h-2.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                         </div>
                         Show derivative f'(x)
                      </label>
                   )}

                   {detectParams(eq.text).map(letter => (
                      <div key={letter} className="flex items-center gap-2 pl-7 pr-1" onClick={(e) => e.stopPropagation()}>
                         <span className="text-xs font-mono text-slate-500 w-16 shrink-0">
                            {letter} = {(eq.params?.[letter] ?? 1).toFixed(1)}
                         </span>
                         <input
                            type="range"
                            min={-10}
                            max={10}
                            step={0.1}
                            value={eq.params?.[letter] ?? 1}
                            onChange={(ev) => updateParam(eq.id, letter, parseFloat(ev.target.value))}
                            className="flex-1 accent-emerald-500"
                         />
                      </div>
                   ))}
                </div>
             ))}
          </div>

          {/* Educational Note */}
          <div className={`p-4 text-[11px] leading-relaxed border-t ${darkMode ? 'border-[#1e2028] bg-transparent text-[#6b7280]' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
             {activeTab === '2D' ? (
                <>
                  একাধিক equation যোগ করো। যেমন <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">x^2</span>, <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">sin(x)</span>, <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">1/x</span>, <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">2^x</span>, <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">abs(x)</span>। x ছাড়া অন্য letter (যেমন <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">a</span>, <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">k</span>) লিখলে নিচে slider আসবে — যেমন <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">y = a·sin(b·x)</span>। <strong className={darkMode ? 'text-slate-200' : 'text-slate-800'}>derivative f'(x)</strong> চেক করলে ঢালের লেখচিত্র (dashed) দেখাবে। চাকা ঘুরিয়ে zoom, ড্র্যাগ করে pan; <span className="text-emerald-500 bg-emerald-500/10 px-1 rounded">Shift</span>+scroll = শুধু x, <span className="text-emerald-500 bg-emerald-500/10 px-1 rounded">Alt</span>+scroll = শুধু y।
                </>
             ) : (
                <>
                  <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">z = f(x,y)</span> দিলে surface; <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">x^2+y^2=1</span> বা <span className="text-emerald-500 font-mono font-medium bg-emerald-500/10 px-1 rounded">y=x^2</span> দিলে মেঝেতে (z=0) 2D curve আঁকবে। <strong className={darkMode ? 'text-slate-200' : 'text-slate-800'}>Extend to 3D</strong> দিলে সেটা উপরে টেনে 3D দেয়াল বানাবে। ঘোরাতে drag, scroll-এ zoom।
                </>
             )}
          </div>

          {/* Custom On-screen Keyboard */}
          <div className={`p-3 grid grid-cols-6 gap-1 border-t ${darkMode ? 'bg-transparent border-[#1e2028]' : 'bg-slate-100 border-slate-200'}`}>
             {keyboardRows.map((row, i) => (
                <div key={i} className="contents">
                   {row.map(btn => (
                      <button 
                         key={btn}
                         onClick={() => {
                            if (btn === '÷') insertChar('/');
                            else if (btn === '×') insertChar('*');
                            else if (btn === '√') insertChar('sqrt(');
                            else if (btn === 'ln') insertChar('log(');
                            else if (btn === 'log') insertChar('log10(');
                            else if (btn === 'abs') insertChar('abs(');
                            else if (btn === 'sin' || btn === 'cos' || btn === 'tan') insertChar(`${btn}(`);
                            else if (btn === 'π') insertChar('pi');
                            else insertChar(btn);
                         }}
                         className={`py-3 px-1 text-[13px] rounded-lg font-mono transition-transform active:scale-95 shadow-sm ${darkMode ? 'bg-[#1e2028] text-slate-200 hover:bg-[#252836]' : 'bg-white text-slate-700 hover:bg-slate-50 border-b border-slate-200'} ${['x', 'y', 'z', 'sin', 'cos', 'tan', 'ln', 'log', 'π', 'e'].includes(btn) ? 'text-emerald-600 font-semibold dark:text-emerald-400' : ''}`}
                      >
                         {btn}
                      </button>
                   ))}
                </div>
             ))}
          </div>
       </div>

       {/* Right Panel: Plot Canvas */}
       <div className={`flex-1 h-[60vh] lg:h-auto relative overflow-hidden flex flex-col ${darkMode ? 'bg-[#0f111a]' : 'bg-slate-50'}`}>
          
          {/* Top Floating Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-4">
             <div className={`flex items-center gap-1 p-1.5 rounded-[14px] shadow-sm border ${darkMode ? 'bg-[#161822] border-[#1e2028]' : 'bg-white border-slate-200'}`}>
                <button 
                  onClick={() => setActiveTab("2D")}
                  className={`px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${activeTab === '2D' ? 'bg-[#10b981] text-slate-950 shadow-md' : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`}
                >
                  <LineChart className="w-4 h-4" /> 2D
                </button>
                <button 
                  onClick={() => setActiveTab("3D")}
                  className={`px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${activeTab === '3D' ? 'bg-[#10b981] text-slate-950 shadow-md' : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`}
                >
                  <Box className="w-4 h-4" /> 3D
                </button>
             </div>
             
             {/* Note: The theme toggle in the screenshot is probably handled by the parent layout, but we can display a dummy or visual one here if it's meant to be in this component. Based on the props `darkMode` is passed down, so we won't toggle it here, just render an empty space or leave it out so parent renders it. But if it's in the canvas area, we should render it. Let's assume it's in the parent header, since 'Examora GRAPHING' is also not here. */}
          </div>
          
          <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[12px] px-5 py-2 rounded-2xl flex items-center gap-2 shadow-lg border ${darkMode ? 'bg-[#161822] border-[#1e2028] text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
            <Hexagon className="w-3.5 h-3.5" />
            ঘোরাতে ড্র্যাগ • scroll = zoom • 2D মেঝেতে দেখাবে
          </div>

          {/* Bottom Right Controls */}
          <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
             <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer border ${darkMode ? 'bg-[#161822] text-slate-300 hover:bg-[#1e2028] border-[#1e2028]' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}>
                <Plus className="w-5 h-5" />
             </button>
             <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer border ${darkMode ? 'bg-[#161822] text-slate-300 hover:bg-[#1e2028] border-[#1e2028]' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}>
                <Minus className="w-5 h-5" />
             </button>
             <button className={`w-10 h-10 mt-1 rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer border ${darkMode ? 'bg-[#161822] text-slate-300 hover:bg-[#1e2028] border-[#1e2028]' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}>
                <Target className="w-5 h-5" />
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
