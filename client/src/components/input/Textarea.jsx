import React from "react";

const Textarea = (props) => {

    const {
        label = "Enter your message",
        id = "textarea",
        required = false,
        disabled = false,
        className = "",
        value,
        onChange,
        ...restProps
    } = props

    return (
        <label
            htmlFor={id}
            className={`border border-neutral-300 rounded-md px-3 pt-5 pb-2 bg-neutral-50 flex flex-col custom-input-container w-full relative text-left ${className}`}
        >
            <textarea
                id={id}
                required={required}
                disabled={disabled}
                placeholder=" "
                value={value}
                name={id}
                className="bg-transparent outline-none text-neutral-700 w-full text-sm resize-none min-h-[100px] textarea-custom"
                onChange={onChange}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                {...restProps}
            />
            <label htmlFor={id} className="text-sm text-neutral-500 truncate w-[80%] block">
                {label}
            </label>
        </label>
    );
};

export default Textarea;
