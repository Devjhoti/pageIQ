import { useState, useEffect, useRef } from 'react'

export function useCountUp(end, duration = 1500, shouldAnimate = true) {
  const [count, setCount] = useState(0)
  const startTime = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end)
      return
    }

    startTime.current = null

    function animate(timestamp) {
      if (!startTime.current) startTime.current = timestamp
      const progress = Math.min((timestamp - startTime.current) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [end, duration, shouldAnimate])

  return count
}
