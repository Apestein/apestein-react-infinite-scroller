// eslint-disable-next-line no-redeclare
import React from "react"

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  fetchNextPage: () => void
  fetchPreviousPage: () => void
  hasNextPage: boolean
  hasPreviousPage: boolean
  loadingMessage: React.ReactNode
  endingMessage: React.ReactNode
  // data: { pages: { data: { id: number | string }[] } }[]
}

export const InfiniteScroller = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollProps
>(
  (
    {
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
      endingMessage,
      loadingMessage,
      children,
      ...props
    },
    ref
  ) => {
    const nextObserverTarget = React.useRef(null)
    const prevObserverTarget = React.useRef(null)

    React.useEffect(() => {
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
        <div ref={prevObserverTarget} />
        {children}
        <div ref={nextObserverTarget} />
        {hasNextPage ? loadingMessage : endingMessage}
      </div>
    )
  }
)
