import React, { useCallback, useEffect } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Badge } from '@/components/ui/badge';

// Import carousel images
import slide1 from '@/assets/carousel-slide-1-citation.webp';
import slide2 from '@/assets/carousel-slide-2-style.webp';
import slide3 from '@/assets/carousel-slide-3-evidence.webp';
import slide4 from '@/assets/carousel-slide-4-verification.webp';

const slides = [
  {
    id: 1,
    image: slide1,
    title: "真实引用",
    badge: "DOI Verified",
    description: "假引文标红并给替代建议",
    alt: "DOI验证与引用校验界面"
  },
  {
    id: 2,
    image: slide2,
    title: "个人文风",
    badge: "Deviation 28",
    description: "对齐你的写作基线，保留自然错误率",
    alt: "个人文风分析仪表盘"
  },
  {
    id: 3,
    image: slide3,
    title: "全程留痕",
    badge: "Evidence Package",
    description: "时间线、段落 diff 与来源快照，一键打包",
    alt: "写作过程证据包导出界面"
  },
  {
    id: 4,
    image: slide4,
    title: "口头核验",
    badge: "Q&A Ready",
    description: "自动生成速答提纲，10 分钟走一遍",
    alt: "口头核验问答卡片界面"
  }
];

const options: EmblaOptionsType = { loop: true };

const HeroCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const autoplay = setInterval(() => {
        scrollNext();
      }, 5000); // 5 seconds auto-play

      return () => clearInterval(autoplay);
    }
  }, [emblaApi, scrollNext]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl shadow-lg" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-none w-full relative">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-auto"
                style={{ aspectRatio: '16/10' }}
              />
              
              {/* Overlay with title and description */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold">{slide.title}</h3>
                    <Badge 
                      variant="secondary" 
                      className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                    >
                      {slide.badge}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90 max-w-md">{slide.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === 0 ? '#4F46E5' : '#D1D5DB'
            }}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;