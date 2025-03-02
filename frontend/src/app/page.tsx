import { Metadata } from "next"
import LoginPage from "../components/Auth/LoginForm"
import Gatekeeper from "@/layouts/Gatekeeper"

export const metadata: Metadata = {
  title: 'Login',
}


export default function Home() {
  return (
    <div>
      <Gatekeeper>
        <LoginPage />
      </Gatekeeper>
    </div>
  )
}
