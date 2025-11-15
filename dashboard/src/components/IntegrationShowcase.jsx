import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Code } from 'lucide-react'

export default function IntegrationShowcase() {
  const [activeVariant, setActiveVariant] = useState(0)

  const variants = [
    { text: "You left your products in your cart 🛒", color: "#FF938C" },
    { text: "You forgot something in your cart!", color: "#FF938C" },
    { text: "Ai uitat ceva in cosul de cumparaturi!", color: "#FF938C" },
    { text: "Your cart is waiting for you 💕", color: "#FF938C" }
  ]

  const jsonIntent = `{
  "intent_id": "cart_abandon",
  "context": "User is from <location>, New user",
  "base_message": "You left something in your cart!"
}`

  return (
    <div className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-coral/10 rounded-full mb-6">
            <Code className="w-4 h-4 text-accent-coral" />
            <span className="text-sm font-medium text-accent-coral">Simple Integration</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
            One JSON. <span className="text-accent-coral">Infinite Variants.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Send us a simple intent, and our AI generates optimized notification variants 
            tailored to your audience, location, and context.
          </p>
        </motion.div>

        {/* Main Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: JSON Snippet */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-accent-coral font-semibold flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Intent Payload
                </span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                <code>{jsonIntent}</code>
              </pre>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <StatBadge number="< 100ms" label="Response Time" />
              <StatBadge number="10+" label="AI Variants" />
              <StatBadge number="50+" label="Languages" />
            </div>
          </motion.div>

          {/* Right: Variant Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Center Hub */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 border-2 border-dashed border-accent-coral/30 rounded-full"
              />
              
              {/* Center Icon */}
              <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-accent-coral to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              {/* Variant Cards */}
              {variants.map((variant, index) => (
                <VariantCard
                  key={index}
                  variant={variant}
                  index={index}
                  total={variants.length}
                  isActive={activeVariant === index}
                  onClick={() => setActiveVariant(index)}
                />
              ))}
            </div>

            {/* Interactive Description */}
            <motion.div
              key={activeVariant}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 text-center"
            >
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Generated Variant {activeVariant + 1}/{variants.length}</p>
                <p className="text-lg font-semibold text-gray-900">{variants[activeVariant].text}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mt-20"
        >
          <FeatureBox
            icon="🌍"
            title="Context-Aware"
            description="Variants adapt to user location, language, and preferences"
          />
          <FeatureBox
            icon="⚡"
            title="Real-Time Generation"
            description="AI generates variants instantly when you send the intent"
          />
          <FeatureBox
            icon="📊"
            title="Auto-Optimization"
            description="Our system learns which variants perform best over time"
          />
        </motion.div>
      </div>
    </div>
  )
}

function VariantCard({ variant, index, total, isActive, onClick }) {
  const angle = (index / total) * 360
  const radius = 140
  const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius
  const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      className="absolute cursor-pointer"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-all ${
          isActive ? 'ring-4 ring-accent-coral ring-offset-2 ring-offset-white' : ''
        }`}
        style={{ backgroundColor: variant.color }}
      >
        {index + 1}
      </div>
      
      {/* Connection Line */}
      <motion.div
        className="absolute w-0.5 bg-gradient-to-b from-accent-coral/50 to-transparent origin-bottom"
        style={{
          height: radius - 40,
          left: '50%',
          bottom: '100%',
          transform: `rotate(${-angle + 90}deg) translateX(-50%)`
        }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.2 }}
      />
    </motion.div>
  )
}

function StatBadge({ number, label }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-200 text-center"
    >
      <p className="text-2xl font-bold text-accent-coral mb-1">{number}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </motion.div>
  )
}

function FeatureBox({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-accent-coral/50 hover:shadow-lg transition-all"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}
