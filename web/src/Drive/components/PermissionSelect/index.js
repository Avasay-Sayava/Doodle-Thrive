/**
 * PermissionSelect - generic dropdown for changing user permissions
 * @param {string} value - current role value
 * @param {Function} onChange - callback when role changes
 * @param {Array} options - available permission options
 * @param {boolean} disabled - disable select
 */
import "./style.css";

export default function PermissionSelect({
  value,
  onChange,
  options = [],
  disabled = false,
}) {
  return (
    <select
      className="permission-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
