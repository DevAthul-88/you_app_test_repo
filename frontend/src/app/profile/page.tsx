import ProfilePage from '@/components/Profile/ProfilePage'
import { MobileContainer } from '@/layouts/mobile-container'
import ProtectedLayout from '@/layouts/ProtectedLayout'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Profile',
}
 


function page() {
  return (
    <MobileContainer>
      <ProtectedLayout>
        <ProfilePage />
      </ProtectedLayout>
    </MobileContainer>
  )
}

export default page