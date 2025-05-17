import { Hono } from 'hono'
import { renderer } from './renderer'

import $Counter from '@/islands/Counter'
import $Hello from '@/islands/Hello'
import $MyForm from '@/islands/MyForm'

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

export default app
