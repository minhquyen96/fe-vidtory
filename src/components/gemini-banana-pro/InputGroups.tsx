import React from 'react'
import {
  ComicInputs,
  AdInputs,
  InfoInputs,
  AppMode,
  STYLE_PRESETS,
  POPULAR_MANGA_STYLES,
  STORY_IDEAS,
  Language,
  TRANSLATIONS,
  TASK_ACTIONS,
} from '@/types/gemini-banana-pro'
import {
  X,
  ImagePlus,
  ChevronDown,
  Info,
  Square,
  RectangleHorizontal,
  RectangleVertical,
} from 'lucide-react'

interface Props<T> {
  data: T
  onChange: (field: keyof T, value: any) => void
  mode: AppMode
  lang: Language
  showGuide?: boolean
  onDismissGuide?: () => void
  errors?: Record<string, string>
}

const t = (lang: Language, key: string, nested?: string) => {
  const dict = TRANSLATIONS[lang]
  if (nested && (dict as any)[key]) {
    return (dict as any)[key][nested] || nested
  }
  return (dict as any)[key] || key
}

// HeroUI-styled Label with Refactored Layout and Increased Spacing
const Label: React.FC<{
  children: React.ReactNode
  optionalLabel?: string
  required?: boolean
  tooltip?: string
}> = ({ children, optionalLabel, required, tooltip }) => (
  <div className="flex items-center gap-1.5 mb-2 md:mb-3 px-1">
    <label className="text-sm md:text-base font-semibold text-foreground/90 tracking-tight select-none flex items-center">
      {children}
      {required && <span className="text-danger ml-0.5">*</span>}
    </label>
    {tooltip && (
      <div className="group relative inline-flex items-center ml-0.5">
        <Info
          size={13}
          className="text-default-400 hover:text-primary transition-colors cursor-help opacity-70 hover:opacity-100"
          strokeWidth={1.5}
        />
        {/* Tooltip Popup */}
        <div className="absolute top-full left-[-6px] mt-2 w-56 p-3 bg-foreground text-background text-xs leading-relaxed rounded-medium shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-left">
          {tooltip}
          {/* Triangle pointing up */}
          <div className="absolute bottom-full left-[8px] -mb-px border-4 border-transparent border-b-foreground"></div>
        </div>
      </div>
    )}
    {optionalLabel && (
      <span className="text-[10px] md:text-xs text-default-400 font-normal ml-0.5">
        {optionalLabel}
      </span>
    )}
  </div>
)

