
import React, { Suspense } from 'react'
import VideosClient from './VideosPage'

const page = () => {
  return (
    <Suspense fallback={<div>Loading playlist...</div>}>
      <VideosClient />
    </Suspense>
  )
}

export default page