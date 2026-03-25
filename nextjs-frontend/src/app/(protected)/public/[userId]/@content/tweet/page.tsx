import React, { Suspense } from 'react'
import PublicTweetClient from './TweetClient'

const page = () => {
    return (
        <Suspense fallback={<div>Loading playlist...</div>}>
            <PublicTweetClient />
        </Suspense>
    )
}

export default page