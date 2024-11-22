"use server"
import crypto from "node:crypto"

export async function getNextAction(cursor: number) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const range = (start: number, stop: number, step: number) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    )
  return { data: range(cursor, cursor + 10, 1), nextCursor: cursor + 10 + 1 }
}

//cursor will be automatically passed when calling fetchNextPage & fetchPreviousPage
export async function getSomethingAction(cursor: number) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => ({
      foo: start + i * step,
      id: crypto.randomUUID().toString(),
    }))
  return {
    data: range(cursor, cursor + 10, 1),
    nextCursor: cursor + 10 + 1,
    prevCursor: cursor - 10 - 1,
  }
}