// HeroUI Flat Input with STANDARD font size (14px)
const HeroInput: React.FC<{
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  error?: string
}> = ({ value, onChange, placeholder, multiline, error }) => {
  const baseClasses = `w-full bg-default-100 hover:bg-default-200 text-foreground placeholder:text-default-400 rounded-medium px-3 py-2 md:py-2.5 text-sm md:text-base transition-colors focus:outline-none focus:ring-2 ${error ? 'ring-2 ring-danger bg-danger/10' : 'focus:ring-primary focus:bg-default-100'}`

  return (
    <div>
      {multiline ? (
        <textarea
          className={`${baseClasses} min-h-[80px] md:min-h-[100px] resize-none leading-relaxed`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type="text"
          className={baseClasses}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {error && (
        <p className="text-danger text-[10px] md:text-xs mt-1 font-medium px-1">
          {error}
        </p>
      )}
    </div>
  )
}

// HeroUI-style File Input (Card)
const MultiFileInput: React.FC<{
  files: File[]
  onChange: (files: File[]) => void
  lang: Language
}> = ({ files, onChange, lang }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      onChange([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  return (
    <div className="space-y-2 md:space-y-3">
      <div className="grid grid-cols-4 md:grid-cols-3 gap-2 md:gap-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative aspect-square bg-default-100 rounded-medium overflow-hidden group shadow-sm ring-1 ring-default-200"
          >
            <img
              src={URL.createObjectURL(file)}
              alt="Reference"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 bg-black/50 hover:bg-danger text-white p-1 rounded-full transition-colors backdrop-blur-md"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <label className="aspect-square flex flex-col items-center justify-center bg-default-100 hover:bg-default-200 rounded-medium cursor-pointer transition-all active:scale-95 ring-1 ring-transparent hover:ring-default-300">
          <div className="flex flex-col items-center justify-center text-center p-1 md:p-2">
            <ImagePlus className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 text-default-400" />
            <span className="text-[10px] md:text-xs text-default-500 font-medium leading-tight">
              {t(lang, 'labels', 'addRef')}
            </span>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  )
}

// HeroUI Select with STANDARD font size (14px)
const SelectInput: React.FC<{
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}> = ({ value, onChange, options, placeholder }) => (
  <div className="relative group">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-default-100 hover:bg-default-200 text-foreground rounded-medium px-3 py-2 md:py-2.5 text-sm md:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-default-500 group-hover:text-foreground transition-colors">
      <ChevronDown size={16} />
    </div>
  </div>
)

// HeroUI Chip-like Selection
const StyleSelect: React.FC<{
  value: string
  onChange: (v: string) => void
  options: string[]
}> = ({ value, onChange, options }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all active:scale-95 border
          ${
            value === opt
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-transparent border-default-200 text-default-500 hover:bg-default-100 hover:border-default-300'
          }`}
      >
        {opt}
      </button>
    ))}
  </div>
)

// Aspect Ratio Selector - Rectangular buttons with horizontal text layout
const AspectRatioSelector: React.FC<{
  value: string
  onChange: (v: string) => void
}> = ({ value, onChange }) => {
  const ratios = [
    { id: '1:1', label: '1:1', icon: Square },
    { id: '16:9', label: '16:9', icon: RectangleHorizontal },
    { id: '9:16', label: '9:16', icon: RectangleVertical },
  ]

  return (
    <div className="flex gap-2">
      {ratios.map((r) => {
        const Icon = r.icon
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            className={`flex items-center justify-center gap-1.5 md:gap-2 flex-1 p-2 md:p-3 rounded-medium border transition-all active:scale-95
              ${
                value === r.id
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-default-100 border-transparent text-default-500 hover:bg-default-200'
              }
            `}
          >
            <Icon size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-xs md:text-sm font-semibold">{r.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export const ComicForm: React.FC<Props<ComicInputs>> = ({
  data,
  onChange,
  mode,
  lang,
  showGuide,
  onDismissGuide,
  errors,
}) => {
  const taskOptions = TASK_ACTIONS[lang].map((t) => ({
    value: t.id,
    label: t.label,
  }))

  // Include "Any Style" as first option
  const mangaOptions = ['Any Style', ...POPULAR_MANGA_STYLES].map((m) => ({
    value: m,
    label: m === 'Any Style' ? (lang === 'vi' ? 'Bất kỳ' : 'Any Style') : m,
  }))

  return (
    <div className="space-y-5 sm+:space-y-8 pb-4 sm+:pb-12 relative">
      <div>
        <Label required tooltip={t(lang, 'tooltips', 'story')}>
          {t(lang, 'labels', 'story')}
        </Label>
        <HeroInput
          value={data.story}
          onChange={(v) => onChange('story', v)}
          placeholder={t(lang, 'placeholders', 'story')}
          multiline
          error={errors?.story}
        />

        {/* Marquee Story Suggestions */}
        <div className="mt-2 md:mt-3 relative overflow-hidden h-7 md:h-8 w-full group">
          <div className="absolute inset-0 flex items-center gap-2 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...STORY_IDEAS[lang], ...STORY_IDEAS[lang]].map((idea, idx) => (
              <button
                key={`${idea.short}-${idx}`}
                onClick={() => onChange('story', idea.full)}
                className="shrink-0 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-default-100 border border-transparent hover:border-primary/30 text-[10px] md:text-xs font-medium hover:bg-default-200 transition-colors"
              >
                {idea.short}
              </button>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-r from-content1 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-l from-content1 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <div>
        <Label
          optionalLabel={t(lang, 'labels', 'optional')}
          tooltip={t(lang, 'tooltips', 'refImages')}
        >
          {t(lang, 'labels', 'refImages')}
        </Label>
        <MultiFileInput
          files={data.referenceImages}
          onChange={(f) => onChange('referenceImages', f)}
          lang={lang}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-8">
        <div>
          <Label
            optionalLabel={t(lang, 'labels', 'optional')}
            tooltip={t(lang, 'tooltips', 'task')}
          >
            {t(lang, 'labels', 'task')}
          </Label>
          <SelectInput
            value={data.taskAction}
            onChange={(v) => onChange('taskAction', v)}
            options={taskOptions}
            placeholder={t(lang, 'labels', 'selectOption')}
          />
        </div>
        <div>
          <Label
            optionalLabel={t(lang, 'labels', 'optional')}
            tooltip={t(lang, 'tooltips', 'mangaRef')}
          >
            {t(lang, 'labels', 'mangaRef')}
          </Label>
          <SelectInput
            value={data.selectedManga}
            onChange={(v) => onChange('selectedManga', v)}
            options={mangaOptions}
            placeholder={t(lang, 'labels', 'selectOption')}
          />
        </div>
      </div>

      <div>
        <Label
          optionalLabel={t(lang, 'labels', 'optional')}
          tooltip={t(lang, 'tooltips', 'artStyle')}
        >
          {t(lang, 'labels', 'artStyle')}
        </Label>
        <StyleSelect
          value={data.style}
          onChange={(v) => onChange('style', v)}
          options={STYLE_PRESETS[lang][mode]}
        />
      </div>

      <div>
        <Label
          optionalLabel={t(lang, 'labels', 'optional')}
          tooltip={t(lang, 'tooltips', 'aspectRatio')}
        >
          {t(lang, 'labels', 'aspectRatio')}
        </Label>
        <AspectRatioSelector
          value={data.aspectRatio}
          onChange={(v) => onChange('aspectRatio', v)}
        />
      </div>

      <div>
        <Label
          optionalLabel={t(lang, 'labels', 'optional')}
          tooltip={t(lang, 'tooltips', 'layout')}
        >
          {t(lang, 'labels', 'layout')}
        </Label>
        <div className="flex gap-1.5 bg-default-100 p-1 md:p-1.5 rounded-medium overflow-x-auto custom-scrollbar">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <button
              key={num}
              onClick={() => onChange('frameCount', num)}
              className={`flex-1 aspect-square min-w-[32px] md:min-w-[36px] rounded-small flex items-center justify-center text-sm md:text-base font-bold transition-all active:scale-90 ${
                data.frameCount === num
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-default-200'
                  : 'text-default-400 hover:text-foreground hover:bg-default-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export const AdForm: React.FC<Props<AdInputs>> = ({
  data,
  onChange,
  mode,
  lang,
  errors,
}) => (
  <div className="space-y-5 md:space-y-8 pb-4 md:pb-12">
    <div>
      <Label required tooltip={t(lang, 'tooltips', 'brand')}>
        {t(lang, 'labels', 'brand')}
      </Label>
      <HeroInput
        value={data.brandName}
        onChange={(v) => onChange('brandName', v)}
        placeholder={t(lang, 'placeholders', 'brand')}
        error={errors?.brandName}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'headline')}
      >
        {t(lang, 'labels', 'headline')}
      </Label>
      <HeroInput
        value={data.headline}
        onChange={(v) => onChange('headline', v)}
        placeholder={t(lang, 'placeholders', 'headline')}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'desc')}
      >
        {t(lang, 'labels', 'desc')}
      </Label>
      <HeroInput
        value={data.description}
        onChange={(v) => onChange('description', v)}
        placeholder={t(lang, 'placeholders', 'desc')}
        multiline
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'target')}
      >
        {t(lang, 'labels', 'target')}
      </Label>
      <HeroInput
        value={data.targetAudience}
        onChange={(v) => onChange('targetAudience', v)}
        placeholder={t(lang, 'placeholders', 'target')}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'artDirection')}
      >
        {t(lang, 'labels', 'artDirection')}
      </Label>
      <StyleSelect
        value={data.style}
        onChange={(v) => onChange('style', v)}
        options={STYLE_PRESETS[lang][mode]}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'refImages')}
      >
        {t(lang, 'labels', 'refImages')}
      </Label>
      <MultiFileInput
        files={data.referenceImages}
        onChange={(f) => onChange('referenceImages', f)}
        lang={lang}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'aspectRatio')}
      >
        {t(lang, 'labels', 'aspectRatio')}
      </Label>
      <AspectRatioSelector
        value={data.aspectRatio}
        onChange={(v) => onChange('aspectRatio', v)}
      />
    </div>
  </div>
)

