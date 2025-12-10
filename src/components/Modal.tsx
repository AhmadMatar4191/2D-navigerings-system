import type { ReactNode, MouseEvent } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

/**
 * Enkel modal-komponent med overlay, titelrad och innehåll.
 * Visas bara när `open` är true.
 */
export default function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  // Klick på overlay → stäng modalen
  const handleOverlayClick = () => {
    onClose();
  };

  // Stoppar klick inne i modalen från att bubbla ut till overlay
  const handleInnerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="modal"
        onClick={handleInnerClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>

          <button onClick={onClose} aria-label="Stäng" type="button">
            x
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
