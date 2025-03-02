import React from 'react'
import RegisterPage from '../../components/Auth/RegisterForm'
import { Metadata } from 'next'
import Gatekeeper from '@/layouts/Gatekeeper'


export const metadata: Metadata = {
  title: 'Register',
}


function page() {
  return (
    <div>
      <Gatekeeper>
        <RegisterPage />
      </Gatekeeper>
    </div>
  )
}

export default page