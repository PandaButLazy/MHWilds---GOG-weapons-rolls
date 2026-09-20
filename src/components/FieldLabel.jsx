export function FieldLabel({ iconUrl, children }) {
  return (
    <span className="field-label">
      {iconUrl && <img className="field-icon" src={iconUrl} alt="" />}
      {children}
    </span>
  )
}
