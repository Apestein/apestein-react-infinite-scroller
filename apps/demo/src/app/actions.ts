"use server"
/*
Mock database access, returns next 10 numbers.
Cursor will be automatically passed when calling fetchNextPage & fetchPreviousPage
*/
export async function getFooAction(cursor: number) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => ({
      foo: start + i * step,
      id: crypto.randomUUID().toString(),
    }))
  const foo = {
    data: range(cursor, cursor + 9, 1),
    nextCursor: cursor < 40 ? cursor + 9 + 1 : null,
    prevCursor: cursor >= 0 ? cursor - 9 - 1 : null,
    //changing >= to > will cause bug
    // prevCursor: cursor > 0 ? cursor - 9 - 1 : null,
  }
  console.log(cursor, foo)
  return foo
}
