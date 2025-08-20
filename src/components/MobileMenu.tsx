import React, { useEffect, useState } from 'react';
import { X, ChevronDown, ExternalLink } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { label: "功能", href: "#features" },
  { label: "为什么", href: "#reasons" },
  { label: "闭环方案", href: "#loop" },
  { label: "流程", href: "#process" },
  { label: "价格", href: "#pricing" },
  { label: "FAQ", href: "#faq" }
];

const resourceItems = [
  { title: "DOI 是什么", href: "/resources/what-is-doi" },
  { title: "非母语如何避免 AI 误判", href: "/resources/avoid-misjudge" },
  { title: "口头核验提问 20 例", href: "/resources/viva-qa-20" }
];

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    } else {
      document.body.style.overflow = '';
      setIsResourcesOpen(false);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        const offset = window.innerWidth < 768 ? 56 : 64; // mobile : desktop
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-lg font-semibold text-slate-900">菜单</span>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md"
              aria-label="关闭菜单"
              data-event="menu_toggle"
              data-label="close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto" role="navigation">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="w-full text-left px-3 py-3 text-slate-700 hover:bg-gray-50 hover:text-indigo-700 rounded-lg transition-colors duration-120 border-l-2 border-transparent hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    data-event="nav_click"
                    data-label={item.label.toLowerCase()}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              
              {/* Resources Accordion */}
              <li>
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="w-full text-left px-3 py-3 text-slate-700 hover:bg-gray-50 hover:text-indigo-700 rounded-lg transition-colors duration-120 border-l-2 border-transparent hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 flex items-center justify-between"
                  aria-expanded={isResourcesOpen}
                  data-event="nav_click"
                  data-label="resources"
                >
                  <span>资源</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {isResourcesOpen && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {resourceItems.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2 text-sm text-slate-600 hover:bg-gray-50 hover:text-indigo-700 rounded-lg transition-colors duration-120 flex items-center justify-between group"
                          onClick={onClose}
                          data-event="nav_click"
                          data-label={`resources_${item.title.toLowerCase().replace(/\s+/g, '_')}`}
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-120" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="px-4 py-6 border-t border-gray-100 space-y-3">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-indigo-700 border border-indigo-600 rounded-full hover:text-indigo-900 hover:border-indigo-700 transition-colors duration-120 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
              data-event="cta_click"
              data-label="login"
            >
              登录
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-120 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
              data-event="cta_click"
              data-label="start"
            >
              无风险体验
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;