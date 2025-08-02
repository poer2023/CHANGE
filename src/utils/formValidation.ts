// 表单验证工具类和规则

export type ValidationRule = {
  test: (value: any) => boolean;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type FieldValidationRules = {
  [fieldName: string]: ValidationRule[];
};

export type FormErrors = {
  [fieldName: string]: string[];
};

// 基础验证规则
export const validationRules = {
  // 必填验证
  required: (message = '此字段为必填项'): ValidationRule => ({
    test: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== '';
    },
    message
  }),

  // 最小长度验证
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // 如果没有值，让required规则处理
      const str = String(value);
      return str.length >= min;
    },
    message: message || `最少需要 ${min} 个字符`
  }),

  // 最大长度验证
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const str = String(value);
      return str.length <= max;
    },
    message: message || `最多允许 ${max} 个字符`
  }),

  // 邮箱验证
  email: (message = '请输入有效的邮箱地址'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value));
    },
    message
  }),

  // 手机号验证（中国大陆）
  phone: (message = '请输入有效的手机号码'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const phoneRegex = /^1[3-9]\d{9}$/;
      return phoneRegex.test(String(value));
    },
    message
  }),

  // 数字验证
  number: (message = '请输入有效的数字'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      return !isNaN(Number(value));
    },
    message
  }),

  // 最小值验证
  min: (min: number, message?: string): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const num = Number(value);
      return !isNaN(num) && num >= min;
    },
    message: message || `值不能小于 ${min}`
  }),

  // 最大值验证
  max: (max: number, message?: string): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const num = Number(value);
      return !isNaN(num) && num <= max;
    },
    message: message || `值不能大于 ${max}`
  }),

  // 密码强度验证
  strongPassword: (message = '密码必须包含大小写字母、数字和特殊字符，且长度至少8位'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(String(value));
    },
    message
  }),

  // 确认密码验证
  confirmPassword: (originalPassword: string, message = '两次输入的密码不一致'): ValidationRule => ({
    test: (value) => {
      return String(value) === String(originalPassword);
    },
    message
  }),

  // URL验证
  url: (message = '请输入有效的URL地址'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      try {
        new URL(String(value));
        return true;
      } catch {
        return false;
      }
    },
    message
  }),

  // 正则表达式验证
  pattern: (regex: RegExp, message = '格式不正确'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      return regex.test(String(value));
    },
    message
  }),

  // 自定义验证函数
  custom: (testFn: (value: any) => boolean, message: string): ValidationRule => ({
    test: testFn,
    message
  }),

  // 选择项验证
  oneOf: (options: any[], message?: string): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      return options.includes(value);
    },
    message: message || `请选择有效选项`
  }),

  // 文件类型验证
  fileType: (allowedTypes: string[], message?: string): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return allowedTypes.some(type => 
          value.type.includes(type) || value.name.toLowerCase().endsWith(type.toLowerCase())
        );
      }
      return true;
    },
    message: message || `允许的文件类型: ${allowedTypes.join(', ')}`
  }),

  // 文件大小验证（字节）
  fileSize: (maxSize: number, message?: string): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      if (value instanceof File) {
        return value.size <= maxSize;
      }
      return true;
    },
    message: message || `文件大小不能超过 ${formatFileSize(maxSize)}`
  })
};

// 验证单个字段
export const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];
  
  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 验证整个表单
export const validateForm = (data: Record<string, any>, rules: FieldValidationRules): FormErrors => {
  const errors: FormErrors = {};
  
  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const fieldValue = data[fieldName];
    const result = validateField(fieldValue, fieldRules);
    
    if (!result.isValid) {
      errors[fieldName] = result.errors;
    }
  }
  
  return errors;
};

// 检查表单是否有错误
export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
};

// 获取第一个错误信息
export const getFirstError = (errors: FormErrors): string | null => {
  for (const fieldErrors of Object.values(errors)) {
    if (fieldErrors.length > 0) {
      return fieldErrors[0];
    }
  }
  return null;
};

// 清除字段错误
export const clearFieldError = (errors: FormErrors, fieldName: string): FormErrors => {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
};

// 设置字段错误
export const setFieldError = (errors: FormErrors, fieldName: string, errorMessages: string[]): FormErrors => {
  return {
    ...errors,
    [fieldName]: errorMessages
  };
};

