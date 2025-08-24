import { useLanguage } from '@/contexts/LanguageContext';
import { translate, type TranslationKey } from '@/locales';

export interface UseTranslationReturn {
  t: (key: TranslationKey) => string;
  language: 'zh' | 'en';
  isZh: boolean;
  isEn: boolean;
}

/**
 * 翻译Hook - 提供轻量级的多语言支持
 * 
 * @example
 * ```tsx
 * const { t, isZh } = useTranslation();
 * 
 * return (
 *   <div>
 *     <h1>{t('nav.pricing')}</h1>
 *     <p>{isZh ? '中文特殊处理' : 'English specific content'}</p>
 *   </div>
 * );
 * ```
 */
export const useTranslation = (): UseTranslationReturn => {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translate(key, language);
  };

  return {
    t,
    language,
    isZh: language === 'zh',
    isEn: language === 'en'
  };
};