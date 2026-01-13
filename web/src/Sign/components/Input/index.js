import "./style.css";

function Input({
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    error,
    errorMessage,
    ...props
}) {
    const inputProps = { type, name, placeholder, onChange, ...props };
    if (type !== "file") {
        inputProps.value = value;
    }

    return (
        <label>
            <input className={`Input${error ? ' error' : ''}`}
                {...inputProps}
            />
            {error && errorMessage && (
                <p className="error-message" id={`error-message-${name}`}>
                    {errorMessage}
                </p>
            )}
        </label>
    );
}

export default Input;
