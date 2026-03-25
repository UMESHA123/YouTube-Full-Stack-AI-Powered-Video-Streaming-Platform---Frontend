import React, { Suspense } from 'react'
import PublicVideoClient from './VideoClient'

const page = () => {
    return (
        <Suspense fallback={<div>Loading playlist...</div>}>
            <PublicVideoClient />
        </Suspense>
    )
}

export default page