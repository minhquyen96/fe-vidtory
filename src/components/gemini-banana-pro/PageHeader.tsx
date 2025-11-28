import { ArrowLeft, Coins, Zap, Download, Key } from 'lucide-react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { AppMode } from '@/types/gemini-banana-pro'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface PageHeaderProps {
  activePage: AppMode
  userCredit: number
  resultImage: string | null
  onBuyCredit: () => void
  onDownload: () => void
  onActivate?: () => void
}

export function PageHeader({
  activePage,
  userCredit,
  resultImage,
  onBuyCredit,
  onDownload,
  onActivate,
}: PageHeaderProps) {
  const { t } = useTranslation(I18N_NAMESPACES.GEMINI_BANANA_PRO)
  const router = useRouter()

  return (
    <header className="h-14 md:h-20 w-full bg-content1 border-b border-divider flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
      {/* Left side - Back button and Logo */}
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-default-100 rounded-full text-default-500 hover:text-foreground transition-colors hidden md:flex"
          title="Quay lại"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Vidtory Logo SVG - Responsive Sizing */}
        <Link href="/" className="h-6 md:h-10 w-auto text-foreground">
          <svg
            viewBox="0 0 483 154"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-auto"
          >
            {/* Logo Path */}
            <path
              d="M388.788 53.6475H405.032L423.392 97.165H423.792L440.44 55.2109H460.286L419.53 148.576H399.818L415.135 113.813H411.405L388.788 62.9453V73.3242H383.726C380.796 73.3242 378.132 73.6793 375.735 74.3896C373.426 75.0112 371.473 76.0324 369.875 77.4531C368.277 78.8738 367.033 80.7833 366.145 83.1807C365.346 85.4891 364.947 88.3303 364.947 91.7041V121.272H346.301V55.2109H362.283L364.014 69.1953H364.414C366.278 65.0221 368.365 61.8253 370.674 59.6055C372.982 57.2969 375.647 55.7435 378.666 54.9443C381.685 54.0565 385.059 53.6123 388.788 53.6123V53.6475ZM308.66 53.6123C315.053 53.6123 320.824 55.0777 325.974 58.0078C331.124 60.938 335.209 65.022 338.228 70.2607C341.247 75.4107 342.757 81.4043 342.757 88.2412C342.757 94.9893 341.247 100.983 338.228 106.222C335.209 111.372 331.124 115.457 325.974 118.476C320.825 121.406 315.009 122.871 308.527 122.871C302.223 122.871 296.495 121.406 291.345 118.476C286.195 115.457 282.111 111.372 279.092 106.222C276.073 100.983 274.563 94.9893 274.563 88.2412C274.563 81.4931 276.073 75.4995 279.092 70.2607C282.11 65.022 286.196 60.938 291.345 58.0078C296.495 55.0777 302.267 53.6123 308.66 53.6123ZM258.029 55.21H275.344V70.3936H258.029V97.5645C258.029 100.583 258.65 102.715 259.893 103.958C261.225 105.112 263.445 105.689 266.552 105.689H275.077V121.272H263.09C258.384 121.272 254.21 120.517 250.57 119.008C247.019 117.498 244.266 115.013 242.312 111.55C240.359 108.087 239.383 103.381 239.383 97.4316V70.3936H228.061V55.21H239.383L241.381 37.0967H258.029V55.21ZM308.66 69.4619C305.996 69.4619 303.51 70.1721 301.201 71.5928C298.892 72.9247 297.028 75.0113 295.607 77.8525C294.275 80.6051 293.609 84.068 293.609 88.2412C293.609 92.4145 294.275 95.9223 295.607 98.7637C297.028 101.516 298.848 103.603 301.068 105.023C303.377 106.355 305.863 107.021 308.527 107.021C311.368 107.021 313.899 106.355 316.119 105.023C318.427 103.603 320.247 101.516 321.579 98.7637C323 95.9223 323.711 92.4145 323.711 88.2412C323.711 84.068 323 80.6051 321.579 77.8525C320.247 75.0114 318.427 72.9246 316.119 71.5928C313.899 70.1721 311.412 69.4619 308.66 69.4619Z"
              fill="currentColor"
            />
            <path
              d="M67.4493 108.752H67.8497L91.9561 29.6382H113.134L83.0333 122.871H52.1329L22.0323 29.6382H43.0762L67.4493 108.752ZM135.278 122.871H115.3V29.6382H135.278V122.871ZM176.834 29.6382C187.578 29.6382 196.501 31.5918 203.605 35.4985C210.708 39.3166 215.947 44.733 219.321 51.7476C222.784 58.6734 224.516 66.8424 224.516 76.2544C224.516 85.5776 222.784 93.7466 219.321 100.761C215.947 107.687 210.708 113.103 203.605 117.01C196.59 120.917 187.622 122.871 176.7 122.871H143.271V29.6382H176.834ZM168.12 51.9546C165.345 50.3526 161.876 52.355 161.876 55.5591V96.9507C161.876 100.155 165.345 102.157 168.12 100.555L203.967 79.8589C206.741 78.2567 206.741 74.2519 203.967 72.6499L168.12 51.9546Z"
              fill="url(#paint0_linear_195_2114)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_195_2114"
                x1="22.0323"
                y1="38.608"
                x2="222.317"
                y2="117.951"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#ABDF00" />
                <stop offset="1" stopColor="#00E2E9" />
              </linearGradient>
            </defs>
          </svg>
        </Link>
      </div>

      {/* Right side - Credit, Upgrade, Download */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Credit Display */}
        <div className="flex items-center gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-default-100 rounded-full border border-default-200">
          <Coins size={14} className="text-amber-500 fill-amber-500 md:w-5 md:h-5" />
          <span className="font-bold text-xs md:text-base">{userCredit}</span>
        </div>

        {/* Activation Button */}
        {onActivate && (
          <Link
            href="/activation"
            className="flex items-center gap-2 px-2 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-large font-bold text-xs md:text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
            title={t('labels.activate')}
          >
            <Key size={16} className="md:w-4 md:h-4" />
            <span className="hidden md:inline">{t('labels.activate')}</span>
          </Link>
        )}

        {/* Upgrade Button */}
        <button
          onClick={onBuyCredit}
          className="flex items-center gap-2 px-2 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-large font-bold text-xs md:text-base transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-95"
        >
          <Zap size={16} className="fill-white md:w-5 md:h-5" />
          <span className="hidden md:inline">{t('labels.upgrade')}</span>
        </button>

        {/* Download Button */}
        <button
          onClick={onDownload}
          disabled={!resultImage}
          className={`p-2 md:px-6 md:py-2.5 rounded-large transition-all flex items-center gap-2 font-semibold active:scale-95
                     ${
                       resultImage
                         ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40'
                         : 'bg-default-100 text-default-300 cursor-not-allowed border border-default-200'
                     }
                  `}
        >
          <Download size={18} className="md:w-5 md:h-5" />
          <span className="hidden md:inline text-base">{t('labels.download')}</span>
        </button>
      </div>
    </header>
  )
}
