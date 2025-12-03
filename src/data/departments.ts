// src/data/departments.ts
import type { Department } from "../types";

export const ROWS = 25;
export const COLS = 40;
export const CELL = 20;

// Dina avdelningar (r = rad, c = kolumn, h = höjd i rutor, w = bredd i rutor)
export const DEPARTMENTS: Department[] = [
  // Front / entry
  { name: "Entré", r: 0, c: 0, h: 2, w: 8 },

  // Fresh up front
  { name: "Grönsaker", r: 3, c: 2, h: 4, w: 10 },
  { name: "Bröd", r: 3, c: 13, h: 4, w: 8 },

  // Center aisles (torrvaror)
  { name: "Bak", r: 8, c: 6, h: 11, w: 4 },
  { name: "Konserver", r: 8, c: 12, h: 11, w: 4 },
  { name: "Torrvaror", r: 8, c: 18, h: 11, w: 4 },

  // Snacks / candy
  { name: "Snacks", r: 8, c: 24, h: 5, w: 4 },

  // Frozen
  { name: "Frys", r: 14, c: 24, h: 5, w: 4 },

  // Meat / fish / dairy on the right wall
  { name: "Kött", r: 5, c: 32, h: 5, w: 6 },
  { name: "Fisk", r: 11, c: 32, h: 5, w: 6 },
  { name: "Mejeri", r: 17, c: 32, h: 5, w: 6 },

  // Bottom zone → bulky & cleaning then beverages → checkout
  { name: "Städ", r: 20, c: 2, h: 4, w: 10 },
  { name: "Dryck", r: 20, c: 14, h: 4, w: 12 },
  { name: "Kassa", r: 23, c: 29, h: 2, w: 9 },
];
