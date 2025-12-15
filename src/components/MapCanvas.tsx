// src/components/MapCanvas.tsx
import { useEffect, useMemo, useRef } from "react";
import { ROWS, COLS, CELL } from "../data/departments";
import blueprintSrc from "../assets/KartaÖverAffär.png";
import type { Department } from "../types";

// Färgtema för ljust läge
const LIGHT_COLORS = {
  bg: "#fff6e8",
  grid: "#d7c9b2",
  border: "#c29c5f",
  dept: "#e9dfcf",
  highlight: "#ffd54a",
  label: "#553a20",
};

// Färgtema för mörkt läge
const DARK_COLORS = {
  bg: "#1c1917", // Mörk bakgrund
  grid: "#44403c", // Mörka rutnätslinjer
  border: "#57534e", // Mörk ram
  dept: "#292524", // Mörkgrå hyllor
  highlight: "#ca8a04", // Mörkare gul highlight
  label: "#e7e5e4", // Ljus text
};

interface MapCanvasProps {
  highlighted?: Set<string>;
  departments?: Department[];

  // Blueprint-inställningar (karta över butiken)
  blueprintAlign?: "center" | "topleft";
  blueprintOffset?: { x?: number; y?: number }; // offset i rutnät-celler
  blueprintScale?: number; // extra skala-faktor på bilden
  blueprintAlpha?: number; // transparens för blueprint (0–1)

  // Positioner för användare och väg (path)
  userPosition?: { r: number; c: number } | null;
  path?: { r: number; c: number }[];

  // Klick i kartan (rad/kolumn ges tillbaka)
  onMapClick?: (r: number, c: number) => void;

  // Dark mode-flagga
  isDarkMode?: boolean;
}

/**
 * Canvas-komponent som ritar:
 * - blueprint-bild (butikskarta)
 * - rutnät
 * - avdelningar (departments) med highlight
 * - användare + väg (path)
 */
