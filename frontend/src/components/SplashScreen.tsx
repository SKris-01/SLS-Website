import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/icon/logo.png'

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 1000) 
          return 100
        }
        return prev + 1 // Consistent linear progress for stability
      })
    }, 30) // Faster but smoother

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-[9999] bg-[#5B0F2E] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Victorian Ornaments */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 border-t-4 border-l-4 border-[#C9A66B] m-8 rounded-tl-[100px]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 border-t-4 border-r-4 border-[#C9A66B] m-8 rounded-tr-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 border-b-4 border-l-4 border-[#C9A66B] m-8 rounded-bl-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 border-b-4 border-r-4 border-[#C9A66B] m-8 rounded-br-[100px]"></div>
      </div>

      <div className="relative max-w-2xl w-full flex flex-col items-center px-10 text-center space-y-12">
        {/* Logo with ornate frame */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center"
        >
          {/* Spinning Outer Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border-2 border-[#C9A66B]/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-[#C9A66B]/40 rounded-full"
          />
          
          <div className="relative w-40 h-40 md:w-48 md:h-48 bg-white p-6 rounded-full shadow-2xl flex items-center justify-center border-4 border-[#C9A66B] z-10">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        {/* Message */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ fontSize: '42px' }}
            className="font-serif font-bold italic text-[#C9A66B] tracking-tight leading-tight whitespace-nowrap"
          >
            Welcome to Shriyans Lotus Seeds
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/40"
          >
            The Elite Makhana Collection
          </motion.p>
        </div>

        {/* Loading Bar */}
        <div className="w-full space-y-4">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-[#C9A66B]/10 p-[1px]">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#C9A66B] to-[#E5C387] rounded-full shadow-[0_0_15px_rgba(201,166,107,0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#C9A66B]/60">
            <span className="w-24 text-left">EST. 2024</span>
            <span className="tabular-nums w-12 text-center">{Math.round(progress)}%</span>
            <span className="w-24 text-right">PREMIUM</span>
          </div>
        </div>
      </div>

      {/* Background Texture/Grain */}
      <div className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
    </motion.div>
  )
}

export default SplashScreen
