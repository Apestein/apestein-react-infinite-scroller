"use client"
import { InfiniteScroller } from "@repo/ui/infinite-scroller"
import { getSomethingAction } from "./actions"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"

export default function Home() {
  const {
    data,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["infinite-data"],
    queryFn: ({ pageParam }) => {
      prevDataRef.current = data
      return getSomethingAction(pageParam)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
  })

  const prevDataRef = React.useRef<typeof data>()

  React.useEffect(() => {
    const prevFirstId = prevDataRef.current?.pages.at(0)?.data.at(0)?.id
    if (!prevFirstId) return
    const dif = data?.pageParams.filter(
      (e): e is number => !prevDataRef.current?.pageParams.includes(e)
    )
    //only restore scroll position for inverse scroll, normal scroll is automatic
    if (dif?.at(0) !== data?.pageParams.at(0)) return
    const firstElement = document.getElementById(prevFirstId)
    firstElement?.scrollIntoView()
  }, [data?.pageParams])

  if (status === "error") return <p>Error {error.message}</p>
  if (status === "pending") return <p>Loading...</p>
  return (
    <main className="container flex min-h-screen flex-col px-4">
      <InfiniteScroller
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        endingMessage="end"
        loadingMessage="loading..."
        className="h-60 overflow-auto [overflow-anchor:none]"
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
    </main>
  )
}
