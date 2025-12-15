import Modal from "./Modal";

/**
 * Enkel modal-prop: bara öppet/stängt + onClose
 */
interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Inställningsmodal behöver även dark mode-data
 */
interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggle: () => void;
}

/* 
   InfoModal - (startsidan)
*/
export function InfoModal({ open, onClose }: SimpleModalProps) {
  return (
    <Modal open={open} title="Välkommen" onClose={onClose}>
      <div className="infoContent">
        <p>
          Välkommen till butikskartan! Här kan du välja butik, söka efter varor
          och se var i butiken de finns.
        </p>
      </div>
    </Modal>
  );
}

/* 
   MapInfoModal – (kartskärmen)
*/
export function MapInfoModal({ open, onClose }: SimpleModalProps) {
  return (
    <Modal open={open} title="Tips för kartan" onClose={onClose}>
      <div className="infoContent">
        <p>Så här använder du kartan:</p>
        <ul style={{ paddingLeft: "1.2rem", margin: "6px 0 0" }}>
          <li>📍 Tryck på kartan för att välja din startposition.</li>
          <li>🔍 Skriv en vara eller avdelning i sökrutan längst ned.</li>
          <li>✨ Gulmarkerade hyllor visar var dina träffar finns.</li>
          <li>   Den blå punkten visar var du startar, och linjen visar vägen.</li>
        </ul>
      </div>
    </Modal>
  );
}

/* ------------------------------------------
   SettingsModal // mörkt läge 
------------------------------------------- */
export function SettingsModal({
  open,
  onClose,
  isDarkMode,
  onToggle,
}: SettingsModalProps) {
  return (
    <Modal open={open} title="Inställningar" onClose={onClose}>
      <div className="settingsContent">
        <p>Anpassa hur appen ser ut.</p>

        {/* Dark mode-knapp */}
        <label className="settingRow" style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>Mörkt läge</span>
            <span style={{ fontSize: "1.2em" }}>
              {isDarkMode ? "🌙" : "☀️"}
            </span>
          </div>

          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={onToggle}
            style={{ transform: "scale(1.3)", cursor: "pointer" }}
          />
        </label>
      </div>
    </Modal>
  );
}
