import { Hono } from 'hono'
import { renderer } from './renderer'

import $Counter from '@/islands/Counter'
import $Hello from '@/islands/Hello'

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

export default app
