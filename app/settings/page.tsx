'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  Key, 
  TestTube, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useSettingsStore } from '@/lib/store'
import { useSession } from 'next-auth/react'

export default function SettingsPage() {
  const router = useRouter()
  const { updateSettings, ...settings } = useSettingsStore()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role || 'user'
  
  const [openRouterKey, setOpenRouterKey] = useState(settings.openRouterApiKey || '')
  const [sunraApiKey, setSunraApiKey] = useState(settings.sunraApiKey || '')
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false)
  const [showSunraKey, setShowSunraKey] = useState(false)
  
  const [testingOpenRouter, setTestingOpenRouter] = useState(false)
  const [testingSunra, setTestingSunra] = useState(false)
  const [openRouterStatus, setOpenRouterStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [sunraStatus, setSunraStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    await updateSettings({
      openRouterApiKey: openRouterKey,
      sunraApiKey: sunraApiKey
    })
    
    // Show success feedback
    // You could add a toast notification here
  }

  const testOpenRouterConnection = async () => {
    if (!openRouterKey.trim()) return
    
    setTestingOpenRouter(true)
    setOpenRouterStatus('idle')
    
    try {
      const response = await fetch('/api/test-openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: openRouterKey })
      })
      
      if (response.ok) {
        setOpenRouterStatus('success')
      } else {
        setOpenRouterStatus('error')
      }
    } catch (error) {
      setOpenRouterStatus('error')
    } finally {
      setTestingOpenRouter(false)
    }
  }

  const testSunraConnection = async () => {
    if (!sunraApiKey.trim()) return
    
    setTestingSunra(true)
    setSunraStatus('idle')
    
    try {
      const response = await fetch('/api/test-sunra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: sunraApiKey })
      })
      
      if (response.ok) {
        setSunraStatus('success')
      } else {
        setSunraStatus('error')
      }
    } catch (error) {
      setSunraStatus('error')
    } finally {
      setTestingSunra(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-xl font-semibold text-foreground">Paramètres</h1>
          </div>

          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          {/* User Profile & Plan (visible to all) */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Profil</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Email</label>
                  <Input defaultValue={session?.user?.email || ''} disabled />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Nom</label>
                  <Input defaultValue={(session?.user as any)?.name || ''} disabled />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Plan</label>
                  <select className="input w-full">
                    <option>Free</option>
                    <option>Pro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Modèle IA préféré</label>
                  <Input placeholder="ex: deepseek/deepseek-r1-distill-llama-70b" />
                </div>
              </div>
            </Card>
          </div>
          
          {/* API Keys Section (admins only) */}
          {role === 'admin' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys
            </h2>
            <p className="text-muted-foreground mb-6">
              Configure your API keys to enable AI-powered features
            </p>

            <div className="space-y-6">
              
              {/* OpenRouter API Key */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">OpenRouter API Key</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect to OpenRouter to use AI models like DeepSeek for text generation and enhancement.
                    </p>
                    
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Input
                          type={showOpenRouterKey ? 'text' : 'password'}
                          value={openRouterKey}
                          onChange={(e) => setOpenRouterKey(e.target.value)}
                          placeholder="sk-or-v1-..."
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                        >
                          {showOpenRouterKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={testOpenRouterConnection}
                        disabled={!openRouterKey.trim() || testingOpenRouter}
                        className="gap-2"
                      >
                        {testingOpenRouter ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <TestTube className="w-4 h-4" />
                        )}
                        Test
                      </Button>
                    </div>

                    {openRouterStatus === 'success' && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Connection successful
                      </div>
                    )}
                    
                    {openRouterStatus === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Connection failed - check your API key
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Get your API key from{' '}
                        <a 
                          href="https://openrouter.ai/keys" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          openrouter.ai/keys
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sunra AI API Key */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">Sunra AI API Key</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect to Sunra AI for advanced image generation capabilities.
                    </p>
                    
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Input
                          type={showSunraKey ? 'text' : 'password'}
                          value={sunraApiKey}
                          onChange={(e) => setSunraApiKey(e.target.value)}
                          placeholder="sunra_..."
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => setShowSunraKey(!showSunraKey)}
                        >
                          {showSunraKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={testSunraConnection}
                        disabled={!sunraApiKey.trim() || testingSunra}
                        className="gap-2"
                      >
                        {testingSunra ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <TestTube className="w-4 h-4" />
                        )}
                        Test
                      </Button>
                    </div>

                    {sunraStatus === 'success' && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Connection successful
                      </div>
                    )}
                    
                    {sunraStatus === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Connection failed - check your API key
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Get your API key from{' '}
                        <a 
                          href="https://sunra.ai/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          sunra.ai
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          )}

          {/* Usage Information */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Usage Information</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">OpenRouter Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Used for AI-powered text enhancement, writing suggestions, and content generation. 
                    DeepSeek models offer free tier usage.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Sunra AI Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Enables high-quality image generation for your book content and illustrations.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}