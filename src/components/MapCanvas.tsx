// src/components/MapCanvas.tsx
import { useEffect, useRef } from "react";
import { ROWS, COLS, CELL } from "../data/departments";
import blueprintSrc from "../assets/KartaÖverAffär.png";
import type { Department } from "../types";

const LIGHT_COLORS = {
  bg: "#fff6e8",
  grid: "#d7c9b2",
  border: "#c29c5f",
  dept: "#e9dfcf",
  highlight: "#ffd54a",
  label: "#553a20",
};

const DARK_COLORS = {
  bg: "#1c1917",       // Mörk bakgrund
  grid: "#44403c",     // Mörka rutnätslinjer
  border: "#57534e",   // Mörk ram
  dept: "#292524",     // Mörkgrå hyllor
  highlight: "#ca8a04",// Mörkare gul highlight
  label: "#e7e5e4",    // Ljus text
};

interface MapCanvasProps {
  highlighted?: Set<string>;
  departments?: Department[];
  // blueprint placement options
  // align: 'center' (default) or 'topleft'
  blueprintAlign?: "center" | "topleft";
  // offset in grid cells (columns, rows) applied when not centered
  blueprintOffset?: { x?: number; y?: number };
  // additional scale multiplier applied to the image-fit scale
  blueprintScale?: number;
  // alpha for the blueprint layer (0-1)
  blueprintAlpha?: number;

  userPosition?: { r: number, c: number } | null; // <--- NY
  path?: { r: number, c: number }[];              // <--- NY
  onMapClick?: (r: number, c: number) => void;    // <--- NY


  isDarkMode?: boolean; // <--- NY PROP för dark mode
}

