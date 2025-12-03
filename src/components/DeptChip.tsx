// src/components/DeptChip.tsx
import type { MouseEvent } from "react";
import { DEPT_ICONS } from "../data/products";
import type { Department } from "../types";

/**
 * Komponent för en enskild avdelningsknapp ("chip").
 * dept – Avdelningsobjektet { name, ... }.
 * onClick – Klickhanterare som anropas med dept.name.
 */
interface DeptChipProps {
  dept: Department;
  onClick: (deptName: string) => void;
}

export default function DeptChip({ dept, onClick }: DeptChipProps) {
  const deptName = dept.name;

  const handlePointerDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick(deptName);
  };

  return (
    <button
      key={deptName}
      className="chip"
      data-dept={deptName}
      type="button"
      // Stoppa drag-händelser i den omslutande DraggableRow
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <div className="chipEmoji">{DEPT_ICONS[deptName] ?? "❔"}</div>
      <div className="chipLabel">{deptName}</div>
    </button>
  );
}
