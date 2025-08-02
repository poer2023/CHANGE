'use client';

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { FormData, FormStep, ValidationError } from '@/types/form';
import { usePaperStore } from '@/store';
import PaperTypeSelector from './PaperTypeSelector';
import FieldSelector from './FieldSelector';
import AIRequirementParser from './AIRequirementParser';
import OutlinePreference from './OutlinePreference';

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPaperFromForm, formData: storeFormData, setFormData: setStoreFormData } = usePaperStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    title: storeFormData.title || '',
    paperType: storeFormData.paperType || '',
    field: storeFormData.field || '',
    requirements: storeFormData.requirements || '',
    wordCount: storeFormData.wordCount || 3000,
    format: storeFormData.format || 'academic',
    specialRequirements: storeFormData.specialRequirements || '',
    outlinePreference: storeFormData.outlinePreference || '',
    detailLevel: storeFormData.detailLevel || 'detailed',
    citationStyle: storeFormData.citationStyle || 'apa',
    abstract: storeFormData.abstract || '',
    keywords: storeFormData.keywords || []
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps: FormStep[] = [
    {
      id: 0,
      title: '论文类型',
      description: '选择您要撰写的论文类型',
      component: 'PaperTypeSelector',
      isCompleted: !!formData.paperType,
      isActive: currentStep === 0
    },
    {
      id: 1,
      title: '学科领域',
      description: '选择您的专业领域',
      component: 'FieldSelector',
      isCompleted: !!formData.field,
      isActive: currentStep === 1
    },
    {
      id: 2,
      title: 'AI需求解析',
      description: '与AI助手交流您的具体需求',
      component: 'AIRequirementParser',
      isCompleted: !!formData.requirements,
      isActive: currentStep === 2
    },
    {
      id: 3,
      title: '大纲偏好',
      description: '设置大纲生成的详细偏好',
      component: 'OutlinePreference',
      isCompleted: !!formData.outlinePreference,
      isActive: currentStep === 3
    }
  ];

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setErrors(prev => prev.filter(error => !Object.keys(updates).includes(error.field)));
  }, []);

  const validateStep = useCallback((stepIndex: number): boolean => {
    const newErrors: ValidationError[] = [];
    
    switch (stepIndex) {
      case 0:
        if (!formData.paperType) {
          newErrors.push({ field: 'paperType', message: '请选择论文类型' });
        }
        break;
      case 1:
        if (!formData.field) {
          newErrors.push({ field: 'field', message: '请选择学科领域' });
        }
        break;
      case 2:
        if (!formData.requirements) {
          newErrors.push({ field: 'requirements', message: '请完成需求分析' });
        }
        break;
      case 3:
        if (!formData.outlinePreference) {
          newErrors.push({ field: 'outlinePreference', message: '请选择大纲偏好' });
        }
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  }, [currentStep, validateStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save form data to store first
      setStoreFormData(formData);
      
      // Create paper from form data
      const newPaper = await createPaperFromForm(formData);
      
      console.log('表单数据:', formData);
      console.log('创建的论文:', newPaper);
      
      // Navigate to the editor
      navigate(`/editor/${newPaper.id}`);
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepComponent = () => {
    const props = { formData, updateFormData, errors };
    
    switch (currentStep) {
      case 0:
        return <PaperTypeSelector {...props} />;
      case 1:
        return <FieldSelector {...props} />;
      case 2:
        return <AIRequirementParser {...props} />;
      case 3:
        return <OutlinePreference {...props} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            智能论文助手
          </h1>
          <p className="text-gray-600">
            让AI帮助您创建高质量的学术论文
          </p>
        </motion.div>

        {/* 进度指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStepClick(index)}
              >
                <div
                  className={`step-indicator ${
                    step.isCompleted
                      ? 'completed'
                      : step.isActive
                      ? 'active'
                      : 'inactive'
                  }`}
                >
                  {step.isCompleted ? (
                    <Check size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 max-w-24">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* 主要内容区域 */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {renderStepComponent()}
          </AnimatePresence>

          {/* 错误提示 */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              {errors.map((error, index) => (
                <p key={index} className="text-red-700 text-sm">
                  {error.message}
                </p>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* 导航按钮 */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'btn-secondary'
            }`}
          >
            <ChevronLeft size={20} className="mr-2" />
            上一步
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                提交中...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                完成创建
                <Check size={20} className="ml-2" />
              </>
            ) : (
              <>
                下一步
                <ChevronRight size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;