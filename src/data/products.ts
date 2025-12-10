import type { Product } from "../types";
export const STORES: Stores[] = [
  { id: "Ica Maxi Garnisonen", name: "Ica Maxi Garnisonen", distance: 1.2 },
  { id: "Coop Forum City", name: "Coop Forum City", distance: 2.5 },
  { id: "Willys Hemma Centralen", name: "Willys Hemma Centralen", distance: 0.8 },
  { id: "Lidl Västra Hamnen", name: "Lidl Västra Hamnen", distance: 3.1 },
  { id: "Hemköp Triangeln", name: "Hemköp Triangeln", distance: 2.0 },
  { id: "Netto Möllevången", name: "Netto Möllevången", distance: 2.7, note: "Småbutik" },
];
export const PRODUCTS: Product[] = [
  // --- Frukt & Grönt ---
  { name: "Äpplen",        dept: "Frukt & Grönt" },
  { name: "Gurka",         dept: "Frukt & Grönt" },
  { name: "Bananer",       dept: "Frukt & Grönt" },
  { name: "Tomater",       dept: "Frukt & Grönt" },
  { name: "Sallad",        dept: "Frukt & Grönt" },
  { name: "Morötter",      dept: "Frukt & Grönt" },

  // --- Bröd  ---
  { name: "Baguette",      dept: "Bröd" },
  { name: "Fralla",        dept: "Bröd" },
  { name: "Rågbröd",       dept: "Bröd" },
  { name: "Långfranska",   dept: "Bröd" },
  { name: "Polarbröd",     dept: "Bröd" },

  // --- Tacos / Tex-Mex ---
  { name: "Tacoskal",      dept: "Tacos / Tex-Mex" },
  { name: "Tortillabröd",  dept: "Tacos / Tex-Mex" },
  { name: "Tacosås",       dept: "Tacos / Tex-Mex" },
  { name: "Guacamole-mix", dept: "Tacos / Tex-Mex" },

  // --- Mejeri ---
  { name: "Mjölk",         dept: "Mejeri" },
  { name: "Yoghurt",       dept: "Mejeri" },
  { name: "Grädde",        dept: "Mejeri" },
  { name: "Smör",          dept: "Mejeri" },
  { name: "Ost",           dept: "Mejeri" },

  // --- Kyl / Kött  ---
  { name: "Nötfärs",       dept: "Kyl / Kött" },
  { name: "Kycklingfilé",  dept: "Kyl / Kött" },
  { name: "Fläskkotlett",  dept: "Kyl / Kött" },
  { name: "Bacon",         dept: "Kyl / Kött" },

  // --- Frys/Kött  ---
  { name: "Glass",         dept: "Frys/Kött" },
  { name: "Frysta bär",    dept: "Frys/Kött" },
  { name: "Pommes frites", dept: "Frys/Kött" },
  { name: "Kycklingklubbor frysta", dept: "Frys/Kött" },

  // --- Pasta / Konserver / Ägg ---
  { name: "Spaghetti",     dept: "Pasta / Konserver / Ägg" },
  { name: "Makaroner",     dept: "Pasta / Konserver / Ägg" },
  { name: "Krossade tomater (konserv)", dept: "Pasta / Konserver / Ägg" },
  { name: "Majs på burk",  dept: "Pasta / Konserver / Ägg" },
  { name: "Ägg",           dept: "Pasta / Konserver / Ägg" },

  // --- Världens mat ---
  { name: "Nudlar",        dept: "Världens mat" },
  { name: "Sojasås",       dept: "Världens mat" },
  { name: "Currypasta",    dept: "Världens mat" },

  // --- Städ & Tvätt ---
  { name: "Diskmedel",     dept: "Städ & Tvätt" },
  { name: "Tvättmedel",    dept: "Städ & Tvätt" },
  { name: "Sköljmedel",    dept: "Städ & Tvätt" },

  // --- Djur ---
  { name: "Hundfoder",     dept: "Djur" },
  { name: "Kattmat",       dept: "Djur" },
  { name: "Kattsand",      dept: "Djur" },

  // --- Hygien ---
  { name: "Tandkräm",      dept: "Hygien" },
  { name: "Schampo",       dept: "Hygien" },
  { name: "Duschgel",      dept: "Hygien" },

  // --- Godis ---
  { name: "Chokladkaka",   dept: "Godis" },
  { name: "Gelégodis",     dept: "Godis" },
  { name: "Karameller",    dept: "Godis" },

  // --- bak ---
  { name: "Bakpulver",     dept: "bak" },
  { name: "Vaniljsocker",  dept: "bak" },
  { name: "Jäst",          dept: "bak" },
  { name: "Kakao",         dept: "bak" },

  // --- Chips & Snacks ---
  { name: "Chips",         dept: "Chips & Snacks" },
  { name: "Nötter",        dept: "Chips & Snacks" },
  { name: "Popcorn",       dept: "Chips & Snacks" },

  // --- Fika ---
  { name: "Kaffe",         dept: "Fika" },
  { name: "Te",            dept: "Fika" },
  { name: "Kanelbulle",    dept: "Fika" },

  // --- Pålägg ---
  { name: "Skinka",        dept: "Pålägg" },
  { name: "Leverpastej",   dept: "Pålägg" },
  { name: "Ostskivor",     dept: "Pålägg" },

  // --- Dryck ---
  { name: "Läsk",          dept: "Dryck" },
  { name: "Juice",         dept: "Dryck" },
  { name: "Mineralvatten", dept: "Dryck" },
  { name: "Energidryck",   dept: "Dryck" },

  // --- Snabbmat  ---
  { name: "Färdigpizza",   dept: "Snabbmat" },
  { name: "Lasagne (fryst)", dept: "Snabbmat" },
  { name: "Färdigrätt",    dept: "Snabbmat" },

  // --- Blommor ---
  { name: "Rosor",         dept: "Blommor" },
  { name: "Tulpaner",      dept: "Blommor" },
];

export const DEPT_ICONS: Record<string, string> = {
  "Mejeri": "🥛",
  "Frukt & Grönt": "🍎",
  "Bröd": "🥐",
  "Tacos / Tex-Mex": "🌮",
  "Kyl / Kött": "🥩",
  "Frys/Kött": "❄️",
  "Pasta / Konserver / Ägg": "🍝",
  "Världens mat": "🌍",
  "Städ & Tvätt": "🧼",
  "Djur": "🐾",
  "Hygien": "🧴",
  "Godis": "🍬",
  "bak": "🧁",
  "Chips & Snacks": "🍟",
  "Fika": "☕️",
  "Pålägg": "🥪",
  "Dryck": "🥤",
  "Snabbmat": "🍕",
  "Kassa": "💳",
  "Snabbkassa": "⚡️",
  "Blommor": "🌸",
};

