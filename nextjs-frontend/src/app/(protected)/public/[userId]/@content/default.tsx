import React, { Suspense } from 'react'
import PublicPlaylistPage from './playlists/page'
import PublicPlaylistClient from './playlists/page'
import PublicVideoClient from './videos/VideoClient'

const Home = () => {
  return (
    <Suspense fallback={<div>Loading playlist...</div>}>
      <PublicVideoClient />
    </Suspense>
  )
}

export default Home