import { useMemo, useState } from "react";
import { InfoModal, SettingsModal } from "../components/InfoAndSettingsModals";
import type { Store } from "../types";

interface StoreSelectScreenProps {
  stores?: Store[];
  query: string;
  setQuery: (value: string) => void;
  onSelectStore: (store: Store) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

/**
 * Skärmen där användaren väljer butik:
 * - toppbar med info- & inställningsknappar
 * - sökfält för butiker
 * - lista med filtrerade butiker
 */
export default function StoreSelectScreen({
  stores = [],
  query,
  setQuery,
  onSelectStore,
  isDarkMode,
  onToggleDarkMode,
}: StoreSelectScreenProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Filtrerar butiker baserat på söksträngen
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return stores;
    return stores.filter((s) => s.name.toLowerCase().includes(q));
  }, [stores, query]);

  return (
    <div className="screen">
      {/* Toppbar med info- och inställningsknapp */}
      <div className="top-bar">
        {/* Info-knapp */}
        <button
          className="icon-btn"
          onClick={() => setInfoOpen(true)}
          aria-label="Info"
          type="button"
        >
          ℹ
        </button>

        <div className="top-title">Butikskarta</div>

        {/* Inställningar-knapp */}
        <button
          className="icon-btn"
          onClick={() => setSettingsOpen(true)}
          aria-label="Inställningar"
          type="button"
        >
          ⚙️
        </button>
      </div>

      <div className="screenBody">
        <div className="searchBlock">
          <label htmlFor="storeSearch" className="searchLabel">
            Välj butik
          </label>

          <div className="search-wrapper">
            <input
              id="storeSearch"
              className="search-input"
              placeholder="Skriv t.ex. ICA Maxi…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-icon-btn" aria-label="Sök" type="button">
              🔎
            </button>
          </div>

          <div className="section-title">Nära dig</div>

          {/* Lista med filtrerade butiker */}
          <div className="store-list">
            {filtered.length === 0 && (
              <div className="no-results">
                Inga butiker matchar sökningen.
              </div>
            )}

            {filtered.map((s) => (
              <button
                key={s.id ?? s.name}
                className="store-card"
                onClick={() => onSelectStore(s)}
                aria-label={`Välj ${s.name}`}
                type="button"
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  {s.note && (
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{s.note}</div>
                  )}
                </div>

                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {s.distance ?? ""}
                  {s.distance ? " km" : ""}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info-modal (på/av) */}
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />

      {/* Inställningsmodal med dark mode-växlare */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggle={onToggleDarkMode}
      />
    </div>
  );
}
