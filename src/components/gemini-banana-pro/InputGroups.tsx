import React from 'react';
import { useTranslation } from 'next-i18next';
import { ComicInputs, AdInputs, InfoInputs, AppMode } from '@/types/gemini-banana-pro';
import { I18N_NAMESPACES } from '@/constants/i18n';
import { X, ImagePlus, Check, ChevronDown } from 'lucide-react';

interface Props<T> {
  data: T;
  onChange: (field: keyof T, value: any) => void;
  mode: AppMode;
  showGuide?: boolean;
  onDismissGuide?: () => void;
}

// Updated Label to place optional text inline
const Label: React.FC<{ children: React.ReactNode, optionalLabel?: string, required?: boolean }> = ({ children, optionalLabel, required }) => (
  <div className="flex items-baseline gap-2 mb-2">
    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
    {optionalLabel && <span className="text-[10px] text-slate-400 font-normal normal-case">{optionalLabel}</span>}
  </div>
);

const TextInput: React.FC<{ value: string, onChange: (e: string) => void, placeholder?: string, multiline?: boolean }> = ({ value, onChange, placeholder, multiline }) => {
  const cls = "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm";
  return multiline ? (
    <textarea 
      className={`${cls} min-h-[100px] resize-none`} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
  ) : (
    <input 
      type="text" 
      className={cls} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
  );
};

const MultiFileInput: React.FC<{ files: File[], onChange: (files: File[]) => void }> = ({ files, onChange }) => {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {files.map((file, index) => (
          <div key={index} className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden group shadow-sm">
            <img src={URL.createObjectURL(file)} alt="Reference" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            <button 
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full transition-colors backdrop-blur-sm"
            >
                <X size={10} />
            </button>
          </div>
        ))}
        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
          <div className="flex flex-col items-center justify-center text-center p-2">
            <ImagePlus className="w-5 h-5 mb-1 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-[9px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 font-medium uppercase">{t('labels.addRef')}</span>
          </div>
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};

// Generic Select Dropdown
const SelectInput: React.FC<{ 
  value: string, 
  onChange: (v: string) => void, 
  options: { value: string, label: string }[],
  placeholder?: string
}> = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm cursor-pointer"
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <ChevronDown size={16} />
    </div>
  </div>
);

const StyleSelect: React.FC<{ value: string, onChange: (v: string) => void, options: string[] }> = ({ value, onChange, options }) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-3 py-2 rounded-md text-xs font-medium transition-all border text-left truncate ${
          value === opt 
            ? 'bg-primary/10 border-primary text-primary shadow-sm' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
        title={opt}
      >
        {opt}
      </button>
    ))}
  </div>
);