export const InfoForm: React.FC<Props<InfoInputs>> = ({
  data,
  onChange,
  mode,
  lang,
  errors,
}) => (
  <div className="space-y-5 md:space-y-8 pb-4 md:pb-12">
    <div>
      <Label required tooltip={t(lang, 'tooltips', 'topic')}>
        {t(lang, 'labels', 'topic')}
      </Label>
      <HeroInput
        value={data.topic}
        onChange={(v) => onChange('topic', v)}
        placeholder={t(lang, 'placeholders', 'topic')}
        error={errors?.topic}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'data')}
      >
        {t(lang, 'labels', 'data')}
      </Label>
      <HeroInput
        value={data.dataPoints}
        onChange={(v) => onChange('dataPoints', v)}
        placeholder={t(lang, 'placeholders', 'data')}
        multiline
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'summary')}
      >
        {t(lang, 'labels', 'summary')}
      </Label>
      <HeroInput
        value={data.description}
        onChange={(v) => onChange('description', v)}
        placeholder={t(lang, 'placeholders', 'summary')}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'artDirection')}
      >
        {t(lang, 'labels', 'artDirection')}
      </Label>
      <StyleSelect
        value={data.style}
        onChange={(v) => onChange('style', v)}
        options={STYLE_PRESETS[lang][mode]}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'refImages')}
      >
        {t(lang, 'labels', 'refImages')}
      </Label>
      <MultiFileInput
        files={data.referenceImages}
        onChange={(f) => onChange('referenceImages', f)}
        lang={lang}
      />
    </div>

    <div>
      <Label
        optionalLabel={t(lang, 'labels', 'optional')}
        tooltip={t(lang, 'tooltips', 'aspectRatio')}
      >
        {t(lang, 'labels', 'aspectRatio')}
      </Label>
      <AspectRatioSelector
        value={data.aspectRatio}
        onChange={(v) => onChange('aspectRatio', v)}
      />
    </div>
  </div>
)
