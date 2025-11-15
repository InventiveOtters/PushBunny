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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
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
                <span className="text-gray-900">Bunny</span>
              </h1>
              <p className="text-xs text-gray-600">Analytics Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 text-gray-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 text-red-600 transition-colors"
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
                      ? 'bg-accent-coral text-white shadow-lg'
                      : 'bg-white border border-gray-300 hover:border-accent-coral text-gray-700'
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
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                    <Sparkles className="w-6 h-6 text-accent-coral" />
                    Message Variants
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentIntentData.variants.length} variants for {formatIntentName(selectedIntent)}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Message</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Sent</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Clicked</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">CTR</th>
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
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    purple: 'from-pink-50 to-pink-100 border-pink-200',
    pink: 'from-coral-50 to-coral-100 border-accent-coral/30',
    green: 'from-green-50 to-green-100 border-green-200',
  }

  const iconColorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-accent-coral',
    pink: 'bg-accent-coral',
    green: 'bg-green-500',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white border p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconColorClasses[color]} text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  )
}

function ChartCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-6 text-gray-900">{title}</h3>
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            color: '#111827'
          }}
        />
        <Bar dataKey="sent" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        <Bar dataKey="clicked" fill="#FF938C" radius={[8, 8, 0, 0]} />
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            color: '#111827'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="CTR" 
          stroke="#FF938C" 
          strokeWidth={3}
          dot={{ fill: '#FF938C', r: 4 }}
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
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-coral flex items-center justify-center font-semibold text-sm flex-shrink-0 text-white">
            {index + 1}
          </div>
          <p className="text-sm leading-relaxed text-gray-900">{variant.message}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
          {variant.sent}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="px-3 py-1 bg-coral-100 text-accent-coral rounded-lg text-sm font-medium">
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-accent-coral/30 border-t-accent-coral rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600">Loading dashboard...</p>
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
      <div className="w-24 h-24 bg-accent-coral/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-12 h-12 text-accent-coral" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900">No Data Yet</h2>
      <p className="text-gray-600 mb-8">
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
