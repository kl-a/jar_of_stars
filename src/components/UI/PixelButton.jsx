// Pixel-art style button with press-down animation.
// Next.js migration: export function PixelButton(...)

function PixelButton({
  children,
  onClick,
  color       = '#ffeaa7',
  shadowColor = '#c9a84c',
  textColor   = '#2d2b3d',
  style       = {},
  disabled    = false,
  small       = false,
}) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={()    => setPressed(false)}
      onMouseLeave={()  => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={()   => setPressed(false)}
      style={{
        fontFamily:  "'Fredoka'",
        fontSize:    small ? 13 : 16,
        color:       textColor,
        background:  disabled ? '#555' : color,
        border:      `2px solid ${disabled ? '#333' : shadowColor}`,
        borderRadius: 8,
        padding:     small ? '8px 14px' : '12px 20px',
        cursor:      disabled ? 'not-allowed' : 'pointer',
        boxShadow:   pressed ? `1px 1px 0px ${shadowColor}` : `3px 3px 0px ${shadowColor}`,
        transform:   pressed ? 'translate(2px,2px)' : 'translate(0,0)',
        transition:  'box-shadow 0.05s, transform 0.05s',
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:             8,
        whiteSpace:  'nowrap',
        lineHeight:   1.6,
        opacity:     disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

Object.assign(window, { PixelButton });
