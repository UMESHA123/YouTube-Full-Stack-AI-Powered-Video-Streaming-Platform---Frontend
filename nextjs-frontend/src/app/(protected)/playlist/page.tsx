import React, { Suspense } from 'react'
import PlaylistClient from './PlaylistClient'

const page = () => {
  return (
    <Suspense fallback={<div>Loading playlist...</div>}>
      <PlaylistClient />
    </Suspense>
  )
}

export default page