import { nanoid } from 'nanoid/non-secure'

export const generateId = () => {
  const id = nanoid()

  return id
}
