import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Layout } from '@/components/layout/Layout'
import {
  Home,
  Video,
  Image as ImageIcon,
  Lightbulb,
  BarChart2,
  Calendar,
  Cloud,
  Bell,
  Play,
  Sparkles,
  ChevronRight,
  Zap,
  Star,
  Moon,
  Sun,
  BookOpen,
  Layout as LayoutIcon,
  Megaphone,
  FileText,
  PieChart,
  Film,
} from 'lucide-react'
import { I18N_NAMESPACES } from '@/constants/i18n'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// Card Illustration Component - Same as HomePage.tsx
interface CardIllustrationProps {
  variant: 'comic' | 'ad' | 'info' | 'video'
}

const CardIllustration: React.FC<CardIllustrationProps> = ({ variant }) => {
  const configs = {
    comic: {
      bg: 'bg-violet-100 dark:bg-violet-900/20',
      accent: 'bg-violet-500',
      gradient: 'from-violet-500 to-fuchsia-500',
      BackIcon: BookOpen,
      FrontIcon: Sparkles,
      backColor: 'text-violet-300 dark:text-violet-800',
    },
    ad: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      accent: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
      BackIcon: LayoutIcon,
      FrontIcon: Megaphone,
      backColor: 'text-blue-300 dark:text-blue-800',
    },
    info: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/20',
      accent: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-teal-500',
      BackIcon: FileText,
      FrontIcon: PieChart,
      backColor: 'text-emerald-300 dark:text-emerald-800',
    },
    video: {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      accent: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-500',
      BackIcon: Film,
      FrontIcon: Play,
      backColor: 'text-orange-300 dark:text-orange-800',
    },
  }

  const config = configs[variant]
  const Back = config.BackIcon
  const Front = config.FrontIcon

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Background Blob */}
      <div className={`absolute w-32 h-32 rounded-full blur-3xl opacity-40 ${config.bg}`}></div>

      {/* Composition */}
      <div className="relative w-32 h-24">
        {/* Back Element (Context) */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center transform rotate-6 transition-transform group-hover:rotate-12 group-hover:translate-x-2`}
        >
          <Back size={40} className={`${config.backColor} opacity-50`} strokeWidth={1.5} />
          {/* Lines simulation */}
          <div className="absolute bottom-4 left-4 right-4 space-y-1.5 opacity-30">
            <div className="h-1 bg-current rounded-full w-3/4"></div>
            <div className="h-1 bg-current rounded-full w-1/2"></div>
          </div>
        </div>

        {/* Front Element (Action) */}
        <div
          className={`absolute bottom-0 left-2 w-16 h-16 rounded-2xl shadow-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white transform -rotate-3 transition-transform group-hover:-rotate-6 group-hover:-translate-y-1 group-hover:scale-105 ring-4 ring-white dark:ring-gray-800`}
        >
          <Front size={28} fill="currentColor" className="drop-shadow-sm" />
        </div>

        {/* Floating Badge (Decorative) */}
        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-md text-gray-400 dark:text-gray-500">
          <Star size={10} fill="currentColor" />
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  variant: 'comic' | 'ad' | 'info' | 'video'
  onClick: () => void
  badge?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  variant,
  onClick,
  badge,
}) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl/30 text-left transition-all duration-300 hover:-translate-y-1 w-full h-[280px]"
  >
    {/* Top Illustration Area */}
    <div className="flex-[3] w-full dark:from-white/5 p-4 relative overflow-hidden">
      <CardIllustration variant={variant} />

      {badge && (
        <div className="absolute top-4 left-4">
          <span className="bg-black/5 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-black/5 dark:border-white/10">
            {badge}
          </span>
        </div>
      )}
    </div>

    {/* Bottom Content Area */}
    <div className="flex-[2] flex flex-col items-center text-center px-6 pb-6 pt-2">
      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-[rgb(171,223,0)] dark:group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
        {description}
      </p>

      {/* Hover Arrow */}
      <div className="mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
          Create <ChevronRight size={14} />
        </div>
      </div>
    </div>
  </button>
)

interface InspirationCardProps {
  title: string
  duration: string
  views: string
  imageUrl: string
}

const InspirationCard: React.FC<InspirationCardProps> = ({
  title,
  duration,
  views,
  imageUrl,
}) => (
  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
    <img
      src={imageUrl}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      alt={title}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90"></div>

    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/10 shadow-sm">
      <Sparkles size={10} className="text-amber-300 fill-amber-300" />
      <span className="text-[10px] font-bold text-white tracking-wide shadow-black/50 drop-shadow-sm">
        GEMINI
      </span>
    </div>

    <div className="absolute bottom-4 left-4 right-4 text-white">
      <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
        <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/10">
          {duration}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-medium drop-shadow-md">
          <Play size={10} fill="currentColor" /> {views}
        </span>
      </div>
      <p className="text-sm font-bold truncate leading-tight drop-shadow-md">{title}</p>
    </div>
  </div>
)

const INSPIRATION_ITEMS = [
  { title: 'Neon City Walk', id: '1555680202-c86f0e12f086', views: '12K', duration: '00:05' },
  { title: 'Golden Hour', id: '1472214103451-9374bd1c798e', views: '1K', duration: '00:07' },
  { title: 'Abstract Flow', id: '1550684848-fac1c5b4e853', views: '45K', duration: '00:16' },
  { title: 'Deep Ocean', id: '1518837695005-2083093ee35b', views: '1K', duration: '00:07' },
  { title: 'Cyber Fashion', id: '1535295972055-1c762f4483e5', views: '8K', duration: '00:11' },
  { title: 'Future Tech', id: '1518770660439-4636190af475', views: '22K', duration: '00:09' },
  { title: 'Retro Vibe', id: '1525547719571-a2d4ac8945e2', views: '5K', duration: '00:12' },
  { title: 'Coffee Break', id: '1495474472287-4d71bcdd2085', views: '90K', duration: '00:06' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('trending')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [lang, setLang] = useState<'en' | 'vi'>('en')

  // Load theme and lang from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const savedLang = localStorage.getItem('lang') as 'en' | 'vi' | null
    if (savedTheme) setTheme(savedTheme)
    if (savedLang) setLang(savedLang)
  }, [])

  // Apply theme
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Save lang
  React.useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const handleStartBuilding = () => {
    router.push('/editor')
  }

  const handleBrowseTemplates = () => {
    router.push('/dashboard/templates')
  }

  const handleImportNow = () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const jsonString = event.target?.result as string
            const workflowData = JSON.parse(jsonString)
            localStorage.setItem('pending_import_workflow', JSON.stringify(workflowData))
            router.push('/editor?import=true')
          } catch (error) {
            console.error('Error loading workflow:', error)
            alert('Failed to load workflow. Please check the file format.')
          }
        }
        reader.readAsText(file)
      }
      input.click()
    } catch (error) {
      console.error('Error opening file dialog:', error)
      alert('Failed to open file dialog. Please try again.')
    }
  }

  return (
    <Layout showHeader={false} showFooter={false} noIndex>
      <DashboardLayout>
        <div className="bg-gray-50/50 dark:bg-gray-900/50 flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8">
            {/* HERO */}
            <div className="flex flex-col items-center justify-center text-center mb-16 mt-4">
              <div className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-400 mb-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <Star size={12} className="fill-gray-400 dark:fill-gray-500 text-gray-400 dark:text-gray-500" />
                Vidtory Pro is free for now
                <ChevronRight size={12} className="text-gray-400 dark:text-gray-500" />
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                Hi! What do you feel like <br />
                <span
                  className="bg-gradient-to-r from-[rgb(171,223,0)] to-cyan-500 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgb(171, 223, 0), rgb(0, 226, 233))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  creating today? {' '}
                </span>
                <Sparkles className="inline w-8 h-8 md:w-10 md:h-10 ml-2 -mt-4 text-[rgb(171,223,0)] dark:text-cyan-400 animate-pulse" />
              </h2>
            </div>

            {/* CREATION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
              <FeatureCard
                title="Build Your First Workflow"
                description="Create your first AI workflow in minutes."
                variant="comic"
                onClick={handleStartBuilding}
                badge="POPULAR"
              />

              <FeatureCard
                title="Learn from Templates"
                description="Explore pre-built workflow templates."
                variant="ad"
                onClick={handleBrowseTemplates}
              />

              <FeatureCard
                title="Import Existing Project"
                description="Import your saved workflow files."
                variant="info"
                onClick={handleImportNow}
              />

              <FeatureCard
                title="Video Gen"
                description="Text to cinematic video clips."
                variant="video"
                onClick={() => {}}
                badge="SOON"
              />
            </div>

            {/* INSPIRATION */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => setActiveTab('trending')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                      activeTab === 'trending'
                        ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white'
                        : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    Trending on TikTok
                  </button>
                  <button
                    onClick={() => setActiveTab('showcase')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                      activeTab === 'showcase'
                        ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white'
                        : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    Image inspiration
                  </button>
                </div>
                <button className="text-xs font-bold text-[rgb(171,223,0)] dark:text-cyan-400 hover:text-[rgb(171,223,0)]/80 dark:hover:text-cyan-500 transition-colors flex items-center gap-1">
                  More inspirations <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {INSPIRATION_ITEMS.map((item, index) => (
                  <InspirationCard
                    key={index}
                    title={item.title}
                    duration={item.duration}
                    views={item.views}
                    imageUrl={`https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=600&q=80`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        I18N_NAMESPACES.COMMON,
        I18N_NAMESPACES.HOME,
      ])),
    },
  }
}
