// src/components/MapCanvas.tsx
import { useEffect, useRef } from "react";
import { ROWS, COLS, CELL } from "../data/departments";
import blueprintSrc from "../assets/logo.png/KartaÖverAffär.png";
import type { Department } from "../types";

const COLORS = {
  bg: "#fff6e8",
  grid: "#d7c9b2",
  border: "#c29c5f",
  dept: "#e9dfcf",
  highlight: "#ffd54a",
  label: "#553a20",
};

interface MapCanvasProps {
  highlighted?: Set<string>;
  departments?: Department[];
}

export default function MapCanvas({
  highlighted = new Set<string>(),
  departments = [],
}: MapCanvasProps) {
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

      // blueprint layer
      const img = imgRef.current;
      if (img) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        const imgW = img.naturalWidth || img.width;
        const imgH = img.naturalHeight || img.height;
        const s = Math.min(canvasW / imgW, canvasH / imgH);
        const dw = imgW * s;
        const dh = imgH * s;
        const dx = (canvasW - dw) / 2;
        const dy = (canvasH - dh) / 2;
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
        const x = d.c * scaledCell;
        const y = d.r * scaledCell;
        const w = d.w * scaledCell;
        const h = d.h * scaledCell;
        const isHit = highlighted.has(String(d.name).toLowerCase());

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

        ctx.fillStyle = COLORS.label;
        ctx.font = `${Math.max(10, 12 * mapScale)}px system-ui`;
        ctx.fillText(d.name, x + 4 * mapScale, y + 14 * mapScale);
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

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
  }, [highlighted, departments]);

  return <canvas ref={cvsRef} className="map-canvas" />;
}
