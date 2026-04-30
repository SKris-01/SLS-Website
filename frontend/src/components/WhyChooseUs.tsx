import { CheckCircle, ShieldCheck, Smile } from 'lucide-react'

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <CheckCircle className="w-10 h-10 text-accent" />,
      title: "Quality Sourcing",
      description: "We pick only the largest, brightest, and crunchiest makhana seeds directly from the Bihar heartlands."
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-accent" />,
      title: "Hygiene Standards",
      description: "Our processing facility follows strict FSSAI guidelines to ensure zero contamination and peak freshness."
    },
    {
      icon: <Smile className="w-10 h-10 text-accent" />,
      title: "Customer Satisfaction",
      description: "Thousands of happy snackers trust us for their daily healthy cravings. Your health, our mission."
    }
  ]

  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Why Choose Us</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Discover the commitment behind every bag of Shriyans Lotus Seeds.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reasons.map((reason, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-accent">
                {reason.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
