// src/screens/StoreMapScreen.tsx

import { useMemo, useState } from "react";
import MapCanvas from "../components/MapCanvas";
import BottomSheet from "../components/BottomSheet";
import type { Store, Department, Product } from "../types";
// 👇 1. LÄGG TILL IMPORTEN HÄR
import { findPath } from "../utils/pathfinder";

interface StoreMapScreenProps {
  store: Store | null;
  departments: Department[];
  products: Product[];
  onBack: () => void;
  isDarkMode: boolean; // <--- NY
}

export default function StoreMapScreen({
  store,
  departments = [],
  products = [],
  onBack,
  isDarkMode, // <--- Ta emot
}: StoreMapScreenProps) {
  const [query, setQuery] = useState("");

  // 👇 2. KLISTRA IN DIN KOD HÄR (HÖGST UPP I FUNKTIONEN)
  const [userPos, setUserPos] = useState<{r:number, c:number} | null>(null);
  
  const calculatedPath = useMemo(() => {
    if (!userPos || !query) return [];

    // Försök hitta avdelning direkt på namn
    let targetDept = departments.find(d => d.name.toLowerCase() === query.toLowerCase());

    // Om query inte är en avdelning, kolla om det är en produkt (t.ex. "Mjölk")
    // och hitta vilken avdelning den tillhör
    if (!targetDept) {
       const product = products.find(p => p.name.toLowerCase() === query.toLowerCase());
       if (product) {
         targetDept = departments.find(d => d.name === product.dept);
       }
    }
    
    if (targetDept) {
      return findPath(userPos, targetDept.name, departments);
    }
    return [];
  }, [userPos, query, departments, products]); 
  // 👆 (Jag la till 'products' i beroenden ovan för säkerhets skull)


  // ... HÄR KOMMER DIN GAMLA KOD (highlighted, results, pickDept) ...
  const highlighted = useMemo(() => { 
    /* ... din gamla kod ... */ 
    const s = query.trim().toLowerCase();
    const set = new Set<string>();
    if (s) {
      for (const d of departments) {
        if (d.name.toLowerCase().includes(s)) set.add(d.name.toLowerCase());
      }
    }
    return set;
  }, [query, departments]);

  const results = useMemo(() => {
     /* ... din gamla kod ... */
    const s = query.trim().toLowerCase();
    if (!s) return [];
    return products.filter(
      (p) => p.name.toLowerCase().includes(s) || p.dept.toLowerCase().includes(s)
    );
  }, [query, products]);

  function pickDept(name: string) {
    setQuery(name);
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

      <div className="map-area" style={{ position: 'relative' }}>
        
        {/* 👇 3. UPPDATERA MAPCANVAS HÄR */}
        <MapCanvas
          highlighted={highlighted}
          departments={departments}
          blueprintOffset={{ x: 0, y: -15 }}
          
          // Lägg till de nya propsen här:
          userPosition={userPos}
          path={calculatedPath}
          onMapClick={(r, c) => setUserPos({ r, c })}
          isDarkMode={isDarkMode} // <--- Skicka vidare till Canvas
        />

        {/* (Valfritt) En liten ruta som hjälper användaren */}
        {!userPos && (
          <div style={{
            position: 'absolute', 
            top: 20, 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)', 
            color: '#fff', 
            padding: '6px 12px',
            borderRadius: 20, 
            fontSize: 12,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}>
            📍 Tryck på kartan för att starta
          </div>
        )}

      </div>

      <BottomSheet
        query={query}
        setQuery={setQuery}
        onPickDept={pickDept}
        results={results}
      />
    </div>
  );
}