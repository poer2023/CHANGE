import React from 'react'
import { motion } from 'framer-motion'
import { PenTool, Sparkles, ArrowRight } from 'lucide-react'

const HeroSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const handleStartWriting = () => {
    // 这里可以添加跳转到注册或登录页面的逻辑
    console.log('开始创作按钮被点击')
  }

  const handleWatchDemo = () => {
    // 这里可以添加观看演示视频的逻辑
    console.log('观看演示按钮被点击')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-50 to-blue-50 rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* 浮动图标 */}
      <motion.div
        className="absolute top-20 left-10 text-primary-400"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <PenTool size={24} />
      </motion.div>
      <motion.div
        className="absolute top-32 right-16 text-blue-400"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        <Sparkles size={28} />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-20 text-primary-300"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
      >
        <PenTool size={20} />
      </motion.div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 顶部标签 */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
            variants={itemVariants}
          >
            <Sparkles size={16} />
            <span>AI驱动的智能写作平台</span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="heading-gradient">AI驱动的</span>
            <br />
            <span className="text-gray-900">智能论文写作助手</span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            让AI成为您的学术写作伙伴，智能生成、专业格式化、实时协作，
            <br className="hidden md:block" />
            轻松完成高质量的学术论文、毕业设计和研究报告
          </motion.p>

          {/* CTA按钮组 */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleStartWriting}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>开始创作</span>
              <ArrowRight size={20} />
            </motion.button>
            
            <motion.button
              onClick={handleWatchDemo}
              className="btn-secondary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              观看演示
            </motion.button>
          </motion.div>

          {/* 统计数据 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600">用户信赖</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">99.5%</div>
              <div className="text-gray-600">准确率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">5倍</div>
              <div className="text-gray-600">效率提升</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  )
}

export default HeroSection