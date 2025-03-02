import InterestsPage from '@/components/Profile/InterestsPage'
import { MobileContainer } from '@/layouts/mobile-container'
import ProtectedLayout from '@/layouts/ProtectedLayout'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Interests',
}
 


function page() {
  return (
    <MobileContainer>
      <ProtectedLayout>
        <InterestsPage />
      </ProtectedLayout>
    </MobileContainer>
  )
}

export default page