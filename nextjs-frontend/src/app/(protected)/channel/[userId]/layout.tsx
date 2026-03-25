"use client"
import PrivateChannelHeader from '@/components/PrivateChannelHeader';
import React from 'react'

const ChannelLayout = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) => {
  const isOwner = true;
  return (
    <div className="max-w-[1500px] mx-auto">
      <PrivateChannelHeader
        onTabChange={() => {}}
        isOwner={isOwner}
        onUpdateChannel={() => { }}
      />

      <div className="mt-6">
        {content ?? children}
      </div>
    </div>
  )
}

export default ChannelLayout
