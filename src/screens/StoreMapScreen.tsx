// src/screens/StoreMapScreen.tsx
import { useMemo, useState } from "react";
import MapCanvas from "../components/MapCanvas";
import BottomSheet from "../components/BottomSheet";
import type { Store, Department, Product } from "../types";

interface StoreMapScreenProps {
  store: Store | null;
  departments: Department[];
  products: Product[];
  onBack: () => void;
}

export default function StoreMapScreen({
  store,
  departments = [],
  products = [],
  onBack,
}: StoreMapScreenProps) {
  const [query, setQuery] = useState("");

  // vilka avdelningar ska lysa
  const highlighted = useMemo(() => {
    const s = query.trim().toLowerCase();
    const set = new Set<string>();
    if (s) {
      for (const d of departments) {
        if (d.name.toLowerCase().includes(s)) set.add(d.name.toLowerCase());
      }
    }
    return set;
  }, [query, departments]);

  // produktsök – visas som små rutor i sheet
  const results = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return [];
    return products.filter(
      (p) => p.name.toLowerCase().includes(s) || p.dept.toLowerCase().includes(s)
    );
  }, [query, products]);

  // klick på chip/resultat → uppdatera query (så kartan highlightar)
  function pickDept(name: string) {
    setQuery(name);
    // scrolla upp mot kartan på små skärmar
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="screen">
      <div className="store-map-top">
        <button className="back-btn" onClick={onBack} aria-label="Tillbaka" type="button">
          ←
        </button>
        <div className="store-name">{store?.name ?? "Butik"}</div>
      </div>

      <div className="map-area">
        {/* Korten/stilen följer er befintliga CSS (vit bakgrund, rundade hörn) */}
        <MapCanvas highlighted={highlighted} departments={departments} />
      </div>

      {/* Dragbar panel (vi använder vår komponent som flyttar med translateY) */}
      <BottomSheet
        query={query}
        setQuery={setQuery}
        onPickDept={pickDept}
        results={results}
      />
    </div>
  );
}
