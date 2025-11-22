import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Coins, MessageCircle, Check } from 'lucide-react';
import { apiService } from '@/services/api';
import { useTranslation } from 'next-i18next';
import { I18N_NAMESPACES } from '@/constants/i18n';

interface CreditPackage {
  id: string;
  name: string;
  description: string;
  credit: number;
  price_id: string;
  isActive: boolean;
  created_at: number;
}

interface PackagesResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    packages: CreditPackage[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface BuyCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Facebook Messenger URL - opens messenger chat
const FACEBOOK_MESSENGER_URL = 'https://m.me/lehuyducanh';

export function BuyCreditModal({ isOpen, onClose }: BuyCreditModalProps) {
  const { t } = useTranslation(I18N_NAMESPACES.COMMON);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPackages();
    }
  }, [isOpen]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.get<PackagesResponse>(
        '/activation-codes/packages/public',
        {
          page: 1,
          limit: 50,
        }
      );

      if (result.status === 'success' && result.data?.packages) {
        // Filter only active packages and sort by credit (descending)
        const activePackages = result.data.packages
          .filter((pkg) => pkg.isActive)
          .sort((a, b) => b.credit - a.credit);
        setPackages(activePackages);
      } else {
        setError(result.message || 'Failed to load packages');
      }
    } catch (err: any) {
      console.error('Failed to load packages:', err);
      setError(err.response?.data?.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  // Find the most popular package (middle one or highest credit)
  const popularPackageId = useMemo(() => {
    if (packages.length === 0) return null;
    // Get the package with highest credit, or middle one if multiple
    const sorted = [...packages].sort((a, b) => b.credit - a.credit);
    return sorted[Math.floor(sorted.length / 2)]?.id || sorted[0]?.id;
  }, [packages]);

  // Auto-select popular package on load
  useEffect(() => {
    if (popularPackageId && !selectedPackageId) {
      setSelectedPackageId(popularPackageId);
    }
  }, [popularPackageId, selectedPackageId]);

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
  };

  const handleContactMessenger = () => {
    window.open(FACEBOOK_MESSENGER_URL, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t('buyCreditModal.outOfCreditTitle')}
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
            {t('buyCreditModal.outOfCreditDescription')}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Coins className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-lg">{t('buyCreditModal.noPackages')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Packages List - Simple Compact Design */}
            <div className="space-y-2">
              {packages.map((pkg) => {
                const isPopular = pkg.id === popularPackageId;
                return (
                  <div
                    key={pkg.id}
                    className={`relative group rounded-lg border-2 transition-all duration-200 ${
                      selectedPackageId === pkg.id
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
                        : isPopular
                        ? 'border-slate-300 dark:border-slate-600 hover:border-primary/50 bg-white dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-slate-800'
                    } cursor-pointer`}
                    onClick={() => handleSelectPackage(pkg.id)}
                  >
                    <div className="p-4 flex items-center justify-between gap-4">
                      {/* Left: Radio + Credit Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Radio Button */}
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedPackageId === pkg.id
                            ? 'border-primary bg-primary'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {selectedPackageId === pkg.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                          )}
                        </div>

                        {/* Credit Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`flex-shrink-0 p-2 rounded-lg ${
                            isPopular
                              ? 'bg-amber-500'
                              : 'bg-amber-400 dark:bg-amber-500'
                          }`}>
                            <Coins className="text-white" size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-lg ${
                                selectedPackageId === pkg.id
                                  ? 'text-primary dark:text-primary'
                                  : 'text-slate-900 dark:text-slate-100'
                              }`}>
                                {pkg.credit.toLocaleString()} credit
                              </span>
                              {isPopular && (
                                <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                                  {t('buyCreditModal.popular')}
                                </span>
                              )}
                            </div>
                            {pkg.description && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                {pkg.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Features List - Common for all packages */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span>Sử dụng ngay sau khi mua</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span>Không giới hạn thời gian</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <div className="pt-4">
              <Button
                onClick={handleContactMessenger}
                className="w-full bg-gradient opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-14"
                size="lg"
                disabled={!selectedPackageId}
              >
                <MessageCircle size={20} className="mr-2" />
                <span className="font-bold text-base">{t('buyCreditModal.contactMessenger')}</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

