import React, { useState } from 'react';
import { 
  Home, Video, Image as ImageIcon, Lightbulb, Users, 
  BarChart2, Calendar, Cloud, Bell, Globe, 
  HelpCircle, Play, Mic, Sparkles, Search, ChevronRight, Zap,
  CreditCard, Layout, BookOpen, Megaphone, BarChart3, Wand2, Star,
  Moon, Sun, Music, FileText, Layers, PieChart, Film, Aperture,
  MessageSquare, MonitorPlay, Palette
} from 'lucide-react';
import { AppMode, Language } from '../types';
import { DSButton, DSCard, DSSidebarItem, DSSectionHeader } from './DesignSystem';

interface HomePageProps {
  onNavigate: (mode: AppMode) => void;
  credits: number;
  lang: Language;
  setLang: (l: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

// New Composed Illustration Component
interface CardIllustrationProps {
  variant: 'comic' | 'ad' | 'info' | 'video';
}

const CardIllustration: React.FC<CardIllustrationProps> = ({ variant }) => {
  const configs = {
    comic: {
      bg: 'bg-violet-100 dark:bg-violet-900/20',
      accent: 'bg-violet-500',
      gradient: 'from-violet-500 to-fuchsia-500',
      BackIcon: BookOpen,
      FrontIcon: Sparkles,
      backColor: 'text-violet-300 dark:text-violet-800'
    },
    ad: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      accent: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
      BackIcon: Layout,
      FrontIcon: Megaphone,
      backColor: 'text-blue-300 dark:text-blue-800'
    },
    info: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/20',
      accent: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-teal-500',
      BackIcon: FileText,
      FrontIcon: PieChart,
      backColor: 'text-emerald-300 dark:text-emerald-800'
    },
    video: {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      accent: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-500',
      BackIcon: Film,
      FrontIcon: Play,
      backColor: 'text-orange-300 dark:text-orange-800'
    }
  };

  const config = configs[variant];
  const Back = config.BackIcon;
  const Front = config.FrontIcon;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Background Blob */}
      <div className={`absolute w-32 h-32 rounded-full blur-3xl opacity-40 ${config.bg}`}></div>
      
      {/* Composition */}
      <div className="relative w-32 h-24">
         {/* Back Element (Context) */}
         <div className={`absolute top-0 right-0 w-20 h-20 bg-white dark:bg-default-100 rounded-2xl shadow-sm border border-default-200 flex items-center justify-center transform rotate-6 transition-transform group-hover:rotate-12 group-hover:translate-x-2`}>
            <Back size={40} className={`${config.backColor} opacity-50`} strokeWidth={1.5} />
            {/* Lines simulation */}
            <div className="absolute bottom-4 left-4 right-4 space-y-1.5 opacity-30">
                <div className="h-1 bg-current rounded-full w-3/4"></div>
                <div className="h-1 bg-current rounded-full w-1/2"></div>
            </div>
         </div>

         {/* Front Element (Action) */}
         <div className={`absolute bottom-0 left-2 w-16 h-16 rounded-2xl shadow-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white transform -rotate-3 transition-transform group-hover:-rotate-6 group-hover:-translate-y-1 group-hover:scale-105 ring-4 ring-background`}>
             <Front size={28} fill="currentColor" className="drop-shadow-sm" />
         </div>
         
         {/* Floating Badge (Decorative) */}
         <div className="absolute -bottom-2 -right-2 bg-white dark:bg-default-200 p-1.5 rounded-full shadow-md text-default-400">
             <Star size={10} fill="currentColor" />
         </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string; 
  description: string;
  variant: 'comic' | 'ad' | 'info' | 'video';
  onClick: () => void;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description,
  variant,
  onClick,
  badge
}) => (
  <button onClick={onClick} className="group relative flex flex-col rounded-large overflow-hidden bg-default-50 hover:bg-default-100 border border-default-100 hover:shadow-xl/30 text-left transition-all duration-300 hover:-translate-y-1 w-full h-[280px]">
    
    {/* Top Illustration Area */}
    <div className="flex-[3] w-full dark:from-white/5 p-4 relative overflow-hidden">
        <CardIllustration variant={variant} />
        
        {badge && (
          <div className="absolute top-4 left-4">
             <span className="bg-black/5 dark:bg-white/10 backdrop-blur-md text-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-black/5">
                {badge}
             </span>
          </div>
        )}
    </div>
    
    {/* Bottom Content Area */}
    <div className="flex-[2] flex flex-col items-center text-center px-6 pb-6 pt-2">
        <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-default-500 font-medium leading-relaxed">{description}</p>
        
        {/* Hover Arrow */}
        <div className="mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-default-500">
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                Create <ChevronRight size={14} />
            </div>
        </div>
    </div>
  </button>
);

