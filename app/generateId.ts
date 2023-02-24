import { nanoid } from "nanoid/non-secure"

export const generateId = (): string => {
  const id = nanoid()

  return id
}
