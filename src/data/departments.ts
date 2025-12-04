// src/data/departments.ts
import type { Department } from "../types";

export const ROWS = 50;
export const COLS = 40;
export const CELL = 20;

/**
 * r = radstart (0 uppe), c = kolumnstart (0 vänster)
 * h = höjd i celler, w = bredd i celler
 * Layouten är anpassad efter blueprinten: top-band, vänster vägg,
 * öar till vänster, långa mittgångar, högervägg + kassa-zon.
 */
export const DEPARTMENTS: Department[] = [
  // ───────── Top-band ─────────
  {
    name: "Mejeri",
    boxes: [{ r: 0, c: 3.4, h: 2.2, w: 12.2 }],
  },
  {
    name: "Tacos / Tex-Mex",
    boxes: [{ r: 0, c: 15.8, h: 2.2, w: 7 }],
  },
  {
    // alla tre Frukt & Grönt-ytor är samma avdelning
    name: "Frukt & Grönt",
    boxes: [
      { r: 0, c: 23,   h: 2.2, w: 17 },
      { r: 0, c: 36.5, h: 14,  w: 3.3 },
      { r: 4.8, c: 24, h: 5,   w: 10.4 },
    ],
  },

  // ───────── Vänster vägg (lång) ─────────
  {
    name: "Kyl / Kött",
    boxes: [{ r: 3.8, c: 0, h: 18, w: 3 }],
  },
  {
    name: "Pasta / Konserver / Ägg",
    boxes: [{ r: 21.9, c: 0, h: 16.8, w: 3 }],
  },

  // ───────── Öar uppe till vänster (4 block) ─────────
  {
    // fyra separata block men samma kategori
    name: "Frys/Kött",
    boxes: [
      { r: 4,   c: 4.7, h: 5.4, w: 4 },
      { r: 4,   c: 10,  h: 5.4, w: 4 },
      { r: 11.2, c: 4.7, h: 5.4, w: 4 },
      { r: 11.2, c: 10,  h: 5.4, w: 4 },
    ],
  },

  // ───────── Horisontella rader mitt-vänster ─────────
  {
    name: "Världens mat",
    boxes: [{ r: 19.7, c: 4.9, h: 1, w: 11.4 }],
  },
  {
    name: "Städ & Tvätt",
    boxes: [
      { r: 24.6, c: 4.9, h: 1, w: 11.4 },
      { r: 20.8, c: 4.9, h: 1, w: 11.4 },


    ],
  },
  {
    name: "Djur",
    boxes: [
      { r: 29, c: 4.9, h: 1, w: 11.4 },
      { r: 25.8, c: 4.9, h: 1, w: 11.4 },
    ],
  },
  {
    name: "Hygien",
    boxes: [
      { r: 30, c: 4.9, h: 1, w: 11.4 },
      { r: 33.2, c: 4.9, h: 1, w: 11.4 },
    ],
  },
  {
    name: "Godis",
    boxes: [{ r: 34.3, c: 4.9, h: 1, w: 11.4 }],
  },

  // ───────── Långa mittgångar (smala vertikala) ─────────
  {
    name: "bak",
    boxes: [{ r: 12.2, c: 19.3, h: 24.6, w: 1 }],
  },
  {
    name: "Chips & Snacks",
    boxes: [
      { r: 12.2, c: 20.3, h: 24.6, w: 1 },
      { r: 12.2, c: 23, h: 24.6, w: 1 },


    ],
  },
  {
    name: "Bröd",
    boxes: [
      { r: 12.2, c: 26.7, h: 15.4, w: 1.9 },
      { r: 12.2, c: 24, h: 24.6, w: 1 }

    ],
  },
  {
    name: "Fika",
    boxes: [{ r: 12.2, c: 30.6, h: 22.8, w: 1.2 }],
  },

  // ───────── Högervägg ─────────
  {
    name: "Pålägg",
    boxes: [
      { r: 12.2, c: 31.9, h: 22.8, w: 1.3 },
      

    ],
  },
  {
    name: "Snabbmat",
    boxes: [{ r: 14.1, c: 36.7, h: 31, w: 3 }],
  },

  // ───────── Bottenzon ─────────
  {
    name: "Dryck",
    boxes: [{ r: 38.8, c: 0, h: 2, w: 18 }],
  },

  /*
  {
    name: "Godis (vägg)",
    boxes: [{ r: 64, c: 21, h: 4, w: 7 }],
  },
*/


  // ───────── Kassor ─────────
  {
    name: "Kassa",
    boxes: [
      { r: 39.6, c: 18.6, h: 6.4, w: 1.4 },
      { r: 39.6, c: 22.8, h: 6.4, w: 1.4 },
    ],
  },
 
  {
    name: "Snabbkassa",
    boxes: [{ r: 35.2, c: 26, h: 9.8, w: 5.6 }],
  },
  {
    name: "Blommor",
    boxes: [{ r: 35.2, c: 31.8, h: 9.8, w: 1.5 }],
  },
];
