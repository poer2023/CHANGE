import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VerifyLevel, Addon } from './OutcomePanelCard';

interface PricingBlockProps {
  lockedPrice?: { 
    value: number; 
    currency: 'CNY'; 
    expiresAt: number; 
  } | null;
  estimate: {
    priceRange: [number, number];
    etaMinutes: [number, number];
    verifyLevel: VerifyLevel;
  };
  addons: Addon[];
  onVerifyChange: (level: VerifyLevel) => void;
}

const PricingBlock: React.FC<PricingBlockProps> = ({
  lockedPrice,
  estimate,
  addons,
  onVerifyChange
}) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Countdown for locked price
  useEffect(() => {
    if (!lockedPrice) return;

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = lockedPrice.expiresAt - now;
      
      if (remaining <= 0) {
        setTimeLeft('00:00');
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockedPrice]);

  const formatTimeRange = (minutes: [number, number]): string => {
    const [min, max] = minutes;
    if (max < 60) {
      return `${min}–${max} 分钟`;
    } else {
      const minHours = Math.round(min / 60 * 10) / 10;
      const maxHours = Math.round(max / 60 * 10) / 10;
      return `${minHours}–${maxHours} 小时`;
    }
  };

  // Calculate addon pricing
  const addonPrices = {
    evidencePack: 15,
    defenseCard: 25,
    latex: 10,
    aiCheck: 20,
    plagiarism: 30,
    shareLink: 5
  };

  const addonTotal = addons.reduce((sum, addon) => {
    return sum + (addonPrices[addon] || 0);
  }, 0);

  const basePrice = estimate.priceRange[0];
  const totalPrice = basePrice + addonTotal;

  if (lockedPrice) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-slate-900">
                ¥{lockedPrice.value}
              </span>
              <Badge className="bg-green-100 text-green-700 text-xs">
                {t('outcome.pricing.locked')}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-sm text-amber-600 font-mono">
                {timeLeft}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-600">{t('outcome.pricing.verify_level')}</div>
            <div className="text-sm font-medium text-slate-700">{estimate.verifyLevel}</div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-[#6A5AF9] hover:text-[#5A4ACF] p-0"
        >
          {t('outcome.pricing.relock')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main pricing display */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-slate-900">
            ≈ ¥{estimate.priceRange[0]}–{estimate.priceRange[1]}
          </div>
          <div className="text-sm text-slate-600">
            ETA {formatTimeRange(estimate.etaMinutes)}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-600">{t('outcome.pricing.verify_level')}</div>
          <ToggleGroup
            type="single"
            value={estimate.verifyLevel}
            onValueChange={(value) => value && onVerifyChange(value as VerifyLevel)}
            className="bg-white border border-slate-200 rounded-xl p-1 h-8"
          >
            <ToggleGroupItem 
              value="Basic" 
              className="text-xs h-6 px-2 rounded-lg data-[state=on]:bg-[#6A5AF9] data-[state=on]:text-white"
            >
              {t('outcome.pricing.basic')}
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="Standard" 
              className="text-xs h-6 px-2 rounded-lg data-[state=on]:bg-[#6A5AF9] data-[state=on]:text-white"
            >
              {t('outcome.pricing.standard')}
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="Pro" 
              className="text-xs h-6 px-2 rounded-lg data-[state=on]:bg-[#6A5AF9] data-[state=on]:text-white"
            >
              {t('outcome.pricing.pro')}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Expandable details */}
      {(addons.length > 0 || showDetails) && (
        <div className="border-t border-slate-200 pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-7 text-xs text-slate-600 hover:text-slate-900 p-0 flex items-center gap-1"
          >
            {showDetails ? t('outcome.pricing.hide_details') : t('outcome.pricing.show_details')}
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          
          {showDetails && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{t('outcome.pricing.base_price')}</span>
                <span className="text-slate-900">¥{basePrice}</span>
              </div>
              
              {addons.length > 0 && (
                <>
                  {addons.map((addon) => (
                    <div key={addon} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {t(`outcome.addons.${addon}.title`)}
                      </span>
                      <span className="text-slate-900">+¥{addonPrices[addon]}</span>
                    </div>
                  ))}
                </>
              )}
              
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-medium">
                <span className="text-slate-900">{t('outcome.pricing.total')}</span>
                <span className="text-slate-900">¥{totalPrice}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingBlock;