import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { getAllIntents } from '../services/api'
import { 
  LogOut, 
  RefreshCw, 
  TrendingUp, 
  MousePointerClick, 
  Send,
  Sparkles
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Dashboard() {
  const { logout, apiKey } = useAuth()
  const [intents, setIntents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIntent, setSelectedIntent] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const data = await getAllIntents(apiKey)
      setIntents(data)
      if (data.length > 0 && !selectedIntent) {
        setSelectedIntent(data[0].intentId)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [apiKey])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const currentIntentData = intents.find(i => i.intentId === selectedIntent)

  // Calculate statistics
  const stats = currentIntentData ? calculateStats(currentIntentData.variants) : null

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen notebook-bg">
      {/* Header */}
      <header className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="PushBunny Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-accent-coral">Push</span>
                <span className="text-white">Bunny</span>
              </h1>
              <p className="text-xs text-gray-400">Analytics Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="glass glass-hover px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="glass glass-hover px-4 py-2 rounded-xl flex items-center gap-2 text-red-400"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {intents.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Intent Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {intents.map((intent) => (
                <motion.button
                  key={intent.intentId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIntent(intent.intentId)}
                  className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedIntent === intent.intentId
                      ? 'bg-gradient-to-r from-accent-purple to-accent-blue shadow-lg'
                      : 'glass glass-hover'
                  }`}
                >
                  {formatIntentName(intent.intentId)}
                </motion.button>
              ))}
            </div>

            {/* Stats Cards */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <StatCard
                  icon={<Send className="w-5 h-5" />}
                  label="Total Sent"
                  value={stats.totalSent}
                  color="blue"
                />
                <StatCard
                  icon={<MousePointerClick className="w-5 h-5" />}
                  label="Total Clicked"
                  value={stats.totalClicked}
                  color="purple"
                />
                <StatCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Click Rate"
                  value={`${stats.ctr}%`}
                  color="pink"
                />
              </motion.div>
            )}

            {/* Charts */}
            {currentIntentData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Performance by Variant">
                  <BarChartComponent variants={currentIntentData.variants} />
                </ChartCard>
                
                <ChartCard title="Engagement Metrics">
                  <LineChartComponent variants={currentIntentData.variants} />
                </ChartCard>
              </div>
            )}

            {/* Variants Table */}
            {currentIntentData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-accent-purple" />
                    Message Variants
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {currentIntentData.variants.length} variants for {formatIntentName(selectedIntent)}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Message</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Sent</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Clicked</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {currentIntentData.variants.map((variant, index) => (
                          <VariantRow key={variant.variant_id} variant={variant} index={index} />
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: 'from-accent-blue/20 to-accent-blue/5',
    purple: 'from-accent-purple/20 to-accent-purple/5',
    pink: 'from-accent-pink/20 to-accent-pink/5',
    green: 'from-accent-green/20 to-accent-green/5',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/5">
          {icon}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  )
}

function ChartCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-6 rounded-2xl"
    >
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      {children}
    </motion.div>
  )
}

function BarChartComponent({ variants }) {
  const data = variants.map((v, i) => ({
    name: `V${i + 1}`,
    sent: v.sent,
    clicked: v.clicked,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0A0828', 
            border: '1px solid #ffffff20',
            borderRadius: '12px'
          }}
        />
        <Bar dataKey="sent" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        <Bar dataKey="clicked" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function LineChartComponent({ variants }) {
  const data = variants.map((v, i) => ({
    name: `V${i + 1}`,
    'CTR': v.sent > 0 ? ((v.clicked / v.sent) * 100).toFixed(1) : 0,
    'Sent': v.sent,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0A0828', 
            border: '1px solid #ffffff20',
            borderRadius: '12px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="CTR" 
          stroke="#8B5CF6" 
          strokeWidth={3}
          dot={{ fill: '#8B5CF6', r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="Sent" 
          stroke="#3B82F6" 
          strokeWidth={3}
          dot={{ fill: '#3B82F6', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function VariantRow({ variant, index }) {
  const ctr = variant.sent > 0 ? ((variant.clicked / variant.sent) * 100).toFixed(1) : 0

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5 hover:bg-white/5 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {index + 1}
          </div>
          <p className="text-sm leading-relaxed">{variant.message}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="px-3 py-1 bg-accent-blue/20 rounded-lg text-sm font-medium">
          {variant.sent}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="px-3 py-1 bg-accent-purple/20 rounded-lg text-sm font-medium">
          {variant.clicked}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`text-sm font-semibold ${
          ctr > 5 ? 'text-accent-green' : ctr > 2 ? 'text-accent-blue' : 'text-gray-400'
        }`}>
          {ctr}%
        </span>
      </td>
    </motion.tr>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen notebook-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-accent-purple/30 border-t-accent-purple rounded-full mx-auto mb-4"
        />
        <p className="text-gray-400">Loading dashboard...</p>
      </motion.div>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-12 h-12 text-accent-purple" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
      <p className="text-gray-400 mb-8">
        Start sending notifications to see analytics here
      </p>
    </motion.div>
  )
}

function calculateStats(variants) {
  const totalSent = variants.reduce((sum, v) => sum + v.sent, 0)
  const totalClicked = variants.reduce((sum, v) => sum + v.clicked, 0)
  const ctr = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : 0

  return { totalSent, totalClicked, ctr }
}

function formatIntentName(intentId) {
  return intentId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
