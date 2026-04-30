import { useState, useMemo, useEffect, useRef } from 'react'
import { X, Search, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'
import ProductCard from './ProductCard'

interface SearchDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SearchDrawer = ({ isOpen, onClose }: SearchDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const trendingRowRef = useRef<HTMLDivElement>(null)

  const recommendations = [
    'Peri Peri Makhana',
    'Honey Mustard & Jalapeno',
    'Blueberry & Lavender',
    'Smoky Jalapeno',
    'Cheese & Chill'
  ]

  // Fetch products when drawer opens
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api('/api/products')
        setProducts(data.products || [])
      } catch (err) {
        console.error('Failed to fetch products for search:', err)
      }
    }
    
    if (isOpen) {
      fetchProducts()
      setSearchQuery('')
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
      if (trendingRowRef.current) trendingRowRef.current.scrollLeft = 0
    }
  }, [isOpen])

  // Filter products matching search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return []
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4)
  }, [searchQuery, products])

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Search Background Blur Mask */}
      <div className="absolute inset-0 bg-brand-pink/95 backdrop-blur-3xl" onClick={onClose}></div>
      
      {/* Search Content Container - edge-to-edge on mobile for immersive row */}
      <div className={`relative h-full max-w-7xl mx-auto px-0 md:px-6 py-6 md:py-20 flex flex-col transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
        
        {/* Close Button Circle - High accessibility on mobile */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-4 md:top-10 md:right-10 p-3 md:p-4 bg-brand-red/10 hover:bg-brand-red/20 rounded-full text-brand-red transition-all shadow-xl group border border-brand-red/10 z-[110]"
        >
          <X className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex flex-col gap-8 md:gap-12 w-full mt-12 md:mt-16 items-center overflow-y-auto scrollbar-hide"
        >
          
          {/* Trending/Recommendations Section - PURE EDGE-TO-EDGE SCROLLING */}
          <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-top-5 duration-500">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-dark/40 text-center px-4">Trending Flavors For You</h3>
            <div 
                ref={trendingRowRef}
                className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide snap-x px-4 md:px-0"
            >
              {recommendations.map((item) => (
                <button 
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className="flex items-center gap-2 px-5 py-3 md:px-6 md:py-4 bg-white hover:bg-brand-red text-brand-dark hover:text-white border border-brand-red/10 rounded-full transition-all duration-300 font-bold uppercase text-[10px] md:text-xs tracking-widest whitespace-nowrap shadow-lg snap-center group/tag shrink-0"
                >
                  {item}
                  <ArrowRight className="w-4 h-4 opacity-30 group-hover/tag:translate-x-1 group-hover/tag:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Branded Capsule Search Bar matching user reference - With safe side padding */}
          <div className="relative w-full max-w-5xl px-4 md:px-0 group flex-shrink-0 animate-in fade-in zoom-in-95 duration-500 delay-100">
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isOpen}
              className="w-full bg-white text-brand-dark px-6 md:px-8 py-4 md:py-7 rounded-full text-lg md:text-3xl font-bold focus:outline-none placeholder:text-brand-dark/30 shadow-2xl transition-all border border-brand-red/10"
            />
            <Search className="absolute right-10 md:right-8 top-1/2 -translate-y-1/2 w-6 md:w-10 h-6 md:h-10 text-brand-dark/20 group-focus-within:text-brand-red transition-colors" />
          </div>

          {/* Search Content Section - Safe side padding for matches */}
          <div className="w-full max-w-6xl px-4 md:px-0 space-y-12 pb-10">
            {/* Live Results Section */}
            {filteredProducts.length > 0 && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-brand-dark/50 text-center">Live Matches</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="animate-in fade-in zoom-in-95 duration-500">
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchDrawer
