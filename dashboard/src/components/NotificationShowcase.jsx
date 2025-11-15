import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'

export default function NotificationShowcase() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
        >
          <span className="text-accent-coral">AI-Powered</span> Variants
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600"
        >
          Watch as our AI generates and tests the perfect message
        </motion.p>
      </div>

      <div className="relative flex justify-center items-start overflow-hidden" style={{ maxHeight: '400px' }}>
        {/* iPhone Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <PhoneMockup />
        </motion.div>

        {/* Floating Notification Card */}
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          whileInView={{ opacity: 1, y: 0, x: '-50%' }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ y: -5, x: '-50%' }}
          className="absolute top-8 md:top-12 w-[90%] md:w-[600px] z-10"
          style={{ left: '50%' }}
        >
          <NotificationCard />
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-accent-coral/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-coral/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      </div>
    </div>
  )
}

function PhoneMockup() {
  return (
    <div className="relative w-[280px] md:w-[340px] h-[560px] md:h-[680px]">
      {/* Phone Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[50px] shadow-2xl p-3">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20"></div>
        
        {/* Screen */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[42px] overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-sm font-semibold z-10">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 border-2 border-white rounded-sm"></div>
              <div className="w-4 h-3 border-2 border-white rounded-sm"></div>
              <div className="w-4 h-3 border-2 border-white rounded-sm"></div>
            </div>
          </div>

          {/* App Icons Grid */}
          <div className="absolute inset-0 pt-20 px-6">
            <div className="grid grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
        </div>
      </div>

      {/* Shadow */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[85%] h-8 bg-black/30 blur-2xl rounded-full"></div>
    </div>
  )
}

function NotificationCard() {
  const [currentVariant, setCurrentVariant] = useState(0)
  
  // Notification variants with words that will rotate
  const variants = [
    {
      title: ['Limited', 'Time', 'Deal!'],
      message: ['Get', 'an', 'exclusive', 'offer', 'on', 'your', 'favorite', 'coffee!', "Don't", 'miss', 'out!']
    },
    {
      title: ['Today', 'Only!'],
      message: ['Enjoy', 'a', 'special', 'discount', 'on', 'your', 'go-to', 'brew!', "Don't", 'miss', 'out!']
    },
    {
      title: ['Flash', 'Sale!'],
      message: ['Grab', 'this', 'amazing', 'deal', 'on', 'your', 'beloved', 'espresso!', "Don't", 'miss', 'out!']
    },
    {
      title: ['Hot', 'Deal!'],
      message: ['Score', 'a', 'fantastic', 'price', 'on', 'your', 'favorite', 'latte!', "Don't", 'miss', 'out!']
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVariant((prev) => (prev + 1) % variants.length)
    }, 5000) // Increased to 5 seconds for better viewing
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border border-white/20">
      <div className="flex items-start gap-4">
        {/* App Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-accent-coral to-accent-pink rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bell className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with slot animation */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-gray-400 text-sm">☕</span>
            {variants[currentVariant].title.map((word, index) => (
              <SlotWord 
                key={`title-${index}`} 
                word={word} 
                delay={index * 0.1}
                variant={currentVariant}
              />
            ))}
            <span className="text-gray-400 text-xs ml-auto">now</span>
          </div>

          {/* Message with slot animation */}
          <div className="text-sm text-gray-200 leading-relaxed flex flex-wrap gap-1">
            {variants[currentVariant].message.map((word, index) => (
              <SlotWord 
                key={`message-${index}`} 
                word={word} 
                delay={variants[currentVariant].title.length * 0.1 + index * 0.08}
                variant={currentVariant}
              />
            ))}
          </div>
        </div>

        {/* Preview Image */}
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex-shrink-0 shadow-lg flex items-center justify-center">
          <span className="text-2xl">☕</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-1.5 mt-4 justify-center">
        {variants.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentVariant 
                ? 'w-8 bg-accent-coral' 
                : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function SlotWord({ word, delay, variant }) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 600)
    return () => clearTimeout(timer)
  }, [variant])

  return (
    <div className="relative inline-block overflow-hidden h-6">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${word}-${variant}`}
          initial={{ y: isAnimating ? 30 : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: delay,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="inline-block font-semibold"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
