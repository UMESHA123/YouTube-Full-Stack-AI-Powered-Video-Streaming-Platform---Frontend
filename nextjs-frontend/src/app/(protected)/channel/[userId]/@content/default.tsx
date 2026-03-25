"use client"

import { Suspense } from "react"
import PlaylistClient from "./playlist/page"

const HomePage = () => {

  return (
    <div className="max-w-[1500px] mx-auto">
      <Suspense fallback={<div>Loading playlist...</div>}>
        <PlaylistClient />
      </Suspense>
    </div>
  )
}

export default HomePage