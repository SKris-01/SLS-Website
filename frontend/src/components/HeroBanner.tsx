import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const images = [
  "https://ik.imagekit.io/damienknights/SLS%20Products/Peri%20Peri%20B.jpeg",
  "https://ik.imagekit.io/damienknights/SLS%20Products/R%20Salt%20Big.jpeg?updatedAt=1776187808430",
  "https://ik.imagekit.io/damienknights/SLS%20Products/Peri%20Peri%20B.jpeg",
  "https://ik.imagekit.io/damienknights/SLS%20Products/image1.jpeg",
  "https://ik.imagekit.io/damienknights/SLS%20Products/Himalayan%20Rock%20Salt.jpeg?updatedAt=1776187807307",
]

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full min-h-screen bg-primary pt-24 md:pt-32 overflow-hidden flex flex-col justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 blur-[150px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">

          {/* Column 1: Content (Left) */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="order-2 md:order-1 text-left flex flex-col justify-center py-6 md:py-0"
          >
            <span className="text-secondary/80 uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[12px] mb-4 md:mb-6 block drop-shadow-sm">
              Traditionally Indian Healthy Globally
            </span>
            <h1 className="text-white text-3xl sm:text-4xl md:text-[4.5rem] font-serif font-black leading-[1] md:leading-[0.9] mb-6 md:mb-8 max-w-2xl italic tracking-tighter drop-shadow-2xl">
              <span className="whitespace-nowrap text-5xl md:text-7xl">Premium</span> <br />
              <span className="text-accent text-7xl md:text-9xl">Makhana</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base md:text-xl max-w-lg mb-8 md:mb-12 font-sans font-normal leading-relaxed drop-shadow-sm">
              Super Puffed Lotus Seeds by Shriyans. Gluten Free, Zero Cholesterol, and Rich in Antioxidants –  the perfect protein-rich healthy snack.
            </p>

            <div className="flex flex-wrap gap-6 md:gap-10 items-center">
              <Link
                to="/products"
                className="bg-accent text-white px-8 md:px-14 py-4 md:py-6 rounded-full font-black uppercase text-[10px] md:text-sm tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-accent/20 cursor-pointer block border border-accent/20 text-center"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>

          {/* Column 2: Showcase Card (Right) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="order-1 md:order-2 flex justify-center md:justify-end items-center"
          >
            <div className="relative w-full aspect-[4/5] max-w-[320px] md:max-w-[500px] overflow-hidden rounded-[32px] md:rounded-[64px] border border-white/10 shadow-2xl">
              {/* Premium Card Container */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>

              {/* Main Product Showcase */}
              <div className="relative h-full w-full flex items-center justify-center">
                {/* Radial accent glow */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-accent/20 blur-[100px] rounded-full"></div>

                <AnimatePresence initial={false}>
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    alt="Premium Makhana"
                    className="absolute inset-0 z-10 w-full h-full object-cover drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] md:drop-shadow-[0_50px_80px_rgba(0,0,0,0.7)]"
                    loading="eager"
                  />
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


    </div>
  )
}

export default HeroBanner
