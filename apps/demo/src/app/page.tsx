"use client"
import Image from "next/image"
import { InfiniteScroller } from "@repo/ui/infinite-scroller"
import { getNextAction } from "./actions"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"

export default function Home() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["infinite-data"],
    queryFn: ({ pageParam }) => getNextAction(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })

  if (status === "error") return <p>Error {error.message}</p>
  if (status === "pending") return <p>Loading...</p>
  return (
    <main className="container flex min-h-screen flex-col px-4">
      <InfiniteScroller
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        endingMessage="end"
        loadingMessage="loading..."
        className="h-60 overflow-auto"
      >
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((el, i) => (
              <p key={i}>{el}</p>
            ))}
          </React.Fragment>
        ))}
      </InfiniteScroller>
    </main>
  )
}
