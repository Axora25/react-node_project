// frontend/src/components/SubsidyCard.jsx
import React from "react";
// import { ExternalLinkIcon } from "./Icons"; // optional — if you don't have, just render a text link

export default function SubsidyCard({ item }) {
  // adapt field names depending on your data shape
  const title = item.title || item.name || item.program || "Untitled";
  const desc = item.description || item.short_description || item.summary || "";
  const status = (item.status || "Active").toString();
  const category = item.category || item.category_name || (item.tags && item.tags[0]) || "";
  const location = item.state || item.region || "All India";
  const grant = item.grant || item.subsidy || item.amount || item.benefit || "Varies per asset";
  const eligibility = item.eligibility || item.eligibility_criteria || "";

  return (
    <div className="bg-[#0b1020] border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div className="text-xs rounded-full px-3 py-1 bg-green-700/40 text-green-300 font-semibold">
          {category}
        </div>
        <div className={`text-sm font-medium ${status.toLowerCase()==="active" ? "text-green-400" : "text-gray-400"}`}>
          {status}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-300 mb-3">{desc}</p>

      <ul className="text-sm text-gray-200 mb-3 space-y-1">
        <li>🟩 {grant}</li>
        <li>📍 {location}</li>
      </ul>

      {eligibility ? (
        <div className="text-sm text-gray-300 mb-4">
          <div className="font-semibold">Eligibility:</div>
          <div>{eligibility}</div>
        </div>
      ) : null}

      <div className="flex gap-3 items-center">
        <button className="px-4 py-2 bg-lime-400 text-black font-semibold rounded hover:brightness-95">
          Apply Now
        </button>
        {/* If there's an external link present */}
        {item.link ? (
          <a href={item.link} target="_blank" rel="noreferrer" className="text-gray-400 underline text-sm">
            External
          </a>
        ) : null}
      </div>
    </div>
  );
}
