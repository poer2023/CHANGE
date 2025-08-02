import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Search, BookOpen, TrendingUp, CheckCircle } from 'lucide-react'

interface UseCase {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  gradient: string
}

const UseCaseSection: React.FC = () => {
  const useCases: UseCase[] = [
    {
      icon: <GraduationCap size={48} />,
      title: "学术论文",
      description: "适用于各学科的学术研究论文，从文献综述到研究方法，从数据分析到结论撰写，AI助力您完成高质量的学术作品。",
      features: [
        "智能文献检索与整理",
        "研究方法论指导",
        "数据分析与可视化",
        "规范引用格式",
        "学术语言优化"
      ],
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Search size={48} />,
      title: "毕业设计",
      description: "本科和研究生毕业设计的全程写作支持，从选题到开题报告，从设计实现到论文撰写，一站式解决方案。",
      features: [
        "选题建议与可行性分析",
        "开题报告模板",
        "技术方案设计",
        "实验数据整理",
        "答辩PPT生成"
      ],
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <BookOpen size={48} />,
      title: "研究报告",
      description: "企业研究报告、市场调研报告、政策分析报告等多类型研究文档，专业格式，深度分析，见解独到。",
      features: [
        "行业趋势分析",
        "数据收集与处理",
        "图表自动生成",
        "SWOT分析模板",
        "执行摘要撰写"
      ],
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <TrendingUp size={48} />,
      title: "项目提案",
      description: "商业计划书、项目申请书、资金申请报告等提案文档，逻辑清晰，论证有力，提高通过率。",
      features: [
        "商业模式分析",
        "财务预测模型",
        "风险评估报告",
        "竞争对手分析",
        "投资回报计算"
      ],
      gradient: "from-orange-500 to-orange-600"
    }
  ]

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
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-15"></div>
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
            <span className="text-gray-900">广泛</span>
            <span className="heading-gradient">使用场景</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            无论您是学生、研究者还是专业人士，我们的AI写作助手都能为您提供专业的文档创作支持
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* 渐变背景 */}
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${useCase.gradient} rounded-t-3xl`}></div>
              
              {/* 图标和标题 */}
              <div className="flex items-center mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${useCase.gradient} text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {useCase.title}
                </h3>
              </div>

              {/* 描述 */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {useCase.description}
              </p>

              {/* 功能列表 */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">核心功能：</h4>
                {useCase.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="flex items-center text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* 悬浮效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* 统计数据 */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { number: "500+", label: "学术论文", color: "text-blue-600" },
            { number: "1,200+", label: "毕业设计", color: "text-purple-600" },
            { number: "800+", label: "研究报告", color: "text-green-600" },
            { number: "300+", label: "项目提案", color: "text-orange-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-600">已完成{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* 底部CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            准备开始您的写作之旅？
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            选择适合您的使用场景，立即体验AI智能写作的强大功能
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              className="btn-primary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              免费试用
            </motion.button>
            <motion.button
              className="btn-secondary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              查看案例
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default UseCaseSection