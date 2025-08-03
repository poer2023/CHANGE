import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  LoadingSpinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormInput,
  SearchInput,
  Textarea,
  Select,
  ProgressBar,
  CircularProgress,
  Stepper,
  LikeButton,
  Rating,
  CopyButton,
  BookmarkButton,
  ShareButton,
  HoverCard,
  Pulse,
  Breathe,
  useModal,
  useToastActions,
  OnboardingProvider,
  useOnboardingState
} from '@/components/UI';
import { useFormValidation, validationRules } from '@/utils/formValidation';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Heart, Star, Settings, User, Mail, Phone, Globe } from 'lucide-react';

const UIShowcase: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [rating, setRating] = useState(3);
  const [progress, setProgress] = useState(65);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { isOpen, open, close } = useModal();
  const { success, error, warning, info } = useToastActions();
  const onboarding = useOnboardingState();

  // 表单验证示例
  const formValidation = useFormValidation({
    validationRules: {
      name: [validationRules.required(), validationRules.minLength(2)],
      email: [validationRules.required(), validationRules.email()],
      phone: [validationRules.phone()],
      website: [validationRules.url()]
    },
    validateOnBlur: true
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: ''
  });

  const steps = [
    { id: '1', title: '基本信息', description: '填写个人基本信息', status: 'completed' as const },
    { id: '2', title: '联系方式', description: '填写联系方式', status: 'current' as const },
    { id: '3', title: '确认提交', description: '确认并提交信息', status: 'pending' as const }
  ];

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    formValidation.handleFieldChange(field, value);
  };

  const handleFieldBlur = (field: string, value: string) => {
    formValidation.handleFieldBlur(field, value);
  };

  const onboardingSteps = [
    {
      id: 'welcome',
      title: '欢迎来到 UI 展示页面',
      content: '这里展示了我们所有的增强UI组件，让我们开始探索吧！',
      target: 'showcase-title',
      placement: 'bottom' as const
    },
    {
      id: 'buttons',
      title: '交互按钮',
      content: '尝试点击这些按钮，体验微交互动画效果',
      target: 'interaction-buttons',
      placement: 'top' as const
    },
    {
      id: 'form',
      title: '表单组件',
      content: '我们的表单组件支持实时验证和无障碍访问',
      target: 'form-section',
      placement: 'right' as const
    }
  ];

  return (
    <OnboardingProvider
      steps={onboardingSteps}
      isActive={onboarding.isActive}
      onFinish={onboarding.finish}
      onSkip={onboarding.skip}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <motion.div
          className="max-w-6xl mx-auto space-y-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* 页面标题 */}
          <motion.div
            id="showcase-title"
            className="text-center space-y-4"
            variants={fadeInUp}
          >
            <h1 className="text-4xl font-bold text-gray-900">
              AI论文写作工具 - UI展示
            </h1>
            <p className="text-xl text-gray-600">
              体验我们精心设计的用户界面组件和交互效果
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button onClick={() => success('欢迎使用!', '感谢您体验我们的UI组件')}>
                显示成功通知
              </Button>
              <Button variant="outline" onClick={open}>
                打开模态框
              </Button>
              <Button 
                variant="ghost" 
                onClick={onboarding.start}
                disabled={onboarding.isActive}
              >
                开始引导
              </Button>
            </div>
          </motion.div>

          {/* 微交互组件展示 */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-red-500" />
                微交互组件
              </h2>
              
              <div id="interaction-buttons" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 点赞按钮 */}
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-gray-900">点赞按钮</h3>
                  <LikeButton
                    liked={liked}
                    onToggle={() => setLiked(!liked)}
                    count={liked ? 256 : 255}
                    size="lg"
                  />
                </div>

                {/* 评分组件 */}
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-gray-900">评分组件</h3>
                  <Rating
                    rating={rating}
                    onRatingChange={setRating}
                    size="lg"
                  />
                  <p className="text-sm text-gray-600">当前评分: {rating}</p>
                </div>

                {/* 复制按钮 */}
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-gray-900">复制按钮</h3>
                  <CopyButton
                    text="这是要复制的文本内容"
                    onCopy={() => success('复制成功', '文本已复制到剪贴板')}
                    size="lg"
                    variant="text"
                  />
                </div>

                {/* 书签按钮 */}
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-gray-900">书签按钮</h3>
                  <BookmarkButton
                    bookmarked={bookmarked}
                    onToggle={() => setBookmarked(!bookmarked)}
                    size="lg"
                  />
                </div>
              </div>

              {/* 动画效果组件 */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-gray-900">脉冲动画</h3>
                  <Pulse active={true} color="#10B981">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full" />
                    </div>
                  </Pulse>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="font-medium text-gray-900">呼吸动画</h3>
                  <Breathe scale={[1, 1.1]} duration={2}>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                  </Breathe>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="font-medium text-gray-900">悬停卡片</h3>
                  <HoverCard
                    hoverContent={
                      <div className="p-2">
                        <p className="text-sm font-medium">悬停提示</p>
                        <p className="text-xs text-gray-600">这是悬停时显示的内容</p>
                      </div>
                    }
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center cursor-pointer">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </HoverCard>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 进度和步骤指示器 */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">进度和步骤指示器</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 进度条 */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">进度条</h3>
                  <div className="space-y-4">
                    <ProgressBar
                      value={progress}
                      showLabel={true}
                      labelPosition="top"
                      color="primary"
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setProgress(Math.max(0, progress - 10))}
                      >
                        -10%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setProgress(Math.min(100, progress + 10))}
                      >
                        +10%
                      </Button>
                    </div>
                    
                    <CircularProgress
                      value={progress}
                      size={120}
                      color="primary"
                      showLabel={true}
                    />
                  </div>
                </div>

                {/* 步骤指示器 */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">步骤指示器</h3>
                  <Stepper
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                    orientation="vertical"
                    allowClickOnCompleted={true}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 表单组件展示 */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h2 id="form-section" className="text-2xl font-semibold mb-6">表单组件</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormInput
                    label="姓名"
                    placeholder="请输入您的姓名"
                    icon={<User className="w-4 h-4" />}
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={(e) => handleFieldBlur('name', e.target.value)}
                    error={formValidation.getFieldError('name')}
                    required
                  />

                  <FormInput
                    label="邮箱"
                    type="email"
                    placeholder="请输入您的邮箱"
                    icon={<Mail className="w-4 h-4" />}
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={(e) => handleFieldBlur('email', e.target.value)}
                    error={formValidation.getFieldError('email')}
                    required
                  />

                  <FormInput
                    label="手机号"
                    placeholder="请输入您的手机号"
                    icon={<Phone className="w-4 h-4" />}
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    onBlur={(e) => handleFieldBlur('phone', e.target.value)}
                    error={formValidation.getFieldError('phone')}
                  />

                  <FormInput
                    label="网站"
                    placeholder="请输入您的网站地址"
                    icon={<Globe className="w-4 h-4" />}
                    value={formData.website}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    onBlur={(e) => handleFieldBlur('website', e.target.value)}
                    error={formValidation.getFieldError('website')}
                  />
                </div>

                <div className="space-y-4">
                  <SearchInput
                    label="搜索"
                    placeholder="搜索内容..."
                    onSearch={(value) => info('搜索', `搜索关键词: ${value}`)}
                  />

                  <Select
                    label="选择类型"
                    placeholder="请选择"
                    options={[
                      { value: 'research', label: '研究论文' },
                      { value: 'review', label: '综述文章' },
                      { value: 'report', label: '技术报告' }
                    ]}
                  />

                  <Textarea
                    label="描述"
                    placeholder="请输入描述..."
                    autoResize
                    maxLength={200}
                    showCount
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 加载状态展示 */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">加载状态</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-4">
                  <h3 className="font-medium text-gray-900">小型加载器</h3>
                  <LoadingSpinner size="sm" text="加载中..." />
                </div>

                <div className="text-center space-y-4">
                  <h3 className="font-medium text-gray-900">中型加载器</h3>
                  <LoadingSpinner size="md" text="处理中..." />
                </div>

                <div className="text-center space-y-4">
                  <h3 className="font-medium text-gray-900">大型加载器</h3>
                  <LoadingSpinner size="lg" text="请稍候..." />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* 通知测试 */}
          <motion.div variants={fadeInUp}>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">通知系统</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => success('成功!', '操作已成功完成')}
                >
                  成功通知
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => error('错误!', '操作失败，请重试')}
                >
                  错误通知
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => warning('警告!', '请注意相关风险')}
                >
                  警告通知
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => info('提示', '这是一个信息提示')}
                >
                  信息通知
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* 模态框 */}
        <Modal isOpen={isOpen} onClose={close} size="md">
          <ModalHeader>模态框演示</ModalHeader>
          <ModalBody>
            <p className="text-gray-600">
              这是一个模态框的演示。它支持键盘导航、焦点管理和无障碍访问功能。
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <ShareButton onShare={() => success('分享成功', '内容已分享')} />
                <span className="text-sm text-gray-600">分享这个模态框</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={close}>
              取消
            </Button>
            <Button onClick={close}>
              确定
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </OnboardingProvider>
  );
};

export default UIShowcase;