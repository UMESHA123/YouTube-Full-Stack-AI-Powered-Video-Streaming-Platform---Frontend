
import React, { Suspense } from 'react'
import TweetClient from './TweetPage'

const page = () => {
  return (
    <Suspense fallback={<div>Loading playlist...</div>}>
      <TweetClient />
    </Suspense>
  )
}

export default page