import { useState } from 'react'
import { Star, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  id: string
  image: string
  name: string
  rating: number
  reviews: number
  oldPrice?: string
  currentPrice: string
}

import CachedImage from './CachedImage'

const ProductCard = ({ id, image, name, rating, reviews, oldPrice, currentPrice }: ProductCardProps) => {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart({ id, image, name, currentPrice })
    setIsAdded(true)
    
    // Reset back to "Add to cart" after 2 seconds for a fresh look
    setTimeout(() => {
        setIsAdded(false)
    }, 2000)
  }

  return (
    <div className="group flex flex-col items-start gap-4 transition-all duration-300 w-full max-w-[245px]">
      {/* Container with Rounded corners and Soft Shadows */}
      <Link 
        to={`/product/${id}`}
        className="block relative w-full aspect-[4/5] rounded-[40px] shadow-soft cursor-pointer border border-primary/5 bg-secondary/10 hover:bg-secondary/20 transition-all duration-500 md:group-hover:scale-[1.02] overflow-hidden"
      >
        <div className="absolute inset-0 p-2">
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center rounded-[30px] bg-white">
            <CachedImage 
              src={image} 
              alt={name} 
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col items-start text-left w-full px-1">
        <Link to={`/product/${id}`} className="block w-full">
            <div className="h-8 md:h-7 flex items-center mb-0 overflow-hidden">
              <h3 className="text-primary font-bold text-lg md:text-xl leading-none font-serif line-clamp-1 w-full hover:text-primary/70 transition-colors">
                {name}
              </h3>
            </div>
        </Link>
        
        <div className="flex items-center gap-1 mb-2 h-5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              strokeWidth={1.5}
              className={`w-4 h-4 ${i < rating ? 'fill-primary text-primary' : 'text-primary/10'}`} 
            />
          ))}
          <span className="text-primary/30 text-[10px] ml-1 font-black tracking-widest">({reviews})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2 font-bold tracking-widest h-6 mt-1">
            {oldPrice && <span className="text-primary/30 line-through text-[9px] md:text-xs">₹{oldPrice}</span>}
            <span className="text-primary text-base md:text-lg font-black tracking-tighter">₹{currentPrice}</span>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`w-full md:w-auto px-5 md:px-7 py-2.5 border-2 rounded-full font-bold transition-all duration-300 uppercase tracking-widest text-[9px] md:text-[10px] whitespace-nowrap shadow-sm flex items-center justify-center gap-2 active:scale-95
            ${isAdded 
              ? 'bg-primary border-primary text-white scale-105' 
              : 'bg-white text-primary border-primary/10 hover:bg-primary hover:text-white hover:border-primary hover:translate-y-[-1px]'
            }
          `}
        >
          {isAdded ? (
            <>
                <Check className="w-3 h-3" />
                <span>Added</span>
            </>
          ) : (
            <span>Add to cart</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
