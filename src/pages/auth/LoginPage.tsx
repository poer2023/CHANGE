import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, PenTool } from 'lucide-react';
import { useUserStore } from '@/store';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, isLoading, error } = useUserStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('请输入邮箱和密码');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: 实现真实的登录API调用
      // 模拟登录过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      const mockUser = {
        id: '1',
        email: formData.email,
        name: formData.email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      login(mockUser);
      navigate('/');
    } catch (err) {
      setError('登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

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
            欢迎回来
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            继续你的学术写作之旅，让AI助力你的研究成果。
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-primary-100">
              <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
              <span>智能写作建议</span>
            </div>
            <div className="flex items-center text-primary-100">
              <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
              <span>实时语法检查</span>
            </div>
            <div className="flex items-center text-primary-100">
              <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
              <span>论文结构优化</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧 - 登录表单 */}
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
            登录账户
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            还没有账户？{' '}
            <Link 
              to="/auth/register" 
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              立即注册
            </Link>
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10"
                  placeholder="请输入密码"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  记住我
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  忘记密码？
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '登录'}
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
                <span>使用 Google 登录</span>
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

export default LoginPage;