export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">MindScribe Pro</h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mb-8">
          La plateforme moderne pour planifier, écrire et illustrer vos livres avec l’aide de l’IA.
        </p>
        <div className="flex gap-3">
          <a href="/signup" className="px-6 py-3 bg-accent text-white rounded-xl">Commencer gratuitement</a>
          <a href="/login" className="px-6 py-3 border border-border rounded-xl text-text-primary">Se connecter</a>
        </div>
      </section>
    </div>
  )
}
