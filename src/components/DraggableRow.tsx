// src/components/DraggableRow.tsx
import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface DraggableRowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function DraggableRow({
  children,
  className = "",
  ...props
}: DraggableRowProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const dragging = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const downTarget = useRef<EventTarget | null>(null);
  const THRESHOLD = 6; // pixels: below this we treat as a click

  useEffect(() => {
    const element = elRef.current;
    if (!element) return;

    function onPointerDown(e: PointerEvent) {
      // only primary button/pointer
      if (e.button && e.button !== 0) return;

      const el = elRef.current;
      if (!el) return;

      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // ignore if unsupported
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

      if (!dragging.current && Math.abs(dx) > THRESHOLD) {
        dragging.current = true;
      }

      if (dragging.current) {
        el.scrollLeft = startScroll.current - dx;
        // only prevent default while actively dragging
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
        // ignore if unsupported
      }

      // if we didn't really drag, trigger a real click on the original target
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
