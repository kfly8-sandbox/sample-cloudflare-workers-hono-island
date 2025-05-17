import { Hono } from 'hono'
import { renderer } from './renderer'

import $Counter from '@/islands/counter'
import $Hello from '@/islands/hello'
import $MyForm from '@/islands/my-form'
import $MyLoginForm from '@/islands/my-login-form'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <>
      <h1 className="text-3xl font-bold underline m-5">Welcome to Hono!</h1>
      <$Counter />
      <$Hello message="World" />
    </>
  )
})

app.get('/counter', (c) => {
  return c.render(
    <>
      <$Counter />
    </>
  )
})

app.get('/hello', (c) => {
  return c.render(
    <>
      <$Hello message="日本" />
    </>
  )
})

app.get('/myform', (c) => {
  return c.render(
    <>
      <h3 className="text-3xl font-bold underline m-5">MyForm</h3>
      <div className="m-5">
        <$MyForm />
      </div>
    </>
  )
})

app.get('/login', (c) => {
  return c.render(
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
      <$MyLoginForm />
      </div>
    </div>
  )
})

export default app
