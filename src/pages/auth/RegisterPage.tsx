import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, PenTool, Check } from 'lucide-react';
import { useUserStore } from '@/store';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, isLoading, error } = useUserStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('请填写所有必填字段');
      return false;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }

    if (!formData.acceptTerms) {
      setError('请阅读并同意服务条款');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: 实现真实的注册API调用
      // 模拟注册过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟注册成功
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        username: formData.username,
        createdAt: new Date().toISOString(),
        subscription: {
          plan: 'free' as const,
        }
      };

      login(mockUser);
      navigate('/');
    } catch (err) {
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: '弱', color: 'text-red-500' };
    if (password.length < 10) return { strength: 2, text: '中', color: 'text-yellow-500' };
    return { strength: 3, text: '强', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex">
      {/* 左侧 - 品牌展示 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 flex-col justify-center px-12">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <PenTool className="h-12 w-12 text-white" />
            <h1 className="ml-4 text-3xl font-bold text-white">AI论文助手</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            开启学术写作新体验
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            加入我们，体验AI驱动的智能论文写作工具，让学术创作变得简单高效。
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-primary-100">
              <Check className="w-5 h-5 text-primary-300 mr-3" />
              <span>免费使用基础功能</span>
            </div>
            <div className="flex items-center text-primary-100">
              <Check className="w-5 h-5 text-primary-300 mr-3" />
              <span>AI智能写作助手</span>
            </div>
            <div className="flex items-center text-primary-100">
              <Check className="w-5 h-5 text-primary-300 mr-3" />
              <span>云端同步保存</span>
            </div>
            <div className="flex items-center text-primary-100">
              <Check className="w-5 h-5 text-primary-300 mr-3" />
              <span>多人协作编辑</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧 - 注册表单 */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* 移动端品牌显示 */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <PenTool className="h-10 w-10 text-primary-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">AI论文助手</h1>
            </div>
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
            创建账户
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            已有账户？{' '}
            <Link 
              to="/auth/login" 
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              立即登录
            </Link>
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
                  placeholder="请输入密码（至少6位）"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center">
                  <div className="flex-1 mr-3">
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength.strength
                              ? level === 1 ? 'bg-red-500' : level === 2 ? 'bg-yellow-500' : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className={`text-sm ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                确认密码
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="text-gray-600">
                  我已阅读并同意{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    服务条款
                  </a>{' '}
                  和{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    隐私政策
                  </a>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '注册中...' : '创建账户'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或者</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span>使用 Google 注册</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;