import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import HeroBanner from '../components/HeroBanner'
import ProductSection from '../components/ProductSection'
import Benefits from '../components/Features'
import WhyChooseUs from '../components/WhyChooseUs'
import Certifications from '../components/Certifications'
import Testimonials from '../components/Testimonials'
import Marketplace from '../components/Marketplace'
import { api } from '../lib/api'

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'home'],
    queryFn: () => api('/api/products?limit=12'),
  })

  const products = data?.products || []
  const featuredProducts = products.slice(0, 8)

  return (
    <div className="bg-white">
      <HeroBanner />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Benefits />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-8 text-center">Featured Collection</h2>
        {isLoading ? (
          <div className="py-20 flex justify-center"><div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" /></div>
        ) : (
          <ProductSection
            title=""
            products={featuredProducts}
            isScrollable={true}
          />
        )}
      </div>

      <WhyChooseUs />

      <Certifications />

      <Testimonials />

      <Marketplace />
    </div>
  )
}

export default Home
