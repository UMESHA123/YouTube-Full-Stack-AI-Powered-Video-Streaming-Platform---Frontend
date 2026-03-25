import React, { Suspense } from 'react'
import WatchPage from './WatchClient'

const page = () => {
  return (
    <Suspense fallback={<div>Loading playlist...</div>}>
      <WatchPage />
    </Suspense>
  )
}

export default page