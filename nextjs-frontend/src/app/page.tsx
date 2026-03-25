import App from "@/app/_App";
import Categories from "@/components/Categories";
import SuggestedTopics from "@/components/SuggestedTopics";
import VideosGrid from "@/components/VideosGrid";
import React from "react";

export default function Home() {
  return (
    <App>
      <React.Fragment>
        <Categories />
        <div className="flex flex-col xl:flex-row gap-6">
          <VideosGrid />
          <SuggestedTopics />
        </div>
      </React.Fragment>
    </App>
  );
}
