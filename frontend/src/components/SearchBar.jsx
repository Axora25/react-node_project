// frontend/src/components/SearchBar.jsx
import React from "react";

export default function SearchBar({ value, onChange, placeholder = "Search subsidies..." }) {
  return (
    <div className="w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border-2 border-gray-600 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
}
