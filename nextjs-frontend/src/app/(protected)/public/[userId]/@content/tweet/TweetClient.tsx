"use client"
import React, { useEffect, useState } from 'react'
import { CommunityFeedPost } from '@/types/types';
import { GetUserTweets } from '@/APIS';
import { PublicCommunityPostCard } from '@/components/PublicCommunityPostCard';
import { useParams } from 'next/navigation';

const PublicTweetClient = () => {
    const params = useParams();
    const userId = params.userId as string;
    console.log(userId)
    const [posts, setPosts] = useState<CommunityFeedPost[]>([])

    useEffect(() => {
        try {
            const getUserPublicChannelCommunityPost = async (userId: string) => {
                const response = await GetUserTweets(userId);

                if (response?.statusCode === 200) {
                    console.log("channel user tweets: ", response);
                    setPosts([...response?.data])
                } else {
                    console.log("error response from the get user tweet: ");
                }
            }
            getUserPublicChannelCommunityPost(userId);
        } catch (error) {
            console.log("Error in community feed useeffect: ", error)
        }

    }, [userId])

    return (
            <div className="max-w-2xl mx-auto pb-10">
            {posts.map((post) => (
                <PublicCommunityPostCard key={post?._id} post={post} />
            ))}
        </div>
    )
}

export default PublicTweetClient
