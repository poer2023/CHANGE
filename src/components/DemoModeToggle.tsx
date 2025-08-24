import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useDemoMode } from '@/state/AppContext';
import { Eye, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const DemoModeToggle: React.FC = () => {
  const { demoMode, toggleDemoMode } = useDemoMode();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#E7EAF3] shadow-lg",
        "transition-all duration-200 hover:shadow-xl",
        demoMode && "border-[#6A5AF9] bg-[#6A5AF9]/5"
      )}>
        <div className="flex items-center gap-2">
          {demoMode ? (
            <Eye className="h-4 w-4 text-[#6A5AF9]" />
          ) : (
            <Settings className="h-4 w-4 text-slate-500" />
          )}
          <Label 
            htmlFor="demo-mode"
            className={cn(
              "text-sm font-medium cursor-pointer select-none",
              demoMode ? "text-[#6A5AF9]" : "text-slate-700"
            )}
          >
            演示模式
          </Label>
        </div>
        
        <Switch
          id="demo-mode"
          checked={demoMode}
          onCheckedChange={toggleDemoMode}
          className="data-[state=checked]:bg-[#6A5AF9]"
        />
        
        {demoMode && (
          <div className="text-xs text-[#6A5AF9] bg-[#6A5AF9]/10 px-2 py-1 rounded-md">
            所有限制已解除
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoModeToggle;