// src/components/InfoAndSettingsModals.tsx
import Modal from "./Modal";

interface BasicModalProps {
  open: boolean;
  onClose: () => void;
}

/* ------------------------------------------
   InfoModal – visar välkomst/info-text
------------------------------------------- */
export function InfoModal({ open, onClose }: BasicModalProps) {
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
   SettingsModal – plats för framtida inställningar
------------------------------------------- */
export function SettingsModal({ open, onClose }: BasicModalProps) {
  return (
    <Modal open={open} title="Inställningar" onClose={onClose}>
      <div className="settingsContent">
        <p>Här kan du lägga till framtida inställningar (t.ex. tema, språk, mm).</p>

        <label className="settingRow">
          <span>Visa avstånd till butiker</span>
          <input type="checkbox" />
        </label>

        <label className="settingRow">
          <span>Kompakt listvy</span>
          <input type="checkbox" />
        </label>
      </div>
    </Modal>
  );
}
