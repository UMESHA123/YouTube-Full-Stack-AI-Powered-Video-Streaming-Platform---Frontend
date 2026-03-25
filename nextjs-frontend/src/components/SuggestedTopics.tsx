"use client";

import { getSuggestedVideoTopics } from "@/APIS";
import { useYoutubecontext } from "@/contextAPI/YoutubeContextAPI";
import React, { useEffect } from "react";

const SuggestedTopics = () => {
    const {
        selectedTopic,
        setSelectedTopic,
        setSelectedTopicVideoIds,
        suggestedTopics,
        setSuggestedTopics,
    } = useYoutubecontext();

    useEffect(() => {
        if (suggestedTopics.length > 0) return;
        const loadTopics = async () => {
            try {
                const response = await getSuggestedVideoTopics();
                if (response?.statusCode === 200) {
                    setSuggestedTopics(response?.data || []);
                }
            } catch (error) {
                console.log("Error loading suggested topics: ", error);
            }
        };
        loadTopics();
    }, [suggestedTopics.length, setSuggestedTopics]);

    return (
        <div>
            <div className="hidden xl:block w-80 shrink-0">
                <div className="sticky top-24 space-y-4">
                    {/* Topics Box */}
                    <div className="border border-[#272727] rounded-xl p-4 bg-[#0f0f0f]">
                        <h3 className="font-bold mb-4 text-gray-200 text-lg">Suggested Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setSelectedTopic("");
                                    setSelectedTopicVideoIds([]);
                                }}
                                className={`text-xs px-3 py-1.5 rounded-lg transition-colors border ${
                                    !selectedTopic
                                        ? "bg-white text-black border-white"
                                        : "bg-[#272727] text-gray-300 hover:text-white hover:bg-[#3f3f3f] border-transparent hover:border-[#4f4f4f]"
                                }`}
                            >
                                All
                            </button>
                            {suggestedTopics.slice(0, 20).map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => {
                                        setSelectedTopic(topic.label);
                                        setSelectedTopicVideoIds(topic.videoIds || []);
                                    }}
                                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors border ${
                                        selectedTopic?.toLowerCase() === topic.label.toLowerCase()
                                            ? "bg-white text-black border-white"
                                            : "bg-[#272727] text-gray-300 hover:text-white hover:bg-[#3f3f3f] border-transparent hover:border-[#4f4f4f]"
                                    }`}
                                >
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Premium Promo */}
                    <div className="p-4 rounded-xl bg-linear-to-br from-[#1f1f1f] to-[#121212] border border-[#272727]">
                        <h3 className="font-bold text-gray-100 mb-2">TubeClone Premium</h3>
                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                            Enjoy ad-free videos, background play, and offline downloads.
                        </p>
                        <button className="w-full py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors">
                            Get Premium
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#aaa] font-medium px-1">
                        <a href="#" className="hover:text-white">About</a>
                        <a href="#" className="hover:text-white">Press</a>
                        <a href="#" className="hover:text-white">Copyright</a>
                        <a href="#" className="hover:text-white">Contact us</a>
                        <a href="#" className="hover:text-white">Creators</a>
                        <a href="#" className="hover:text-white">Advertise</a>
                        <a href="#" className="hover:text-white">Developers</a>
                    </div>
                    <div className="px-1 text-[12px] text-[#717171]">
                        © 2025 YouTube Clone
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SuggestedTopics
