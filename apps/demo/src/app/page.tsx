import React from "react"
import { NormalInfiniteScrollSection } from "./normal-infinite-scroll-section"
import { InverseInfiniteScrollSection } from "./inverse-infinite-scroll-section"
import { BiInfiniteScrollSection } from "./bi-infinite-scroll-section"

export default function Home() {
  return (
    <main className="grid grid-cols-3 container mx-auto p-12">
      <NormalInfiniteScrollSection />
      <InverseInfiniteScrollSection />
      <BiInfiniteScrollSection />
    </main>
  )
}
