'use client'

import { useFormStatus } from 'react-dom'

export function AddButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}
            className="disabled:opacity-15"
    >
      Add
    </button>
  )
}