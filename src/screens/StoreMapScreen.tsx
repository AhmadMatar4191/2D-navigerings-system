import { useMemo, useState } from "react";
import MapCanvas from "../components/MapCanvas";
import BottomSheet from "../components/BottomSheet";
import { MapInfoModal } from "../components/InfoAndSettingsModals";
import type { Store, Department, Product } from "../types";
import { findPath } from "../utils/pathfinder";

interface StoreMapScreenProps {
  store: Store | null;
  departments: Department[];
  products: Product[];
  onBack: () => void;
  isDarkMode: boolean;
}

/**
 * Skärmen som visar:
 * - vald butik (titelrad)
 * - kartan (MapCanvas)
 * - sök + kategorier i BottomSheet
 */
export default function StoreMapScreen({
  store,
  departments = [],
  products = [],
  onBack,
  isDarkMode,
}: StoreMapScreenProps) {
  // Söksträng i bottom sheet
  const [query, setQuery] = useState("");

  // Info-modal specifikt för kartan (MapInfoModal)
  const [infoOpen, setInfoOpen] = useState(false);

  // Användarens startposition på kartan (rad/kolumn)
  const [userPos, setUserPos] = useState<{ r: number; c: number } | null>(null);

  // Beräkna path från användarens position till vald avdelning/produkt
  const calculatedPath = useMemo(() => {
    if (!userPos || !query) return [];

    // 1) Försök hitta avdelning direkt på namn
    let targetDept = departments.find(
      (d) => d.name.toLowerCase() === query.toLowerCase()
    );

    // 2) Om query inte är en avdelning, försök hitta produkt → dess avdelning
    if (!targetDept) {
      const product = products.find(
        (p) => p.name.toLowerCase() === query.toLowerCase()
      );
      if (product) {
        targetDept = departments.find((d) => d.name === product.dept);
      }
    }

    // 3) Räkna ut path om vi hittat en avdelning
    if (targetDept) {
      return findPath(userPos, targetDept.name, departments);
    }
    return [];
  }, [userPos, query, departments, products]);

  // Vilka avdelningar ska highlightas baserat på söksträngen
  const highlighted = useMemo(() => {
    const s = query.trim().toLowerCase();
    const set = new Set<string>();

    if (s) {
      for (const d of departments) {
        if (d.name.toLowerCase().includes(s)) {
          set.add(d.name.toLowerCase());
        }
      }
    }

    return set;
  }, [query, departments]);

  // Produkter som matchar söksträngen
  const results = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return [];

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.dept.toLowerCase().includes(s)
    );
  }, [query, products]);

  // När en avdelning väljs via chips/resultat
  function pickDept(name: string) {
    setQuery(name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="screen">
      {/* Topprad: back-knapp, butiksnamn, info-knapp */}
      <div className="store-map-top">
        <button
          className="back-btn"
          onClick={onBack}
          aria-label="Tillbaka"
          type="button"
        >
          ←
        </button>

        <div className="store-name">{store?.name ?? "Butik"}</div>

        <button
          className="icon-btn"
          onClick={() => setInfoOpen(true)}
          aria-label="Info om kartan"
          type="button"
        >
          ℹ
        </button>
      </div>

      {/* Kartyta */}
      <div className="map-area" style={{ position: "relative" }}>
        <MapCanvas
          highlighted={highlighted}
          departments={departments}
          // Justera blueprintOffset om du vill flytta bakgrundsbilden
          blueprintOffset={{ x: 0, y: -9.2 }}
          userPosition={userPos}
          path={calculatedPath}
          onMapClick={(r, c) => setUserPos({ r, c })}
          isDarkMode={isDarkMode}
        />

        {/* Liten hjälp-bubbla tills användaren satt startposition */}
        {!userPos && (
          <div
            style={{
              position: "absolute",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            📍 Tryck på kartan för att starta navigering
          </div>
        )}
      </div>

      {/* BottomSheet med sök + avdelningar + resultat */}
      <BottomSheet
        query={query}
        setQuery={setQuery}
        onPickDept={pickDept}
        results={results}
      />

      {/* Info-modal specifik för kartan */}
      <MapInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
