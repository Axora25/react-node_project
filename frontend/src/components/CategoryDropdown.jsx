// frontend/src/components/CategoryDropdown.jsx
import React from "react";

export default function CategoryDropdown({ categories = [], value, onChange }) {
  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-2 border-gray-600 bg-transparent px-4 py-3 text-white focus:outline-none"
      >
        <option value="all">All Categories</option>
        {categories.map((c, idx) => {
          // categories may be objects or strings
          const label = typeof c === "string" ? c : c.name || c.title || JSON.stringify(c);
          return (
            <option key={idx} value={label}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
