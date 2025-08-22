import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Save, ArrowRight, Loader2 } from 'lucide-react';

interface ActionBarProps {
  onBackToOutline: () => void;
  onSave: () => void;
  onContinue: () => void;
  isSaving: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onBackToOutline,
  onSave,
  onContinue,
  isSaving
}) => {
  return (
    <div className="fixed bottom-0 left-60 right-80 bg-white border-t border-[#EEF0F4] p-4 z-20">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Left Side - Back to Outline */}
          <Button
            variant="ghost"
            onClick={onBackToOutline}
            className="flex items-center gap-2 text-[#5B667A] hover:text-[#6E5BFF]"
          >
            <ArrowUp className="h-4 w-4" />
            返回大纲
          </Button>

          {/* Right Side - Save and Continue */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              保存草稿
            </Button>

            <Button
              onClick={onContinue}
              className="bg-[#6E5BFF] hover:brightness-105 focus:ring-2 focus:ring-[#6E5BFF] focus:ring-offset-2 text-white rounded-full px-6 h-10 flex items-center gap-2"
            >
              通过/继续
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;