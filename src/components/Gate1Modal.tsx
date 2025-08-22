import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  Sparkles,
  Target,
  Edit3,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Gate1ModalProps } from '@/state/types';

const Gate1Modal: React.FC<Gate1ModalProps> = ({
  open,
  price,
  benefits,
  onPreviewOnly,
  onUnlock
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Calculate time left
  useEffect(() => {
    if (!price?.expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, price.expiresAt - now);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [price?.expiresAt]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      await onUnlock();
    } finally {
      setIsUnlocking(false);
    }
  };

  const defaultBenefits = [
    '一次完整生成',
    '2 次局部重写',
    '全量引用核验'
  ];

  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[500px] rounded-2xl"
        hideCloseButton
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] flex items-center justify-center">
              <Unlock className="h-4 w-4 text-white" />
            </div>
            解锁内容生成
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            自动推进已完成，现在可以开始生成您的论文正文。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Display */}
          <div className="text-center space-y-3 p-6 bg-gradient-to-br from-[#6E5BFF]/5 to-[#8B7FFF]/5 rounded-2xl border border-[#6E5BFF]/10">
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 text-[#6E5BFF]" />
              <Badge className="bg-[#6E5BFF] text-white">
                锁定价格
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="text-3xl font-bold text-[#6E5BFF]">
                ¥{price.value}
              </div>
              <p className="text-sm text-gray-600">
                {price.currency} · 含全部服务
              </p>
            </div>

            {/* Countdown Timer */}
            {timeLeft > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600 font-medium">
                  锁价剩余: {formatTime(timeLeft)}
                </span>
              </div>
            )}

            {timeLeft === 0 && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 text-red-500" />
                <span className="text-red-600 font-medium">
                  价格已过期，需要重新估算
                </span>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#6E5BFF]" />
              包含权益
            </h4>
            
            <div className="grid gap-3">
              {displayBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-900">智能生成</p>
                <p className="text-xs text-gray-600">AI驱动写作</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-900">精准引用</p>
                <p className="text-xs text-gray-600">全量核验</p>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto">
                <Edit3 className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-900">灵活编辑</p>
                <p className="text-xs text-gray-600">多次重写</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <Button
              onClick={handleUnlock}
              disabled={isUnlocking || timeLeft === 0}
              className={cn(
                "w-full rounded-full text-white transition-all duration-200 shadow-lg hover:shadow-xl",
                timeLeft === 0 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] hover:from-[#5B4FCC] hover:to-[#7A6FCC]"
              )}
            >
              {isUnlocking ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  正在处理支付...
                </>
              ) : timeLeft === 0 ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  价格已过期
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  立即解锁生成 ¥{price.value}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onPreviewOnly}
              className="w-full rounded-full border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400"
            >
              <Shield className="h-4 w-4 mr-2" />
              仅预览草案
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              报价已锁定，{timeLeft > 0 ? `${formatTime(timeLeft)} 后过期` : '已过期'}。<br />
              未付费前为预览模式，内容受限。
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Gate1Modal;