// src/App.tsx
import { useMemo, useState } from "react";
import StoreSelectScreen from "./screens/StoreSelectScreen";
import StoreMapScreen from "./screens/StoreMapScreen";

import { DEPARTMENTS } from "./data/departments";
import { PRODUCTS } from "./data/products";
import type { Store, Department, Product } from "./types";

const STORES: Store[] = [
  {
    id: "ica-maxi",
    name: "ICA Maxi Garnisonen",
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
];

export default function App() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeQuery, setStoreQuery] = useState<string>("");

  const departments = useMemo<Department[]>(() => DEPARTMENTS, []);
  const products = useMemo<Product[]>(() => PRODUCTS, []);

  return (
    <div className="app-shell">
      <div className="phone">
        {!selectedStore ? (
          <>
            {/* Startsida */}
            <StoreSelectScreen
              stores={STORES}
              query={storeQuery}
              setQuery={setStoreQuery}
              onSelectStore={setSelectedStore}
            />
          </>
        ) : (
          <StoreMapScreen
            store={selectedStore}
            departments={departments}
            products={products}
            onBack={() => setSelectedStore(null)}
          />
        )}
      </div>
    </div>
  );
}
