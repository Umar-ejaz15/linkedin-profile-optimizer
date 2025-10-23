"use client";

import React, { useState } from "react";
import TabsSidebar from "./components/TabsSidebar";
import ExperienceWriter from "./components/generators/ExperienceWriter";
import PostWriter from "./components/generators/PostWriter";
import ProfileAnalyzer from "./components/generators/ProfileAnalyzer";
import HeadlineGenerator from "./components/generators/HeadlineGenerator";
export default function HomePage() {
  const tabs = [
    "Headline Generator",
    "Experience Writer",
    "Post Writer",
    "Profile Analyzer",
  ];

  const [active, setActive] = useState(tabs[0]);

  const renderActiveTab = () => {
    switch (active) {
      case "Headline Generator":
        return <HeadlineGenerator />;
      case "Experience Writer":
        return <ExperienceWriter />;
      case "Post Writer":
        return <PostWriter />;
     
      case "Profile Analyzer":
        return <ProfileAnalyzer />;
      default:
        return null;
    }
  };

  return (
      <div className="w-full min-h-screen mx-auto bg-white shadow-md rounded-2xl overflow-hidden flex">
        <TabsSidebar active={active} setActive={setActive} tabs={tabs} />
        <main className="flex-1 p-6">{renderActiveTab()}</main>
    </div>
  );
}
