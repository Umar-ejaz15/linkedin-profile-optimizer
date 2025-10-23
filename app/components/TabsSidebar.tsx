"use client";

import React from "react";

interface TabsSidebarProps {
  active: string;
  setActive: (tab: string) => void;
  tabs: string[];
}

export default function TabsSidebar({ active, setActive, tabs }: TabsSidebarProps) {
  return (
    <aside className="w-64 border-r p-4 bg-slate-900">
      <h3 className="text-xl font-semibold mb-4">LinkedIn AI Toolkit</h3>
      <ul className="space-y-2">
        {tabs.map((t) => (
          <li key={t}>
            <button
              onClick={() => setActive(t)}
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition ${
                active === t ? "bg-slate-200 font-medium" : ""
              }`}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-xs text-slate-900 border-t pt-4">
        <p>Each tab will open its own generator form with a separate API request.</p>
      </div>
    </aside>
  );
}
