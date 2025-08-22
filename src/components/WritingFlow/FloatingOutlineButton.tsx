import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingOutlineButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingOutlineButton: React.FC<FloatingOutlineButtonProps> = ({
  onClick,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#6E5BFF] hover:brightness-105 text-white shadow-lg hover:shadow-xl transition-all duration-200 p-0',
        className
      )}
    >
      <FileText className="h-5 w-5" />
    </Button>
  );
};

export default FloatingOutlineButton;