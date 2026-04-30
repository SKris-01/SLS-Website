import { useState, useMemo, useRef } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import SectionHeading from './SectionHeading'

interface ProductSectionProps {
  title: string
  products: any[]
  isScrollable?: boolean
  showSort?: boolean
  showNoMore?: boolean
}

const ProductSection = ({ title, products, isScrollable = false, showSort = false, showNoMore = false }: ProductSectionProps) => {
  const [sortBy, setSortBy] = useState('featured')
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll functionality
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current
        const scrollAmount = clientWidth * 0.8
        scrollRef.current.scrollTo({
            left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
            behavior: 'smooth'
        })
    }
  }

  // Sophisticated sorting logic
  const sortedProducts = useMemo(() => {
    let result = [...products]
    if (sortBy === 'price-low') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }
    return result
  }, [products, sortBy])

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ]

  return (
    <section className="mb-10 lg:mb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between items-start mb-2 md:mb-10 gap-6">
        {/* Signature Branding Heading */}
        <div className="flex-1">
          <SectionHeading title={title} />
        </div>

        <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Pixel-Perfect Custom Branded Dropdown */}
            {showSort && (
              <div className="relative md:mb-2 z-20">
                <div 
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-3 border border-primary/10 px-5 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 transition-all"
                >
                  <span className="text-primary text-sm font-bold lowercase tracking-tighter">sort by</span>
                  <ChevronDown className={`w-4 h-4 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                </div>
                
                {isOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-primary/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                    {sortOptions.map((option) => (
                      <div 
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setIsOpen(false)
                        }}
                        className={`px-5 py-3 text-[10px] md:text-xs uppercase font-bold cursor-pointer transition-colors whitespace-nowrap
                          ${sortBy === option.value ? 'bg-primary text-white' : 'text-primary hover:bg-gray-50'}
                        `}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      <div className="relative group/scroll px-0 md:px-4">
        {/* Side Arrows (Left/Right) - Positioned in the white space */}
        {isScrollable && (
            <>
                <button 
                    onClick={() => scroll('left')}
                    className="absolute -left-2 md:-left-12 lg:-left-16 top-1/2 -translate-y-16 z-30 p-3.5 rounded-full bg-white shadow-xl border border-primary/5 text-primary hover:bg-primary hover:text-white transition-all hidden md:flex active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute -right-2 md:-right-12 lg:-right-16 top-1/2 -translate-y-16 z-30 p-3.5 rounded-full bg-white shadow-xl border border-primary/5 text-primary hover:bg-primary hover:text-white transition-all hidden md:flex active:scale-95"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </>
        )}
        
        {/* Single Row Horizontal Scroll - Standardized for Desktop & Mobile */}
        <div 
            ref={scrollRef}
            className={`
                ${isScrollable 
                ? 'flex overflow-x-auto pb-10 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory' 
                : 'grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16'} 
                md:gap-x-4 lg:gap-x-6 pt-0 pb-4 md:py-4 transition-all
            `}
        >
            {sortedProducts.map((product) => (
            <div 
                key={product.id} 
                className={isScrollable 
                ? 'w-[75vw] sm:w-[50vw] md:w-[28vw] lg:w-[22%] flex-shrink-0 snap-start' 
                : ''
                }
            >
                <ProductCard 
                id={product.id}
                name={product.name}
                image={product.imageUrl || product.image}
                currentPrice={product.price?.toString()}
                oldPrice={product.mrp?.toString()}
                rating={product.rating || 5}
                reviews={product._count?.reviews || 0}
                />
            </div>
            ))}
        </div>
      </div>

      {/* High-Fidelity "No More Items" Signal */}
      {showNoMore && products.length > 0 && (
          <div className="w-full flex flex-col items-center justify-center pt-20 pb-10 gap-4 opacity-30 text-primary">
              <div className="h-[1px] w-20 bg-primary"></div>
               <p className="font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs text-center">
                  no more items found
              </p>
              <div className="h-[1px] w-20 bg-primary"></div>
          </div>
      )}
    </section>
  )
}

export default ProductSection
