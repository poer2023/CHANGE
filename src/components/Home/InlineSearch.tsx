import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineSearchProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const InlineSearch: React.FC<InlineSearchProps> = ({
  placeholder = "搜索文稿、引用、标签…",
  className,
  autoFocus = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea and it's the '/' key
      if (
        event.key === '/' &&
        !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/documents?q=${encodeURIComponent(searchTerm.trim())}`);
    }, 300);
  };

  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setSearchTerm('');
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          disabled={isLoading}
          className={cn(
            "pl-9 pr-20 h-10",
            "w-full lg:w-[420px]"
          )}
        />
        
        {/* Right section - Clear button and Loading/Submit */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchTerm && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-6 w-6">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            </div>
          ) : searchTerm.trim() && (
            <Button
              type="submit"
              size="sm"
              className="h-6 px-2 text-xs rounded-md"
            >
              搜索
            </Button>
          )}
        </div>
      </div>
      
      {/* Keyboard hint */}
      <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
        按 <kbd className="px-1 py-0.5 bg-muted rounded text-xs">/</kbd> 聚焦
      </div>
    </form>
  );
};

export default InlineSearch;