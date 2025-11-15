import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Code } from 'lucide-react'

export default function IntegrationShowcase() {
  const variants = [
    { text: "You left your products in your cart 🛒", language: "English" },
    { text: "You forgot something in your cart!", language: "English (Variant)" },
    { text: "Ai uitat ceva in cosul de cumparaturi!", language: "Romanian" },
    { text: "Your cart is waiting for you 💕", language: "English (Emoji)" },
    { text: "Complete your purchase before items sell out!", language: "English (Urgent)" }
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
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[400px,1fr] gap-8 items-start">
            {/* Left: JSON Snippet */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sticky top-8"
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

            {/* Right: Variants with Arrows */}
            <div className="relative space-y-6 lg:pl-16">
              {/* Section Label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-4"
              >
                <Sparkles className="w-4 h-4 text-accent-coral" />
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  AI Generated Variants
                </span>
              </motion.div>

              {/* Vertical Connection Line */}
              <div className="absolute -left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-accent-coral via-accent-coral/50 to-transparent hidden lg:block"></div>
              
              {/* AI Processing Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute -left-[42px] top-[calc(50%+2rem)] -translate-y-1/2 hidden lg:block z-10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-accent-coral to-pink-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              {variants.map((variant, index) => (
                <VariantCard
                  key={index}
                  variant={variant}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VariantCard({ variant, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.3 }}
      className="relative"
    >
      {/* Connecting Arrow from vertical line (hidden on mobile) */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 hidden lg:flex items-center">
        <div className="w-12 h-0.5 bg-accent-coral/40"></div>
        <div className="w-3 h-3 rounded-full bg-accent-coral"></div>
      </div>

      {/* Variant Card */}
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-accent-coral/50 transition-all"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-coral rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {index + 1}
            </div>
            <span className="text-xs font-semibold text-accent-coral bg-accent-coral/10 px-3 py-1 rounded-full">
              {variant.language}
            </span>
          </div>
        </div>
        <p className="text-gray-900 font-medium leading-relaxed">
          {variant.text}
        </p>
      </motion.div>
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
