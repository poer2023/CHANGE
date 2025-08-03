import { useEffect, useRef, useCallback } from 'react';

interface KeyboardNavigationOptions {
  enabled?: boolean;
  loop?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  selector?: string;
  onEscape?: () => void;
  onEnter?: (element: HTMLElement, index: number) => void;
  onFocus?: (element: HTMLElement, index: number) => void;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
  const {
    enabled = true,
    loop = true,
    orientation = 'both',
    selector = '[role="button"], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    onEscape,
    onEnter,
    onFocus
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);
  const currentIndexRef = useRef(-1);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll(selector);
    return Array.from(elements).filter((el): el is HTMLElement => {
      const element = el as HTMLElement;
      return (
        !(element as any).disabled &&
        element.tabIndex !== -1 &&
        element.offsetParent !== null && // 元素可见
        !element.hasAttribute('aria-hidden') &&
        window.getComputedStyle(element).visibility !== 'hidden'
      );
    });
  }, [selector]);

  const focusElement = useCallback((index: number) => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    let targetIndex = index;
    
    if (loop) {
      if (targetIndex < 0) {
        targetIndex = elements.length - 1;
      } else if (targetIndex >= elements.length) {
        targetIndex = 0;
      }
    } else {
      targetIndex = Math.max(0, Math.min(targetIndex, elements.length - 1));
    }

    const element = elements[targetIndex];
    if (element) {
      element.focus();
      currentIndexRef.current = targetIndex;
      onFocus?.(element, targetIndex);
    }
  }, [getFocusableElements, loop, onFocus]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !containerRef.current) return;

    const elements = getFocusableElements();
    if (elements.length === 0) return;

    // 获取当前焦点元素的索引
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = elements.indexOf(activeElement);
    currentIndexRef.current = currentIndex;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;

      case 'Enter':
      case ' ': // 空格键
        if (activeElement && currentIndex !== -1) {
          event.preventDefault();
          onEnter?.(activeElement, currentIndex);
          
          // 如果是按钮或链接，触发点击
          if (activeElement.tagName === 'BUTTON' || activeElement.tagName === 'A') {
            activeElement.click();
          }
        }
        break;

      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          focusElement(currentIndex + 1);
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          focusElement(currentIndex - 1);
        }
        break;

      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          focusElement(currentIndex + 1);
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          focusElement(currentIndex - 1);
        }
        break;

      case 'Home':
        event.preventDefault();
        focusElement(0);
        break;

      case 'End':
        event.preventDefault();
        focusElement(elements.length - 1);
        break;

      case 'Tab':
        // Tab键的默认行为，但我们可以跟踪焦点
        setTimeout(() => {
          const newActiveElement = document.activeElement as HTMLElement;
          const newIndex = elements.indexOf(newActiveElement);
          if (newIndex !== -1) {
            currentIndexRef.current = newIndex;
          }
        }, 0);
        break;
    }
  }, [enabled, getFocusableElements, focusElement, orientation, onEscape, onEnter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  // 聚焦到第一个元素
  const focusFirst = useCallback(() => {
    focusElement(0);
  }, [focusElement]);

  // 聚焦到最后一个元素
  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    focusElement(elements.length - 1);
  }, [focusElement, getFocusableElements]);

  // 聚焦到下一个元素
  const focusNext = useCallback(() => {
    focusElement(currentIndexRef.current + 1);
  }, [focusElement]);

  // 聚焦到上一个元素
  const focusPrevious = useCallback(() => {
    focusElement(currentIndexRef.current - 1);
  }, [focusElement]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    focusElement,
    getCurrentIndex: () => currentIndexRef.current,
    getFocusableElements
  };
};

// 焦点陷阱Hook - 用于模态框等
export const useFocusTrap = (isActive: boolean = true) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    previousFocusRef.current = document.activeElement as HTMLElement;

    const getFocusableElements = (): HTMLElement[] => {
      const elements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(elements).filter((el): el is HTMLElement => {
        const element = el as HTMLElement;
        return (
          !(element as any).disabled &&
          element.tabIndex !== -1 &&
          element.offsetParent !== null
        );
      });
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement) return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // 聚焦第一个可聚焦元素
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      setTimeout(() => {
        focusableElements[0].focus();
      }, 0);
    }

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // 恢复之前的焦点
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};

// 跳过链接Hook - 提供快速导航到主要内容的功能
export const useSkipLinks = () => {
  const skipLinksRef = useRef<HTMLElement | null>(null);

  const createSkipLink = useCallback((target: string, label: string) => {
    const link = document.createElement('a');
    link.href = `#${target}`;
    link.textContent = label;
    link.className = `
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
      bg-primary-600 text-white px-4 py-2 rounded-md z-50 
      focus:outline-none focus:ring-2 focus:ring-white
    `.trim();
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetElement = document.getElementById(target);
      if (targetElement) {
        targetElement.focus();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });

    return link;
  }, []);

  const addSkipLinks = useCallback((links: Array<{ target: string; label: string }>) => {
    if (!skipLinksRef.current) {
      const container = document.createElement('div');
      container.className = 'skip-links';
      document.body.insertBefore(container, document.body.firstChild);
      skipLinksRef.current = container;
    }

    // 清除现有的跳过链接
    skipLinksRef.current.innerHTML = '';

    // 添加新的跳过链接
    links.forEach(({ target, label }) => {
      const link = createSkipLink(target, label);
      skipLinksRef.current?.appendChild(link);
    });
  }, [createSkipLink]);

  return { addSkipLinks };
};

// ARIA实时区域Hook - 用于屏幕阅读器公告
export const useAriaLiveRegion = () => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 创建实时区域
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    
    document.body.appendChild(liveRegion);
    liveRegionRef.current = liveRegion;

    return () => {
      if (liveRegionRef.current) {
        document.body.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!liveRegionRef.current) return;

    liveRegionRef.current.setAttribute('aria-live', priority);
    liveRegionRef.current.textContent = message;

    // 清除消息以便下次公告
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  return { announce };
};