import { useEffect, useRef, useState } from "react";
import { DEPARTMENTS } from "../data/departments";
import DraggableRow from "./DraggableRow";
import DeptChip from "./DeptChip";
import type { Product } from "../types";

// Fördefinierade "snap" lägen för bottenpanelen (0 = helt uppe, 1 = helt nere)
const SNAP_POINTS: readonly number[] = [0, 0.5, 0.86];

interface BottomSheetProps {
  query: string;
  setQuery: (value: string) => void;
  onPickDept: (deptName: string) => void;
  results: Product[];
}

// Bottenpanel med sök, kategori-chip och sökresultat
export default function BottomSheet({
  query,
  setQuery,
  onPickDept,
  results,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [yFraction, setYFraction] = useState(0.5); // 0–1, anger hur långt ned panelen är
  const drag = useRef<{ startY: number; startFrac: number } | null>(null);

  // Hanterar drag (dra upp/ner) av bottenpanelen
  useEffect(() => {
    const element = sheetRef.current;
    if (!element) return;

    function onPointerDown(e: PointerEvent) {
      if (!(e.target instanceof HTMLElement)) return;

      // Starta drag endast om man tar tag i "handtaget"
      const handle = e.target.closest(".handle");
      if (!handle) return;

      const el = sheetRef.current;
      if (!el) return;

      drag.current = {
        startY: e.clientY,
        startFrac: yFraction,
      };

      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // Ignorera om pointer capture inte stöds
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!drag.current) return;

      const el = sheetRef.current;
      if (!el) return;

      const dy = e.clientY - drag.current.startY;
      const viewportH = window.innerHeight || el.clientHeight || 1;

      // Omvandlar drag i pixlar till en fraktion (0–1)
      const deltaFrac = dy / viewportH;
      let next = drag.current.startFrac + deltaFrac;
      next = Math.min(1, Math.max(0, next));

      setYFraction(next);
      e.preventDefault();
    }

    function onPointerUp(e: PointerEvent) {
      if (!drag.current) return;

      const el = sheetRef.current;
      if (!el) return;

      // Snappa till närmsta fördefinierade SNAP_POINT
      const current = yFraction;
      const nearest = SNAP_POINTS.reduce((acc, v) =>
        Math.abs(v - current) < Math.abs(acc - current) ? v : acc
      );

      setYFraction(nearest);
      drag.current = null;

      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // Ignorera om pointer capture inte stöds
      }
    }

    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [yFraction]);

  return (
    <div
      ref={sheetRef}
      className="sheet"
      style={{ transform: `translateY(${yFraction * 100}%)` }}
    >
      {/* Handtag för att dra upp/ner panelen */}
      <div className="handle">
        <div className="grabber" />
      </div>

      {/* Sökfält för produkt/kategori */}
      <div className="searchRow">
        <div className="sheet-search-wrapper">
          <input
            className="sheet-search-input"
            placeholder="Sök vara eller kategori... (t.ex. mjölk eller mejeri)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="sheet-search-icon" aria-hidden="true">
            🔎
          </span>
        </div>
      </div>

      {/* Horisontellt scrollbara avdelnings-chip */}
      <DraggableRow className="deptRow">
        {DEPARTMENTS.map((d) => (
          <DeptChip
            key={d.name}
            dept={d}
            onClick={onPickDept}
            isSelected={query === d.name}
          />
        ))}
      </DraggableRow>

      {/* Rutmönster med sökresultat */}
      <div className="results">
        {results.map((p, i) => (
          <div
            key={i}
            className="resultSquare"
            title={`${p.name} • ${p.dept}`}
            onClick={() => {
              // Välj avdelning och scrolla upp kartan
              setQuery(p.dept);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="resultLabel">{p.name}</span>
          </div>
        ))}

        {results.length === 0 && <div className="empty">Inga träffar</div>}
      </div>
    </div>
  );
}
