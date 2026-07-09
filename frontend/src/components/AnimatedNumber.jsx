import { useState, useEffect, useRef } from 'react'

export default function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1000, decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const target = Number(value) || 0
    if (target === display) return
    const start = display
    const startTime = performance.now()
    startRef.current = target

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (target - start) * eased
      setDisplay(current)
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [value, duration])

  const formatted = display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return <span>{prefix}{formatted}{suffix}</span>
}
