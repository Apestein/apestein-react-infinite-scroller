"use client"
import { BiInfiniteScroller } from "@repo/ui/infinite-scrollers"
import { getFooAction } from "../actions"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"

export function BiInfiniteScrollSection() {
  const {
    data,
    error,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["bi-infinite-data"],
    queryFn: ({ pageParam }) => getFooAction(pageParam),
    initialPageParam: 30, //currently, setting initialPageParam to last page will cause bug due to tanstack query, instead set it second to last page
    getNextPageParam: (nextPage, pages) => nextPage.nextCursor,
    getPreviousPageParam: (prevPage, pages) => prevPage.prevCursor,
    maxPages: 3, //set maxPage for good performance, but not needed if infinite list is short
  })

  if (status === "error") return <p>Error {error.message}</p>
  if (status === "pending")
    return <p className="h-[312px]">Loading from client...</p>
  return (
    <section>
      <h1 className="font-bold">Bi-directional Infinite Scroll</h1>
      <BiInfiniteScroller
        fetchNextPage={fetchNextPage}
        fetchPreviousPage={fetchPreviousPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        endingMessage="end"
        loadingMessage="loading..."
        firstItemId={data.pages.at(0)?.data.at(0)?.id}
        lastItemId={data.pages.at(-1)?.data.at(-1)?.id}
        className="border-2 p-2 h-72 text-xl overflow-auto"
      >
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map((el) => (
              //had to change height(h-8) here to prevent top intersection observer <div/> from being initially visible
              <p key={el.id} id={el.id} className="h-8">
                {el.foo}
              </p>
            ))}
          </React.Fragment>
        ))}
      </BiInfiniteScroller>
    </section>
  )
}
