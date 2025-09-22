'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Users, Eye, Heart, Zap, BarChart3 } from 'lucide-react'

// A/B Test Configuration
const ABTestVariants = {
  CONTROL: 'control',
  VARIANT_A: 'variant_a',
  VARIANT_B: 'variant_b'
} as const

type Variant = typeof ABTestVariants[keyof typeof ABTestVariants]

interface ABTestConfig {
  id: string
  name: string
  description: string
  variants: {
    control: {
      name: string
      description: string
      component: React.ComponentType<any>
    }
    variant_a: {
      name: string
      description: string
      component: React.ComponentType<any>
    }
    variant_b?: {
      name: string
      description: string
      component: React.ComponentType<any>
    }
  }
  metrics: string[]
  active: boolean
}

// Hook pour gérer les tests A/B
export function useABTest(testId: string) {
  const [variant, setVariant] = useState<Variant>(ABTestVariants.CONTROL)
  const [testData, setTestData] = useState<any>({})

  useEffect(() => {
    // Récupérer la variante stockée ou en assigner une nouvelle
    const storedVariant = localStorage.getItem(`ab_test_${testId}`)
    
    if (storedVariant && Object.values(ABTestVariants).includes(storedVariant as Variant)) {
      setVariant(storedVariant as Variant)
    } else {
      // Assigner aléatoirement une variante (33% pour chaque)
      const variants = Object.values(ABTestVariants)
      const randomVariant = variants[Math.floor(Math.random() * variants.length)]
      setVariant(randomVariant)
      localStorage.setItem(`ab_test_${testId}`, randomVariant)
    }

    // Charger les données de test
    const data = localStorage.getItem(`ab_test_data_${testId}`)
    if (data) {
      setTestData(JSON.parse(data))
    }
  }, [testId])

  const trackEvent = (eventName: string, properties?: any) => {
    const eventData = {
      testId,
      variant,
      eventName,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId()
    }

    // Stocker l'événement localement
    const existingEvents = JSON.parse(localStorage.getItem('ab_test_events') || '[]')
    existingEvents.push(eventData)
    localStorage.setItem('ab_test_events', JSON.stringify(existingEvents))

    // Ici, vous pourriez envoyer les données à votre service d'analytics
    console.log('A/B Test Event:', eventData)
  }

  return {
    variant,
    trackEvent,
    isControl: variant === ABTestVariants.CONTROL,
    isVariantA: variant === ABTestVariants.VARIANT_A,
    isVariantB: variant === ABTestVariants.VARIANT_B
  }
}

