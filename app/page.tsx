"use client";

import React, { useState } from "react";
import TabsSidebar from "./components/TabsSidebar";
import ExperienceWriter from "./components/generators/ExperienceWriter";
import PostWriter from "./components/generators/PostWriter";
import HeadlineGenerator from "./components/generators/HeadlineGenerator";
import HashtagGenerator from "./components/generators/HashtagGenerator";
import AboutGenerator from "./components/generators/AboutGenerator";
import { Menu, X } from "lucide-react";

export default function HomePage() {
  const tabs = [
    "Headline Generator",
    "About Generator",
    "Experience Writer",
    "Post Writer",
    "Hashtag Generator",
  ];

  const [active, setActive] = useState(tabs[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveTab = () => {
    switch (active) {
      case "Headline Generator":
        return <HeadlineGenerator />;
      case "Experience Writer":
        return <ExperienceWriter />;
      case "Post Writer":
        return <PostWriter />;
      case "Hashtag Generator":
        return <HashtagGenerator />;
      case "About Generator":
        return <AboutGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar */}
      <div className="md:w-72 relative">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">💼</span>
            LinkedIn AI Toolkit
          </h3>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar content */}
        <div
          className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 md:block transition-all duration-300 shadow-2xl ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <TabsSidebar
            active={active}
            setActive={(tab) => {
              setActive(tab);
              setSidebarOpen(false);
            }}
            tabs={tabs}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}
