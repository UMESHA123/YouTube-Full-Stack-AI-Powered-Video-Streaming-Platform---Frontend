export const dynamic = "force-dynamic";
import React, { Suspense } from 'react'
import PlaylistClient from './PlaylistPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading playlist...</div>}>
        <PlaylistClient />
      </Suspense>
    </div>
  )
}

export default page