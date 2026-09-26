const PATHS = {
  attack: (
    <>
      <path
        d="M6 18L17 7M17 7h-4M17 7v4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  affinity: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </>
  ),
  element: (
    <path
      d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-1-2-1-3 2 1 3 3 3 5a5 5 0 01-10 0c0-5 3-7 5-11z"
      fill="currentColor"
    />
  ),
}

export function DeviceIcon({ type, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="device-icon"
    >
      {PATHS[type]}
    </svg>
  )
}
