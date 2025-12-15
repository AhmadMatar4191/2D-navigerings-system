import type { Store } from "../types";

/**
 * Statisk lista med butiker.
 */
export const STORES: Store[] = [
  {
    id: "ica-maxi",
    name: "ICA Maxi Stormarknad",
    distance: 1.2,
    note: "Öppet till 22",
  },
  {
    id: "hemkop-syd",
    name: "Hemköp Syd",
    distance: 2.8,
    note: "Öppet till 21",
  },
  {
    id: "coop-norra",
    name: "Coop Norra",
    distance: 4.1,
    note: "Öppet till 22",
  },
  {
    id: "willys-central",
    name: "Willys Central",
    distance: 5.5,
    note: "Öppet till 20",
  },
  {
    id: "lidl-östra",
    name: "Lidl Östra",
    distance: 6.3,
    note: "Öppet till 21",
  },
];
