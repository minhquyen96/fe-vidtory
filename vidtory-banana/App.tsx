
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Megaphone, 
  BarChart3, 
  Wand2, 
  Download, 
  Loader2,
  Trash2,
  RefreshCw,
  History,
  Sun,
  Moon,
  Zap,
  ImagePlus,
  ArrowLeft,
  Coins,
  StepForward,
  CopyPlus,
  Repeat,
  Edit3,
  Eye,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft
} from 'lucide-react';
import JSZip from 'jszip';
import { ComicForm, AdForm, InfoForm } from './components/InputGroups';
import { HomePage } from './components/HomePage';
import { AppMode, ComicInputs, AdInputs, InfoInputs, STYLE_PRESETS, HistoryItem, InputUnion, Language, TRANSLATIONS } from './types';
import { generateCreativeContent } from './services/geminiService';
import { DSButton, DSSidebarItem } from './components/DesignSystem';

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'WORKSPACE'>('HOME');
  const [activePage, setActivePage] = useState<AppMode>(AppMode.COMIC);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sidebar State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  // Independent canvas state for each mode
  const [canvasImages, setCanvasImages] = useState<Record<AppMode, string | null>>({
    [AppMode.COMIC]: null,
    [AppMode.ADVERTISING]: null,
    [AppMode.INFOGRAPHIC]: null
  });

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [credits, setCredits] = useState(100); 
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
  });
  const [lang, setLang] = useState<Language>('vi'); 
  const [showGuide, setShowGuide] = useState(true); 
  
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [pendingAutoGenerate, setPendingAutoGenerate] = useState(false);

  const resultImage = canvasImages[activePage];
  const filteredHistory = history.filter(item => item.mode === activePage);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Form Data
  const [comicData, setComicData] = useState<ComicInputs>({
    description: '', story: '', frameCount: 4, style: STYLE_PRESETS['vi'][AppMode.COMIC][0], referenceImages: [], selectedManga: 'Any Style', taskAction: 'story', aspectRatio: '1:1'
  });
  const [adData, setAdData] = useState<AdInputs>({
    adMode: 'manual', url: '', description: '', style: '', brandName: '', headline: '', targetAudience: '', referenceImages: [], aspectRatio: '1:1'
  });
  const [infoData, setInfoData] = useState<InfoInputs>({
    description: '', style: STYLE_PRESETS['vi'][AppMode.INFOGRAPHIC][0], topic: '', dataPoints: '', referenceImages: [], aspectRatio: '1:1'
  });

  const t = (key: string, nested?: string) => {
    const dict = TRANSLATIONS[lang];
    if (nested && (dict as any)[key]) {
      return (dict as any)[key][nested] || nested;
    }
    return (dict as any)[key] || key;
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>, field: string, value: any) => {
    setter((prev: any) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }
  };

  const validateInputs = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;
    if (activePage === AppMode.COMIC && !comicData.story.trim()) { errors.story = t('errors', 'missingStory'); isValid = false; }
    if (activePage === AppMode.ADVERTISING) {
        if (adData.adMode === 'manual' && !adData.brandName.trim()) { errors.brandName = t('errors', 'missingBrand'); isValid = false; }
        if (adData.adMode === 'auto' && !adData.url.trim()) { errors.url = t('errors', 'missingUrl'); isValid = false; }
    }
    if (activePage === AppMode.INFOGRAPHIC && !infoData.topic.trim()) { errors.topic = t('errors', 'missingTopic'); isValid = false; }
    setFieldErrors(errors);
    return isValid;
  };

  const handleGenerate = async () => {
    setError(null);
    if (!validateInputs()) return;
    if (credits <= 0) { setError(t('errors', 'noCredits')); return; }

    setIsLoading(true);
    setShowGuide(false);
    if (window.innerWidth < 768) setMobileTab('preview');

    try {
      let currentData: InputUnion;
      switch (activePage) {
        case AppMode.COMIC: currentData = comicData; break;
        case AppMode.ADVERTISING: currentData = adData; break;
        case AppMode.INFOGRAPHIC: currentData = infoData; break;
      }
      
      const imageBase64 = await generateCreativeContent(activePage, currentData);
      setCanvasImages(prev => ({ ...prev, [activePage]: imageBase64 }));
      setCredits(c => c - 1);

      const newItem: HistoryItem = { id: Date.now().toString(), url: imageBase64, mode: activePage, params: { ...currentData }, timestamp: Date.now() };
      setHistory(prev => [newItem, ...prev]);

    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError(t('errors', 'unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pendingAutoGenerate) { handleGenerate(); setPendingAutoGenerate(false); }
  }, [pendingAutoGenerate, comicData]);

  const handleRemix = (item: HistoryItem) => {
    setActivePage(item.mode);
    if (item.mode === AppMode.COMIC) setComicData(item.params as ComicInputs);
    else if (item.mode === AppMode.ADVERTISING) setAdData(item.params as AdInputs);
    else if (item.mode === AppMode.INFOGRAPHIC) setInfoData(item.params as InfoInputs);
    setCanvasImages(prev => ({ ...prev, [item.mode]: item.url }));
    if (window.innerWidth < 768) setMobileTab('editor');
  };

  const handleUseAsRef = async (url: string, mode: AppMode) => {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], `ref-${Date.now()}.png`, { type: "image/png" });
        if (mode === AppMode.COMIC) setComicData(prev => ({ ...prev, referenceImages: [...prev.referenceImages, file] }));
        else if (mode === AppMode.ADVERTISING) setAdData(prev => ({ ...prev, referenceImages: [...prev.referenceImages, file] }));
        else if (mode === AppMode.INFOGRAPHIC) setInfoData(prev => ({ ...prev, referenceImages: [...prev.referenceImages, file] }));
        if (window.innerWidth < 768) setMobileTab('editor');
    } catch (err) { console.error("Failed to convert image to ref", err); }
  };

  const handleDownload = () => {
    if (resultImage) {
        const link = document.createElement('a'); link.href = resultImage; link.download = `vidtory-studio-${Date.now()}.png`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    }
  };

  const handleDownloadAll = async () => {
    if (filteredHistory.length === 0) return;
    const zip = new JSZip();
    filteredHistory.forEach((item, index) => {
      const base64Data = item.url.split(',')[1]; zip.file(`image_${index + 1}_${item.mode}.png`, base64Data, { base64: true });
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(content); link.download = `vidtory-history-${Date.now()}.zip`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handlePreviewAction = async (action: 'remix' | 'ref' | 'delete' | 'continue' | 'variant' | 'recreate') => {
    if (!resultImage) return;
    const currentItem = history.find(h => h.url === resultImage);
    if (!currentItem) return; 

    switch (action) {
      case 'remix': case 'variant': case 'recreate': handleRemix(currentItem); break;
      case 'ref': await handleUseAsRef(currentItem.url, currentItem.mode); break;
      case 'continue':
        await handleUseAsRef(currentItem.url, currentItem.mode);
        if (currentItem.mode === AppMode.COMIC) {
            setActivePage(AppMode.COMIC);
            setComicData(prev => ({ ...prev, taskAction: 'continue' }));
            setPendingAutoGenerate(true);
        }
        if (window.innerWidth < 768) setMobileTab('preview');
        break;
      case 'delete':
        setHistory(prev => prev.filter(h => h.id !== currentItem.id));
        setCanvasImages(prev => ({ ...prev, [activePage]: null }));
        break;
    }
  };

  const deleteHistoryItem = (id: string) => {
      setHistory(prev => prev.filter(h => h.id !== id));
      const item = history.find(h => h.id === id);
      if (item && item.url === resultImage) setCanvasImages(prev => ({ ...prev, [activePage]: null }));
  };

  // ROUTING VIEWS
  if (view === 'HOME') {
    return (
      <HomePage 
        onNavigate={(mode) => { setActivePage(mode); setView('WORKSPACE'); }}
        credits={credits}
        lang={lang} setLang={setLang}
        theme={theme} setTheme={setTheme}
      />
    );
  }

  return (
    <div 
        className="flex flex-col h-full w-full bg-background text-foreground overflow-hidden font-sans selection:bg-brand-gradient selection:text-default-900"
        onClick={() => setShowGuide(false)}
    >
      
      {/* 1. GLOBAL HEADER */}
      <header className="h-14 md:h-20 bg-content1 border-b border-divider flex items-center justify-between px-4 md:px-6 shrink-0 z-50 shadow-sm transition-all">
        <div className="flex items-center gap-3 md:gap-4">
            <DSButton variant="icon" onClick={() => setView('HOME')} className="hidden md:flex">
                <ArrowLeft size={20} />
            </DSButton>
            
            {/* Logo */}
            <div className="h-6 md:h-10 w-auto text-foreground cursor-pointer" onClick={() => setView('HOME')}>
                <svg viewBox="0 0 483 154" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
                    <path d="M388.788 53.6475H405.032L423.392 97.165H423.792L440.44 55.2109H460.286L419.53 148.576H399.818L415.135 113.813H411.405L388.788 62.9453V73.3242H383.726C380.796 73.3242 378.132 73.6793 375.735 74.3896C373.426 75.0112 371.473 76.0324 369.875 77.4531C368.277 78.8738 367.033 80.7833 366.145 83.1807C365.346 85.4891 364.947 88.3303 364.947 91.7041V121.272H346.301V55.2109H362.283L364.014 69.1953H364.414C366.278 65.0221 368.365 61.8253 370.674 59.6055C372.982 57.2969 375.647 55.7435 378.666 54.9443C381.685 54.0565 385.059 53.6123 388.788 53.6123V53.6475ZM308.66 53.6123C315.053 53.6123 320.824 55.0777 325.974 58.0078C331.124 60.938 335.209 65.022 338.228 70.2607C341.247 75.4107 342.757 81.4043 342.757 88.2412C342.757 94.9893 341.247 100.983 338.228 106.222C335.209 111.372 331.124 115.457 325.974 118.476C320.825 121.406 315.009 122.871 308.527 122.871C302.223 122.871 296.495 121.406 291.345 118.476C286.195 115.457 282.111 111.372 279.092 106.222C276.073 100.983 274.563 94.9893 274.563 88.2412C274.563 81.4931 276.073 75.4995 279.092 70.2607C282.11 65.022 286.196 60.938 291.345 58.0078C296.495 55.0777 302.267 53.6123 308.66 53.6123ZM258.029 55.21H275.344V70.3936H258.029V97.5645C258.029 100.583 258.65 102.715 259.893 103.958C261.225 105.112 263.445 105.689 266.552 105.689H275.077V121.272H263.09C258.384 121.272 254.21 120.517 250.57 119.008C247.019 117.498 244.266 115.013 242.312 111.55C240.359 108.087 239.383 103.381 239.383 97.4316V70.3936H228.061V55.21H239.383L241.381 37.0967H258.029V55.21ZM308.66 69.4619C305.996 69.4619 303.51 70.1721 301.201 71.5928C298.892 72.9247 297.028 75.0113 295.607 77.8525C294.275 80.6051 293.609 84.068 293.609 88.2412C293.609 92.4145 294.275 95.9223 295.607 98.7637C297.028 101.516 298.848 103.603 301.068 105.023C303.377 106.355 305.863 107.021 308.527 107.021C311.368 107.021 313.899 106.355 316.119 105.023C318.427 103.603 320.247 101.516 321.579 98.7637C323 95.9223 323.711 92.4145 323.711 88.2412C323.711 84.068 323 80.6051 321.579 77.8525C320.247 75.0114 318.427 72.9246 316.119 71.5928C313.899 70.1721 311.412 69.4619 308.66 69.4619Z" fill="url(#paint0_linear_logo_app)"/>
                    <defs>
                    <linearGradient id="paint0_linear_logo_app" x1="22.0323" y1="38.608" x2="222.317" y2="117.951" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#ABDF00"/>
                    <stop offset="1" stop-color="#00E2E9"/>
                    </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-default-100 rounded-full border border-default-200">
                <Coins size={14} className="text-amber-500 fill-amber-500 md:w-5 md:h-5" />
                <span className="font-bold text-xs md:text-base">{credits}</span>
            </div>

            <DSButton variant="gradient" icon={Zap} className="hidden md:flex">
                {t('labels', 'upgrade')}
            </DSButton>
            
            <DSButton 
                variant="primary" 
                icon={Download} 
                onClick={handleDownload} 
                disabled={!resultImage}
                className="hidden md:flex"
            >
                {t('labels', 'download')}
            </DSButton>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 2. SIDEBAR (Desktop) */}
        <div className={`hidden md:flex flex-col border-r border-divider bg-content1 shrink-0 z-30 transition-all duration-300 ${isSidebarExpanded ? 'w-[240px]' : 'w-[90px]'}`}>
            
            <div className={`flex flex-col py-4 gap-2 ${isSidebarExpanded ? 'px-4' : 'px-2'}`}>
                <DSSidebarItem 
                  isExpanded={isSidebarExpanded} 
                  icon={BookOpen} 
                  label={t('sidebar', AppMode.COMIC)} 
                  active={activePage === AppMode.COMIC} 
                  onClick={() => setActivePage(AppMode.COMIC)} 
                />
                <DSSidebarItem 
                  isExpanded={isSidebarExpanded} 
                  icon={Megaphone} 
                  label={t('sidebar', AppMode.ADVERTISING)} 
                  active={activePage === AppMode.ADVERTISING} 
                  onClick={() => setActivePage(AppMode.ADVERTISING)} 
                />
                <DSSidebarItem 
                  isExpanded={isSidebarExpanded} 
                  icon={BarChart3} 
                  label={t('sidebar', AppMode.INFOGRAPHIC)} 
                  active={activePage === AppMode.INFOGRAPHIC} 
                  onClick={() => setActivePage(AppMode.INFOGRAPHIC)} 
                />
            </div>

            {/* Footer with side-by-side buttons when expanded */}
            <div className={`mt-auto flex flex-col gap-3 pb-4 ${isSidebarExpanded ? 'px-4' : 'px-2 items-center'}`}>
                
                {isSidebarExpanded ? (
                   // Expanded: Side-by-side
                   <div className="flex items-center gap-2 w-full pt-2 border-t border-divider">
                        <button 
                            onClick={() => setLang(l => l === 'en' ? 'vi' : 'en')}
                            className="flex-1 flex items-center justify-center gap-2 rounded-large bg-default-100 text-default-500 hover:text-foreground hover:bg-default-200 font-bold transition-all py-2 text-xs h-10 border border-transparent hover:border-default-300"
                            title="Switch Language"
                        >
                            {lang === 'vi' ? '🇻🇳 VN' : '🇺🇸 EN'}
                        </button>
                        <button 
                            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                            className="flex-1 flex items-center justify-center gap-2 rounded-large bg-default-100 text-default-500 hover:text-foreground hover:bg-default-200 transition-all py-2 h-10 border border-transparent hover:border-default-300"
                            title="Toggle Theme"
                        >
                             {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        </button>
                        <button 
                          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                          className="flex items-center justify-center w-10 h-10 text-default-400 hover:text-foreground hover:bg-default-100 rounded-large transition-colors border border-transparent hover:border-default-300"
                          title="Collapse"
                        >
                          <PanelLeftClose size={18} />
                        </button>
                   </div>
                ) : (
                    // Collapsed: Stacked
                    <div className="flex flex-col gap-2 w-full pt-2 border-t border-divider items-center">
                        <button 
                            onClick={() => setLang(l => l === 'en' ? 'vi' : 'en')}
                            className="w-10 h-10 flex items-center justify-center rounded-large bg-default-100 text-default-500 hover:text-foreground hover:bg-default-200 font-bold text-xs border border-transparent hover:border-default-300"
                            title={lang === 'vi' ? 'Switch to EN' : 'Switch to VN'}
                        >
                            {lang === 'vi' ? 'VN' : 'EN'}
                        </button>
                        <button 
                            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                            className="w-10 h-10 flex items-center justify-center rounded-large bg-default-100 text-default-500 hover:text-foreground hover:bg-default-200 border border-transparent hover:border-default-300"
                            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                        <button 
                          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                          className="w-10 h-10 flex items-center justify-center text-default-400 hover:text-foreground hover:bg-default-100 rounded-large transition-colors border border-transparent hover:border-default-300"
                          title="Expand"
                        >
                          <PanelLeftOpen size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* 3. INPUT DRAWER */}
        <div className={`
            w-full md:w-[400px] lg:w-[440px] bg-content1 border-r border-divider flex-col shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
            ${mobileTab === 'editor' ? 'flex' : 'hidden md:flex'}
        `}>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
                
                {/* Scrollable Header */}
                <div className="px-4 py-4 md:px-6 md:pt-6 md:pb-6 flex items-center justify-between shrink-0">
                    <span className="font-bold text-xl md:text-2xl tracking-tight flex items-center gap-2">
                        {t('modes', activePage)}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-90">
                        <span className="hidden md:inline text-[10px] text-default-400 font-medium lowercase">{t('labels', 'poweredBy')}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-brand-gradient bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x select-none">
                            BANANA PRO
                        </span>
                        <span className="text-sm">🍌</span>
                    </div>
                </div>

                <div className="px-4 md:px-6 pt-2">
                    {activePage === AppMode.COMIC && (
                        <ComicForm data={comicData} onChange={(k, v) => handleChange(setComicData, k as string, v)} mode={activePage} lang={lang} showGuide={showGuide} onDismissGuide={() => setShowGuide(false)} errors={fieldErrors} />
                    )}
                    {activePage === AppMode.ADVERTISING && (
                        <AdForm data={adData} onChange={(k, v) => handleChange(setAdData, k as string, v)} mode={activePage} lang={lang} errors={fieldErrors} />
                    )}
                    {activePage === AppMode.INFOGRAPHIC && (
                        <InfoForm data={infoData} onChange={(k, v) => handleChange(setInfoData, k as string, v)} mode={activePage} lang={lang} errors={fieldErrors} />
                    )}
                </div>
                <div className="h-[104px] md:h-0 w-full shrink-0"></div>
            </div>

            {/* DESKTOP FOOTER */}
            <div className="hidden md:flex h-[88px] items-center px-6 py-4 border-t border-divider bg-content1 shrink-0 z-10">
                <DSButton 
                    variant="gradient"
                    onClick={handleGenerate}
                    disabled={isLoading || credits <= 0}
                    isLoading={isLoading}
                    icon={Wand2}
                    className="w-full h-14 text-lg"
                >
                    {t('labels', 'generate')} (1 Credit)
                </DSButton>
            </div>
        </div>

        {/* 4. MAIN CANVAS */}
        <div className={`
            flex-1 flex-col min-w-0 bg-content2 relative
            ${mobileTab === 'preview' ? 'flex' : 'hidden md:flex'}
        `}>
            
            <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center py-4 md:p-10 px-0 md:px-10 group/canvas">
                <div className="absolute inset-0 opacity-[0.05]" 
                    style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {error && (
                    <div className="mx-4 bg-danger/10 border border-danger/20 text-danger px-6 py-4 rounded-large backdrop-blur-md max-w-md text-center z-20">
                    <p className="font-medium text-base">{error}</p>
                    </div>
                )}

                {!resultImage && !isLoading && !error && (
                    <div className="text-center z-10 px-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-sm">
                            <Wand2 className="text-default-400" size={32} />
                        </div>
                        <h3 className="text-foreground font-semibold text-xl md:text-2xl mb-2 md:mb-3">{t('labels', 'readyTitle')}</h3>
                        <p className="text-default-500 max-w-xs mx-auto text-sm md:text-base">
                            {t('labels', 'readyDesc')}
                        </p>
                    </div>
                )}

                {!resultImage && isLoading && (
                    <div className="flex flex-col items-center gap-6 z-10 px-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-default-200"></div>
                            <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-base font-semibold text-default-500 animate-pulse">{t('labels', 'generating')}</p>
                        {activePage === AppMode.ADVERTISING && adData.adMode === 'auto' && (
                             <p className="text-xs text-primary font-medium">{t('labels', 'analyzing')}</p>
                        )}
                    </div>
                )}

                {resultImage && (
                    <div className="relative w-full flex flex-col items-center">
                         <div className="px-4 md:px-0 w-full flex justify-center">
                            <div className="relative group/image-wrapper max-w-full">
                                <div className="hidden md:flex absolute -top-14 left-1/2 -translate-x-1/2 bg-content1 backdrop-blur-md border border-default-200 text-foreground px-4 py-2 h-12 rounded-full items-center gap-4 shadow-lg opacity-0 group-hover/image-wrapper:opacity-100 transition-all duration-300 translate-y-2 group-hover/image-wrapper:translate-y-0 z-40 whitespace-nowrap">
                                        <button onClick={() => handlePreviewAction('ref')} className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors" title={t('labels', 'useAsRef')}>
                                            <ImagePlus size={18} /> <span className="hidden sm:inline">{t('labels', 'useAsRef')}</span>
                                        </button>
                                        <div className="w-px h-5 bg-default-300"></div>
                                        {activePage === AppMode.COMIC ? (
                                            <>
                                                <button onClick={() => handlePreviewAction('remix')} className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors" title={t('labels', 'remix')}>
                                                    <RefreshCw size={18} /> <span className="hidden sm:inline">{t('labels', 'remix')}</span>
                                                </button>
                                                <div className="w-px h-5 bg-default-300"></div>
                                                <button onClick={() => handlePreviewAction('continue')} className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors" title={t('labels', 'genNext')}>
                                                    <StepForward size={18} /> <span className="hidden sm:inline">{t('labels', 'genNext')}</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handlePreviewAction('variant')} className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors" title={t('labels', 'makeVariant')}>
                                                    <CopyPlus size={18} /> <span className="hidden sm:inline">{t('labels', 'makeVariant')}</span>
                                                </button>
                                                <div className="w-px h-5 bg-default-300"></div>
                                                <button onClick={() => handlePreviewAction('recreate')} className="flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full hover:bg-transparent hover:text-primary transition-colors" title={t('labels', 'recreate')}>
                                                    <Repeat size={18} /> <span className="hidden sm:inline">{t('labels', 'recreate')}</span>
                                                </button>
                                            </>
                                        )}
                                        <div className="w-px h-5 bg-default-300"></div>
                                        <button onClick={() => handlePreviewAction('delete')} className="flex items-center gap-2 text-sm font-bold hover:text-danger hover:bg-transparent transition-colors text-default-400 p-2 rounded-full" title={t('labels', 'delete')}>
                                            <Trash2 size={18} />
                                        </button>
                                </div>
                                
                                <div className="relative shadow-2xl shadow-black/20 rounded-large ring-1 ring-default-200 bg-content1 overflow-hidden max-h-[60vh] md:max-h-[calc(100vh-320px)]">
                                    <img src={resultImage} alt="Result" className={`w-auto h-auto max-w-full object-contain bg-white transition-opacity duration-300 ${isLoading ? 'opacity-80 grayscale-[30%]' : 'opacity-100'}`} />
                                    {isLoading && (
                                        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                            <Loader2 size={14} className="animate-spin" />
                                            {t('labels', 'generating')}
                                        </div>
                                    )}
                                </div>
                            </div>
                         </div>
                    </div>
                )}
            </div>

            <div className="h-[80px] md:h-[140px] bg-content1 border-t border-divider flex flex-col shrink-0 z-20">
                <div className="h-7 md:h-9 px-4 md:px-6 flex items-center justify-between border-b border-divider bg-default-50">
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-default-500 uppercase tracking-wider">
                    <History size={12} className="md:w-[14px] md:h-[14px]" />
                    {t('labels', 'history')}
                    </div>
                    {filteredHistory.length > 0 && (
                    <button 
                        onClick={handleDownloadAll}
                        className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        <Download size={12} className="md:w-[14px] md:h-[14px]" />
                        {t('labels', 'downloadAll')}
                    </button>
                    )}
                </div>
                <div className="flex-1 flex items-center gap-2 md:gap-3 p-2 md:p-3 overflow-x-auto custom-scrollbar">
                    {filteredHistory.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => setCanvasImages(prev => ({ ...prev, [activePage]: item.url }))}
                            className={`relative h-10 md:h-20 aspect-square rounded-large overflow-hidden cursor-pointer transition-all flex-shrink-0 group shadow-sm hover:shadow-md ${
                                resultImage === item.url 
                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-content1' 
                                : 'ring-1 ring-default-200 hover:ring-default-300'
                            }`}
                        >
                            <img src={item.url} className="w-full h-full object-cover" alt="history" />
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-danger text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                title="Delete"
                            >
                                <X size={10} strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                    {filteredHistory.length === 0 && (
                        <div className="w-full text-center text-[10px] md:text-xs text-default-400 italic">
                            {t('labels', 'noHistory')}
                        </div>
                    )}
                </div>
            </div>
            <div className="h-[104px] md:h-0 w-full shrink-0"></div>
        </div>
      </div>
      
      {/* 5. MOBILE ACTION BAR */}
      <div className="md:hidden fixed bottom-12 left-0 right-0 h-16 bg-content1/95 backdrop-blur-md border-t border-divider flex items-center px-3 gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <DSButton
                variant="gradient"
                onClick={handleGenerate}
                disabled={isLoading || credits <= 0}
                isLoading={isLoading}
                icon={Wand2}
                className="flex-[2] h-10 shadow-primary-lg/50"
            >
                {t('labels', 'generate')}
            </DSButton>

            <div className="flex-1 h-10 bg-default-100 p-1 rounded-large flex items-center border border-default-200">
                <button 
                    onClick={() => setMobileTab('editor')}
                    className={`flex-1 h-full rounded-medium flex items-center justify-center gap-1 transition-all ${
                        mobileTab === 'editor' ? 'bg-background shadow-sm text-primary font-bold' : 'text-default-400 font-medium'
                    }`}
                >
                    <Edit3 size={14} />
                    <span className="text-[10px] whitespace-nowrap">{t('labels', 'mobileEdit')}</span>
                </button>
                <div className="w-px h-4 bg-default-300 mx-1"></div>
                <button 
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 h-full rounded-medium flex items-center justify-center gap-1 transition-all ${
                        mobileTab === 'preview' ? 'bg-background shadow-sm text-primary font-bold' : 'text-default-400 font-medium'
                    }`}
                >
                    <Eye size={14} />
                     <span className="text-[10px] whitespace-nowrap">{t('labels', 'mobilePreview')}</span>
                </button>
            </div>
      </div>

      {/* 6. MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-12 bg-content1 border-t border-divider flex items-center justify-between px-2 z-50 pb-safe-area">
        <DSSidebarItem 
            isMobile 
            icon={BookOpen} 
            label={t('sidebar', AppMode.COMIC)} 
            active={activePage === AppMode.COMIC} 
            onClick={() => setActivePage(AppMode.COMIC)} 
        />
        <DSSidebarItem 
            isMobile 
            icon={Megaphone} 
            label={t('sidebar', AppMode.ADVERTISING)} 
            active={activePage === AppMode.ADVERTISING} 
            onClick={() => setActivePage(AppMode.ADVERTISING)} 
        />
        <DSSidebarItem 
            isMobile 
            icon={BarChart3} 
            label={t('sidebar', AppMode.INFOGRAPHIC)} 
            active={activePage === AppMode.INFOGRAPHIC} 
            onClick={() => setActivePage(AppMode.INFOGRAPHIC)} 
        />
      </div>
    </div>
  );
};

export default App;
