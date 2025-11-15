import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Zap, TrendingUp, BarChart3 } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-4xl">🐰</span>
            <span className="text-2xl font-bold gradient-text">PushBunny</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link 
              to="/dashboard"
              className="px-6 py-2.5 glass glass-hover rounded-xl font-medium transition-all"
            >
              Dashboard
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              AI-Optimized Push
              <br />
              <span className="gradient-text">Notifications</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Boost engagement with intelligent notification variants powered by Gemini AI. 
            Test, optimize, and deliver messages that convert.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-accent-purple/50 transition-all transform hover:scale-105"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-4 glass glass-hover rounded-xl font-semibold text-lg transition-all"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32"
        >
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="AI-Powered"
            description="Gemini AI generates optimal notification copy"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Real-time"
            description="Instant optimization based on user engagement"
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Performance"
            description="Track clicks, opens, and conversion rates"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Analytics"
            description="Comprehensive insights and reporting"
          />
        </motion.div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass p-6 rounded-2xl hover:bg-white/10 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}
