import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cursor = Number(searchParams.get("cursor"))
  if (cursor == null)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 400 }
    )
  await new Promise((resolve) => setTimeout(resolve, 500))
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => ({
      foo: start + i * step,
      id: crypto.randomUUID().toString(),
    }))
  const res = {
    data: range(cursor, cursor + 9, 1),
    nextCursor: cursor < 40 ? cursor + 9 + 1 : null,
    prevCursor: cursor > 0 ? cursor - 9 - 1 : null,
  }
  return NextResponse.json(res)
}
