import { FormData, FormValidationError } from '@/types/form';

export const validateFormStep = (formData: FormData, step: number): FormValidationError[] => {
  const errors: FormValidationError[] = [];

  switch (step) {
    case 0: // 论文类型选择
      if (!formData.paperType) {
        errors.push({
          field: 'paperType',
          message: '请选择论文类型'
        });
      }
      break;

    case 1: // 学科领域选择
      if (!formData.field) {
        errors.push({
          field: 'field',
          message: '请选择学科领域'
        });
      }
      break;

    case 2: // AI需求解析
      if (!formData.requirements) {
        errors.push({
          field: 'requirements',
          message: '请完成与AI助手的需求分析对话'
        });
      }
      
      if (formData.wordCount < 500) {
        errors.push({
          field: 'wordCount',
          message: '论文字数不能少于500字'
        });
      }
      
      if (formData.wordCount > 50000) {
        errors.push({
          field: 'wordCount',
          message: '论文字数不能超过50000字'
        });
      }
      break;

    case 3: // 大纲偏好
      if (!formData.outlinePreference) {
        errors.push({
          field: 'outlinePreference',
          message: '请选择大纲结构偏好'
        });
      }
      
      if (!formData.detailLevel) {
        errors.push({
          field: 'detailLevel',
          message: '请选择大纲详细程度'
        });
      }
      
      if (!formData.citationStyle) {
        errors.push({
          field: 'citationStyle',
          message: '请选择引用格式'
        });
      }
      break;
  }

  return errors;
};

export const validateCompleteForm = (formData: FormData): FormValidationError[] => {
  const errors: FormValidationError[] = [];

  // 必填字段检查
  const requiredFields = [
    { field: 'paperType', message: '论文类型为必填项' },
    { field: 'field', message: '学科领域为必填项' },
    { field: 'requirements', message: '需求分析为必填项' },
    { field: 'outlinePreference', message: '大纲偏好为必填项' },
    { field: 'detailLevel', message: '详细程度为必填项' },
    { field: 'citationStyle', message: '引用格式为必填项' }
  ];

  requiredFields.forEach(({ field, message }) => {
    if (!formData[field as keyof FormData]) {
      errors.push({ field, message });
    }
  });

  // 字数范围检查
  if (formData.wordCount < 500 || formData.wordCount > 50000) {
    errors.push({
      field: 'wordCount',
      message: '论文字数应在500-50000字之间'
    });
  }

  // 格式检查
  const validFormats = ['academic', 'APA', 'MLA', 'Chicago', 'IEEE'];
  if (formData.format && !validFormats.includes(formData.format)) {
    errors.push({
      field: 'format',
      message: '无效的论文格式'
    });
  }

  return errors;
};

export const getFieldDisplayName = (fieldName: string): string => {
  const fieldNames: Record<string, string> = {
    paperType: '论文类型',
    field: '学科领域',
    requirements: '需求分析',
    wordCount: '字数要求',
    format: '格式要求',
    specialRequirements: '特殊要求',
    outlinePreference: '大纲偏好',
    detailLevel: '详细程度',
    citationStyle: '引用格式'
  };

  return fieldNames[fieldName] || fieldName;
};

export const sanitizeFormData = (formData: FormData): FormData => {
  return {
    ...formData,
    specialRequirements: formData.specialRequirements?.trim() || '',
    requirements: formData.requirements?.trim() || '',
    wordCount: Math.max(500, Math.min(50000, formData.wordCount || 3000))
  };
};