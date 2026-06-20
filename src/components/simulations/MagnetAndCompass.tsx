import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export default function MagnetAndCompass() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Magnet state
  const [magnetPos, setMagnetPos] = useState<Point>({ x: window.innerWidth > 768 ? 400 : 200, y: 300 });
  const [isDraggingMagnet, setIsDraggingMagnet] = useState(false);
  const magnetWidth = 200;
  const magnetHeight = 60;
  
  // Compass state
  const [compassPos, setCompassPos] = useState<Point>({ x: window.innerWidth > 768 ? 200 : 100, y: 150 });
  const [isDraggingCompass, setIsDraggingCompass] = useState(false);
  const compassRadius = 45;
  
  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        // Adjust positions if they're out of bounds on resize
        if (!isDraggingMagnet && !isDraggingCompass) {
          setMagnetPos(p => ({ x: Math.min(p.x, width - magnetWidth / 2 - 20), y: Math.min(p.y, height - magnetHeight / 2 - 20) }));
          setCompassPos(p => ({ x: Math.min(p.x, width - compassRadius - 20), y: Math.min(p.y, height - compassRadius - 20) }));
        }
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isDraggingMagnet, isDraggingCompass]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent, type: 'magnet' | 'compass') => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (type === 'magnet') setIsDraggingMagnet(true);
    if (type === 'compass') setIsDraggingCompass(true);
  };

  const handlePointerMove = (e: React.PointerEvent, type: 'magnet' | 'compass') => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Limits
    const minX = type === 'magnet' ? magnetWidth/2 : compassRadius;
    const maxX = dimensions.width - minX;
    const minY = type === 'magnet' ? magnetHeight/2 : compassRadius;
    const maxY = dimensions.height - minY;
    
    const boundedX = Math.max(minX, Math.min(x, maxX));
    const boundedY = Math.max(minY, Math.min(y, maxY));

    if (type === 'magnet' && isDraggingMagnet) {
      setMagnetPos({ x: boundedX, y: boundedY });
    } else if (type === 'compass' && isDraggingCompass) {
      setCompassPos({ x: boundedX, y: boundedY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent, type: 'magnet' | 'compass') => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (type === 'magnet') setIsDraggingMagnet(false);
    if (type === 'compass') setIsDraggingCompass(false);
  };
  
  const resetPositions = () => {
     setMagnetPos({ x: dimensions.width / 2, y: dimensions.height / 2 });
     setCompassPos({ x: Math.max(100, dimensions.width / 4), y: Math.max(100, dimensions.height / 4) });
  };

  // Physics mapping: N pole is right half, S pole is left half (relative to center)
  // Distance from center to poles
  const poleDist = magnetWidth / 2 - 20; 
  const nPole = { x: magnetPos.x + poleDist, y: magnetPos.y };
  const sPole = { x: magnetPos.x - poleDist, y: magnetPos.y };

  // Calculate magnetic field angle at any point
  const getFieldAngle = (x: number, y: number) => {
    // Treat as dipole
    const dxN = x - nPole.x;
    const dyN = y - nPole.y;
    const dN2 = dxN*dxN + dyN*dyN;
    const dN = Math.sqrt(dN2);
    
    const dxS = x - sPole.x;
    const dyS = y - sPole.y;
    const dS2 = dxS*dxS + dyS*dyS;
    const dS = Math.sqrt(dS2);
    
    // Magnetic field vectors from N (repelling) and S (attracting)
    // small softening to avoid infinity
    const softenedDN3 = Math.pow(Math.max(dN, 10), 3);
    const softenedDS3 = Math.pow(Math.max(dS, 10), 3);
    
    const Bx = (dxN / softenedDN3) - (dxS / softenedDS3);
    const By = (dyN / softenedDN3) - (dyS / softenedDS3);
    
    return Math.atan2(By, Bx);
  };

  // Generate grid points for small compasses
  const cols = Math.floor(dimensions.width / 60);
  const rows = Math.floor(dimensions.height / 60);
  const gridCompasses = [];
  
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      const gx = c * 60;
      const gy = r * 60;
      
      // opacity dropoff based on distance to magnet
      const distToCenter = Math.hypot(gx - magnetPos.x, gy - magnetPos.y);
      const intensity = Math.max(0.1, 1 - (distToCenter / (dimensions.width * 0.7)));
      
      // Avoid rendering small compass inside magnet visually
      if (Math.abs(gx - magnetPos.x) < magnetWidth/2 + 10 && Math.abs(gy - magnetPos.y) < magnetHeight/2 + 10) {
        continue;
      }
      
      gridCompasses.push({ id: `$\\{r\\}-$\\{c\\}`, x: gx, y: gy, opacity: intensity * 0.5 });
    }
  }

  const mainCompassAngle = getFieldAngle(compassPos.x, compassPos.y);

  return (
    <div className="w-full relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col" style={{ height: '600px' }}>
      
      {/* Controls Bar */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={resetPositions}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl transition-colors font-medium text-sm border border-emerald-200 dark:border-emerald-800"
        >
          <RefreshCcw className="w-4 h-4" /> রিসেট করুন
        </button>
      </div>

      {/* Simulation Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-full touch-none"
        style={{ cursor: isDraggingMagnet || isDraggingCompass ? 'grabbing' : 'default' }}
      >
        
        {/* Background Grid Field Lines */}
        {gridCompasses.map(comp => {
          const angle = getFieldAngle(comp.x, comp.y);
          return (
            <div 
              key={comp.id}
              className="absolute pointer-events-none"
              style={{
                left: comp.x,
                top: comp.y,
                transform: `translate(-50%, -50%) rotate($\\{angle * (180 / Math.PI)\\}deg)`,
                opacity: comp.opacity,
                transition: 'transform 0.1s ease-out'
              }}
            >
               <div className="w-10 h-3 flex rounded-full overflow-hidden shadow-[0_0_2px_rgba(0,0,0,0.2)]">
                  <div className="w-1/2 h-full bg-slate-300 dark:bg-slate-600"></div>
                  <div className="w-1/2 h-full bg-rose-400"></div>
               </div>
            </div>
          );
        })}

        {/* The Bar Magnet */}
        <div 
          className="absolute shadow-lg rounded-md overflow-hidden cursor-grab active:cursor-grabbing flex select-none hover:shadow-xl transition-shadow"
          style={{
            width: magnetWidth,
            height: magnetHeight,
            left: magnetPos.x,
            top: magnetPos.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
          onPointerDown={(e) => handlePointerDown(e, 'magnet')}
          onPointerMove={(e) => handlePointerMove(e, 'magnet')}
          onPointerUp={(e) => handlePointerUp(e, 'magnet')}
          onPointerCancel={(e) => handlePointerUp(e, 'magnet')}
        >
          <div className="w-1/2 h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-r-0 border-slate-300 dark:border-slate-600">
            <span className="text-3xl font-bold text-slate-400 dark:text-slate-400">S</span>
          </div>
          <div className="w-1/2 h-full bg-rose-600 dark:bg-rose-600 flex items-center justify-center border border-l-0 border-rose-700">
            <span className="text-3xl font-bold text-white">N</span>
          </div>
        </div>

        {/* The Main Compass */}
        <div
          className="absolute rounded-full shadow-lg border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 cursor-grab active:cursor-grabbing flex items-center justify-center"
          style={{
            width: compassRadius * 2,
            height: compassRadius * 2,
            left: compassPos.x,
            top: compassPos.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 15
          }}
          onPointerDown={(e) => handlePointerDown(e, 'compass')}
          onPointerMove={(e) => handlePointerMove(e, 'compass')}
          onPointerUp={(e) => handlePointerUp(e, 'compass')}
          onPointerCancel={(e) => handlePointerUp(e, 'compass')}
        >
          {/* Compass Direction Labels */}
          <div className="absolute inset-0 pointer-events-none font-semibold text-[10px] text-slate-400 dark:text-slate-500">
            <span className="absolute top-1 left-1/2 -translate-x-1/2">N</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2">S</span>
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2">W</span>
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2">E</span>
          </div>
          
          {/* Compass Needle */}
          <div 
            className="absolute rounded-full"
            style={{
               width: compassRadius * 1.5,
               height: 12,
               transform: `rotate($\\{mainCompassAngle * (180 / Math.PI)\\}deg)`,
               transition: isDraggingCompass || isDraggingMagnet ? 'none' : 'transform 0.1s ease-out'
            }}
          >
             <div className="w-full h-full flex rounded-full overflow-hidden shadow-sm relative border border-slate-400/20">
                <div className="w-1/2 h-full bg-white dark:bg-slate-200"></div>
                <div className="w-1/2 h-full bg-rose-600"></div>
                {/* Center Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400 z-10"></div>
             </div>
          </div>
        </div>

      </div>

      {/* Instructions Overlay (Fades out) */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: (isDraggingCompass || isDraggingMagnet) ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg pointer-events-none flex items-center justify-center whitespace-nowrap"
      >
        চুম্বক অথবা কম্পাসটি ড্র্যাগ করে সরিয়ে দেখুন
      </motion.div>

    </div>
  );
}
