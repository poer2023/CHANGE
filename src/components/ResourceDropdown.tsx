import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface ResourceItem {
  title: string;
  href: string;
  isExternal?: boolean;
}

const resourceItems: ResourceItem[] = [
  {
    title: "DOI 是什么",
    href: "/resources/what-is-doi",
    isExternal: true
  },
  {
    title: "非母语如何避免 AI 误判", 
    href: "/resources/avoid-misjudge",
    isExternal: true
  },
  {
    title: "口头核验提问 20 例",
    href: "/resources/viva-qa-20", 
    isExternal: true
  }
];

const ResourceDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-1 text-slate-700 hover:text-indigo-700 transition-colors duration-120 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md px-2 py-1"
        aria-expanded={isOpen}
        aria-controls="resources-dropdown"
        aria-haspopup="true"
        data-event="nav_click"
        data-label="resources"
      >
        资源
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id="resources-dropdown"
          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-2"
          role="menu"
          aria-labelledby="resources-button"
        >
          {resourceItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 hover:text-indigo-700 transition-colors duration-120 flex items-center justify-between group"
              role="menuitem"
              onClick={handleItemClick}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              data-event="nav_click"
              data-label={`resources_${item.title.toLowerCase().replace(/\s+/g, '_')}`}
            >
              <span>{item.title}</span>
              {item.isExternal && (
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-120" />
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceDropdown;