import { useEffect, useMemo, useState } from "react";
import StoreSelectScreen from "./screens/StoreSelectScreen";
import StoreMapScreen from "./screens/StoreMapScreen";
import { DEPARTMENTS } from "./data/departments";
import { PRODUCTS } from "./data/products";
import { STORES } from "./data/stores";
import type { Store } from "./types";

type Screen = "select" | "map";

const STORAGE_KEYS = {
  darkMode: "butiksmap-darkmode",
  lastStoreId: "butiksmap-last-store-id",
} as const;

// Läser initialt darkmode läge från localStorage eller systeminställning
function loadInitialDarkMode(): boolean {
  if (typeof window === "undefined") return false;

  const stored = window.localStorage.getItem(STORAGE_KEYS.darkMode);
  if (stored === "true") return true;
  if (stored === "false") return false;

  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? true
    : false;
}

// Hämtar senast valda butik från localStorage (eller första i listan)
function loadInitialStore(): Store | null {
  // SSR-skydd + fallback
  if (typeof window === "undefined") return STORES[0] ?? null;

  const lastId = window.localStorage.getItem(STORAGE_KEYS.lastStoreId);
  if (!lastId) return STORES[0] ?? null;

  const match = STORES.find((s) => s.id === lastId);
  return match ?? STORES[0] ?? null;
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(loadInitialDarkMode);
  const [screen, setScreen] = useState<Screen>("select");
  const [selectedStore, setSelectedStore] = useState<Store | null>(
    loadInitialStore
  );
  const [storeQuery, setStoreQuery] = useState("");

  // Uppdatera body-klassen när dark mode ändras
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    window.localStorage.setItem(STORAGE_KEYS.darkMode, String(isDarkMode));
  }, [isDarkMode]);

  // Spara senast valda butik i localStorage
  useEffect(() => {
    if (selectedStore) {
      window.localStorage.setItem(STORAGE_KEYS.lastStoreId, selectedStore.id);
    }
  }, [selectedStore]);

  const selectedStoreSafe = useMemo(
    () => selectedStore ?? STORES[0] ?? null,
    [selectedStore]
  );

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setScreen("map");
  };

  const handleBackToSelect = () => {
    setScreen("select");
  };

  return (
    <div className="app-shell">
      <div className="phone">
        {screen === "select" ? (
          <StoreSelectScreen
            stores={STORES}
            query={storeQuery}
            setQuery={setStoreQuery}
            onSelectStore={handleSelectStore}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          />
        ) : (
          <StoreMapScreen
            store={selectedStoreSafe}
            departments={DEPARTMENTS}
            products={PRODUCTS}
            onBack={handleBackToSelect}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}
