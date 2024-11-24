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
  isInitialData: boolean
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
      isInitialData,
      children,
      ...props
    },
    ref
  ) => {
    const nextObserverTarget = React.useRef(null)
    const prevObserverTarget = React.useRef(null)

    React.useEffect(() => {
      if (hasPreviousPage) fetchPreviousPage() //workaround tanstack query bug

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.at(0)?.isIntersecting) {
            if (
              entries.at(0)?.target === nextObserverTarget.current &&
              hasNextPage
            )
              fetchNextPage()
            else if (
              entries.at(0)?.target === prevObserverTarget.current &&
              hasPreviousPage
            )
              fetchPreviousPage()
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
    }, [])

    return (
      <div ref={ref} {...props}>
        {isInitialData
          ? null
          : hasPreviousPage
            ? loadingMessage
            : endingMessage}

        <div ref={prevObserverTarget} />
        {children}
        <div ref={nextObserverTarget} />
        {hasNextPage ? loadingMessage : endingMessage}
      </div>
    )
  }
)
