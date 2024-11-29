// eslint-disable-next-line no-redeclare
import React from "react"

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  fetchNextPage: () => Promise<any>
  hasNextPage: boolean
  loadingMessage: React.ReactNode
  endingMessage: React.ReactNode
}

export const InfiniteScroller = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollProps
>(
  (
    {
      fetchNextPage,
      hasNextPage,
      endingMessage,
      loadingMessage,
      children,
      ...props
    },
    ref
  ) => {
    const observerTarget = React.useRef(null)

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage) fetchNextPage()
        },
        { threshold: 1 }
      )

      if (observerTarget.current) {
        observer.observe(observerTarget.current)
      }

      return () => observer.disconnect()
    }, [])

    return (
      <div ref={ref} {...props}>
        {children}
        <div ref={observerTarget} />
        {hasNextPage ? loadingMessage : endingMessage}
      </div>
    )
  }
)

interface BiInfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  fetchNextPage: () => Promise<any>
  fetchPreviousPage: () => Promise<any>
  hasNextPage: boolean
  hasPreviousPage: boolean
  loadingMessage: React.ReactNode
  endingMessage: React.ReactNode
  firstItemId: string | undefined
  lastItemId: string | undefined
}

export const BiInfiniteScroller = React.forwardRef<
  HTMLDivElement,
  BiInfiniteScrollProps
>(
  (
    {
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
      endingMessage,
      loadingMessage,
      firstItemId,
      lastItemId,
      children,
      ...props
    },
    ref
  ) => {
    const nextObserverTarget = React.useRef(null)
    const prevObserverTarget = React.useRef(null)
    if (!firstItemId || !lastItemId) throw new Error("No first/last item")
    const prevFirstItemId = React.useRef("")
    const prevLastItemId = React.useRef("")

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.at(0)?.isIntersecting) {
            if (
              entries.at(0)?.target === nextObserverTarget.current &&
              hasNextPage
            ) {
              prevLastItemId.current = lastItemId
              fetchNextPage()
            } else if (
              entries.at(0)?.target === prevObserverTarget.current &&
              hasPreviousPage
            ) {
              prevFirstItemId.current = firstItemId
              fetchPreviousPage()
            }
          }
        },
        { threshold: 1 }
      )

      if (nextObserverTarget.current) {
        observer.observe(nextObserverTarget.current)
      }
      if (prevObserverTarget.current) {
        observer.observe(prevObserverTarget.current)
      }

      return () => observer.disconnect()
    }, [hasNextPage, hasPreviousPage, firstItemId, lastItemId])

    React.useEffect(() => {
      const prevFirstItem = document.getElementById(prevFirstItemId.current)
      prevFirstItem?.scrollIntoView()
    }, [prevFirstItemId.current])

    React.useEffect(() => {
      const prevLastItem = document.getElementById(prevLastItemId.current)
      prevLastItem?.scrollIntoView(false)
    }, [prevLastItemId.current])

    return (
      <div ref={ref} {...props}>
        {hasPreviousPage ? loadingMessage : endingMessage}
        <div ref={prevObserverTarget} />
        {children}
        <div ref={nextObserverTarget} />
        {hasNextPage ? loadingMessage : endingMessage}
        <div ref={(node: HTMLDivElement) => node?.scrollIntoView()} />
      </div>
    )
  }
)
