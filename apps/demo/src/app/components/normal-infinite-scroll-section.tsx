"use client";
import { InfiniteScroller } from "@repo/ui/infinite-scrollers";
import { getFooAction, getInfiniteDataAction } from "../actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

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
    // queryFn: ({ pageParam }) => getFooAction(pageParam),
    queryFn: (ctx) => getInfiniteDataAction(10, ctx.pageParam),
    initialPageParam: 0,
    getNextPageParam: (nextPage, pages) => nextPage.nextOffset,
  });

  if (status === "error") return <p>Error {error.message}</p>;
  if (status === "pending")
    return <p className="h-[312px]">Loading from client...</p>;
  return (
    <section>
      <h1 className="font-bold">Normal Infinite Scroll</h1>
      <InfiniteScroller
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        endingMessage="end"
        loadingMessage="loading..."
        className="h-72 overflow-auto border-2 p-2 text-xl"
      >
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.rows.map((el) => (
              <p key={el.id} id={el.id}>
                {el.foo}
              </p>
            ))}
          </React.Fragment>
        ))}
      </InfiniteScroller>
    </section>
  );
}
