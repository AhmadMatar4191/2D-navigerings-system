import type { MouseEvent } from "react";
import { DEPT_ICONS } from "../data/products";
import type { Department } from "../types";

/**
 * En knapp ("chip") som representerar en avdelning.
 * Visar ikon + namn och skickar tillbaka avdelningsnamnet vid klick.
 */
interface DeptChipProps {
  dept: Department;
  onClick: (deptName: string) => void;
  isSelected?: boolean;
}

export default function DeptChip({ dept, onClick, isSelected }: DeptChipProps) {
  const deptName = dept.name;

  // Hindrar att DraggableRow tror att användaren försöker dra
  const handlePointerDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  // Klick på chip => välj avdelningen
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick(deptName);
  };

  return (
    <button
      key={deptName}
      className={`chip ${isSelected ? "selected" : ""}`}
      data-dept={deptName}
      type="button"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <div className="chipEmoji">{DEPT_ICONS[deptName] ?? "❔"}</div>
      <div className="chipLabel">{deptName}</div>
    </button>
  );
}
