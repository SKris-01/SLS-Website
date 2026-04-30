import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      source: "Amazon",
      name: "Rohan Khanna",
      comment: "Best makhana I've ever eaten! The peri peri flavor is actually spicy and has a great crunch. My kids love it.",
      rating: 5
    },
    {
      source: "Meesho",
      name: "Priya Singh",
      comment: "Completely organic and fresh. I've bought multiple bags from Meesho and the quality is consistent every time.",
      rating: 5
    },
    {
      source: "Amazon",
      name: "Ankit Sharma",
      comment: "Good quality, large seeds and correctly roasted. Perfect for evening snacks with tea.",
      rating: 4
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary/5 -translate-y-1/2 -z-10"></div>
        
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-16 text-center">What Our Customers Say</h2>
        
        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-8 pb-10 -mx-4 px-4 md:mx-0 md:px-0">
          {testimonials.map((testi, index) => (
            <div key={index} className="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[400px] bg-white p-8 md:p-10 rounded-2xl shadow-soft border border-primary/5 hover:border-accent/40 transition-all duration-300 relative group snap-start">
                <Quote className="absolute top-8 right-8 md:top-10 md:right-10 w-10 md:w-12 h-10 md:h-12 text-secondary opacity-20 group-hover:scale-125 transition-transform" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < testi.rating ? 'fill-accent text-accent' : 'text-primary/20'}`} />
                ))}
              </div>
              <p className="text-primary/80 mb-8 italic text-base md:text-lg font-serif">"{testi.comment}"</p>
              <div className="flex flex-col items-start gap-1">
                <span className="font-bold text-primary uppercase text-sm">{testi.name}</span>
                <span className="text-primary/40 text-[10px] font-black uppercase tracking-widest">Verified on {testi.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
