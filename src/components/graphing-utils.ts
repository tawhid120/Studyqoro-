export interface MathEq {
  id: string;
  text: string;
  color: string;
  extend3D: boolean;
  isVisible: boolean;
  showDerivative?: boolean;
  params?: { [key: string]: number };
}

// Detect extra single-letter parameters in an equation (excluding x, y, z)
export function detectParams(text: string): string[] {
  const clean = text.toLowerCase();
  const found = new Set<string>();
  const reserved = new Set(["x", "y", "z", "e", "i"]); // e reserved for Euler's number
  // Remove known function names first so their letters aren't picked up as params
  const withoutFuncs = clean.replace(/sin|cos|tan|sqrt|log10|log|abs|pi/g, "");
  const single = withoutFuncs.match(/[a-z]/g) || [];
  single.forEach((ch) => {
    if (!reserved.has(ch)) found.add(ch);
  });
  return Array.from(found);
}

// Marching-squares style contour tracer: returns line segments along f(x,y)=0
export function traceImplicitCurve(
  evaluate: (x: number, y: number) => number,
  range: number = 15,
  step: number = 0.25
): { x: number[]; y: number[] }[] {
  const segments: { x: number[]; y: number[] }[] = [];
  const xs: number[] = [];
  for (let v = -range; v <= range; v += step) xs.push(v);

  const grid: number[][] = [];
  for (let yi = 0; yi < xs.length; yi++) {
    const row: number[] = [];
    for (let xi = 0; xi < xs.length; xi++) {
      let v: number;
      try {
        v = evaluate(xs[xi], xs[yi]);
        if (typeof v !== "number" || isNaN(v)) v = NaN;
      } catch (e) {
        v = NaN;
      }
      row.push(v);
    }
    grid.push(row);
  }

  const interp = (
    x1: number, y1: number, v1: number,
    x2: number, y2: number, v2: number
  ) => {
    const t = v1 / (v1 - v2);
    return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
  };

  for (let yi = 0; yi < xs.length - 1; yi++) {
    for (let xi = 0; xi < xs.length - 1; xi++) {
      const v00 = grid[yi][xi];
      const v10 = grid[yi][xi + 1];
      const v01 = grid[yi + 1][xi];
      const v11 = grid[yi + 1][xi + 1];
      if ([v00, v10, v01, v11].some((v) => isNaN(v))) continue;

      const x0 = xs[xi], x1c = xs[xi + 1];
      const y0 = xs[yi], y1c = xs[yi + 1];

      const pts: { x: number; y: number }[] = [];
      if (v00 * v10 < 0) pts.push(interp(x0, y0, v00, x1c, y0, v10));
      if (v01 * v11 < 0) pts.push(interp(x0, y1c, v01, x1c, y1c, v11));
      if (v00 * v01 < 0) pts.push(interp(x0, y0, v00, x0, y1c, v01));
      if (v10 * v11 < 0) pts.push(interp(x1c, y0, v10, x1c, y1c, v11));

      if (pts.length >= 2) {
        segments.push({ x: [pts[0].x, pts[1].x], y: [pts[0].y, pts[1].y] });
      }
    }
  }
  return segments;
}

export const COLORS = [
  '#10b981', // emerald
  '#f43f5e', // rose
  '#3b82f6', // blue
  '#eab308', // yellow
  '#8b5cf6', // violet
  '#f97316', // orange
];
