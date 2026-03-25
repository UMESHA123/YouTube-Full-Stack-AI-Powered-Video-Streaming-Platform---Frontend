"use client"
import { getSuggestedVideoTopics } from '@/APIS';
import { useYoutubecontext } from '@/contextAPI/YoutubeContextAPI';
import React, { useEffect } from 'react'

const Categories = () => {
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

    const categoryItems = [
        { id: "all", label: "All", videoIds: [] as string[] },
        ...suggestedTopics.slice(0, 12).map((topic) => ({
            id: topic.id,
            label: topic.label,
            videoIds: topic.videoIds,
        })),
    ];

    const activeTopicId = selectedTopic ? selectedTopic.toLowerCase() : "all";

    return (
        <div>
            <div className="flex gap-3 overflow-x-auto pb-4 mb-4 custom-scrollbar sticky top-14 bg-[#0f0f0f] z-10 pt-2">
                {categoryItems.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            if (cat.id === "all") {
                                setSelectedTopic("");
                                setSelectedTopicVideoIds([]);
                            } else {
                                setSelectedTopic(cat.label);
                                setSelectedTopicVideoIds(cat.videoIds || []);
                            }
                        }}
                        className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                  ${(cat.id === "all" ? activeTopicId === "all" : activeTopicId === cat.id)
                                ? 'bg-white text-black'
                                : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'}
                `}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Categories
