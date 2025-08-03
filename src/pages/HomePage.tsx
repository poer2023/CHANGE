import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Star, Users2, CheckCircle, Zap, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <PenTool className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Essay Pass</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">功能</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 text-sm font-medium">用户评价</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">帮助</a>
              <Link
                to="/auth/login"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                登录
              </Link>
              <Link
                to="/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                开始写作
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl leading-tight">
              智能论文写作
              <br />
              <span className="block">让学术创作更简单</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
              基于AI的渐进式表单引导系统
              <br />
              从构思到成稿，让论文写作变得高效有序
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-base font-medium transition-colors"
              >
                免费开始写作
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108755-2616b332c3b2?w=150&h=150&fit=crop&crop=face" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="User" />
              </div>
              <span className="text-sm text-gray-600">受到众多学者和学生的信赖</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-4">
                核心功能
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                渐进式表单，智能化写作
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                通过结构化引导和AI辅助，让论文写作变得有条不紊
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Feature showcase with visual */}
              <div className="order-2 lg:order-1">
                <div className="bg-gray-50 rounded-lg p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-gray-500">渐进式表单界面预览</p>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">渐进式表单引导</h3>
                  <p className="text-gray-600 mb-4">
                    分步骤填写论文要求，系统智能分析并生成个性化的写作结构和大纲
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">AI智能生成</h3>
                  <p className="text-gray-600 mb-4">
                    基于表单信息，AI自动生成高质量论文内容，包括摘要、正文和结论部分
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">实时编辑优化</h3>
                  <p className="text-gray-600 mb-4">
                    提供实时语法检查、内容建议和格式调整，确保论文质量
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Writing Process Section */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-4">
                写作流程
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                三步完成论文创作
              </h2>
              <p className="text-xl text-gray-600">
                从需求分析到内容生成，让论文写作变得简单高效
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">填写表单</h3>
                <p className="text-gray-600 mb-6">
                  通过渐进式表单收集论文要求，包括主题、字数、格式等详细信息
                </p>
                <div className="text-sm text-gray-500 space-y-2">
                  <div>✓ 论文类型选择</div>
                  <div>✓ 研究领域确定</div>
                  <div>✓ 写作要求说明</div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">AI分析生成</h3>
                <p className="text-gray-600 mb-6">
                  AI智能分析表单内容，生成个性化的论文大纲和初稿内容
                </p>
                <div className="text-sm text-gray-500 space-y-2">
                  <div>✓ 智能大纲生成</div>
                  <div>✓ 内容框架构建</div>
                  <div>✓ 参考文献建议</div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">编辑完善</h3>
                <p className="text-gray-600 mb-6">
                  使用富文本编辑器对生成内容进行调整，确保论文质量
                </p>
                <div className="text-sm text-gray-500 space-y-2">
                  <div>✓ 实时内容编辑</div>
                  <div>✓ 格式自动调整</div>
                  <div>✓ 一键导出下载</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-base font-medium transition-colors"
              >
                立即体验
              </Link>
            </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div id="testimonials" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-4">
                用户反馈
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                值得信赖的学术写作伙伴
              </h2>
              <p className="text-xl text-gray-600">
                Essay Pass 帮助众多学生和研究者完成高质量的学术论文
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-start space-x-4">
                  <img className="w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1494790108755-2616b332c3b2?w=150&h=150&fit=crop&crop=face" alt="小李" />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold">小李</h4>
                      <span className="text-gray-500 text-sm ml-2">硕士研究生</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      Essay Pass的渐进式表单真的很棒，帮我理清了论文思路，生成的大纲很有条理。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-start space-x-4">
                  <img className="w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="张教授" />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold">张教授</h4>
                      <span className="text-gray-500 text-sm ml-2">高校教师</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      推荐给学生使用，AI生成的内容质量不错，节省了很多时间。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-start space-x-4">
                  <img className="w-12 h-12 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="王同学" />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold">王同学</h4>
                      <span className="text-gray-500 text-sm ml-2">本科生</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      操作简单，界面友好，对于论文新手来说非常有帮助。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-4">
                适用场景
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                满足多种学术写作需求
              </h2>
              <p className="text-xl text-gray-600">
                Essay Pass 支持多种类型的学术文档创作
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">学术论文</h3>
                <p className="text-gray-600">本科、硕士、博士毕业论文，期刊投稿论文等学术写作。</p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">文献综述</h3>
                <p className="text-gray-600">系统梳理研究现状，撰写高质量的文献综述报告。</p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <PenTool className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">研究报告</h3>
                <p className="text-gray-600">课程作业、实验报告、调研报告等学术文档。</p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users2 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">申请文书</h3>
                <p className="text-gray-600">研究生申请、留学申请等个人陈述和动机信。</p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">课程论文</h3>
                <p className="text-gray-600">各类课程的期末论文、案例分析等学术作业。</p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">学术演讲</h3>
                <p className="text-gray-600">学术会议发言稿、答辩演讲等口语表达文稿。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              开启您的智能写作之旅
            </h2>
            <p className="text-xl mb-8 opacity-90">
              让 Essay Pass 成为您学术写作路上的得力助手
            </p>
            
            <div className="flex items-center justify-center space-x-4 mb-8 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                完全免费使用
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                无需注册账号
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                即用即走
              </div>
            </div>

            <Link
              to="/create"
              className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              立即开始写作
            </Link>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">渐进式引导</h3>
                <p className="opacity-80">结构化表单设计</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">AI智能生成</h3>
                <p className="opacity-80">高质量内容输出</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">实时编辑</h3>
                <p className="opacity-80">富文本编辑体验</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <PenTool className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold">Essay Pass</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                智能论文写作助手，让学术创作更简单
              </p>
              <Link
                to="/create"
                className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                开始写作
              </Link>
            </div>

            <div>
              <h3 className="font-semibold mb-4">产品功能</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">渐进式表单</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">AI智能生成</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">实时编辑</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">支持与帮助</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">使用指南</a></li>
                <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">意见反馈</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 Essay Pass. 保留所有权利.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;