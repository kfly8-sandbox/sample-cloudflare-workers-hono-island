import { createIsland } from '@/lib/island'

import { LoginForm } from '@/components/login-form'

export function MyLoginForm() {

  return (
    <>
      <LoginForm />
    </>
  )
}

export default createIsland(MyLoginForm)
