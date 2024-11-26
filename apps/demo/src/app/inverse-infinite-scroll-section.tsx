"use client"
import { InfiniteScroller } from "@repo/ui/infinite-scroller"
import { getLatestFooAction } from "./actions"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"

export function InverseInfiniteScrollSection() {
  const { data, error, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["inverse-infinite-data"],
    queryFn: ({ pageParam }) => getLatestFooAction(pageParam),
    initialPageParam: 40,
    getNextPageParam: (nextPage, pages) => nextPage.prevCursor,
  })

  if (status === "error") return <p>Error {error.message}</p>
  if (status === "pending") return <p>Loading...</p>
  return (
    <section>
      <h1 className="font-bold">Inverse Infinite Scroll</h1>
      <InfiniteScroller
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        endingMessage="end"
        loadingMessage="loading..."
        className="text-xl border-2 p-2 h-72 overflow-auto flex flex-col-reverse"
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
