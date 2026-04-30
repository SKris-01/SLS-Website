import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Star, Check, ShoppingBag, ArrowLeft, ShieldCheck, Zap, Leaf, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const ProductDetails = () => {
    const { id } = useParams()
    const { addToCart } = useCart()
    const navigate = useNavigate()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [selectedImage, setSelectedImage] = useState<string>('')
    const [isAdded, setIsAdded] = useState(false)

    // Fetch Product Data
    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => api(`/api/products/${id}`),
    })

    // Fetch Recommendations (Latest products by category)
    const { data: recData, isLoading: isRecLoading } = useQuery({
        queryKey: ['recommendations', product?.category, id],
        queryFn: () => api(`/api/products?category=${product?.category}&limit=5`),
        enabled: !!product?.category,
    })

    const recommendations = recData?.products?.filter((p: any) => p.id !== id).slice(0, 4) || []

    // Scroll to top on id change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    // Update selected image when product changes
    useEffect(() => {
        if (product?.imageUrl) {
            setSelectedImage(product.imageUrl)
        }
    }, [product])

    const isLoading = isProductLoading || (isRecLoading && !recommendations.length)

    const handleAddToCart = () => {
        if (!product) return
        addToCart({
            id: product.id,
            name: product.name,
            currentPrice: product.price,
            image: product.imageUrl
        })
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const handleDirectBuy = () => {
        if (!product) return
        navigate('/checkout', {
            state: {
                directBuyItem: {
                    productId: product.id,
                    name: product.name,
                    currentPrice: String(product.price),
                    image: product.imageUrl,
                    quantity: 1
                }
            }
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
                <h1 className="text-4xl font-serif font-bold mb-6 text-primary">Product Not Found</h1>
                <Link to="/products" className="bg-primary text-white px-12 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Back to Products
                </Link>
            </div>
        )
    }

    const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean)

    return (
        <div className="min-h-screen bg-white pt-24 pb-20 md:pt-32 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Link
                to="/products"
                className="inline-flex items-center gap-2 text-primary/60 hover:text-primary mb-10 transition-all group font-bold uppercase tracking-widest text-[10px]"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Products
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">

                {/* ─ Mobile Gallery ───────── */}
                <div className="lg:hidden mb-4 overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scrollbar-hide gap-4 pb-4"
                        onScroll={(e) => {
                            const container = e.currentTarget
                            const index = Math.round(container.scrollLeft / container.clientWidth)
                            if (allImages[index] && selectedImage !== allImages[index]) {
                                setSelectedImage(allImages[index])
                            }
                        }}
                    >
                        {allImages.map((img, idx) => (
                            <div key={idx} className="min-w-full snap-center">
                                <div className="relative aspect-[3/4] bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                    <img
                                        src={img}
                                        loading="lazy"
                                        alt={`${product.name} view ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex overflow-x-auto no-scrollbar scrollbar-hide gap-3 py-2 items-center">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelectedImage(img)
                                        if (scrollContainerRef.current) {
                                            scrollContainerRef.current.scrollTo({
                                                left: scrollContainerRef.current.clientWidth * idx,
                                                behavior: 'smooth'
                                            })
                                        }
                                    }}
                                    className={`relative w-14 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0
                                      ${selectedImage === img ? 'border-primary' : 'border-transparent opacity-50'}
                                  `}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─ Desktop Gallery ─────── */}
                <div className="hidden lg:col-span-7 lg:flex gap-6">
                    {/* Thumbnails Sidebar */}
                    {allImages.length > 1 && (
                        <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar scrollbar-hide shrink-0 w-20">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-20 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all shrink-0
                                      ${selectedImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}
                                  `}
                                >
                                    <img src={img} loading="lazy" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Showcase */}
                    <div className="relative flex-1">
                        <div className="relative aspect-[3/4] max-h-[700px] w-auto mx-auto bg-gray-50 border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    src={selectedImage}
                                    alt={product.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ─ Product Info ─────────────────────── */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-primary">
                                <Star className="w-4 h-4 fill-primary text-primary" />
                                <span className="text-sm font-bold">{(product.rating || 5).toFixed(1)}</span>
                                <span className="text-primary/30 text-xs font-medium ml-1">({product._count?.reviews || 0} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                            {product.mrp > product.price && (
                                <span className="text-primary/30 line-through font-medium text-lg">₹{product.mrp}</span>
                            )}
                        </div>

                        <p className="text-primary/60 text-base md:text-lg leading-relaxed font-medium">
                            {product.description || "Premium roasted makhana infused with gourmet flavors and natural ingredients for the perfect healthy crunch."}
                        </p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Weight', value: product.weight || '100g', icon: Zap },
                            { label: 'Flavour', value: product.flavour || 'Organic', icon: Leaf },
                            { label: 'Quality', value: 'Premium', icon: ShieldCheck },
                            { label: 'Type', value: 'Vegetarian', icon: Check }
                        ].map((spec, i) => (
                            <div key={i} className="flex flex-col gap-1 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-primary/40 uppercase text-[9px] font-bold tracking-widest">{spec.label}</span>
                                <div className="flex items-center gap-2 text-primary">
                                    <spec.icon className="w-3.5 h-3.5" />
                                    <span className="text-xs font-bold">{spec.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded || product.stock <= 0}
                            className={`w-full py-5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 cursor-pointer
                              ${isAdded
                                    ? 'bg-green-600 text-white shadow-green-600/20'
                                    : 'bg-primary text-white hover:bg-primary/95 shadow-primary/20'
                                }
                              ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                            {product.stock <= 0 ? (
                                <span>Out of Stock</span>
                            ) : isAdded ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Added to Cart</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleDirectBuy}
                            disabled={product.stock <= 0}
                            className="w-full py-5 rounded-xl border border-primary/20 text-primary font-bold uppercase tracking-widest text-xs transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* ─ Recommendations Section ─────────────────────────── */}
            {recommendations.length > 0 && (
                <div className="pt-16 border-t border-gray-100">
                    <div className="mb-12">
                        <h2 className="text-3xl font-serif font-bold text-primary">You May Also Like</h2>
                        <div className="w-12 h-1 bg-primary mt-4"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {recommendations.map((rec: any) => (
                            <ProductCard
                                key={rec.id}
                                id={rec.id}
                                name={rec.name}
                                image={rec.imageUrl}
                                currentPrice={rec.price.toString()}
                                oldPrice={rec.mrp ? rec.mrp.toString() : ''}
                                rating={5}
                                reviews={rec._count?.reviews || 0}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails
