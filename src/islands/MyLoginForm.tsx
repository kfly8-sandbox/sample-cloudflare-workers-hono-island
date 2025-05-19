import { $island } from '@/islands/utils'

import { LoginForm } from '@/components/login-form'

export function MyLoginForm() {

  return (
    <>
      <LoginForm />
    </>
  )
}

export default $island(MyLoginForm)
