import { useState, useEffect } from 'react'

interface CachedImageProps {
  src: string
  alt: string
  className?: string
}

const CachedImage = ({ src, alt, className }: CachedImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cacheKey = `img_cache_${src}`
    const cachedData = localStorage.getItem(cacheKey)

    if (cachedData) {
      setImgSrc(cachedData)
      setIsLoading(false)
    }

    // Always fetch fresh image in background to update cache if needed
    const img = new Image()
    img.src = src
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      setImgSrc(src)
      setIsLoading(false)
      
      // Try to save to localStorage for next time (only if small and quota allows)
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        // Keeping it small for cache
        canvas.width = 300 
        canvas.height = (img.height / img.width) * 300
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        const base64 = canvas.toDataURL('image/webp', 0.5) // Compressed webp
        // Only cache if the URL isn't already too long
        if (base64.length < 50000) { // < 50KB
            localStorage.setItem(cacheKey, base64)
        }
      } catch (e) {
        // LocalStorage might be full, ignore silently
        console.warn('Image cache full')
      }
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && !imgSrc && (
        <div className="absolute inset-0 bg-secondary/10 animate-pulse" />
      )}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        />
      )}
    </div>
  )
}

export default CachedImage
