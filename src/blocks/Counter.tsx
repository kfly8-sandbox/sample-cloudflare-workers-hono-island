import { useState } from 'react';

import { Button } from '@/components/ui/button'

export default function $Counter() {

  return (
    <div data-island="Counter">
      <Counter />
    </div>
  )
}

function Counter() {
  const [ count, setCount ] = useState(0)

  return (
    <>
      <Button
        className="m-5"
        onClick={() => { setCount(count+1) }}
      >Click me</Button>
      count: { count }
    </>
  )
}

