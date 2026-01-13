import "./style.css";

function Textarea({
  name,
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
  ...props
}) {
  return (
    <label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "error" : ""}
        {...props}
      />
      {error && errorMessage && (
        <p className="error-message" id={`error-message-${name}`}>
          {errorMessage}
        </p>
      )}
    </label>
  );
}

export default Textarea;
