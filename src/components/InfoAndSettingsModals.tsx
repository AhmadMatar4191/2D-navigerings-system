// src/components/InfoAndSettingsModals.tsx
import Modal from "./Modal";

// Interface för enkla modaler (bara öppna/stäng)
interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

// Interface för inställningar (behöver dark mode data)
interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggle: () => void;
}

/* ------------------------------------------
   InfoModal
------------------------------------------- */
export function InfoModal({ open, onClose }: InfoModalProps) {
  return (
    <Modal open={open} title="Välkommen" onClose={onClose}>
      <div className="infoContent">
        <p>
          Välkommen till butikskartan! Här kan du söka efter varor, filtrera kategorier och se var i
          butiken du hittar det du behöver.
        </p>
        <p>Tips: Tryck på en avdelning för att bara se varor i den kategorin.</p>
      </div>
    </Modal>
  );
}

/* ------------------------------------------
   SettingsModal
------------------------------------------- */
// 👇 Här måste vi ta emot 'isDarkMode' och 'onToggle' i måsvingarna!
export function SettingsModal({ open, onClose, isDarkMode, onToggle }: SettingsModalProps) {
  return (
    <Modal open={open} title="Inställningar" onClose={onClose}>
      <div className="settingsContent">
        <p>Anpassa appens utseende.</p>

        {/* DARK MODE KNAPP */}
        <label className="settingRow" style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Mörkt läge</span>
            <span style={{ fontSize: "1.2em" }}>{isDarkMode ? "🌙" : "☀️"}</span>
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