import React, { Suspense } from 'react'
import PublicPlaylistClient from './PlaylistsClient'

const page = () => {
  return (
    <Suspense fallback={<div>Loading playlist...</div>}>
        <PublicPlaylistClient />
      </Suspense>
  )
}

export default page