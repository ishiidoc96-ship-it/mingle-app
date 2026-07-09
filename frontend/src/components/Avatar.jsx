import { useState, useEffect } from 'react'

function optimizeCloudinaryUrl(url, size) {
  if (!url || !url.includes('cloudinary.com')) return url
  const px = typeof size === 'number' ? size : parseInt(size) || 40
  const target = Math.min(Math.max(px * 2, 100), 800)
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/w_${target},q_auto,f_auto,dpr_2/`)
  }
  return url
}

export default function Avatar({ src, name, size = 40, className = '' }) {
  const [failed, setFailed] = useState(false)
  const initial = name?.[0]?.toUpperCase() || '?'
  const px = typeof size === 'number' ? `${size}px` : size

  useEffect(() => {
    setFailed(false)
  }, [src])

  const optimizedSrc = optimizeCloudinaryUrl(src, size)

  if (optimizedSrc && !failed) {
    return (
      <img
        src={optimizedSrc}
        alt={name || 'avatar'}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`rounded-full object-cover bg-surface-container-high flex-shrink-0 ${className}`}
        style={{ width: px, height: px }}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
      style={{ width: px, height: px, fontSize: `calc(${px} * 0.4)` }}
    >
      {initial}
    </div>
  )
}
