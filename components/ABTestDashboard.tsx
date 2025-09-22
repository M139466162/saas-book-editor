'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, BarChart3, Settings, RefreshCw } from 'lucide-react'
import { ABTestStats, ABTestCTAButtons, ABTestFeatureCards, useABTest } from './ABTesting'

interface ABTestDashboardProps {
  onVariantChange?: (variant: string) => void
}

export default function ABTestDashboard({ onVariantChange }: ABTestDashboardProps) {
  const [activeTab, setActiveTab] = useState('tests')
  const [showStats, setShowStats] = useState(false)

  const tabs = [
    { id: 'tests', label: 'Tests Actifs', icon: <Play className="w-4 h-4" /> },
    { id: 'stats', label: 'Statistiques', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'config', label: 'Configuration', icon: <Settings className="w-4 h-4" /> }
  ]

  const resetTestData = () => {
    localStorage.removeItem('ab_test_events')
    localStorage.removeItem('ab_test_cta_buttons')
    localStorage.removeItem('ab_test_feature_cards')
    localStorage.removeItem('ab_test_data_cta_buttons')
    localStorage.removeItem('ab_test_data_feature_cards')
    window.location.reload()
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tests A/B Dashboard</h1>
          <p className="text-gray-600">Optimisez votre interface utilisateur avec des tests A/B intelligents</p>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.button
            onClick={resetTestData}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            Reset Data
          </motion.button>
          
          <motion.button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 className="w-4 h-4" />
            {showStats ? 'Masquer Stats' : 'Voir Stats'}
          </motion.button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'tests' && (
          <div className="space-y-12">
            {/* Test A/B des boutons CTA */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Test A/B : Boutons Call-to-Action</h2>
                <p className="text-gray-600">Comparaison de différents styles de boutons pour optimiser les conversions</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <ABTestCTAButtons onButtonClick={(variant) => {
                  console.log('CTA clicked with variant:', variant)
                  onVariantChange?.(variant)
                }} />
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-700">Control</div>
                  <div className="text-blue-600">Boutons standards</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-700">Variant A</div>
                  <div className="text-purple-600">Boutons avec gradient</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-700">Variant B</div>
                  <div className="text-green-600">Boutons arrondis</div>
                </div>
              </div>
            </div>

            {/* Test A/B des cartes de fonctionnalités */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Test A/B : Cartes de Fonctionnalités</h2>
                <p className="text-gray-600">Test de différents styles de présentation pour les fonctionnalités</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8">
                <ABTestFeatureCards />
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-700">Control</div>
                  <div className="text-blue-600">Cartes simples</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-700">Variant A</div>
                  <div className="text-purple-600">Cartes avec animations</div>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <div className="font-medium text-pink-700">Variant B</div>
                  <div className="text-pink-600">Style neumorphisme</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <ABTestStats testId="cta_buttons" />
            <ABTestStats testId="feature_cards" />
          </div>
        )}

        {activeTab === 'config' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuration des Tests</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">📊 Métriques suivies</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Clics sur les boutons CTA</li>
                  <li>• Interactions avec les cartes de fonctionnalités</li>
                  <li>• Temps passé sur les sections</li>
                  <li>• Taux de conversion par variante</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-900 mb-2">⚡ Répartition des variantes</h3>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• Control: 33% des utilisateurs</li>
                  <li>• Variant A: 33% des utilisateurs</li>
                  <li>• Variant B: 33% des utilisateurs</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2">🔄 Persistance des données</h3>
                <ul className="text-purple-800 space-y-1 text-sm">
                  <li>• Les variantes sont assignées par session</li>
                  <li>• Les données sont stockées localement</li>
                  <li>• Les événements sont trackés en temps réel</li>
                  <li>• Possibilité de reset pour nouveaux tests</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats flottantes */}
      {showStats && (
        <motion.div
          className="fixed bottom-6 right-6 w-80 max-h-96 overflow-y-auto"
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Stats Temps Réel</h3>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <ABTestStats testId="cta_buttons" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}