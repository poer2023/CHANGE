// Writing Flow Pricing Calculation Utilities

import { AssignmentType, CitationStyle, SourceType } from '@/types/writing-flow';

export type VerificationLevel = 'Basic' | 'Standard' | 'Pro';

export interface PricingInput {
  wordCount: number;
  languageLevel: 'undergrad' | 'postgrad' | 'esl' | 'pro';
  citationStyle: CitationStyle;
  assignmentType: AssignmentType;
  sources: SourceType[];
  hasStyleSamples: boolean;
  title?: string;
  courseName?: string;
  verificationLevel: VerificationLevel;
}

export interface PricingEstimation {
  basePrice: number;
  finalPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  tier: 'budget' | 'standard' | 'premium';
  estimatedCitations: {
    min: number;
    max: number;
  };
  verificationCoverage: number; // percentage
  estimatedTime: {
    min: number; // hours
    max: number; // hours
  };
  breakdown: {
    base: number;
    complexity: number;
    verification: number;
    resources: number;
    style: number;
  };
  deliverables: string[];
}

// Domain complexity mapping
const DOMAIN_COMPLEXITY: Record<string, number> = {
  'stem': 0.3,
  'medical': 0.4,
  'legal': 0.35,
  'engineering': 0.25,
  'business': 0.15,
  'humanities': 0.1,
  'social': 0.12,
  'default': 0.2
};

// Citation format complexity
const FORMAT_COMPLEXITY: Record<CitationStyle, number> = {
  'APA': 0.1,
  'MLA': 0.08,
  'Chicago': 0.15,
  'IEEE': 0.12,
  'GB/T 7714': 0.18
};

// Language level complexity
const LANGUAGE_COMPLEXITY: Record<string, number> = {
  'undergrad': 0.0,
  'postgrad': 0.15,
  'esl': 0.1,
  'pro': 0.25
};

// Assignment type complexity
const ASSIGNMENT_COMPLEXITY: Record<AssignmentType, number> = {
  'paper': 0.1,
  'report': 0.05,
  'review': 0.15,
  'comment': 0.08
};

// Verification level multipliers
const VERIFICATION_MULTIPLIERS: Record<VerificationLevel, number> = {
  'Basic': 1.0,
  'Standard': 1.12,
  'Pro': 1.25
};

// Base rate per 100 words (in RMB)
const BASE_RATE_PER_100_WORDS = 8.0;

/**
 * Classify topic complexity based on title and course name
 */
function classifyTopicComplexity(title?: string, courseName?: string): string {
  const text = `${title || ''} ${courseName || ''}`.toLowerCase();
  
  // STEM keywords
  if (/(?:math|physics|chemistry|biology|computer|engineering|algorithm|data|science|statistics|calculus|algebra)/i.test(text)) {
    return 'stem';
  }
  
  // Medical keywords
  if (/(?:medical|medicine|health|clinical|anatomy|psychology|therapy|diagnosis)/i.test(text)) {
    return 'medical';
  }
  
  // Legal keywords
  if (/(?:law|legal|court|justice|contract|constitution|policy|regulation)/i.test(text)) {
    return 'legal';
  }
  
  // Engineering keywords
  if (/(?:engineer|mechanical|electrical|civil|software|design|system|technical)/i.test(text)) {
    return 'engineering';
  }
  
  // Business keywords
  if (/(?:business|management|marketing|finance|economics|accounting|strategy)/i.test(text)) {
    return 'business';
  }
  
  // Social sciences
  if (/(?:sociology|anthropology|political|social|culture|society|history)/i.test(text)) {
    return 'social';
  }
  
  // Humanities
  if (/(?:literature|philosophy|art|music|language|linguistics|religion|ethics)/i.test(text)) {
    return 'humanities';
  }
  
  return 'default';
}

/**
 * Calculate estimated citation count
 */
function calculateCitationCount(wordCount: number): { min: number; max: number } {
  // Base: 1 citation per 200-300 words
  const base = Math.round(wordCount / 250);
  const min = Math.max(6, Math.round(base * 0.8));
  const max = Math.min(40, Math.round(base * 1.2));
  
  return { min, max };
}

/**
 * Calculate estimated completion time
 */
function calculateEstimatedTime(
  wordCount: number, 
  citationCount: number, 
  verificationLevel: VerificationLevel
): { min: number; max: number } {
  // Base time: 1 hour per 500 words
  const baseTime = wordCount / 500;
  
  // Citation research time: 15-30 minutes per citation
  const citationTime = citationCount * (verificationLevel === 'Pro' ? 0.5 : 0.25);
  
  // Verification time based on level
  const verificationTime = verificationLevel === 'Pro' ? 2 : 
                          verificationLevel === 'Standard' ? 1 : 0.5;
  
  const totalTime = baseTime + citationTime + verificationTime;
  
  return {
    min: Math.max(2, Math.round(totalTime * 0.8)),
    max: Math.round(totalTime * 1.3)
  };
}

