import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Menu, X } from 'lucide-react'

// 导入所有子组件
import HeroSection from './sections/HeroSection'
import FeatureSection from './sections/FeatureSection'
import UseCaseSection from './sections/UseCaseSection'
import TestimonialSection from './sections/TestimonialSection'

const LandingPage: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 监听滚动事件，控制回到顶部按钮的显示
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // 滚动到指定部分
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
    setMobileMenuOpen(false)
  }

  const navigationItems = [
    { label: '首页', sectionId: 'hero' },
    { label: '功能特色', sectionId: 'features' },
    { label: '使用场景', sectionId: 'usecases' },
    { label: '用户评价', sectionId: 'testimonials' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-custom border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">智能写作助手</span>
            </motion.div>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                免费试用
              </motion.button>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="container-custom py-4">
              {navigationItems.map((item) => (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="block w-full text-left py-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button className="btn-primary w-full mt-4">
                免费试用
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* 页面内容 */}
      <main>
        {/* Hero Section */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* Features Section */}
        <section id="features">
          <FeatureSection />
        </section>

        {/* Use Cases Section */}
        <section id="usecases">
          <UseCaseSection />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <TestimonialSection />
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container-custom relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                准备开始您的AI写作之旅？
              </h2>
              <p className="text-xl md:text-2xl mb-12 opacity-90">
                加入数万名用户的行列，体验AI智能写作的强大功能
                <br className="hidden md:block" />
                立即注册，享受免费试用，让AI成为您的最佳写作伙伴
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button
                  className="bg-white text-primary-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  立即免费试用
                </motion.button>
                <motion.button
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium px-8 py-4 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  了解定价方案
                </motion.button>
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-sm opacity-80">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  免费试用30天
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  无需信用卡
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  随时可取消
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 公司信息 */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <span className="text-xl font-bold">智能写作助手</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                专业的AI驱动写作平台，为学生、研究者和专业人士提供高质量的智能写作解决方案，让创作变得更加高效和专业。
              </p>
            </div>

            {/* 产品链接 */}
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI写作助手</a></li>
                <li><a href="#" className="hover:text-white transition-colors">格式化工具</a></li>
                <li><a href="#" className="hover:text-white transition-colors">协作平台</a></li>
                <li><a href="#" className="hover:text-white transition-colors">模板库</a></li>
              </ul>
            </div>

            {/* 支持链接 */}
            <div>
              <h3 className="font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">使用教程</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">意见反馈</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 AI智能写作助手. 保留所有权利.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">隐私政策</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">服务条款</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie政策</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <motion.button
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-50"
          onClick={scrollToTop}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </div>
  )
}

export default LandingPage