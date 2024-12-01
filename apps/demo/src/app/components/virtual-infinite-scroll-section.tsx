/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"

async function fetchServerPage(
  limit: number,
  offset: number = 0
): Promise<{ rows: Array<string>; nextOffset: number; prevOffset: number }> {
  const rows = new Array(limit)
    .fill(0)
    .map((_, i) => `Async loaded row #${i + offset * limit}`)

  await new Promise((r) => setTimeout(r, 500))

  return { rows, nextOffset: offset + 1, prevOffset: offset - 1 }
}

export function VirtualInfiniteScrollSection() {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: (ctx) => fetchServerPage(10, ctx.pageParam),
    getNextPageParam: (lastGroup) => lastGroup.nextOffset,
    getPreviousPageParam: (firstGroup) => firstGroup.prevOffset,
    initialPageParam: 0,
  })

  const allRows = data ? data.pages.flatMap((d) => d.rows) : []

  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage || hasPreviousPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 0,
  })

  React.useEffect(() => {
    const [firstItem] = [...rowVirtualizer.getVirtualItems()]
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

    if (!lastItem || !firstItem) return

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      // console.log(lastItem.index)
      // fetchNextPage()
    }

    if (firstItem.index <= 0) {
      console.log(firstItem.index)
      fetchPreviousPage().finally(() =>
        rowVirtualizer.scrollToIndex(10, { align: "end" })
      )
      // fetchPreviousPage().finally(() => rowVirtualizer.scrollToOffset(500))
    }
  }, [
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    allRows.length,
    isFetchingNextPage,
    isFetchingPreviousPage,
    rowVirtualizer.getVirtualItems(),
  ])

  if (status === "error") return <p>Error {error.message}</p>
  if (status === "pending")
    return <p className="h-[312px]">Loading from client...</p>
  return (
    <section>
      <p>
        This infinite scroll example uses React Query's useInfiniteScroll hook
        to fetch infinite data from a posts endpoint and then a rowVirtualizer
        is used along with a loader-row placed at the bottom of the list to
        trigger the next page to load.
      </p>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `500px`,
          width: `100%`,
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow =
              virtualRow.index > allRows.length - 1 || virtualRow.index <= 0
            const post = allRows[virtualRow.index]

            return (
              <div
                key={virtualRow.index}
                className={
                  virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow
                  ? hasNextPage
                    ? "Loading more..."
                    : "Nothing more to load"
                  : post}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
