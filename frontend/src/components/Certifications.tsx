import fssai from '../assets/icon/fassai.png'
import mca from '../assets/icon/Ministry_of_Corporate_Affairs_India.svg'
import msme from '../assets/icon/MSME_Logo.svg'
import startup from '../assets/icon/startup-india-hub-seeklogo-2.svg'

const Certifications = () => {
  const certifications = [
    { name: "Startup India", id: "startup-india", icon: startup },
    { name: "FSSAI", id: "fssai", icon: fssai },
    { name: "MSME", id: "msme", icon: msme },
    { name: "MCA", id: "mca", icon: mca }
  ]

  // Repeat certifications several times for a seamless loop on all screen sizes
  const loopCertifications = [...certifications, ...certifications]

  return (
    <section className="py-12 bg-white border-y border-primary/5 overflow-hidden pause-on-hover">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h3 className="text-center text-primary/40 uppercase tracking-[0.5em] text-xs font-black mb-10">Our Trusted Affiliations</h3>
        <div className="relative">
          <div className="animate-marquee flex gap-12 md:gap-24 items-center">
            {loopCertifications.map((cert, index) => (
              <div 
                key={`${cert.id}-${index}`} 
                className="flex-shrink-0 transition-all duration-500"
              >
                <img 
                  src={cert.icon} 
                  alt={cert.name} 
                  className="h-12 sm:h-20 md:h-28 w-auto object-contain cursor-default"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Certifications
