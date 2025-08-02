import React from 'react'
import { motion } from 'framer-motion'
import { Brain, FileText, Users, Palette, Zap, Shield, Globe, BarChart } from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: boolean
}

const FeatureSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <Brain size={32} />,
      title: "AI智能生成",
      description: "基于先进的大语言模型，智能生成高质量学术内容，支持多种论文类型和学科领域，让创作变得轻松高效。",
      highlight: true
    },
    {
      icon: <FileText size={32} />,
      title: "专业格式化",
      description: "自动按照APA、MLA、Chicago等国际标准格式排版，确保论文格式的专业性和规范性，一键生成完美格式。",
      highlight: true
    },
    {
      icon: <Users size={32} />,
      title: "实时协作",
      description: "支持多人同时编辑，实时同步修改内容，内置评论和建议功能，让团队协作更加高效便捷。",
      highlight: true
    },
    {
      icon: <Palette size={32} />,
      title: "多模态编辑",
      description: "支持文字、图表、公式、引用等多种内容类型，提供丰富的编辑工具，满足各类学术写作需求。",
      highlight: true
    },
    {
      icon: <Zap size={32} />,
      title: "快速生成",
      description: "AI引擎快速响应，几秒内生成段落内容，大幅提升写作效率，让您专注于思考和创新。"
    },
    {
      icon: <Shield size={32} />,
      title: "数据安全",
      description: "采用端到端加密技术，确保您的学术成果和个人信息安全，支持本地存储和云端备份。"
    },
    {
      icon: <Globe size={32} />,
      title: "多语言支持",
      description: "支持中文、英文等多种语言写作，智能翻译和语言转换，助力国际化学术交流。"
    },
    {
      icon: <BarChart size={32} />,
      title: "智能分析",
      description: "内置查重检测、语法检查、写作质量分析等功能，提供专业的写作建议和改进方案。"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-25"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="heading-gradient">强大功能</span>
            <span className="text-gray-900">，重新定义写作体验</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            集成最先进的AI技术和专业的学术写作工具，为您提供全方位的智能写作解决方案
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`
                relative group p-6 rounded-2xl transition-all duration-300
                ${feature.highlight 
                  ? 'bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 card-hover' 
                  : 'bg-gray-50 hover:bg-white border border-gray-200 card-hover'
                }
              `}
            >
              {/* 特色标识 */}
              {feature.highlight && (
                <div className="absolute -top-3 -right-3 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  核心功能
                </div>
              )}

              {/* 图标 */}
              <div className={`
                feature-icon mb-6 group-hover:scale-110 transition-transform duration-300
                ${feature.highlight ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}
              `}>
                {feature.icon}
              </div>

              {/* 内容 */}
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* 悬浮效果 */}
              <div className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${feature.highlight 
                  ? 'bg-gradient-to-br from-primary-100/20 to-blue-100/20' 
                  : 'bg-gradient-to-br from-gray-100/20 to-gray-200/20'
                }
              `}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* 底部CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600 mb-6">
            还有更多强大功能等您发现
          </p>
          <motion.button
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            了解更多功能
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeatureSection