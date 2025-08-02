import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  title: string
  university?: string
  company?: string
  avatar: string
  content: string
  rating: number
  category: 'student' | 'researcher' | 'professional'
}

const TestimonialSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "张雨欣",
      title: "硕士研究生",
      university: "清华大学",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=100&h=100&fit=crop&crop=face",
      content: "使用AI写作助手完成我的硕士论文，真的太神奇了！从文献综述到实验分析，AI都能给出专业的建议和内容生成。原本需要几个月的工作量，现在只用了一半时间就完成了高质量的论文。",
      rating: 5,
      category: 'student'
    },
    {
      id: 2,
      name: "李教授",
      title: "计算机科学教授",
      university: "北京大学",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "作为一名资深研究者，我对AI写作工具的质量要求很高。这个平台不仅能生成高质量的学术内容，还能保持严格的学术规范。它已经成为我研究工作中不可缺少的助手。",
      rating: 5,
      category: 'researcher'
    },
    {
      id: 3,
      name: "王晓明",
      title: "本科生",
      university: "上海交通大学",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: "毕业设计的时候发现了这个AI写作助手，简直是救星！从开题报告到最终论文，每一步都有详细的指导。特别是引用格式的自动化处理，节省了我大量时间。",
      rating: 5,
      category: 'student'
    },
    {
      id: 4,
      name: "陈经理",
      title: "市场研究总监",
      company: "某知名咨询公司",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "我们团队经常需要撰写市场分析报告，AI写作助手大大提高了我们的工作效率。生成的报告逻辑清晰，数据分析专业，客户反馈非常好。强烈推荐给需要高质量文档的团队。",
      rating: 5,
      category: 'professional'
    },
    {
      id: 5,
      name: "刘博士",
      title: "博士后研究员",
      university: "中科院",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      content: "在准备国际期刊投稿时，AI写作助手帮助我完善了论文的语言表达和格式规范。它对不同期刊的要求都很了解，让我的投稿成功率大大提升。",
      rating: 5,
      category: 'researcher'
    },
    {
      id: 6,
      name: "周同学",
      title: "MBA学生",
      university: "复旦大学",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      content: "商业计划书的撰写对我来说一直是个挑战，但AI写作助手让这变得简单多了。从市场分析到财务预测，每个部分都有专业的模板和指导，最终的方案获得了导师的高度认可。",
      rating: 5,
      category: 'student'
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoPlay) return
    
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [autoPlay])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'student': return 'bg-blue-100 text-blue-800'
      case 'researcher': return 'bg-green-100 text-green-800'
      case 'professional': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'student': return '学生'
      case 'researcher': return '研究者'
      case 'professional': return '专业人士'
      default: return '用户'
    }
  }

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-15"></div>
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
            <span className="text-gray-900">用户</span>
            <span className="heading-gradient">真实评价</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            看看我们的用户如何评价AI智能写作助手，他们的成功就是我们最好的证明
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* 主要见证 */}
          <div 
            className="relative"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
              >
                {/* 引号图标 */}
                <motion.div
                  className="text-primary-200 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Quote size={48} />
                </motion.div>

                {/* 评价内容 */}
                <motion.p
                  className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  "{testimonials[currentIndex].content}"
                </motion.p>

                {/* 星级评分 */}
                <motion.div
                  className="flex items-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {renderStars(testimonials[currentIndex].rating)}
                </motion.div>

                {/* 用户信息 */}
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[currentIndex].title}
                      {testimonials[currentIndex].university && (
                        <span> · {testimonials[currentIndex].university}</span>
                      )}
                      {testimonials[currentIndex].company && (
                        <span> · {testimonials[currentIndex].company}</span>
                      )}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(testimonials[currentIndex].category)}`}>
                    {getCategoryLabel(testimonials[currentIndex].category)}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* 导航按钮 */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12">
              <motion.button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12">
              <motion.button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>
          </div>

          {/* 指示器 */}
          <div className="flex items-center justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 统计数据 */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">4.9</div>
            <div className="text-gray-600">平均评分</div>
            <div className="flex items-center justify-center mt-2">
              {renderStars(5)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-gray-600">用户满意度</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">1,500+</div>
            <div className="text-gray-600">五星好评</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialSection