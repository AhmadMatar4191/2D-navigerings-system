// src/App.tsx
import { useEffect, useMemo, useState } from "react";
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


/* 
 77  git init
   78  git pull https://github.com/Antonclindgren/KOMA-PROJEKT.git
   90  git branch -m main master
   79  npm install
   80  git branch
   81  git add .
   83  git remote add origin https://github.com/Antonclindgren/KOMA-PROJEKT.git
   84  git commit -m "testing"
   85  git push origin master
*/





export default function App() {
  // 1. 👇 HÄR SKAPAR VI STATE FÖR DARK MODE
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 2. Denna effekt körs varje gång isDarkMode ändras
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeQuery, setStoreQuery] = useState<string>("");

  const departments = useMemo<Department[]>(() => DEPARTMENTS, []);
  const products = useMemo<Product[]>(() => PRODUCTS, []);

  return (
    <div className="app-shell">
      <div className="phone">
        {!selectedStore ? (
          <>
            <StoreSelectScreen
              stores={STORES}
              query={storeQuery}
              setQuery={setStoreQuery}
              onSelectStore={setSelectedStore}
              // Nu finns variablerna, så detta kommer fungera:
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
          </>
        ) : (
          <StoreMapScreen
            store={selectedStore}
            departments={departments}
            products={products}
            onBack={() => setSelectedStore(null)}
            isDarkMode={isDarkMode} // <--- LÄGG TILL DENNA
          />
        )}
      </div>
    </div>
  );
}