import { useState } from 'react';
import { createIsland } from '@/lib/island'

import { Button } from '@/components/ui/button'

type Props = {
  initialCount?: number
}

export function Counter({ initialCount = 0 } : Props ) {
  const [ count, setCount ] = useState(initialCount)

  return (
    <>
      <Button
        className="m-5"
        onClick={() => { setCount(count+1) }}
      >Click me!!</Button>
      count: { count }
    </>
  )
}

export default createIsland(Counter)
