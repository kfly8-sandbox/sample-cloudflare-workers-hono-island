import { createIsland } from '@/lib/island'

import { Checkbox } from '@/components/ui/checkbox'

export function MyForm() {

  return (
    <div className="m-5">
      <Checkbox id="terms" className="mr-2" /><label htmlFor="terms" className="text-sm text-gray-700 mt-4">I agree to the terms and conditions</label>
    </div>
  )
}

export default createIsland(MyForm)