export default function MapCanvas({
  highlighted = new Set<string>(),
  departments = [],
  // keep centered by default, but lift up a little (negative y)
  blueprintAlign = "center",
  blueprintOffset = { x: 0, y: -1 },
  blueprintScale = 1,
  blueprintAlpha = 0.5,
  userPosition = null, // Default värde
  path = [],           // Default tom lista
  onMapClick,          // Callback
  isDarkMode = false, // Default false
}: MapCanvasProps) {
  const COLORS = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  const cvsRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const sizeRef = useRef<{ w: number; h: number; mapScale: number }>({
    w: 0,
    h: 0,
    mapScale: 1,
    
  });

  // load blueprint image once
  useEffect(() => {
    const img = new Image();
    img.src = blueprintSrc;
    img.onload = () => {
      imgRef.current = img;
    };
    img.onerror = () => {
      imgRef.current = null;
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let ro: ResizeObserver | null = null;

    const dpr = () => window.devicePixelRatio || 1;

    const updateSize = () => {
      const canvas = cvsRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement ?? canvas;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const parentW = parent.clientWidth;
      const parentH = parent.clientHeight || parentW * (ROWS / COLS);

      const cssW = parentW;
      const cssH = parentH;

      const pxW = Math.max(1, Math.floor(cssW * dpr()));
      const pxH = Math.max(1, Math.floor(cssH * dpr()));

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = pxW;
      canvas.height = pxH;
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);

      const scaleX = cssW / (COLS * CELL);
      const scaleY = cssH / (ROWS * CELL);
      const mapScale = Math.min(scaleX, scaleY);

      sizeRef.current = { w: cssW, h: cssH, mapScale };
    };

 // 🔽🔽🔽 LÄGG TILL DETTA BLOCK 🔽🔽🔽 
  const handleClick = (e: MouseEvent) => {
    const canvas = cvsRef.current;
    if (!canvas) return;
    const x = e.offsetX;
    const y = e.offsetY;

const scaledCell = CELL * sizeRef.current.mapScale;
    const c = Math.floor(x / scaledCell);
    const r = Math.floor(y / scaledCell);

    if (onMapClick) {
      onMapClick(r, c);
    }
    console.log("cell:", { r, c }, "pixel:", {x, y}); // Bra för debugging
  };
// 🔼🔼🔼 LÄGG TILL DETTA BLOCK 🔼🔼🔼 RADERA EFTER 

    const draw = (t = 0) => {
      const canvas = cvsRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const animT = t / 1000;
      const { w: canvasW, h: canvasH, mapScale } = sizeRef.current;
      const scaledCell = CELL * mapScale;

      // background
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // blueprint layer (image)
      const img = imgRef.current;
      if (img) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, blueprintAlpha));
        if (isDarkMode) {
            ctx.filter = "invert(1) hue-rotate(180deg) brightness(0.8)";
          }
        const imgW = img.naturalWidth || img.width;
        const imgH = img.naturalHeight || img.height;
        // fit image to canvas, then apply optional extra multiplier
        const s = Math.min(canvasW / imgW, canvasH / imgH) * blueprintScale;
        const dw = imgW * s;
        const dh = imgH * s;

        let dx = 0;
        let dy = 0;

        if (blueprintAlign === "center") {
          dx = (canvasW - dw) / 2;
          dy = (canvasH - dh) / 2;
        } else if (blueprintAlign === "topleft") {
          // top-left anchored (0,0)
          dx = 0;
          dy = 0;
        }

        // allow additional offset in grid cells (columns/rows). Positive x moves image right.
        const offsetX = (blueprintOffset?.x ?? 0) * scaledCell;
        const offsetY = (blueprintOffset?.y ?? 0) * scaledCell;

        dx += offsetX;
        dy += offsetY;

        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      }

      // grid
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = COLORS.grid;
      for (let r = 0; r <= ROWS; r++) {
        ctx.fillRect(0, r * scaledCell, COLS * scaledCell, 1);
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.fillRect(c * scaledCell, 0, 1, ROWS * scaledCell);
      }
      ctx.globalAlpha = 1;

      // departments
for (const d of departments) {
  const isHit = highlighted.has(String(d.name).toLowerCase());

  // rita alla boxar för avdelningen
  for (const box of d.boxes) {
    const x = box.c * scaledCell;
    const y = box.r * scaledCell;
    const w = box.w * scaledCell;
    const h = box.h * scaledCell;

    // --- rektangel / highlight ---
    if (isHit) {
      const pulse = 0.75 + 0.25 * Math.abs(Math.sin(animT * 3));
      ctx.globalAlpha = pulse;
      ctx.fillStyle = COLORS.highlight;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#ffec99";
      ctx.lineWidth = Math.max(1, 2 * mapScale);
      ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    } else {
      ctx.fillStyle = COLORS.dept;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
    }

    // --- label för DEN HÄR boxen ---
    ctx.save();
    ctx.fillStyle = COLORS.label;

    let fontSize = Math.max(9, 12 * mapScale);
    ctx.font = `${fontSize}px system-ui`;

    const cx = x + w / 2;
    const cy = y + h / 2;

    const maxWidth = w - 6 * mapScale;
    const textWidth = ctx.measureText(d.name).width;

    // om texten inte får plats i bredd och hyllan är smal & hög → rotera 90°
    const shouldRotate = textWidth > maxWidth && h > w;

    if (shouldRotate) {
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(d.name, 0, 0);
    } else {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(d.name, cx, cy);
    }

    ctx.restore();
  }
}

if (path.length > 0) {
      ctx.strokeStyle = "#e11d48"; // Röd färg
      ctx.lineWidth = 4 * mapScale;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      
      const startX = path[0].c * scaledCell + scaledCell / 2;
      const startY = path[0].r * scaledCell + scaledCell / 2;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < path.length; i++) {
        const px = path[i].c * scaledCell + scaledCell / 2;
        const py = path[i].r * scaledCell + scaledCell / 2;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // 2. RITA ANVÄNDAREN (Syns ALLTID om userPosition är satt)
    if (userPosition) {
      const ux = userPosition.c * scaledCell + scaledCell / 2;
      const uy = userPosition.r * scaledCell + scaledCell / 2;

      // Pulserande effekt
      const pulse = 4 * Math.sin(animT * 4); 

      // Yttre ring (pulserar)
      ctx.fillStyle = "rgba(0, 122, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(ux, uy, (12 * mapScale) + (pulse * 0.5 * mapScale), 0, Math.PI * 2);
      ctx.fill();

      // Inre prick (fast)
      ctx.fillStyle = "#007AFF"; 
      ctx.beginPath();
      ctx.arc(ux, uy, 6 * mapScale, 0, Math.PI * 2);
      ctx.fill();
      
      // Vit kant
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2 * mapScale;
      ctx.stroke();

      // Textetikett: "START"
      ctx.font = `bold ${10 * mapScale}px system-ui`;
      ctx.fillStyle = "#007AFF";
      ctx.textAlign = "center";
      ctx.fillText("START", ux, uy - (14 * mapScale));
    }


      // frame
      ctx.strokeStyle = COLORS.border;
      ctx.lineWidth = Math.max(1, mapScale);
      ctx.strokeRect(
        0.5,
        0.5,
        COLS * scaledCell - 1,
        ROWS * scaledCell - 1
      );

      raf = requestAnimationFrame(draw);


    };

    // initial size + observer for resize
 updateSize();
  const canvasForObserver = cvsRef.current;
  const parentForObserver =
    canvasForObserver?.parentElement ?? canvasForObserver ?? null;
  if (parentForObserver) {
    ro = new ResizeObserver(updateSize);
    ro.observe(parentForObserver);
  }

  // 🔽 registrera click-lyssnare
  const canvas = cvsRef.current;
  if (canvas) {
    canvas.addEventListener("click", handleClick);
  }

  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    if (ro) ro.disconnect();
    if (canvas) {
      canvas.removeEventListener("click", handleClick);
    }
  };
  }, [[highlighted, departments, userPosition, path]]);

  
  return <canvas ref={cvsRef} className="map-canvas" />;
}
