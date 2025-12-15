import { ROWS, COLS } from "../data/departments";
import type { Department } from "../types";

type Point = { r: number; c: number };

/**
 * Hjälpfunktion för att se om en punkt krockar med någon hylla
 */
function isObstacle(r: number, c: number, depts: Department[]): boolean {
  // Kolla om punkten ligger inuti någon avdelnings box
  for (const d of depts) {
    for (const box of d.boxes) {
      // Vi använder lite marginal (0.2) så man inte går precis på kanten
      if (
        r >= box.r - 0.5 &&
        r < box.r + box.h + 0.5 &&
        c >= box.c - 0.5 &&
        c < box.c + box.w + 0.5
      ) {
        return true; // Krock!
      }
    }
  }
  return false;
}

/**
 * Huvudfunktionen: Hitta väg från start -> till en avdelning
 */
export function findPath(
  start: Point,
  targetDeptName: string,
  allDepts: Department[]
): Point[] {
  // 1. Skapa en kö för BFS och en lista för besökta rutor
  const queue: Point[][] = [[start]]; // Varje element i kön är en "väg"
  const visited = new Set<string>();
  visited.add(`${start.r},${start.c}`);

  // Hitta målet (avdelningen vi ska till)
  const targetDept = allDepts.find(d => d.name === targetDeptName);
  if (!targetDept) return [];

  // Riktningar vi kan gå: Upp, Ner, Vänster, Höger
  const directions = [
    { r: -1, c: 0 }, { r: 1, c: 0 },
    { r: 0, c: -1 }, { r: 0, c: 1 }
  ];

  while (queue.length > 0) {
    // Ta den äldsta vägen i kön (garanterar kortast väg i BFS)
    const path = queue.shift()!;
    const current = path[path.length - 1];

    // 2. ÄR VI FRAMME?
    // Vi är framme om vi är "nära" målavdelningen (inom 1-2 rutor)
    // Eftersom vi inte kan gå IN i hyllan, letar vi efter en plats bredvid.
    for (const box of targetDept.boxes) {
      if (
        current.r >= box.r - 1 && current.r <= box.r + box.h + 1 &&
        current.c >= box.c - 1 && current.c <= box.c + box.w + 1
      ) {
        // Vi är precis intill hyllan! Returnera vägen.
        return path;
      }
    }

    // 3. FORTSÄTT LETA
    for (const dir of directions) {
      const next = { r: current.r + dir.r, c: current.c + dir.c };
      const key = `${next.r},${next.c}`;

      // Kolla så vi är innanför kartan
      if (next.r < 0 || next.r >= ROWS || next.c < 0 || next.c >= COLS) continue;

      // Har vi varit här?
      if (visited.has(key)) continue;

      // Är det en vägg/hylla? (Men undanta målet, så vi kan gå ända fram till kanten)
      if (isObstacle(next.r, next.c, allDepts)) {
        // Om det inte är målavdelningen vi krockar med, så är det en vägg
        // (Enkelt hack: Vi behandlar alla hyllor som hinder just nu)
        continue;
      }

      // Om allt ok -> Lägg till i kön
      visited.add(key);
      queue.push([...path, next]);
    }
  }

  return []; // Ingen väg hittades
}