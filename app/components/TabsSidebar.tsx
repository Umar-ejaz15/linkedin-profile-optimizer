"use client";

import React from "react";
import { FileText, Briefcase, Pencil, Hash, User } from "lucide-react";

interface TabsSidebarProps {
  active: string;
  setActive: (tab: string) => void;
  tabs: string[];
}

const iconMap: Record<string, React.ReactNode> = {
  "Headline Generator": <User size={20} />,
  "About Generator": <FileText size={20} />,
  "Experience Writer": <Briefcase size={20} />,
  "Post Writer": <Pencil size={20} />,
  "Hashtag Generator": <Hash size={20} />,
};

export default function TabsSidebar({ active, setActive, tabs }: TabsSidebarProps) {
  return (
    <aside className="w-72 min-h-screen border-r border-slate-700/50 p-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="hidden md:block mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          LinkedIn AI Toolkit
        </h3>
        <p className="text-sm text-slate-400">
          Supercharge your LinkedIn presence
        </p>
      </div>

      <ul className="space-y-2">
        {tabs.map((t) => (
          <li key={t}>
            <button
              onClick={() => setActive(t)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group
                ${
                  active === t
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-900/50 scale-105"
                    : "hover:bg-slate-700/50 hover:translate-x-1"
                }`}
            >
              <span className={`transition-transform ${active === t ? "scale-110" : "group-hover:scale-110"}`}>
                {iconMap[t]}
              </span>
              <span className="text-sm">{t}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <p className="text-xs text-slate-400 leading-relaxed">
          💡 Each tool uses AI to generate professional LinkedIn content tailored to your needs.
        </p>
      </div>
    </aside>
  );
}
