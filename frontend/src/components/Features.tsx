import { Dumbbell, Flame, ShieldAlert, Heart } from 'lucide-react'

const Benefits = () => {
  const benefits = [
    {
      icon: <Dumbbell className="w-8 h-8 text-black" />,
      title: "High Protein",
      description: "Essential for muscle building and repairing tissues, making it a perfect post-workout snack."
    },
    {
      icon: <Flame className="w-8 h-8 text-black" />,
      title: "Low Calories",
      description: "A guilt-free snack that keeps you full longer without the extra calorie load."
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-black" />,
      title: "Rich in Antioxidants",
      description: "Powerful compounds that help fight inflammation and protect your cells from damage."
    },
    {
      icon: <Heart className="w-8 h-8 text-black" />,
      title: "Heart Healthy",
      description: "Low in sodium and cholesterol, promoting better cardiovascular health with every crunch."
    }
  ]

  return (
    <section className="py-20 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-16 uppercase tracking-tight">
          Benefits of Makhana
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group border border-primary/5 hover:border-accent/40">
              <div className="mb-6 p-4 bg-white border border-primary/10 rounded-2xl transition-all duration-300 shadow-md group-hover:shadow-lg">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider font-serif">
                {benefit.title}
              </h3>
              <p className="text-primary/60 leading-relaxed font-sans text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
