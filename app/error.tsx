"use client" // Error components must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
      <h2 className="text-2xl font-bold mb-4">出错了！</h2>
      <p className="mb-6">{error.message || "抱歉，应用遇到了一些问题。"}</p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        再试一次
      </Button>
    </div>
  )
} 