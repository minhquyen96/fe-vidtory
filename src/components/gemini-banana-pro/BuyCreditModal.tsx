import React, { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Coins, MessageCircle, Check } from 'lucide-react'
import { apiService } from '@/services/api'
import { useTranslation } from 'next-i18next'
import { I18N_NAMESPACES } from '@/constants/i18n'

interface CreditPackage {
  id: string
  name: string
  description: string
  credit: number
  price_id: string
  isActive: boolean
  created_at: number
}

interface PackagesResponse {
  status: 'success' | 'error'
  message: string
  data?: {
    packages: CreditPackage[]
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

interface BuyCreditModalProps {
  isOpen: boolean
  onClose: () => void
}

// Facebook URL
const FACEBOOK_URL = 'https://www.facebook.com/Vidtory.AI.MovieMaker'

export function BuyCreditModal({ isOpen, onClose }: BuyCreditModalProps) {
  const { t } = useTranslation(I18N_NAMESPACES.COMMON)
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (isOpen) {
      loadPackages()
    }
  }, [isOpen])

  const loadPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiService.get<PackagesResponse>(
        '/activation-codes/packages/public',
        {
          page: 1,
          limit: 50,
        }
      )

      if (result.status === 'success' && result.data?.packages) {
        // Filter only active packages and sort by credit (ascending)
        const activePackages = result.data.packages
          .filter((pkg) => pkg.isActive)
          .sort((a, b) => a.credit - b.credit)
        setPackages(activePackages)
      } else {
        setError(result.message || 'Failed to load packages')
      }
    } catch (err: any) {
      console.error('Failed to load packages:', err)
      setError(err.response?.data?.message || 'Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  // Find the most popular package (middle one)
  const popularPackageId = useMemo(() => {
    if (packages.length === 0) return null
    // Get the middle package (packages are already sorted ascending)
    return packages[Math.floor(packages.length / 2)]?.id || packages[0]?.id
  }, [packages])

  // Auto-select popular package on load
  useEffect(() => {
    if (popularPackageId && !selectedPackageId) {
      setSelectedPackageId(popularPackageId)
    }
  }, [popularPackageId, selectedPackageId])

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId)
  }

  const handleContactFacebook = () => {
    window.open(FACEBOOK_URL, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm+:max-h-[85vh] flex flex-col p-0">
        <div className="flex flex-col h-full min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : error ? (
            <div className="px-6 py-4">
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 text-default-500">
              <Coins className="mx-auto mb-4 text-default-400" size={48} />
              <p className="text-lg">{t('buyCreditModal.noPackages')}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 sm+:px-6 pt-4 sm+:pt-6 pb-3 sm+:pb-4 border-b border-divider shrink-0">
                <h2 className="text-lg sm+:text-xl md:text-2xl font-bold mb-1 sm+:mb-2 text-foreground">
                  {t('buyCreditModal.outOfCreditTitle')}
                </h2>
                <p className="text-xs sm+:text-sm md:text-base text-default-500">
                  {t('buyCreditModal.outOfCreditDescription')}
                </p>
              </div>

              {/* Packages List - Scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm+:px-6 py-3 sm+:py-4 min-h-0">
                {/* Benefits Section - Show before packages */}
                <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-sm font-bold mb-2 text-foreground">
                    {t('buyCreditModal.benefitsTitle')}
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-default-600">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      <span>{t('buyCreditModal.benefitNoWatermark')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-default-600">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      <span>{t('buyCreditModal.benefitHighQuality')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 sm+:space-y-2">
                  {packages.map((pkg) => {
                    const isPopular = pkg.id === popularPackageId
                    const isSelected = selectedPackageId === pkg.id
                    return (
                      <div
                        key={pkg.id}
                        className={`relative rounded-lg border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-default-200 hover:border-primary/50 bg-default-100'
                        }`}
                        onClick={() => handleSelectPackage(pkg.id)}
                      >
                        <div className="p-2.5 sm+:p-4 flex items-center gap-2 sm+:gap-4">
                          {/* Radio Button */}
                          <div
                            className={`flex-shrink-0 w-4 h-4 sm+:w-5 sm+:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-default-300'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 sm+:w-2.5 sm+:h-2.5 rounded-full bg-white"></div>
                            )}
                          </div>

                          {/* Credit Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 sm+:gap-2 mb-0.5 sm+:mb-1">
                              <div
                                className={`font-bold text-sm sm+:text-base ${
                                  isSelected ? 'text-primary' : 'text-foreground'
                                }`}
                              >
                                {pkg.name}
                              </div>
                              {isPopular && (
                                <span className="px-1.5 sm+:px-2 py-0.5 bg-amber-500 text-white text-[9px] sm+:text-[10px] font-bold rounded-full">
                                  {t('buyCreditModal.popular')}
                                </span>
                              )}
                            </div>
                            {pkg.description && (
                              <p className="text-[10px] sm+:text-xs text-default-500 line-clamp-1">
                                {pkg.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Footer with Contact Button - Fixed at bottom */}
              <div className="px-4 sm+:px-6 py-3 sm+:py-4 border-t border-divider bg-content1 shrink-0">
                <Button
                  onClick={handleContactFacebook}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all h-10 sm+:h-12 rounded-large font-bold text-sm sm+:text-base"
                  size="lg"
                  disabled={!selectedPackageId}
                >
                  <MessageCircle size={16} className="sm+:size-[18] mr-2" />
                  <span>{t('buyCreditModal.contactMessenger')}</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
