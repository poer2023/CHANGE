// 验证工具函数

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePaperTitle = (title: string): string | null => {
  const required = validateRequired(title, 'Title');
  if (required) return required;
  
  const minLength = validateMinLength(title, 3, 'Title');
  if (minLength) return minLength;
  
  const maxLength = validateMaxLength(title, 200, 'Title');
  if (maxLength) return maxLength;
  
  return null;
};

export const validateKeywords = (keywords: string[]): string | null => {
  if (keywords.length === 0) {
    return 'At least one keyword is required';
  }
  
  if (keywords.length > 10) {
    return 'Maximum 10 keywords allowed';
  }
  
  for (const keyword of keywords) {
    if (keyword.trim().length === 0) {
      return 'Keywords cannot be empty';
    }
    if (keyword.length > 50) {
      return 'Each keyword must be no more than 50 characters';
    }
  }
  
  return null;
};