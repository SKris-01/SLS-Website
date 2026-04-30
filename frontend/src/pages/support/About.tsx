import { Sparkles, ShieldCheck, Heart } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-[0.03] select-none pointer-events-none">
                <h1 className="text-[100px] md:text-[200px] font-serif font-black italic whitespace-nowrap">Shriyans</h1>
            </div>
          <h1 className="text-4xl md:text-8xl font-serif font-black text-primary mb-4 md:mb-6 italic tracking-tight">Our Story</h1>
          <p className="max-w-2xl mx-auto text-base md:text-xl text-primary/60 font-medium leading-relaxed px-4">
            Redefining the essence of healthy snacking through the purity of nature and the crunch of tradition.
          </p>
        </div>

        {/* Company Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-32">
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-5xl font-serif font-bold text-primary leading-tight">Healthy, Hand-Crafted, Honest</h2>
            <p className="text-primary/70 leading-relaxed text-lg italic">
              "Shriyans Lotus Seeds was born out of a passion for healthy, flavorful snacking. Our fox nuts (Makhana) are hand-picked from the pristine waters of natural ponds and roasted to perfection with hand-crafted spice blends."
            </p>
            <p className="text-primary/70 leading-relaxed text-lg">
              We believe that nature provides the best ingredients. That's why we use no preservatives, no artificial colors—just pure, crunch-tastic goodness that fueled generations before us.
            </p>
            <div className="pt-4 md:pt-8 grid grid-cols-3 gap-3 md:gap-8">
              <div className="text-center p-3 md:p-6 bg-secondary/10 rounded-2xl md:rounded-3xl border border-primary/5">
                <p className="text-xl md:text-3xl font-black text-primary italic">100%</p>
                <p className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-widest mt-1 md:mt-2">Organic</p>
              </div>
              <div className="text-center p-3 md:p-6 bg-secondary/10 rounded-2xl md:rounded-3xl border border-primary/5">
                <p className="text-xl md:text-3xl font-black text-primary italic">0%</p>
                <p className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-widest mt-1 md:mt-2">Additives</p>
              </div>
              <div className="text-center p-3 md:p-6 bg-secondary/10 rounded-2xl md:rounded-3xl border border-primary/5">
                <p className="text-xl md:text-3xl font-black text-primary italic">Pure</p>
                <p className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-widest mt-1 md:mt-2">Joy</p>
              </div>
            </div>
          </div>

          {/* about image part */}
          <div className="relative group">
              <div className="absolute -inset-4 bg-accent/5 rounded-[32px] md:rounded-[60px] blur-2xl group-hover:bg-accent/10 transition-all"></div>
              <div className="relative aspect-square bg-white p-2 rounded-[32px] md:rounded-[60px] shadow-soft border border-primary/5 overflow-hidden">
                 <div className="w-full h-full bg-secondary/10 rounded-[28px] md:rounded-[48px] overflow-hidden">
                    <img 
                      src="https://ik.imagekit.io/eh5y1ltnw/signal-2026-04-19-152512.jpeg" 
                      alt="Premium Shriyans Makhana" 
                      className="w-full h-full object-cover"
                    />
                 </div>
              </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-24 md:mb-32">
            <div className="bg-primary p-8 md:p-12 rounded-[32px] md:rounded-[48px] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6 italic text-accent">Our Vision</h3>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                    To become the global ambassador of traditional Indian superfoods, making healthy snacking an exquisite, accessible, and delightful experience for every household.
                </p>
            </div>
            <div className="bg-secondary/20 p-8 md:p-12 rounded-[32px] md:rounded-[48px] text-primary relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6 italic block">Our Mission</h3>
                <p className="text-primary/60 text-base md:text-lg leading-relaxed">
                    To empower health-conscious snackers by providing ethically sourced, nutritionally dense makhana products that honor traditional craftsmanship while embracing modern flavors.
                </p>
            </div>
        </div>

        {/* Values */}
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4 italic">Core Values</h2>
            <div className="w-12 h-1 bg-accent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: ShieldCheck, title: "Quality", desc: "Rigorous standards for every seed. Only the 'Big-N-Bold' make the cut." },
            { icon: Heart, title: "Transparency", desc: "Honest sourcing and clear communication about what goes into your bag." },
            { icon: Sparkles, title: "Innovation", desc: "Constantly experimenting with gourmet flavors to keep your snack bowl exciting." }
          ].map((v, i) => (
            <div key={i} className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-primary/5 shadow-soft hover:shadow-lg transition-all text-center group">
              <div className="mb-6 md:mb-8 p-3 md:p-4 bg-secondary/10 rounded-2xl md:rounded-3xl inline-block group-hover:bg-accent group-hover:text-white transition-colors">
                <v.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4 uppercase tracking-widest">{v.title}</h3>
              <p className="text-primary/60 text-xs md:text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
