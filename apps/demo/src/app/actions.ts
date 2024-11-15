"use server"

export async function getNextAction(cursor: number) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const range = (start: number, stop: number, step: number) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    )
  return { data: range(cursor, cursor + 10, 1), nextCursor: cursor + 10 + 1 }
}