// Utilitaire pour générer un ID de session
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// Composant pour afficher les statistiques des tests A/B
export function ABTestStats({ testId }: { testId: string }) {
  const [events, setEvents] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('ab_test_events') || '[]')
    const testEvents = storedEvents.filter((e: any) => e.testId === testId)
    setEvents(testEvents)

    // Calculer les statistiques
    const variantStats = testEvents.reduce((acc: any, event: any) => {
      if (!acc[event.variant]) {
        acc[event.variant] = {
          totalEvents: 0,
          uniqueSessions: new Set(),
          eventTypes: {}
        }
      }

      acc[event.variant].totalEvents++
      acc[event.variant].uniqueSessions.add(event.sessionId)
      
      if (!acc[event.variant].eventTypes[event.eventName]) {
        acc[event.variant].eventTypes[event.eventName] = 0
      }
      acc[event.variant].eventTypes[event.eventName]++

      return acc
    }, {})

    // Convertir les Sets en arrays pour l'affichage
    Object.keys(variantStats).forEach(variant => {
      variantStats[variant].uniqueSessionsCount = variantStats[variant].uniqueSessions.size
      delete variantStats[variant].uniqueSessions
    })

    setStats(variantStats)
  }, [testId])

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Statistiques du test A/B</h3>
          <p className="text-sm text-gray-500">Test ID: {testId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(stats).map(([variant, data]: [string, any]) => (
          <motion.div
            key={variant}
            className="bg-gray-50 rounded-lg p-4 border border-gray-100"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="font-medium text-gray-900 mb-3 capitalize">
              {variant.replace('_', ' ')}
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sessions uniques</span>
                <span className="font-semibold text-gray-900">{data.uniqueSessionsCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total événements</span>
                <span className="font-semibold text-gray-900">{data.totalEvents || 0}</span>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Types d'événements:</p>
                {Object.entries(data.eventTypes || {}).map(([eventType, count]: [string, any]) => (
                  <div key={eventType} className="flex justify-between text-xs">
                    <span className="text-gray-600">{eventType}</span>
                    <span className="text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune donnée de test disponible pour le moment</p>
        </div>
      )}
    </motion.div>
  )
}

// Test A/B pour les boutons de call-to-action
export function ABTestCTAButtons({ onButtonClick }: { onButtonClick: (variant: string) => void }) {
  const { variant, trackEvent } = useABTest('cta_buttons')

  const handleClick = (buttonType: string) => {
    trackEvent('cta_click', { buttonType, variant })
    onButtonClick(variant)
  }

  // Version Control - Boutons standards
  if (variant === ABTestVariants.CONTROL) {
    return (
      <div className="flex gap-4">
        <button 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => handleClick('primary')}
        >
          Créer un livre
        </button>
        <button 
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => handleClick('secondary')}
        >
          Explorer les modèles
        </button>
      </div>
    )
  }

  // Variant A - Boutons avec icônes et animations
  if (variant === ABTestVariants.VARIANT_A) {
    return (
      <div className="flex gap-4">
        <motion.button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          onClick={() => handleClick('primary')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-5 h-5" />
          Créer un livre
        </motion.button>
        <motion.button 
          className="border-2 border-purple-300 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
          onClick={() => handleClick('secondary')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-5 h-5" />
          Explorer les modèles
        </motion.button>
      </div>
    )
  }

  // Variant B - Boutons arrondis avec émojis
  return (
    <div className="flex gap-4">
      <motion.button 
        className="bg-green-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg font-medium"
        onClick={() => handleClick('primary')}
        whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)' }}
        whileTap={{ scale: 0.98 }}
      >
        <span>✨</span>
        Commencer maintenant
      </motion.button>
      <motion.button 
        className="bg-white border-2 border-green-500 text-green-700 px-8 py-4 rounded-full hover:bg-green-50 transition-colors flex items-center gap-3 text-lg font-medium shadow-lg"
        onClick={() => handleClick('secondary')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>📚</span>
        Voir les exemples
      </motion.button>
    </div>
  )
}

// Test A/B pour les cartes de fonctionnalités
export function ABTestFeatureCards() {
  const { variant, trackEvent } = useABTest('feature_cards')

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "IA Intégrée", desc: "Assistance IA pour l'écriture" },
    { icon: <Heart className="w-6 h-6" />, title: "Interface Intuitive", desc: "Éditeur Canva-style facile" },
    { icon: <Users className="w-6 h-6" />, title: "Templates Pro", desc: "Modèles professionnels" }
  ]

  const handleCardClick = (featureTitle: string) => {
    trackEvent('feature_card_click', { featureTitle, variant })
  }

  // Version Control - Cartes simples
  if (variant === ABTestVariants.CONTROL) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="text-center p-6 bg-white rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick(feature.title)}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="text-blue-600">{feature.icon}</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    )
  }

  // Variant A - Cartes avec hover effects et gradients
  if (variant === ABTestVariants.VARIANT_A) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="text-center p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl border border-blue-100 cursor-pointer group"
            onClick={() => handleCardClick(feature.title)}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <div className="text-white">{feature.icon}</div>
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    )
  }

  // Variant B - Cartes avec style neumorphisme
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {features.map((feature, index) => (
        <motion.div 
          key={index}
          className="text-center p-8 bg-gray-50 rounded-2xl cursor-pointer group"
          style={{
            boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff'
          }}
          onClick={() => handleCardClick(feature.title)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-white">{feature.icon}</div>
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
            {feature.title}
          </h3>
          <p className="text-gray-700 font-medium">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default {
  useABTest,
  ABTestStats,
  ABTestCTAButtons,
  ABTestFeatureCards,
  ABTestVariants
}