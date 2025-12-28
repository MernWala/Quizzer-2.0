import React, { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const Input = (props) => {

  const [eye, setEye] = useState(false)

  const {
    label = "Username, email, or Mobile Number",
    id = "test",
    required = false,
    type = "text",
    disabled = false,
    autoComplete = "",
    className = "",
    onChange = (e) => { },
    ...restOfProps
  } = props

  return (
    <label htmlFor={id} className={`border border-neutral-300 rounded-md px-3 pt-5 pb-2 bg-neutral-50 flex flex-col custom-input-container w-full relative text-left ${className}`}>
      <input
        type={eye ? 'text' : type}
        id={id}
        name={id}
        required={required}
        disabled={disabled}
        placeholder=" "
        className="bg-transparent outline-none text-neutral-700 w-full text-sm"
        autoComplete={autoComplete}
        style={{ '--pass': type === "password" ? '25px' : 0 }}
        onChange={onChange}
        {...restOfProps}
      />

      <label htmlFor={id} className="text-sm text-neutral-500 truncate w-[80%] block">
        {label}
      </label>

      {type === "password" &&
        <button type="button" className="absolute text-neutral-500 right-2 bg-white pe-2" onClick={() => setEye(!eye)}>
          {eye ?
            <LuEyeClosed />
            :
            <LuEye />
          }
        </button>
      }
    </label>
  );
};

export default Input;
