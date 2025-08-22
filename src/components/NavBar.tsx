import React, { useState, useEffect } from 'react';
import { Menu, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileMenu from './MobileMenu';
import LoginDialog from './LoginDialog';

const navigationItems = [
  { label: "价格", href: "#pricing" },
  { label: "关于", href: "#about" },
  { label: "实际案例", href: "#cases" },
  { label: "博客", href: "#blog" }
];

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 12);
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) {
            setActiveSection(id);
          }
        }
      });
    };

    // Scroll observer
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Intersection observer for active sections
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '-64px 0px -50% 0px' // Account for navbar height
    });

    // Observe all sections
    navigationItems.forEach(item => {
      const element = document.querySelector(item.href);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

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
  };

  const handleLoginClick = () => {
    setIsLoginDialogOpen(true);
  };

  const handleTrialClick = () => {
    if (isAuthenticated) {
      navigate('/writing-flow');
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    navigate('/writing-flow');
  };

  return (
    <>
      <nav
        role="navigation"
        aria-label="Primary"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-md shadow-sm' 
            : 'bg-white/70 backdrop-blur-md'
        }`}
        style={{ height: '64px' }}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-indigo-600 text-white px-4 py-2 rounded-md z-50"
        >
          跳到主内容
        </a>

        <div className="max-w-6xl mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="/"
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md p-1"
                aria-label="EssayPass home"
                data-event="nav_click"
                data-label="logo"
              >
                <FileCheck className="w-6 h-6 text-indigo-600" />
                <span className="text-lg font-semibold text-slate-900">EssayPass</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => {
                const sectionId = item.href.substring(1); // Remove #
                const isActive = activeSection === sectionId;
                
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative text-sm font-medium transition-colors duration-120 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md px-2 py-1 ${
                      isActive 
                        ? 'text-indigo-700 font-semibold' 
                        : 'text-slate-700 hover:text-indigo-700'
                    }`}
                    data-event="nav_click"
                    data-label={item.label.toLowerCase()}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={handleLoginClick}
                className="px-6 py-2.5 text-indigo-700 border border-indigo-600 rounded-full hover:text-indigo-900 hover:border-indigo-700 transition-colors duration-120 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
                data-event="cta_click"
                data-label="login"
              >
                登录
              </button>
              <button
                onClick={handleTrialClick}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-120 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
                data-event="cta_click"
                data-label="start"
              >
                无风险体验
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-md"
              aria-label="打开菜单"
              data-event="menu_toggle"
              data-label="open"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Login Dialog */}
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default NavBar;