import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Download,
  Shield,
  Bot,
  Package,
  FileCode,
  Presentation,
  Share,
  AlertTriangle,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Gate2DialogProps } from '@/state/types';

const Gate2Dialog: React.FC<Gate2DialogProps> = ({
  open,
  missingAddons,
  onBuyAndExport,
  onCancel
}) => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([...missingAddons]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addonInfo = {
    plagiarism: {
      name: '抄袭检测',
      description: '全文原创性检测报告',
      icon: Shield,
      price: 29,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    aiCheck: {
      name: 'AI检测',
      description: 'AI生成内容识别',
      icon: Bot,
      price: 19,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    evidencePack: {
      name: '证据包',
      description: '完整引用溯源文档',
      icon: Package,
      price: 39,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    latex: {
      name: 'LaTeX 格式',
      description: '专业学术排版',
      icon: FileCode,
      price: 15,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    defenseCard: {
      name: '答辩卡',
      description: 'PPT + 答辩要点',
      icon: Presentation,
      price: 49,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    shareLink: {
      name: '分享链接',
      description: '7天只读分享',
      icon: Share,
      price: 9,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  };

  const totalPrice = selectedAddons.reduce((sum, addon) => {
    return sum + (addonInfo[addon as keyof typeof addonInfo]?.price || 0);
  }, 0);

  const handleAddonToggle = (addonId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddons(prev => [...prev, addonId]);
    } else {
      // Don't allow unchecking required addons
      if (!missingAddons.includes(addonId)) {
        setSelectedAddons(prev => prev.filter(id => id !== addonId));
      }
    }
  };

  const handleBuyAndExport = async () => {
    setIsProcessing(true);
    try {
      await onBuyAndExport(selectedAddons);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] flex items-center justify-center">
              <Download className="h-4 w-4 text-white" />
            </div>
            导出前确认
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            您选择的导出功能需要以下附加服务，请确认购买后继续导出。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Required Services Warning */}
          {missingAddons.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">
                  需要购买以下服务
                </p>
                <p className="text-xs text-amber-700">
                  这些服务是您选择的导出功能所必需的
                </p>
              </div>
            </div>
          )}

          {/* Addon Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">
              选择服务 ({selectedAddons.length} 项)
            </h4>
            
            <div className="space-y-3">
              {Object.entries(addonInfo)
                .filter(([id]) => missingAddons.includes(id) || selectedAddons.includes(id))
                .map(([id, addon]) => {
                  const IconComponent = addon.icon;
                  const isRequired = missingAddons.includes(id);
                  const isSelected = selectedAddons.includes(id);

                  return (
                    <div 
                      key={id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200",
                        isSelected 
                          ? "border-[#6E5BFF] bg-[#6E5BFF]/5" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleAddonToggle(id, !!checked)}
                        disabled={isRequired}
                        className="border-[#EEF0F4] data-[state=checked]:bg-[#6E5BFF] data-[state=checked]:border-[#6E5BFF]"
                      />
                      
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        addon.bgColor
                      )}>
                        <IconComponent className={cn("h-5 w-5", addon.color)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-medium text-gray-900">
                            {addon.name}
                          </h5>
                          {isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              必需
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {addon.description}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ¥{addon.price}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Price Summary */}
          {selectedAddons.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  已选服务 ({selectedAddons.length} 项)
                </span>
                <span className="text-lg font-bold text-[#6E5BFF]">
                  ¥{totalPrice}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                支付成功后立即开始导出
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-full"
            disabled={isProcessing}
          >
            取消
          </Button>
          
          <Button
            onClick={handleBuyAndExport}
            disabled={selectedAddons.length === 0 || isProcessing}
            className={cn(
              "flex-1 rounded-full text-white transition-all duration-200",
              selectedAddons.length === 0 || isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] hover:from-[#5B4FCC] hover:to-[#7A6FCC] shadow-lg hover:shadow-xl"
            )}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                购买并导出 ¥{totalPrice}
              </>
            )}
          </Button>
        </div>

        {/* Fine Print */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          购买后的服务将立即生效，支持的导出格式包括 DOCX、PDF 等。
          <br />
          如有疑问请联系客服。
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default Gate2Dialog;