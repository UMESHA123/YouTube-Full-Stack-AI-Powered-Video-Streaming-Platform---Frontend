"use client"
import React, { useEffect, useState } from 'react'
import { CommunityFeedPost } from '@/types/types'
import { CreateTweet, DeleteTweet, GetUserTweets } from '@/APIS'
import { useParams } from 'next/navigation'
import { PrivateCreatePost } from '@/components/PrivateCreatePost'
import { PrivateCommunityPostCard } from '@/components/PrivateCommunityPostCard'

const TweetClient = () => {
    const params = useParams();
    const userId = params.userId as string;

  const [posts, setPosts] = useState<CommunityFeedPost[]>([])
  const [tweetData, setTweetData] = useState("")
  
    useEffect(() => {
      try {
        const getUserPublicChannelCommunityPost = async (userId: string) => {
            const response = await GetUserTweets(userId);
  
            if(response?.statusCode === 200){
              console.log("channel user tweets: ", response);
              setPosts([ ...response?.data])
            }else{
              console.log("error response from the get user tweet: ");
            }
        }
        getUserPublicChannelCommunityPost(userId);
      } catch (error) {
        console.log("Error in community feed useeffect: ", error)
      }
      
    }, [userId])

    const createUserPost = async () => {
      try {
        const respose = await CreateTweet({
          content: tweetData
        });
        if(respose?.statusCode === 200){
          console.log("success: ", respose);
          setPosts((prevPost) => [respose?.data, ...prevPost])
        }else{
          console.log("error in create post method")
        }
      } catch (error) {
        console.log("error while creating a post: ", error);
      }
    }

    const deleteUserPost = async (tweetId: string) => {
      try {
        const response = await DeleteTweet(tweetId);
        if(response?.statusCode === 200){
          console.log("success: ", response);
          setPosts(() => posts.filter((post: CommunityFeedPost) => post?._id !== response?.data?._id))
        }else{
          console.log("error while deleting")
        }
      } catch (error) {
        console.log("error while deketing a user post: ", error);
      }
    }
  return (
    <div className="max-w-2xl mx-auto pb-10">
      {userId && <PrivateCreatePost createUserPost={createUserPost}  tweetData={tweetData} setTweetData={setTweetData}/>}
      {posts.map((post) => (
        <PrivateCommunityPostCard key={post?._id} post={post} userId={userId}  deleteUserPost={deleteUserPost}/>
      ))}
    </div>
  );
}

export default TweetClient
