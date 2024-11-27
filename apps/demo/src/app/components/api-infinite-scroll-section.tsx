"use client"
import { InfiniteScroller } from "@repo/ui/infinite-scroller"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"

export const fetchFoo = async ({ pageParam }: { pageParam: number }) => {
  const res = await fetch("/api/foo?cursor=" + pageParam)
  return res.json() as Promise<{
    data: {
      foo: number
      id: string
    }[]
    nextCursor: number | null
    prevCursor: number | null
  }> //use return type from api route
}

export function ApiInfiniteScrollSection() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["api-infinite-data"],
    queryFn: fetchFoo,
    initialPageParam: 0,
    getNextPageParam: (nextPage, pages) => nextPage.nextCursor,
  })

  if (status === "error") return <p>Error {error.message}</p>
  if (status === "pending")
    return <p className="h-[312px]">Loading from client...</p>
  return (
    <section>
      <h1 className="font-bold">Route-handler Example</h1>
      <InfiniteScroller
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        endingMessage="end"
        loadingMessage="loading..."
        className="h-72 overflow-auto border-2 p-2 text-xl"
      >
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map((el) => (
              <p key={el.id} id={el.id}>
                {el.foo}
              </p>
            ))}
          </React.Fragment>
        ))}
      </InfiniteScroller>
    </section>
  )
}