export const ComicForm: React.FC<Props<ComicInputs>> = ({ data, onChange, mode, showGuide, onDismissGuide }) => {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO);
  
  const taskOptions = [
    { value: 'story', label: t('taskActions.story.label') },
    { value: 'continue', label: t('taskActions.continue.label') },
    { value: 'mix', label: t('taskActions.mix.label') },
    { value: 'remake', label: t('taskActions.remake.label') },
  ];
  
  const mangaOptions = (t('mangaStyles', { returnObjects: true }) as string[]).map(m => ({ value: m, label: m }));
  
  const storyIdeas = [
    { short: t('storyIdeas.cyberpunkDetective.short'), full: t('storyIdeas.cyberpunkDetective.full') },
    { short: t('storyIdeas.wizardLibrary.short'), full: t('storyIdeas.wizardLibrary.full') },
    { short: t('storyIdeas.cozyCatCafe.short'), full: t('storyIdeas.cozyCatCafe.full') },
    { short: t('storyIdeas.spaceBattle.short'), full: t('storyIdeas.spaceBattle.full') },
  ];

  return (
    <div className="space-y-8 pb-8 relative">
      
      {/* First Time User Guide Tooltip - Fixed positioning to prevent layout shift */}
      {showGuide && onDismissGuide && (
        <div className="fixed top-20 z-50 animate-bounce pointer-events-none" style={{ left: 'calc(72px + 360px + 16px)', maxWidth: '360px' }}>
          <div className="relative pointer-events-auto">
            <div className="absolute -top-2 left-8 w-4 h-4 bg-blue-600 rotate-45"></div>
            <div className="bg-blue-600 text-white text-xs p-3 rounded-lg shadow-xl relative flex items-center justify-between">
              <div className="font-medium">
                {t('guide.title')}
              </div>
              <button onClick={onDismissGuide} className="ml-2 text-white/80 hover:text-white">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <Label required>{t('labels.story')}</Label>
        <TextInput 
          value={data.story} 
          onChange={(v) => onChange('story', v)} 
          placeholder={t('placeholders.story')}
          multiline 
        />
        
        {/* Marquee Story Suggestions */}
        <div className="mt-4 relative overflow-hidden h-8 w-full group mask-gradient">
             <div className="absolute inset-0 flex items-center gap-3 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
                 {/* Localized Story Ideas */}
                 {[...storyIdeas, ...storyIdeas].map((idea, idx) => (
                     <button
                        key={`${idea.short}-${idx}`}
                        onClick={() => onChange('story', idea.full)}
                        className="shrink-0 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium hover:bg-primary hover:text-white hover:border-primary transition-colors"
                     >
                        {idea.short}
                     </button>
                 ))}
             </div>
             <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <div>
          <Label optionalLabel={t('labels.optional')}>
            {t('labels.refImages')}
          </Label>
          <MultiFileInput files={data.referenceImages} onChange={(f) => onChange('referenceImages', f)} />
      </div>

      {/* Task / Action Mode */}
      <div>
        <Label optionalLabel={t('labels.optional')}>
          {t('labels.task')}
        </Label>
        <SelectInput 
          value={data.taskAction} 
          onChange={(v) => onChange('taskAction', v)} 
          options={taskOptions} 
          placeholder={t('labels.selectOption')}
        />
      </div>

      {/* Manga Selection */}
      <div>
        <Label optionalLabel={t('labels.optional')}>
          {t('labels.mangaRef')}
        </Label>
        <SelectInput 
          value={data.selectedManga} 
          onChange={(v) => onChange('selectedManga', v)} 
          options={mangaOptions} 
          placeholder={t('labels.selectOption')}
        />
      </div>

      <div>
          <Label optionalLabel={t('labels.optional')}>
            {t('labels.artStyle')}
          </Label>
          <StyleSelect value={data.style} onChange={(v) => onChange('style', v)} options={t(`styles.${mode === AppMode.COMIC ? 'comic' : mode === AppMode.ADVERTISING ? 'advertising' : 'infographic'}`, { returnObjects: true }) as string[]} />
      </div>

      <div>
         <Label optionalLabel={t('labels.optional')}>
            {t('labels.layout')}
         </Label>
         {/* Frame Count Row */}
         <div className="grid grid-cols-8 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full">
             {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                 <button
                    key={num}
                    onClick={() => onChange('frameCount', num)}
                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                        data.frameCount === num
                            ? 'bg-white dark:bg-slate-700 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                 >
                    {num}
                 </button>
             ))}
         </div>
         <p className="mt-2 text-[10px] text-slate-400">
             {t('ui.frameCountNote', { count: data.frameCount })}
         </p>
      </div>
    </div>
  );
};

export const AdForm: React.FC<Props<AdInputs>> = ({ data, onChange, mode }) => {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO);
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.brand')}</Label>
        <TextInput value={data.brandName} onChange={(v) => onChange('brandName', v)} placeholder={t('placeholders.brand')} />
      </div>

      <div>
          <Label optionalLabel={t('labels.optional')}>{t('labels.refImages')}</Label>
          <MultiFileInput files={data.referenceImages} onChange={(f) => onChange('referenceImages', f)} />
      </div>

      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.artStyle')}</Label>
        <StyleSelect value={data.style} onChange={(v) => onChange('style', v)} options={t(`styles.${mode === AppMode.COMIC ? 'comic' : mode === AppMode.ADVERTISING ? 'advertising' : 'infographic'}`, { returnObjects: true }) as string[]} />
      </div>

      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.headline')}</Label>
        <TextInput value={data.headline} onChange={(v) => onChange('headline', v)} placeholder={t('placeholders.headline')} />
      </div>

      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.desc')}</Label>
        <TextInput value={data.description} onChange={(v) => onChange('description', v)} placeholder={t('placeholders.desc')} multiline />
      </div>

      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.target')}</Label>
        <TextInput value={data.targetAudience} onChange={(v) => onChange('targetAudience', v)} placeholder={t('placeholders.target')} />
      </div>
    </div>
  );
};

export const InfoForm: React.FC<Props<InfoInputs>> = ({ data, onChange, mode }) => {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO);
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.topic')}</Label>
        <TextInput value={data.topic} onChange={(v) => onChange('topic', v)} placeholder={t('placeholders.topic')} />
      </div>

      <div>
          <Label optionalLabel={t('labels.optional')}>{t('labels.refImages')}</Label>
          <MultiFileInput files={data.referenceImages} onChange={(f) => onChange('referenceImages', f)} />
      </div>

      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.artStyle')}</Label>
        <StyleSelect value={data.style} onChange={(v) => onChange('style', v)} options={t(`styles.${mode === AppMode.COMIC ? 'comic' : mode === AppMode.ADVERTISING ? 'advertising' : 'infographic'}`, { returnObjects: true }) as string[]} />
      </div>

      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.data')}</Label>
        <TextInput value={data.dataPoints} onChange={(v) => onChange('dataPoints', v)} placeholder={t('placeholders.data')} multiline />
      </div>

      <div>
        <Label optionalLabel={t('labels.optional')}>{t('labels.summary')}</Label>
        <TextInput value={data.description} onChange={(v) => onChange('description', v)} placeholder={t('placeholders.summary')} />
      </div>
    </div>
  );
};

