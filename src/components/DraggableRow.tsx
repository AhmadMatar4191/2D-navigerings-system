import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface DraggableRowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Horisontellt scrollrad som kan dras med mus/pek.
 * Anpassad för att registrera klick samt drag korrekt. 
 */
export default function DraggableRow({
  children,
  className = "",
  ...props
}: DraggableRowProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  const startX = useRef(0);                 // Startposition / för drag i X-led
  const startScroll = useRef(0);            // Scroll-läge / vid dragstart
  const dragging = useRef(false);           // Om vi faktiskt draggar just nu
  const pointerIdRef = useRef<number | null>(null);
  const downTarget = useRef<EventTarget | null>(null);

  const THRESHOLD = 6; // pixlar / om det är under detta räknas det som klick istället för drag

  // Sätter upp pointer-hantering för drag-to-scroll
  useEffect(() => {
    const element = elRef.current;
    if (!element) return;

    function onPointerDown(e: PointerEvent) {
      // Bara primär knapp/pekare
      if (e.button && e.button !== 0) return;

      const el = elRef.current;
      if (!el) return;

      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // Ignorera om pointer capture inte stöds
      }

      pointerIdRef.current = e.pointerId;
      startX.current = e.clientX;
      startScroll.current = el.scrollLeft;
      dragging.current = false;
      downTarget.current = e.target;
    }

    function onPointerMove(e: PointerEvent) {
      if (pointerIdRef.current !== e.pointerId) return;

      const el = elRef.current;
      if (!el) return;

      const dx = e.clientX - startX.current;

      // Börja räkna som drag först när man förflyttat sig tillräckligt långt
      if (!dragging.current && Math.abs(dx) > THRESHOLD) {
        dragging.current = true;
      }

      if (dragging.current) {
        el.scrollLeft = startScroll.current - dx;
        // Förhindrar tex textmarkering medan man draggar
        e.preventDefault();
      }
    }

    function onPointerUp(e: PointerEvent) {
      if (pointerIdRef.current !== e.pointerId) return;

      const el = elRef.current;
      if (!el) return;

      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // Ignorera om pointer capture inte stöds
      }

      // Om vi inte dragit "på riktigt" => gör klick på ursprunglig knapp/länk
      if (!dragging.current && downTarget.current) {
        const target = downTarget.current as HTMLElement;
        const btn = target.closest?.("button, a, [role='button']");
        if (btn instanceof HTMLElement) {
          btn.click();
        }
      }

      pointerIdRef.current = null;
      downTarget.current = null;
      dragging.current = false;
    }

    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={elRef}
      className={["draggable-row", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
