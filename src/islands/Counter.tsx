import { useState } from 'react';
import { createIsland } from '@/lib/island'

import { Button } from '@/components/ui/button'

export function Counter() {
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

export default createIsland(Counter)
