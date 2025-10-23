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
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-64">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-between items-center p-4 bg-slate-900 text-slate-100">
          <h3 className="font-semibold text-lg">LinkedIn AI Toolkit</h3>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar content */}
        <div
          className={`bg-slate-900 text-slate-100 md:block transition-transform duration-300 ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <TabsSidebar
            active={active}
            setActive={(tab) => {
              setActive(tab);
              setSidebarOpen(false); // close on mobile
            }}
            tabs={tabs}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto bg-white">
        {renderActiveTab()}
      </main>
    </div>
  );
}