export default function MapCanvas({
  highlighted = new Set<string>(),
  departments = [],
  blueprintAlign = "center",
  blueprintOffset = { x: 0, y: -1 }, // lite uppflyttad som standard
  blueprintScale = 1,
  blueprintAlpha = 0.5,
  userPosition = null,
  path = [],
  onMapClick,
  isDarkMode = false,
}: MapCanvasProps) {
  const COLORS = useMemo(
    () => (isDarkMode ? DARK_COLORS : LIGHT_COLORS),
    [isDarkMode]
  );

  const cvsRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const sizeRef = useRef<{ w: number; h: number; mapScale: number }>({
    w: 0,
    h: 0,
    mapScale: 1,
  });

  // Ladda blueprint-bilden en gång
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

  // Huvudeffekt: hanterar storlek, ritanimation och klick i kartan
  useEffect(() => {
    let raf = 0;
    let ro: ResizeObserver | null = null;

    // Device Pixel Ratio ⇒ skarpare canvas på t.ex. retina
    const dpr = () => window.devicePixelRatio || 1;

    // Anpassar canvas-storlek till förälderelementet
    const updateSize = () => {
      const canvas = cvsRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement ?? canvas;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const parentW = parent.clientWidth;
      const parentH = parent.clientHeight || (parentW * ROWS) / COLS;

      const cssW = parentW;
      const cssH = parentH;

      const pxW = Math.max(1, Math.floor(cssW * dpr()));
      const pxH = Math.max(1, Math.floor(cssH * dpr()));

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = pxW;
      canvas.height = pxH;

      // Skala context så att 1 enhet = 1 CSS-pixel
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);

      // Viktigt: slå av smoothing för skarpare grid/text/linjer
      ctx.imageSmoothingEnabled = false;

      const scaleX = cssW / (COLS * CELL);
      const scaleY = cssH / (ROWS * CELL);
      const mapScale = Math.min(scaleX, scaleY);

      sizeRef.current = { w: cssW, h: cssH, mapScale };
    };

    // Hanterar klick i kartan → omvandlar pixelposition till (rad, kolumn)
    const handleClick = (e: MouseEvent) => {
      const canvas = cvsRef.current;
      if (!canvas) return;

      const x = e.offsetX;
      const y = e.offsetY;

      const scaledCell = CELL * sizeRef.current.mapScale;
      const c = Math.floor(x / scaledCell);
      const r = Math.floor(y / scaledCell);

      onMapClick?.(r, c);
    };

    // Ritar allt innehåll på canvas, körs löpande via requestAnimationFrame
    const draw = (t = 0) => {
      const canvas = cvsRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const animT = t / 1000;
      const { w: canvasW, h: canvasH, mapScale } = sizeRef.current;
      const scaledCell = CELL * mapScale;

      // Hjälpfunktion: snappar coords till pixelgrid → skarpare text/linjer
      const snap = (v: number) => Math.round(v) + 0.5;

      // 1. Bakgrund
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // 2. Blueprint-lager (butikskartan)
      const img = imgRef.current;
      if (img) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, blueprintAlpha));

        if (isDarkMode) {
          ctx.filter = "invert(1) hue-rotate(180deg) brightness(0.8)";
        }

        const imgW = img.naturalWidth || img.width;
        const imgH = img.naturalHeight || img.height;

        // ✅ FITTA bilden i HELA canvasen (contain)
        const scale = Math.min(canvasW / imgW, canvasH / imgH);
        const dw = imgW * scale;
        const dh = imgH * scale;

        const dx = (canvasW - dw) / 2;

        // Flytta upp lite (relativt till storleken)
        const dy = -17 * mapScale;

        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      }

      // 3. Rutnät
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = COLORS.grid;

      for (let r = 0; r <= ROWS; r++) {
        ctx.fillRect(0, snap(r * scaledCell), COLS * scaledCell, 1);
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.fillRect(snap(c * scaledCell), 0, 1, ROWS * scaledCell);
      }

      ctx.globalAlpha = 1;

      // 4. Avdelningar (departments) + highlight
      for (const d of departments) {
        const isHit = highlighted.has(String(d.name).toLowerCase());

        for (const box of d.boxes) {
          const x = box.c * scaledCell;
          const y = box.r * scaledCell;
          const w = box.w * scaledCell;
          const h = box.h * scaledCell;

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

          // Label (text) för denna hylla/avdelning – nu skarpare
          ctx.save();
          ctx.fillStyle = COLORS.label;

          const fontSize = Math.max(11, 14 * mapScale);
          ctx.font = `600 ${fontSize}px system-ui, sans-serif`;

          // Skugga bakom texten för bättre läsbarhet
          ctx.shadowColor = isDarkMode
            ? "rgba(0,0,0,0.6)"
            : "rgba(255,255,255,0.7)";
          ctx.shadowBlur = 2 * mapScale;

          const cx = x + w / 2;
          const cy = y + h / 2;

          const maxWidth = w - 6 * mapScale;
          const textWidth = ctx.measureText(d.name).width;

          // Om texten inte får plats på bredden och hyllan är högre än bred → rotera 90°
          const shouldRotate = textWidth > maxWidth && h > w;

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          if (shouldRotate) {
            ctx.translate(snap(cx), snap(cy));
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(d.name, 0, 0);
          } else {
            ctx.fillText(d.name, snap(cx), snap(cy));
          }

          ctx.restore();
        }
      }

      // 5. Väg (path) – röd linje mellan celler
      if (path.length > 0) {
        ctx.strokeStyle = "#e11d48";
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

      // 6. Användarens position ("START") om satt
      if (userPosition) {
        const ux = userPosition.c * scaledCell + scaledCell / 2;
        const uy = userPosition.r * scaledCell + scaledCell / 2;

        const pulse = 4 * Math.sin(animT * 4);

        // Yttre pulserande ring
        ctx.fillStyle = "rgba(0, 122, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(
          ux,
          uy,
          12 * mapScale + pulse * 0.5 * mapScale,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Inre prick
        ctx.fillStyle = "#007AFF";
        ctx.beginPath();
        ctx.arc(ux, uy, 6 * mapScale, 0, Math.PI * 2);
        ctx.fill();

        // Vit kant
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2 * mapScale;
        ctx.stroke();

        // Textetikett "START"
        ctx.font = `bold ${10 * mapScale}px system-ui`;
        ctx.fillStyle = "#007AFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("START", ux, uy - 14 * mapScale);
      }

      // 7. Ram runt hela kartan
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

    // Init: sätt storlek, starta resize-observer, registrera klick och starta animation
    updateSize();

    const canvasForObserver = cvsRef.current;
    const parentForObserver =
      canvasForObserver?.parentElement ?? canvasForObserver ?? null;

    if (parentForObserver) {
      ro = new ResizeObserver(updateSize);
      ro.observe(parentForObserver);
    }

    const canvas = cvsRef.current;
    if (canvas) {
      canvas.addEventListener("click", handleClick);
    }

    raf = requestAnimationFrame(draw);

    // Städning när komponenten avmonteras eller beroenden ändras
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      canvas?.removeEventListener("click", handleClick);
    };
  }, [
    highlighted,
    departments,
    userPosition,
    path,
    onMapClick,
    blueprintAlign,
    blueprintOffset,
    blueprintScale,
    blueprintAlpha,
    isDarkMode,
    COLORS,
  ]);

  return <canvas ref={cvsRef} className="map-canvas" />;
}
