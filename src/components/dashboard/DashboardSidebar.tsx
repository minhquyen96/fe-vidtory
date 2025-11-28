import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Home,
  Video,
  Image as ImageIcon,
  Lightbulb,
  BarChart2,
  Calendar,
  Cloud,
  Zap,
  FileText,
  Folder,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { BuyCreditModal } from '@/components/gemini-banana-pro/BuyCreditModal'

export function DashboardSidebar() {
  const router = useRouter()
  const auth = useAuth()
  const { openLoginModal, userData, isAuthenticated } = auth
  const [showBuyCreditModal, setShowBuyCreditModal] = useState(false)

  // Handle buy credit - same logic as PageHeader
  const handleBuyCredit = () => {
    if (!isAuthenticated) {
      openLoginModal()
      return
    }
    setShowBuyCreditModal(true)
  }

  // Check if user is PRO
  const isPro = userData?.premium?.status === 'active'

  // Sidebar Item Component - Same as DSSidebarItem
  const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
    badge,
    onClick,
  }: {
    icon: any
    label: string
    active?: boolean
    badge?: string
    onClick?: () => void
  }) => (
    <button
      onClick={onClick}
      className={`
        group flex items-center rounded-2xl transition-all duration-200 relative w-full px-3 py-3 gap-3 flex-row text-left
        ${active
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
      title={label}
    >
      <div className="flex items-center justify-center">
        <Icon
          size={20}
          strokeWidth={active ? 2.5 : 2}
          className={`
            shrink-0 transition-colors
            ${active
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'
            }
          `}
        />
      </div>
      <span className="text-sm whitespace-nowrap tracking-tight">{label}</span>
      {badge && (
        <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-full text-[9px] px-1.5 py-0.5">
          {badge}
        </span>
      )}
    </button>
  )

  // Section Header Component - Similar to DSSectionHeader
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-3 pb-2 pt-6">
      <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        {title}
      </h3>
    </div>
  )

  return (
    <div className="w-[260px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0 z-20">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-3 shrink-0">
        <div className="w-auto h-10 text-gray-900 dark:text-white">
          <svg
            viewBox="0 0 483 154"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-auto"
          >
            <path
              d="M388.788 53.6475H405.032L423.392 97.165H423.792L440.44 55.2109H460.286L419.53 148.576H399.818L415.135 113.813H411.405L388.788 62.9453V73.3242H383.726C380.796 73.3242 378.132 73.6793 375.735 74.3896C373.426 75.0112 371.473 76.0324 369.875 77.4531C368.277 78.8738 367.033 80.7833 366.145 83.1807C365.346 85.4891 364.947 88.3303 364.947 91.7041V121.272H346.301V55.2109H362.283L364.014 69.1953H364.414C366.278 65.0221 368.365 61.8253 370.674 59.6055C372.982 57.2969 375.647 55.7435 378.666 54.9443C381.685 54.0565 385.059 53.6123 388.788 53.6123V53.6475ZM308.66 53.6123C315.053 53.6123 320.824 55.0777 325.974 58.0078C331.124 60.938 335.209 65.022 338.228 70.2607C341.247 75.4107 342.757 81.4043 342.757 88.2412C342.757 94.9893 341.247 100.983 338.228 106.222C335.209 111.372 331.124 115.457 325.974 118.476C320.825 121.406 315.009 122.871 308.527 122.871C302.223 122.871 296.495 121.406 291.345 118.476C286.195 115.457 282.111 111.372 279.092 106.222C276.073 100.983 274.563 94.9893 274.563 88.2412C274.563 81.4931 276.073 75.4995 279.092 70.2607C282.11 65.022 286.196 60.938 291.345 58.0078C296.495 55.0777 302.267 53.6123 308.66 53.6123ZM258.029 55.21H275.344V70.3936H258.029V97.5645C258.029 100.583 258.65 102.715 259.893 103.958C261.225 105.112 263.445 105.689 266.552 105.689H275.077V121.272H263.09C258.384 121.272 254.21 120.517 250.57 119.008C247.019 117.498 244.266 115.013 242.312 111.55C240.359 108.087 239.383 103.381 239.383 97.4316V70.3936H228.061V55.21H239.383L241.381 37.0967H258.029V55.21ZM308.66 69.4619C305.996 69.4619 303.51 70.1721 301.201 71.5928C298.892 72.9247 297.028 75.0113 295.607 77.8525C294.275 80.6051 293.609 84.068 293.609 88.2412C293.609 92.4145 294.275 95.9223 295.607 98.7637C297.028 101.516 298.848 103.603 301.068 105.023C303.377 106.355 305.863 107.021 308.527 107.021C311.368 107.021 313.899 106.355 316.119 105.023C318.427 103.603 320.247 101.516 321.579 98.7637C323 95.9223 323.711 92.4145 323.711 88.2412C323.711 84.068 323 80.6051 321.579 77.8525C320.247 75.0114 318.427 72.9246 316.119 71.5928C313.899 70.1721 311.412 69.4619 308.66 69.4619Z"
              fill="currentColor"
            />
            <path
              d="M67.4493 108.752H67.8497L91.9561 29.6382H113.134L83.0333 122.871H52.1329L22.0323 29.6382H43.0762L67.4493 108.752ZM135.278 122.871H115.3V29.6382H135.278V122.871ZM176.834 29.6382C187.578 29.6382 196.501 31.5918 203.605 35.4985C210.708 39.3166 215.947 44.733 219.321 51.7476C222.784 58.6734 224.516 66.8424 224.516 76.2544C224.516 85.5776 222.784 93.7466 219.321 100.761C215.947 107.687 210.708 113.103 203.605 117.01C196.59 120.917 187.622 122.871 176.7 122.871H143.271V29.6382H176.834ZM168.12 51.9546C165.345 50.3526 161.876 52.355 161.876 55.5591V96.9507C161.876 100.155 165.345 102.157 168.12 100.555L203.967 79.8589C206.741 78.2567 206.741 74.2519 203.967 72.6499L168.12 51.9546Z"
              fill="url(#paint0_linear_logo)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_logo"
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
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <SidebarItem
          icon={Home}
          label="Home"
          active={router.pathname === '/dashboard'}
          onClick={() => router.push('/dashboard')}
        />
        <SectionHeader title="Creation" />
        <SidebarItem
          icon={Video}
          label="Video generator"
          badge="SOON"
          onClick={() => {}}
        />
        <SidebarItem
          icon={ImageIcon}
          label="Image studio"
          onClick={() => router.push('/dashboard/templates')}
        />
        <SidebarItem
          icon={Lightbulb}
          label="Inspiration"
          onClick={() => {}}
        />
        <SectionHeader title="Management" />
        <SidebarItem
          icon={BarChart2}
          label="Analytics"
          onClick={() => {}}
        />
        <SidebarItem
          icon={Calendar}
          label="Publisher"
          onClick={() => {}}
        />
        <SectionHeader title="Space" />
        <SidebarItem
          icon={Cloud}
          label="Assets"
          onClick={() => {}}
        />
        <SidebarItem
          icon={FileText}
          label="Templates"
          active={router.pathname === '/dashboard/templates'}
          onClick={() => router.push('/dashboard/templates')}
        />
        <SidebarItem
          icon={Folder}
          label="Workflows"
          active={router.pathname === '/dashboard/workflows'}
          onClick={() => router.push('/dashboard/workflows')}
        />
      </div>

      {/* Upgrade Card - Only show if not PRO */}
      {!isPro && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden group hover:border-[rgb(171,223,0)]/20 transition-all cursor-pointer shadow-sm">
            <div
              className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-20"
              style={{
                background:
                  'linear-gradient(to right, rgb(171, 223, 0), rgb(0, 226, 233))',
              }}
            ></div>
            <h4 className="font-bold text-sm mb-1 text-gray-900 dark:text-white flex items-center gap-1.5 relative z-10">
              <Zap size={16} className="text-amber-500 fill-amber-500" /> Unlock
              Pro
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-3 leading-relaxed relative z-10">
              Access premium templates & models.
            </p>
            <button
              onClick={handleBuyCredit}
              className="w-full bg-gradient-to-r from-[rgb(171,223,0)] to-cyan-500 text-black text-sm font-semibold py-2.5 px-4 rounded-xl hover:shadow-lg shadow-md shadow-[rgb(171,223,0)]/20 hover:shadow-[rgb(171,223,0)]/30 transition-all relative z-10"
              style={{
                background:
                  'linear-gradient(to right, rgb(171, 223, 0), rgb(0, 226, 233))',
              }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      {/* Buy Credit Modal */}
      <BuyCreditModal
        isOpen={showBuyCreditModal}
        onClose={() => setShowBuyCreditModal(false)}
      />
    </div>
  )
}
