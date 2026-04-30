import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import ProductCard from '../components/ProductCard'
import { api } from '../lib/api'
import { Loader2, SlidersHorizontal, ChevronDown, X } from 'lucide-react'

interface Product {
    id: string
    name: string
    description: string
    price: number
    mrp: number
    imageUrl?: string
    image?: string
    category: string
    tags: string[]
    stock: number
    rating?: number
    flavour?: string
    ordersCount?: number
    _count?: { reviews: number }
}

const Products = () => {
    const { data: productsData, isLoading: isProductsLoading } = useQuery({
        queryKey: ['products', 'all'],
        queryFn: () => api('/api/products'),
    })

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => api('/api/products/category/list'),
    })

    const products: Product[] = productsData?.products || []
    const categories = ['All', ...(categoriesData || [])]
    const [sortBy, setSortBy] = useState('featured')

    // Active applied filters
    const [filterRating, setFilterRating] = useState(0)
    const [priceRange, setPriceRange] = useState(1000)
    const [activeCategory, setActiveCategory] = useState('All')

    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Temporary filter states for the drawer
    const [tempRating, setTempRating] = useState(0)
    const [tempPrice, setTempPrice] = useState(1000)
    const [tempCategory, setTempCategory] = useState('All')

    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter((p: Product) =>
            (p.rating || 5) >= filterRating &&
            (p.price || 0) <= priceRange &&
            (activeCategory === 'All' || p.category === activeCategory)
        )

        if (sortBy === 'price-low') {
            result.sort((a: Product, b: Product) => (a.price || 0) - (b.price || 0))
        } else if (sortBy === 'price-high') {
            result.sort((a: Product, b: Product) => (b.price || 0) - (a.price || 0))
        } else if (sortBy === 'bestselling') {
            result.sort((a: Product, b: Product) => (b.ordersCount || 0) - (a.ordersCount || 0))
        }
        return result
    }, [products, sortBy, filterRating, priceRange, activeCategory])

    const applyFilters = () => {
        setFilterRating(tempRating)
        setPriceRange(tempPrice)
        setActiveCategory(tempCategory)
        setIsFilterOpen(false)
    }

    const clearFilters = () => {
        setTempRating(0)
        setTempPrice(1000)
        setTempCategory('All')
        setFilterRating(0)
        setPriceRange(1000)
        setActiveCategory('All')
        setIsFilterOpen(false)
    }

    if (isProductsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">Products</h1>
                        <p className="text-primary/60 font-medium uppercase tracking-widest text-[10px]">Premium Lotus seed collection</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setTempRating(filterRating)
                                setTempPrice(priceRange)
                                setTempCategory(activeCategory)
                                setIsFilterOpen(true)
                            }}
                            className={`flex items-center gap-2 border px-6 py-2.5 rounded-xl transition-all font-bold text-xs
                      ${isFilterOpen ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-200 hover:border-primary'}`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                            {(filterRating > 0 || priceRange < 1000 || activeCategory !== 'All') && (
                                <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                            )}
                        </button>

                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-xs cursor-pointer hover:bg-primary/95 transition-all outline-none pr-12 shadow-lg shadow-primary/10"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="bestselling">Bestselling</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isFilterOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFilterOpen(false)}
                                className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100]"
                            />

                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-white z-[101] shadow-2xl flex flex-col"
                            >
                                <div className="flex items-center justify-between p-8 border-b border-primary/5">
                                    <h3 className="text-2xl font-serif font-black text-primary">Filters</h3>
                                    <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-primary/5 hover:bg-primary/10 rounded-full transition-all text-primary">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-12">
                                    <div className="flex flex-col gap-6">
                                        <label className="text-primary/40 font-black uppercase tracking-[0.2em] text-[10px]">Product Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setTempCategory(cat)}
                                                    className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all
                                                ${tempCategory === cat
                                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                                                            : 'bg-white text-primary border-primary/10 hover:border-primary/40'
                                                        }
                                            `}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex justify-between items-center">
                                            <label className="text-primary/40 font-black uppercase tracking-[0.2em] text-[10px]">Price Limit</label>
                                            <span className="text-primary font-bold text-lg">Under ₹{tempPrice}</span>
                                        </div>
                                        <div className="relative pt-4 px-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                step="50"
                                                value={tempPrice}
                                                onChange={(e) => setTempPrice(parseInt(e.target.value))}
                                                style={{
                                                    background: `linear-gradient(to right, #5B0F2E 0%, #5B0F2E ${(tempPrice / 1000) * 100}%, #F3F4F6 ${(tempPrice / 1000) * 100}%, #F3F4F6 100%)`
                                                }}
                                                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary border border-primary/5 shadow-inner"
                                            />
                                            <div className="flex justify-between mt-3 text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                                                <span>₹0</span>
                                                <span>₹1000</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <label className="text-primary/40 font-black uppercase tracking-[0.2em] text-[10px]">Customer Rating</label>
                                        <div className="flex gap-2">
                                            {[0, 3, 4, 5].map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => setTempRating(r)}
                                                    className={`flex-1 py-4 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5
                                                ${tempRating === r
                                                            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
                                                            : 'bg-gray-50 text-primary border border-primary/5 hover:border-primary/20'
                                                        }
                                            `}
                                                >
                                                    <span className="text-lg">{r === 0 ? 'All' : `${r} ★`}</span>
                                                    <span className="text-[8px] uppercase tracking-widest opacity-60">{r === 0 ? 'Any Rated' : 'Min. Rating'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border-t border-primary/5 bg-gray-50/50 flex flex-col gap-4">
                                    <button
                                        onClick={applyFilters}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        Apply All Filters
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="w-full text-primary/40 hover:text-primary font-bold uppercase tracking-widest text-[10px] py-1 transition-all text-center"
                                    >
                                        Reset All Preferences
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {filteredAndSortedProducts.map((product: Product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                image={product.imageUrl || product.image || ''}
                                currentPrice={product.price?.toString()}
                                oldPrice={product.mrp?.toString()}
                                rating={product.rating || 5}
                                reviews={product._count?.reviews || 0}
                            />
                        </motion.div>
                    ))}
                </div>

                {filteredAndSortedProducts.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <p className="text-primary/40 font-serif text-2xl">No products found matching your filters.</p>
                        <button
                            onClick={() => { setFilterRating(0); setPriceRange(1000); setActiveCategory('All'); }}
                            className="bg-primary text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Products
