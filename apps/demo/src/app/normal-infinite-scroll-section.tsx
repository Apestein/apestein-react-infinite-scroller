"use client"
import { InfiniteScroller } from "@repo/ui/infinite-scroller"
import { getFooAction } from "./actions"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"

export function NormalInfiniteScrollSection() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["normal-infinite-data"],
    queryFn: ({ pageParam }) => getFooAction(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })

  if (status === "error") return <p>Error {error.message}</p>
  if (status === "pending") return <p>Loading...</p>
  return (
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
  )
}
