import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        
        {/* E字母部分 */}
        <g>
          {/* E的主体垂直线 */}
          <rect x="50" y="80" width="60" height="240" rx="15" fill="url(#logoGradient2)" />
          
          {/* E的上横线 */}
          <rect x="50" y="80" width="180" height="50" rx="15" fill="url(#logoGradient1)" />
          
          {/* E的中横线 */}
          <rect x="50" y="175" width="140" height="50" rx="15" fill="url(#logoGradient1)" />
          
          {/* E的下横线 */}
          <rect x="50" y="270" width="180" height="50" rx="15" fill="url(#logoGradient1)" />
        </g>
        
        {/* P字母部分 */}
        <g>
          {/* P的主体垂直线 */}
          <rect x="250" y="80" width="60" height="240" rx="15" fill="url(#logoGradient2)" />
          
          {/* P的上横线 */}
          <rect x="250" y="80" width="120" height="50" rx="15" fill="url(#logoGradient1)" />
          
          {/* P的中横线 */}
          <rect x="250" y="175" width="120" height="50" rx="15" fill="url(#logoGradient1)" />
          
          {/* P的右侧弧形 */}
          <path
            d="M 310 80 
               Q 390 80 390 155
               Q 390 225 310 225
               L 310 175
               Q 340 175 340 155
               Q 340 130 310 130
               Z"
            fill="url(#logoGradient2)"
          />
        </g>
        
        {/* 装饰性元素 */}
        <circle cx="200" cy="350" r="8" fill="url(#logoGradient1)" opacity="0.6" />
        <circle cx="170" cy="360" r="4" fill="url(#logoGradient1)" opacity="0.4" />
        <circle cx="230" cy="360" r="4" fill="url(#logoGradient1)" opacity="0.4" />
      </svg>
    </div>
  );
};

export default Logo;