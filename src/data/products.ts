// src/data/products.ts
import type { Product } from "../types";

export const PRODUCTS: Product[] = [
  // --- Bröd ---
  { name: "Baguette", dept: "Bröd" },
  { name: "Fralla", dept: "Bröd" },
  { name: "Rågbröd", dept: "Bröd" },
  { name: "Croissant", dept: "Bröd" },
  { name: "Långfranska", dept: "Bröd" },
  { name: "Polarbröd", dept: "Bröd" },

  // --- Grönsaker ---
  { name: "Äpplen", dept: "Grönsaker" },
  { name: "Gurka", dept: "Grönsaker" },
  { name: "Bananer", dept: "Grönsaker" },
  { name: "Tomater", dept: "Grönsaker" },
  { name: "Sallad", dept: "Grönsaker" },
  { name: "Morötter", dept: "Grönsaker" },

  // --- Snacks ---
  { name: "Chips", dept: "Snacks" },
  { name: "Nötter", dept: "Snacks" },
  { name: "Popcorn", dept: "Snacks" },
  { name: "Godis", dept: "Snacks" },

  // --- Dryck ---
  { name: "Läsk", dept: "Dryck" },
  { name: "Juice", dept: "Dryck" },
  { name: "Mineralvatten", dept: "Dryck" },
  { name: "Energidryck", dept: "Dryck" },

  // --- Mejeri ---
  { name: "Mjölk", dept: "Mejeri" },
  { name: "Yoghurt", dept: "Mejeri" },
  { name: "Grädde", dept: "Mejeri" },
  { name: "Smör", dept: "Mejeri" },
  { name: "Ost", dept: "Mejeri" },

  // --- Kött ---
  { name: "Nötfärs", dept: "Kött" },
  { name: "Kycklingfilé", dept: "Kött" },
  { name: "Fläskkotlett", dept: "Kött" },

  // --- Frys ---
  { name: "Glass", dept: "Frys" },
  { name: "Frysta bär", dept: "Frys" },
  { name: "Pommes frites", dept: "Frys" },

  // --- Bak ---
  { name: "Bakpulver", dept: "Bak" },
  { name: "Vaniljsocker", dept: "Bak" },
  { name: "Jäst", dept: "Bak" },
  { name: "Kakao", dept: "Bak" },
];

export const DEPT_ICONS: Record<string, string> = {
  Bröd: "🥐",
  Grönsaker: "🥕",
  Bak: "🍩",
  Konserver: "🥫",
  Torrvaror: "🌾",
  Snacks: "🍟",
  Dryck: "🥤",
  Kött: "🥩",
  Fisk: "🐟",
  Städ: "🧼",
  Frys: "❄️",
};
