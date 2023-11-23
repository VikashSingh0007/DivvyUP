import React from "react";

const InputBox = ({ type, label, values, selectedValue, onValueChange }) => {
  return (
    <div className="my-2">
      <label htmlFor={type} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        className="w-full px-2 py-2 md:px-3 mt-1 rounded border border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200  focus:ring-offset-0"
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {values.map((value) => (
          <option
            key={value}
            value={value}
            className="w-full px-2 py-2 md:px-3 mt-1 rounded border border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200  focus:ring-offset-0"
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputBox;
