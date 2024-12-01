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
    const prevFirstItemRef = React.useRef<{ id: string } | null>(null)
    const prevLastItemRef = React.useRef<{ id: string } | null>(null)

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.at(0)?.isIntersecting) {
            if (
              entries.at(0)?.target === nextObserverTarget.current &&
              hasNextPage
            ) {
              prevLastItemRef.current = { id: lastItemId }
              fetchNextPage()
            } else if (
              entries.at(0)?.target === prevObserverTarget.current &&
              hasPreviousPage
            ) {
              prevFirstItemRef.current = { id: firstItemId }
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
      if (!prevFirstItemRef.current) return
      const prevFirstItem = document.getElementById(prevFirstItemRef.current.id)
      prevFirstItem?.scrollIntoView()
    }, [prevFirstItemRef.current])

    React.useEffect(() => {
      if (!prevLastItemRef.current) return
      const prevLastItem = document.getElementById(prevLastItemRef.current.id)
      prevLastItem?.scrollIntoView(false)
    }, [prevLastItemRef.current])

    return (
      <div ref={ref} {...props}>
        {hasPreviousPage ? loadingMessage : endingMessage}
        <div ref={prevObserverTarget} />
        {children}
        <div ref={nextObserverTarget} />
        {hasNextPage ? loadingMessage : endingMessage}
        {/* scroll to bottom on mount */}
        <div ref={(node: HTMLDivElement) => node?.scrollIntoView()} />
      </div>
    )
  }
)
