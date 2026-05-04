// Dark overlay wrapper used by every modal.
// Next.js migration: export function ModalOverlay(...)

function ModalOverlay({ children, onClose, center = false }) {
  const isMobile = window.innerWidth < 640;
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:       'fixed',
        inset:           0,
        zIndex:          100,
        background:     'rgba(13,13,40,0.82)',
        display:        'flex',
        alignItems:     (!isMobile || center) ? 'center' : 'flex-end',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

Object.assign(window, { ModalOverlay });