// 文件大小格式化
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 常用的验证规则组合
export const commonValidations = {
  // 用户名验证
  username: [
    validationRules.required(),
    validationRules.minLength(3, '用户名至少3个字符'),
    validationRules.maxLength(20, '用户名最多20个字符'),
    validationRules.pattern(/^[a-zA-Z0-9_-]+$/, '用户名只能包含字母、数字、下划线和短横线')
  ],

  // 邮箱验证
  email: [
    validationRules.required(),
    validationRules.email()
  ],

  // 密码验证
  password: [
    validationRules.required(),
    validationRules.minLength(8),
    validationRules.strongPassword()
  ],

  // 手机号验证
  phone: [
    validationRules.required(),
    validationRules.phone()
  ],

  // 姓名验证
  name: [
    validationRules.required(),
    validationRules.minLength(2, '姓名至少2个字符'),
    validationRules.maxLength(50, '姓名最多50个字符')
  ],

  // 年龄验证
  age: [
    validationRules.required(),
    validationRules.number(),
    validationRules.min(0, '年龄不能小于0'),
    validationRules.max(150, '年龄不能大于150')
  ],

  // 网址验证
  website: [
    validationRules.url()
  ],

  // 头像文件验证
  avatar: [
    validationRules.fileType(['jpg', 'jpeg', 'png', 'gif'], '只允许上传 JPG、PNG、GIF 格式的图片'),
    validationRules.fileSize(5 * 1024 * 1024, '图片大小不能超过 5MB')
  ]
};

// React Hook for form validation
import { useState, useCallback, useMemo } from 'react';

export interface UseFormValidationOptions {
  validationRules: FieldValidationRules;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export const useFormValidation = (options: UseFormValidationOptions) => {
  const {
    validationRules: rules,
    validateOnChange = false,
    validateOnBlur = true,
    debounceMs = 300
  } = options;

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);

  // 验证单个字段
  const validateSingleField = useCallback((fieldName: string, value: any) => {
    if (!rules[fieldName]) return;

    const fieldRules = rules[fieldName];
    const result = validateField(value, fieldRules);

    setErrors(prev => {
      if (result.isValid) {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      } else {
        return {
          ...prev,
          [fieldName]: result.errors
        };
      }
    });
  }, [rules]);

  // 验证所有字段
  const validateAllFields = useCallback((data: Record<string, any>) => {
    setIsValidating(true);
    const formErrors = validateForm(data, rules);
    setErrors(formErrors);
    setIsValidating(false);
    return !hasFormErrors(formErrors);
  }, [rules]);

  // 清除字段错误
  const clearErrors = useCallback((fieldName?: string) => {
    if (fieldName) {
      setErrors(prev => clearFieldError(prev, fieldName));
    } else {
      setErrors({});
    }
  }, []);

  // 标记字段为已触摸
  const markFieldTouched = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // 获取字段错误（只有在字段被触摸后才返回错误）
  const getFieldError = useCallback((fieldName: string) => {
    if (!touched[fieldName]) return undefined;
    return errors[fieldName]?.[0];
  }, [errors, touched]);

  // 检查字段是否有错误
  const hasFieldError = useCallback((fieldName: string) => {
    return touched[fieldName] && errors[fieldName] && errors[fieldName].length > 0;
  }, [errors, touched]);

  // 检查表单是否有效
  const isFormValid = useMemo(() => {
    return !hasFormErrors(errors);
  }, [errors]);

  // 处理字段变化
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    if (validateOnChange) {
      validateSingleField(fieldName, value);
    }
  }, [validateOnChange, validateSingleField]);

  // 处理字段失焦
  const handleFieldBlur = useCallback((fieldName: string, value: any) => {
    markFieldTouched(fieldName);
    if (validateOnBlur) {
      validateSingleField(fieldName, value);
    }
  }, [validateOnBlur, validateSingleField, markFieldTouched]);

  return {
    errors,
    touched,
    isValidating,
    isFormValid,
    validateSingleField,
    validateAllFields,
    clearErrors,
    markFieldTouched,
    getFieldError,
    hasFieldError,
    handleFieldChange,
    handleFieldBlur
  };
};