/**
 * Main pricing calculation function
 */
export function calculateWritingFlowPrice(input: PricingInput): PricingEstimation {
  const {
    wordCount,
    languageLevel,
    citationStyle,
    assignmentType,
    sources,
    hasStyleSamples,
    title,
    courseName,
    verificationLevel
  } = input;

  // Calculate base price
  const hundredWordUnits = Math.ceil(wordCount / 100);
  const basePrice = hundredWordUnits * BASE_RATE_PER_100_WORDS;

  // Calculate complexity multipliers
  const topicComplexity = classifyTopicComplexity(title, courseName);
  const domainMultiplier = DOMAIN_COMPLEXITY[topicComplexity] || DOMAIN_COMPLEXITY.default;
  const formatMultiplier = FORMAT_COMPLEXITY[citationStyle] || 0.1;
  const languageMultiplier = LANGUAGE_COMPLEXITY[languageLevel] || 0.0;
  const assignmentMultiplier = ASSIGNMENT_COMPLEXITY[assignmentType] || 0.1;

  const complexityMultiplier = 1 + domainMultiplier + formatMultiplier + languageMultiplier + assignmentMultiplier;

  // Verification level multiplier
  const verificationMultiplier = VERIFICATION_MULTIPLIERS[verificationLevel];

  // Resource type bump (3% per additional resource type)
  const resourceMultiplier = 1 + (sources.length * 0.03);

  // Style sample bump
  const styleMultiplier = hasStyleSamples ? 1.03 : 1.0;

  // Calculate final price
  const finalPrice = Math.round(
    basePrice * complexityMultiplier * verificationMultiplier * resourceMultiplier * styleMultiplier
  );

  // Calculate price range (±15%)
  const priceRange = {
    min: Math.round(finalPrice * 0.85),
    max: Math.round(finalPrice * 1.15)
  };

  // Determine tier
  const tier: 'budget' | 'standard' | 'premium' = 
    finalPrice < 50 ? 'budget' :
    finalPrice < 150 ? 'standard' : 'premium';

  // Calculate citations and time
  const estimatedCitations = calculateCitationCount(wordCount);
  const estimatedTime = calculateEstimatedTime(
    wordCount, 
    Math.round((estimatedCitations.min + estimatedCitations.max) / 2),
    verificationLevel
  );

  // Verification coverage based on level
  const verificationCoverage = verificationLevel === 'Pro' ? 100 :
                              verificationLevel === 'Standard' ? 95 : 85;

  // Breakdown
  const breakdown = {
    base: basePrice,
    complexity: Math.round(basePrice * (complexityMultiplier - 1)),
    verification: Math.round(basePrice * complexityMultiplier * (verificationMultiplier - 1)),
    resources: Math.round(basePrice * complexityMultiplier * verificationMultiplier * (resourceMultiplier - 1)),
    style: Math.round(basePrice * complexityMultiplier * verificationMultiplier * resourceMultiplier * (styleMultiplier - 1))
  };

  // Deliverables based on verification level
  const deliverables = [
    '完整初稿 + 结构化大纲',
    `${verificationLevel === 'Pro' ? '深度' : verificationLevel === 'Standard' ? '标准' : '基础'}引用核验`,
    hasStyleSamples ? '个性化风格对齐' : '标准学术风格'
  ];

  if (verificationLevel === 'Pro') {
    deliverables.push('专业润色建议', '格式标准化检查');
  } else if (verificationLevel === 'Standard') {
    deliverables.push('基础润色建议');
  }

  return {
    basePrice,
    finalPrice,
    priceRange,
    tier,
    estimatedCitations,
    verificationCoverage,
    estimatedTime,
    breakdown,
    deliverables
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `¥${price}`;
}

/**
 * Format price range for display
 */
export function formatPriceRange(min: number, max: number): string {
  return `¥${min}-${max}`;
}

/**
 * Format time range for display
 */
export function formatTimeRange(min: number, max: number): string {
  if (max < 24) {
    return `${min}-${max}小时`;
  } else {
    const minDays = Math.round(min / 24 * 10) / 10;
    const maxDays = Math.round(max / 24 * 10) / 10;
    return `${minDays}-${maxDays}天`;
  }
}

/**
 * Get tier display information
 */
export function getTierInfo(tier: 'budget' | 'standard' | 'premium') {
  const tierInfo = {
    budget: { label: '经济型', color: 'text-green-600', bgColor: 'bg-green-50' },
    standard: { label: '标准型', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    premium: { label: '专业型', color: 'text-purple-600', bgColor: 'bg-purple-50' }
  };
  
  return tierInfo[tier];
}