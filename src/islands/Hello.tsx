import { useState } from 'react'

import { $island } from '@/islands/utils'

type Props = {
  message: string
}

export function Hello({ message } : Props) {
  const [messageState, setMessageState ] = useState(message)

  return (
    <div className="m-5">
      <input type="text" onInput={(e) => {
        const input = e.target as HTMLInputElement
        setMessageState(input.value)
      }} placeholder='Input text' value={messageState}
        className="border-2 border-gray-300 rounded-md p-2"
      />
      <p
        className="text-sm font-bold text-gray-700 mt-4"
      >Hello, {messageState}</p>
    </div>
  )
}

export default $island(Hello)
