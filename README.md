# 📚 MindScribe Pro - SaaS Book Editor

> Un éditeur de livres moderne avec IA intégrée, interface Canva-style et tests A/B pour optimiser l'expérience utilisateur.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-purple)](https://framer.com/motion/)

## ✨ Fonctionnalités Principales

### 🎨 **Interface Utilisateur Moderne**
- **Design System Unifié** : Tokens de design cohérents, palette de couleurs harmonieuse
- **Animations Fluides** : Micro-interactions avec Framer Motion et physique spring
- **Responsive Design** : Interface adaptative pour desktop et mobile
- **Mode Sombre Élégant** : Thème sombre professionnel avec accents colorés

### 🧪 **Tests A/B Avancés**
- **3 Variantes de Tests** : Control, Variant A (gradients), Variant B (neumorphisme)  
- **Dashboard Analytics** : Métriques en temps réel, suivi des conversions
- **Tracking Intelligent** : Événements utilisateur, sessions, performance
- **Interface de Configuration** : Gestion complète des tests et données

### 📝 **Éditeur Puissant**
- **Interface Canva-Style** : Éditeur visuel intuitif avec header professionnel
- **Édition en Temps Réel** : Sauvegarde automatique, indicateurs de statut
- **Rich Text Editor** : Tiptap intégré avec slash commands et markdown
- **IA Intégrée** : Assistance à l'écriture et génération de contenu

### 🚀 **Performance et UX**
- **Local-First** : Stockage avec Zustand + localStorage pour rapidité
- **Command Palette** : Navigation clavier avec ⌘K
- **Search Avancée** : Recherche temps réel dans livres et contenus
- **États de Chargement** : Feedback visuel professionnel pour toutes les actions

## 🛠 Stack Technique

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript 5.6 |
| **Styling** | Tailwind CSS 3.4, CSS-in-JS, Design Tokens |
| **Animations** | Framer Motion 10.16, CSS Transitions |
| **State** | Zustand 4.4, React Query 5.0 |
| **Éditeur** | Tiptap 2.1, Rich Text, Markdown |
| **UI/UX** | Radix UI, Lucide Icons, A/B Testing |
| **Outils** | ESLint, Prettier, Playwright, Rimraf |

## 🚀 Installation Rapide

```bash
# Cloner le repository
git clone https://github.com/M139466162/saas-book-editor.git
cd saas-book-editor

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Ouvrir dans le navigateur
open http://localhost:3001
```

## 📁 Architecture du Projet

```
saas-book-editor/
├── 📱 app/                     # Next.js App Router
│   ├── 🔌 api/                # Routes API (books, IA, export)
│   ├── 🏠 page.tsx            # Dashboard principal avec A/B tests
│   ├── 📝 book/[id]/          # Éditeur de livre individual
│   ├── 📋 templates/          # Galerie de templates
│   ├── 🧪 ab-testing/         # Dashboard tests A/B  
│   └── ⚙️ settings/           # Configuration utilisateur
├── 🎨 components/             # Composants React
│   ├── 🧪 ABTesting.tsx       # Système de tests A/B
│   ├── 📊 ABTestDashboard.tsx # Interface analytics
│   ├── 🎯 ui/DesignSystem.tsx # Tokens de design unifiés
│   └── 📝 RichTextEditor.tsx  # Éditeur Tiptap
├── 📚 lib/                    # Utilitaires core
│   ├── 🗃️ store.ts           # Gestion d'état Zustand
│   ├── 🔧 utils.ts           # Fonctions utilitaires
│   └── 📄 export.ts          # Export PDF/EPUB
└── 🎨 styles/                 # Styles globaux
    └── globals.css            # Design system CSS
```

## 🎯 Guide d'Utilisation

### 🆕 Créer un Nouveau Livre
1. **Via Interface** : Bouton "Créer un livre" (varie selon test A/B)
2. **Via Command Palette** : ⌘K → "Nouveau livre"  
3. **Via Templates** : Choisir un modèle prédéfini

### 🧪 Utiliser les Tests A/B
1. **Accéder au Dashboard** : `/ab-testing` dans l'URL
2. **Voir les Variantes** : 3 styles différents testés automatiquement
3. **Analyser les Métriques** : Clics, conversions, performance par variante
4. **Configurer les Tests** : Reset des données, paramètres avancés

### ✏️ Édition Avancée
1. **Interface Canva** : Header moderne avec outils intuitifs
2. **Édition Inline** : Clic sur titre pour édition directe
3. **Sauvegarde Auto** : Indicateurs visuels de synchronisation
4. **Rich Text** : Slash commands (/) pour blocs rapides

## 🧪 Tests A/B - Détails Techniques

### Types de Tests Implémentés

| Test | Contrôle | Variant A | Variant B |
|------|----------|-----------|-----------|
| **CTA Buttons** | Boutons standards | Gradients animés | Style arrondi + émojis |
| **Feature Cards** | Cartes simples | Hover effects + gradients | Neumorphisme + rotations |

### Métriques Suivies
- **Clics par variante** : Tracking précis des interactions
- **Sessions uniques** : Identification des utilisateurs
- **Taux de conversion** : Performance par variante  
- **Types d'événements** : Actions granulaires

## 🎨 Design System

### Palette de Couleurs
```css
/* Couleurs principales */
--gray-50: #f9fafb;    /* Backgrounds légers */
--gray-900: #111827;   /* Texte principal */
--blue-600: #2563eb;   /* Accents primaires */
--green-500: #10b981; /* Success states */
```

### Typographie
- **Headers** : text-3xl → text-xs (hiérarchie complète)
- **Weights** : font-light → font-black
- **Spacing** : Leading relaxed, tracking optimisé

## 📊 Performance

### Métriques Optimisées
- ⚡ **Time to Interactive** : < 2s
- 🎯 **Core Web Vitals** : Scores verts
- 📱 **Mobile Performance** : 90+ Lighthouse
- 🔄 **Animations** : 60fps natif

## 🔮 Roadmap & Fonctionnalités Futures

### 🏗️ En Développement
- [ ] **Collaboration Temps Réel** : Édition multi-utilisateurs
- [ ] **IA Avancée** : Intégration DeepSeek/Gemini
- [ ] **Export Avancé** : PDF professionnel, EPUB, Print-ready
- [ ] **Templates Premium** : Bibliothèque étendue de modèles

### 💡 Idées Futures  
- [ ] **Mode Zen** : Interface minimaliste pour écriture
- [ ] **Analytics Avancés** : Métriques de productivité, insights
- [ ] **Intégrations** : Notion, Obsidian, Google Docs
- [ ] **Mobile App** : Application native iOS/Android

## 🤝 Contribution

### Standards de Code
```bash
# Linter et formater
npm run lint        # ESLint avec rules strictes
npm run lint:fix    # Auto-fix des erreurs
```

## 📝 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour les détails.

---

## 🎯 À Propos

**MindScribe Pro** combine la puissance d'un éditeur moderne avec l'intelligence artificielle pour créer l'outil d'écriture ultime. Chaque pixel est pensé pour une expérience utilisateur exceptionnelle, de la première interaction jusqu'à la publication finale.

### 🏆 Points Forts
- **🎨 Design Cohérent** : Système unifié sur toutes les pages
- **🧪 Data-Driven** : Optimisation continue via tests A/B  
- **⚡ Performance Native** : Interactions fluides à 60fps
- **🤖 IA Intégrée** : Assistance intelligente pour l'écriture
- **📱 Responsive** : Expérience parfaite sur tous les appareils

*Construit avec ❤️ pour les écrivains, créateurs et penseurs de demain.*