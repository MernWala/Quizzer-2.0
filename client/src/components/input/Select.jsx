const Select = ({
    label = "Select an option",
    id = "select-id",
    required = false,
    disabled = false,
    options = [],
    autoComplete = "",
    className = "",
    onChange = (e) => { }
}) => {
    return (
        <label htmlFor={id} className={`border border-neutral-300 rounded-md px-3 pt-5 pb-2 bg-neutral-50 flex flex-col custom-input-container w-full relative ${className}`}>
            <select
                id={id}
                required={required}
                disabled={disabled}
                defaultValue=""
                autoComplete={autoComplete}
                className="bg-transparent outline-none text-neutral-700 w-full text-sm appearance-none"
                onChange={onChange}
            >
                <option value="" disabled hidden>- Select -</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <label htmlFor={id} className="text-sm text-neutral-500 truncate w-[80%] block">
                {label}
            </label>
        </label>
    );
};

export default Select;
