import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Zap, TrendingUp, BarChart3 } from 'lucide-react'
import { useRive } from '@rive-app/react-canvas'
import NotificationShowcase from '../components/NotificationShowcase'
import IntegrationShowcase from '../components/IntegrationShowcase'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Dark Background */}
      <div className="notebook-bg relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-coral/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-coral/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <img 
                src="/logo.png" 
                alt="PushBunny Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold">
                <span className="text-accent-coral">Push</span>
                <span className="text-white">Bunny</span>
              </span>
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

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Animated Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <TypingWord />
                <br />
                <span className="text-white">Notifications</span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-400 mb-8 max-w-xl"
            >
              Boost engagement with intelligent notification variants powered by Gemini AI. 
              Test, optimize, and deliver messages that convert.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                to="/dashboard"
                className="px-8 py-4 bg-accent-coral rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-accent-coral/50 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="px-8 py-4 glass glass-hover rounded-xl font-semibold text-lg transition-all text-center"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Rive Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="w-full max-w-xl">
              <RiveAnimation />
            </div>
          </motion.div>
        </div>
        </div>
      </div>

      {/* AI-Powered Variants Section with White Background */}
      <div className="bg-white py-20">
        <NotificationShowcase />
      </div>

      {/* Integration Showcase Section */}
      <IntegrationShowcase />

      {/* Features Section with White Background */}
      <div id="features" className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              <span className="text-accent-coral">Powerful</span> Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your notification strategy
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
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
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white p-6 rounded-2xl hover:shadow-xl transition-all group border border-gray-200"
    >
      <div className="w-12 h-12 rounded-xl bg-accent-coral flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

function TypingWord() {
  const words = ['Better', 'Faster', 'Creative', 'Smart']
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseAtEnd = 2000

    const timer = setTimeout(() => {
      if (!isDeleting && displayedText === currentWord) {
        // Pause at the end of the word
        setTimeout(() => setIsDeleting(true), pauseAtEnd)
      } else if (isDeleting && displayedText === '') {
        // Move to next word
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      } else if (isDeleting) {
        // Delete character
        setDisplayedText(currentWord.substring(0, displayedText.length - 1))
      } else {
        // Type character
        setDisplayedText(currentWord.substring(0, displayedText.length + 1))
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [displayedText, isDeleting, currentWordIndex, words])

  return (
    <span className="text-accent-coral">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

function RiveAnimation() {
  const { RiveComponent } = useRive({
    src: '/pushbunny.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  })

  return (
    <div className="w-full h-[620px] lg:h-[760px] flex items-center justify-center">
      <RiveComponent />
    </div>
  )
}