interface InspirationCardProps {
  title: string;
  duration: string;
  views: string;
  imageUrl: string;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ title, duration, views, imageUrl }) => (
  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-primary-lg/30 transition-all hover:-translate-y-1">
    <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90"></div>
    
    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/10 shadow-sm">
        <Sparkles size={10} className="text-amber-300 fill-amber-300" />
        <span className="text-[10px] font-bold text-white tracking-wide shadow-black/50 drop-shadow-sm">GEMINI</span>
    </div>

    <div className="absolute bottom-4 left-4 right-4 text-white">
        <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
             <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/10">{duration}</span>
             <span className="flex items-center gap-1 text-[10px] font-medium drop-shadow-md"><Play size={10} fill="currentColor" /> {views}</span>
        </div>
        <p className="text-sm font-bold truncate leading-tight drop-shadow-md">{title}</p>
    </div>
  </div>
);

const INSPIRATION_ITEMS = [
  { title: "Neon City Walk", id: "1555680202-c86f0e12f086", views: "12K", duration: "00:05" }, 
  { title: "Golden Hour", id: "1472214103451-9374bd1c798e", views: "1K", duration: "00:07" }, 
  { title: "Abstract Flow", id: "1550684848-fac1c5b4e853", views: "45K", duration: "00:16" }, 
  { title: "Deep Ocean", id: "1518837695005-2083093ee35b", views: "1K", duration: "00:07" }, 
  { title: "Cyber Fashion", id: "1535295972055-1c762f4483e5", views: "8K", duration: "00:11" }, 
  { title: "Future Tech", id: "1518770660439-4636190af475", views: "22K", duration: "00:09" }, 
  { title: "Retro Vibe", id: "1525547719571-a2d4ac8945e2", views: "5K", duration: "00:12" }, 
  { title: "Coffee Break", id: "1495474472287-4d71bcdd2085", views: "90K", duration: "00:06" }
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, credits, lang, setLang, theme, setTheme }) => {
  const [activeTab, setActiveTab] = useState('trending');

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-brand-gradient selection:text-white">
      
      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex w-[260px] flex-col border-r border-divider bg-content1 shrink-0 z-20">
        <div className="h-20 flex items-center px-6 gap-3 shrink-0">
             <div className="w-auto h-10 text-foreground">
                <svg viewBox="0 0 483 154" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
                    <path d="M388.788 53.6475H405.032L423.392 97.165H423.792L440.44 55.2109H460.286L419.53 148.576H399.818L415.135 113.813H411.405L388.788 62.9453V73.3242H383.726C380.796 73.3242 378.132 73.6793 375.735 74.3896C373.426 75.0112 371.473 76.0324 369.875 77.4531C368.277 78.8738 367.033 80.7833 366.145 83.1807C365.346 85.4891 364.947 88.3303 364.947 91.7041V121.272H346.301V55.2109H362.283L364.014 69.1953H364.414C366.278 65.0221 368.365 61.8253 370.674 59.6055C372.982 57.2969 375.647 55.7435 378.666 54.9443C381.685 54.0565 385.059 53.6123 388.788 53.6123V53.6475ZM308.66 53.6123C315.053 53.6123 320.824 55.0777 325.974 58.0078C331.124 60.938 335.209 65.022 338.228 70.2607C341.247 75.4107 342.757 81.4043 342.757 88.2412C342.757 94.9893 341.247 100.983 338.228 106.222C335.209 111.372 331.124 115.457 325.974 118.476C320.825 121.406 315.009 122.871 308.527 122.871C302.223 122.871 296.495 121.406 291.345 118.476C286.195 115.457 282.111 111.372 279.092 106.222C276.073 100.983 274.563 94.9893 274.563 88.2412C274.563 81.4931 276.073 75.4995 279.092 70.2607C282.11 65.022 286.196 60.938 291.345 58.0078C296.495 55.0777 302.267 53.6123 308.66 53.6123ZM258.029 55.21H275.344V70.3936H258.029V97.5645C258.029 100.583 258.65 102.715 259.893 103.958C261.225 105.112 263.445 105.689 266.552 105.689H275.077V121.272H263.09C258.384 121.272 254.21 120.517 250.57 119.008C247.019 117.498 244.266 115.013 242.312 111.55C240.359 108.087 239.383 103.381 239.383 97.4316V70.3936H228.061V55.21H239.383L241.381 37.0967H258.029V55.21ZM308.66 69.4619C305.996 69.4619 303.51 70.1721 301.201 71.5928C298.892 72.9247 297.028 75.0113 295.607 77.8525C294.275 80.6051 293.609 84.068 293.609 88.2412C293.609 92.4145 294.275 95.9223 295.607 98.7637C297.028 101.516 298.848 103.603 301.068 105.023C303.377 106.355 305.863 107.021 308.527 107.021C311.368 107.021 313.899 106.355 316.119 105.023C318.427 103.603 320.247 101.516 321.579 98.7637C323 95.9223 323.711 92.4145 323.711 88.2412C323.711 84.068 323 80.6051 321.579 77.8525C320.247 75.0114 318.427 72.9246 316.119 71.5928C313.899 70.1721 311.412 69.4619 308.66 69.4619Z" fill="currentColor"/>
                    <path d="M67.4493 108.752H67.8497L91.9561 29.6382H113.134L83.0333 122.871H52.1329L22.0323 29.6382H43.0762L67.4493 108.752ZM135.278 122.871H115.3V29.6382H135.278V122.871ZM176.834 29.6382C187.578 29.6382 196.501 31.5918 203.605 35.4985C210.708 39.3166 215.947 44.733 219.321 51.7476C222.784 58.6734 224.516 66.8424 224.516 76.2544C224.516 85.5776 222.784 93.7466 219.321 100.761C215.947 107.687 210.708 113.103 203.605 117.01C196.59 120.917 187.622 122.871 176.7 122.871H143.271V29.6382H176.834ZM168.12 51.9546C165.345 50.3526 161.876 52.355 161.876 55.5591V96.9507C161.876 100.155 165.345 102.157 168.12 100.555L203.967 79.8589C206.741 78.2567 206.741 74.2519 203.967 72.6499L168.12 51.9546Z" fill="url(#paint0_linear_logo)"/>
                    <defs>
                    <linearGradient id="paint0_linear_logo" x1="22.0323" y1="38.608" x2="222.317" y2="117.951" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#ABDF00"/>
                    <stop offset="1" stop-color="#00E2E9"/>
                    </linearGradient>
                    </defs>
                </svg>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
            <DSSidebarItem icon={Home} label="Home" active />
            <DSSectionHeader title="Creation" />
            <DSSidebarItem icon={Video} label="Video generator" badge="SOON" />
            <DSSidebarItem icon={ImageIcon} label="Image studio" />
            <DSSidebarItem icon={Lightbulb} label="Inspiration" />
            
            <DSSectionHeader title="Management" />
            <DSSidebarItem icon={BarChart2} label="Analytics" />
            <DSSidebarItem icon={Calendar} label="Publisher" />
            
            <DSSectionHeader title="Space" />
            <DSSidebarItem icon={Cloud} label="Assets" />
        </div>

        <div className="p-4 mt-auto">
            <DSCard className="p-4 relative overflow-hidden group hover:border-primary/20" hoverable>
                <div className="absolute -right-4 -top-4 bg-primary/10 w-20 h-20 rounded-full blur-2xl"></div>
                <h4 className="font-bold text-sm mb-1 text-foreground flex items-center gap-1.5">
                    <Zap size={16} className="text-amber-500 fill-amber-500" /> Unlock Pro
                </h4>
                <p className="text-[11px] text-default-500 mb-3 leading-relaxed">Access premium templates & models.</p>
                <DSButton variant="gradient" size="md" className="w-full text-black">
                    Upgrade Plan
                </DSButton>
            </DSCard>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
        
        {/* HEADER */}
        <header className="h-16 px-6 md:px-10 flex items-center justify-between shrink-0 bg-background/80 backdrop-blur-md sticky top-0 z-20 shadow-sm hover:shadow-sm transition-colors">
            <h1 className="text-xl font-bold hidden md:block opacity-0">Home</h1>
            
            <div className="md:hidden flex items-center gap-2 text-primary">
                 <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-bold">V</div>
            </div>

            <div className="flex items-center gap-3 md:gap-6 ml-auto">
                <div className="hidden md:flex items-center gap-3 bg-default-100/50 hover:bg-default-100 px-4 py-2 rounded-full border border-default-200 transition-colors cursor-pointer group">
                    <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-default-700 group-hover:text-foreground transition-colors">{credits} credits</span>
                    <div className="w-px h-3 bg-default-300"></div>
                    <span className="text-xs font-bold text-primary hover:underline">Get more</span>
                </div>

                <div className="flex items-center gap-4 text-default-400">
                    <Bell size={20} className="hover:text-foreground cursor-pointer transition-colors" />
                    <div className="w-px h-4 bg-default-200"></div>
                    
                    <button 
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="p-1 hover:text-foreground transition-colors"
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <button 
                        onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors font-bold text-xs uppercase"
                        title="Switch Language"
                    >
                        <span className="text-lg leading-none">{lang === 'vi' ? '🇻🇳' : '🇺🇸'}</span>
                        {lang.toUpperCase()}
                    </button>
                </div>

                <div className="w-9 h-9 rounded-full bg-brand-gradient text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-background cursor-pointer hover:ring-default-300 transition-all">
                    M
                </div>
            </div>
        </header>

        {/* SCROLLABLE BODY */}
        <div className="bg-default-100/50 flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8">
                
                {/* HERO */}
                <div className="flex flex-col items-center justify-center text-center mb-16 mt-4">
                     <div className="inline-flex items-center gap-1.5 bg-default-50 border border-default-200 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-default-600 mb-6 cursor-pointer hover:bg-default-100 transition-colors shadow-sm">
                        <Star size={12} className="fill-default-400 text-default-400" />
                        Nano Banana Pro is free for now
                        <ChevronRight size={12} className="text-default-400" />
                     </div>
                     
                     <h2 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tight leading-tight">
                        Hi! What do you feel like <br/>
                        <span className="bg-brand-gradient bg-clip-text text-transparent">creating today?</span>
                        <Sparkles className="inline w-8 h-8 md:w-10 md:h-10 ml-2 -mt-4 text-secondary animate-pulse" />
                     </h2>
                </div>

                {/* CREATION GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                    <FeatureCard 
                        title="Comic Creator" 
                        description="Turn stories into visual manga pages."
                        variant="comic"
                        onClick={() => onNavigate(AppMode.COMIC)}
                        badge="POPULAR"
                    />

                    <FeatureCard 
                        title="Ad Designer" 
                        description="Professional product ads from URL."
                        variant="ad"
                        onClick={() => onNavigate(AppMode.ADVERTISING)}
                    />

                    <FeatureCard 
                        title="Infographic" 
                        description="Visualize data and complex topics."
                        variant="info"
                        onClick={() => onNavigate(AppMode.INFOGRAPHIC)}
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
                    <div className="flex items-center justify-between mb-8 border-b border-divider">
                        <div className="flex items-center gap-8">
                            <button 
                                onClick={() => setActiveTab('trending')}
                                className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'trending' ? 'text-foreground border-foreground' : 'text-default-400 border-transparent hover:text-default-600'}`}
                            >
                                Trending on TikTok
                            </button>
                            <button 
                                onClick={() => setActiveTab('showcase')}
                                className={`pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'showcase' ? 'text-foreground border-foreground' : 'text-default-400 border-transparent hover:text-default-600'}`}
                            >
                                Image inspiration
                            </button>
                        </div>
                        <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
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
      </div>
    </div>
  );
};