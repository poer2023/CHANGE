import type { Step1Inputs, VerifyLevel, Estimate, EstimateResponse } from '@/state/types';

// Frontend pricing estimation (for immediate feedback, backend will provide authoritative pricing)
export function estimatePrice(inputs: Step1Inputs, verifyLevel: VerifyLevel): Estimate {
  const wc = Math.max(300, Math.min(20000, inputs.wordCount || 0));
  const base = Math.ceil(wc / 100) * 2.5; // 每100字 2.5 元示例

  // Level complexity multipliers
  const kLvl = {
    'UG': 0,
    'PG': 0.06,
    'ESL': 0.05,
    'Pro': 0.12
  }[inputs.level] || 0;

  // Format complexity multipliers
  const kFmt = {
    'APA': 0,
    'MLA': 0,
    'Chicago': 0.02,
    'IEEE': 0.03,
    'GBT': 0.05
  }[inputs.format] || 0;

  // Verification level multipliers
  const kVer = {
    'Basic': 1,
    'Standard': 1.12,
    'Pro': 1.25
  }[verifyLevel];

  // Resource type multiplier
  const kRes = 1 + 0.03 * (inputs.resources?.length || 0);

  // Style samples multiplier
  const kStyle = inputs.styleSamples?.length ? 1.03 : 1.0;

  // Calculate final value
  const value = Math.round(base * (1 + kLvl + kFmt) * kVer * kRes * kStyle);
  
  // Price range (±8%)
  const priceRange: [number, number] = [
    Math.round(value * 0.92),
    Math.round(value * 1.08)
  ];

  // Citation estimation
  const cites = Math.max(6, Math.min(40, Math.round(wc / 250)));
  const citesRange: [number, number] = [cites - 2, cites + 2];

  // Time estimation (minutes)
  const eta: [number, number] = [
    Math.round(wc / 200),
    Math.round(wc / 120)
  ];

  // Generate assumptions for cost breakdown
  const assumptions: string[] = [];
  
  if (kLvl > 0) {
    assumptions.push(`语言水平调整 ${(kLvl * 100).toFixed(0)}%`);
  }
  if (kFmt > 0) {
    assumptions.push(`引用格式复杂度 ${(kFmt * 100).toFixed(0)}%`);
  }
  if (kVer > 1) {
    assumptions.push(`${verifyLevel} 核验等级 ${((kVer - 1) * 100).toFixed(0)}%`);
  }
  if (kRes > 1) {
    assumptions.push(`多资源类型 ${((kRes - 1) * 100).toFixed(0)}%`);
  }
  if (kStyle > 1) {
    assumptions.push(`风格样本对齐 ${((kStyle - 1) * 100).toFixed(0)}%`);
  }

  return {
    priceRange,
    citesRange,
    etaMinutes: eta,
    verifyLevel,
    assumptions,
    updatedAt: Date.now()
  };
}

// API call for server-side estimation (authoritative)
export async function fetchEstimate(
  inputs: Step1Inputs, 
  verifyLevel: VerifyLevel
): Promise<EstimateResponse> {
  try {
    const response = await fetch('/api/estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...inputs,
        verifyLevel
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend estimate failed, using frontend fallback:', error);
    
    // Fallback to frontend calculation
    const estimate = estimatePrice(inputs, verifyLevel);
    return {
      priceRange: estimate.priceRange,
      citesRange: estimate.citesRange,
      etaMinutes: estimate.etaMinutes,
      assumptions: estimate.assumptions
    };
  }
}

// Debounced estimate function for real-time updates
let estimateTimeout: NodeJS.Timeout | null = null;

export function debouncedEstimate(
  inputs: Step1Inputs,
  verifyLevel: VerifyLevel,
  callback: (estimate: Estimate) => void,
  delay: number = 300
): void {
  if (estimateTimeout) {
    clearTimeout(estimateTimeout);
  }

  estimateTimeout = setTimeout(async () => {
    try {
      const response = await fetchEstimate(inputs, verifyLevel);
      
      const estimate: Estimate = {
        priceRange: response.priceRange,
        citesRange: response.citesRange,
        etaMinutes: response.etaMinutes,
        verifyLevel,
        assumptions: response.assumptions,
        updatedAt: Date.now()
      };

      callback(estimate);
    } catch (error) {
      console.error('Debounced estimate failed:', error);
      
      // Fallback to immediate frontend calculation
      const estimate = estimatePrice(inputs, verifyLevel);
      callback(estimate);
    }
  }, delay);
}

// Validate step1 inputs for estimation
export function validateStep1ForEstimate(inputs: Step1Inputs): boolean {
  return !!(
    inputs.title?.trim() &&
    inputs.wordCount >= 300 &&
    inputs.wordCount <= 20000 &&
    inputs.assignmentType &&
    inputs.format &&
    inputs.level &&
    inputs.resources?.length > 0
  );
}