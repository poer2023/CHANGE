import type { Language } from '@/contexts/LanguageContext';

export type TranslationKey = 
  // 通用
  | 'common.save'
  | 'common.cancel' 
  | 'common.submit'
  | 'common.delete'
  | 'common.edit'
  | 'common.close'
  | 'common.back'
  | 'common.next'
  | 'common.confirm'
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  
  // 导航
  | 'nav.pricing'
  | 'nav.about'
  | 'nav.cases'
  | 'nav.blog'
  | 'nav.login'
  | 'nav.signup'
  | 'nav.dashboard'
  | 'nav.profile'
  | 'nav.settings'
  | 'nav.logout'
  
  // 导航栏无障碍
  | 'navbar.skipToMain'
  | 'navbar.logoAriaLabel'
  | 'navbar.openMenu'

  // 应用级别
  | 'app.loading'
  | 'app.error.generic'
  | 'app.error.network'
  | 'app.error.auth_required'
  | 'app.error.route_not_found'
  | 'app.notification.success'
  | 'app.notification.error'
  | 'app.notification.info'
  | 'app.status.initializing'
  | 'app.status.ready'
  | 'app.status.offline'
  
  // 首页/落地页
  | 'landing.hero.title'
  | 'landing.hero.subtitle'
  | 'landing.cta.start'
  | 'landing.cta.trial'
  | 'landing.cta.learn_more'
  
  // 写作流程
  | 'flow.topic.title'
  | 'flow.research.title'
  | 'flow.strategy.title'
  | 'flow.outline.title'
  | 'flow.writing.title'
  
  // Topic Step 页面
  | 'topic.page_description'
  | 'topic.cards.basic_info'
  | 'topic.cards.academic_requirements' 
  | 'topic.cards.style_reference'
  | 'topic.cards.additional_requirements'
  
  // Topic Step 表单字段
  | 'topic.form.title.label'
  | 'topic.form.title.placeholder'
  | 'topic.form.title.validation.min'
  | 'topic.form.title.validation.max'
  | 'topic.form.type.label'
  | 'topic.form.type.placeholder'
  | 'topic.form.type.required'
  | 'topic.form.words.label'
  | 'topic.form.words.placeholder'
  | 'topic.form.words.unit'
  | 'topic.form.words.validation.min'
  | 'topic.form.words.validation.max'
  | 'topic.form.format.label'
  | 'topic.form.format.placeholder'
  | 'topic.form.format.required'
  | 'topic.form.level.label'
  | 'topic.form.level.placeholder'
  | 'topic.form.level.required'
  | 'topic.form.resources.label'
  | 'topic.form.resources.required'
  | 'topic.form.requirements.label'
  | 'topic.form.requirements.placeholder'
  | 'topic.form.requirements.max'
  | 'topic.form.requirements.counter'
  
  // Topic Step 文件上传
  | 'topic.form.files.title'
  | 'topic.form.files.description'
  | 'topic.form.files.drag_drop'
  | 'topic.form.files.choose'
  | 'topic.form.files.supported'
  | 'topic.form.files.error.format'
  | 'topic.form.files.error.size'
  | 'topic.form.files.error.count'
  | 'topic.form.files.max'
  
  // Topic Step 选项
  | 'topic.options.assignment.paper'
  | 'topic.options.assignment.report'
  | 'topic.options.assignment.review'
  | 'topic.options.assignment.commentary'
  | 'topic.options.level.undergraduate'
  | 'topic.options.level.graduate'
  | 'topic.options.level.esl'
  | 'topic.options.level.professional'
  | 'topic.options.resources.paper'
  | 'topic.options.resources.book'
  | 'topic.options.resources.web'
  | 'topic.options.resources.dataset'
  | 'topic.options.resources.other'
  
  // Topic Step 操作
  | 'topic.actions.save_draft'
  | 'topic.actions.next_step'
  | 'topic.validation.success'
  
  // Topic Step 通知消息
  | 'topic.toast.draft_saved'
  | 'topic.toast.draft_saved_desc'
  | 'topic.toast.save_failed'
  | 'topic.toast.save_failed_desc'
  | 'topic.toast.feature_developing'
  | 'topic.toast.feature_developing_desc'
  | 'topic.toast.success_desc'
  | 'topic.toast.error_title'
  | 'topic.toast.lock_price_failed'
  | 'topic.toast.payment_success'
  | 'topic.toast.payment_success_desc'
  | 'topic.toast.payment_failed'
  | 'topic.toast.payment_failed_desc'
  | 'topic.toast.preview_mode'
  | 'topic.toast.preview_mode_desc'
  | 'topic.toast.autopilot_failed'
  | 'topic.toast.verification_updated'
  | 'topic.toast.verification_rate'
  | 'topic.toast.retry_title'
  | 'topic.toast.retry_desc'
  
  // Gate1 Modal 内容
  | 'topic.gate1.benefit1'
  | 'topic.gate1.benefit2'  
  | 'topic.gate1.benefit3'
  
  // OutcomePanel 右侧面板
  | 'outcome.verification_level'
  | 'outcome.price_locked'
  | 'outcome.eta'
  | 'outcome.instant_writing'
  | 'outcome.preview_sample'
  | 'outcome.unlock_after_payment'
  
  // 写作流程表单
  | 'form.paper'
  | 'form.report' 
  | 'form.review'
  | 'form.commentary'
  | 'form.upload_style_samples'
  | 'form.drag_drop_files'
  | 'form.browse_files'
  
  // 表单
  | 'form.title'
  | 'form.assignment_type'
  | 'form.word_count'
  | 'form.format'
  | 'form.level'
  | 'form.resources'
  | 'form.notes'
  
  // 结果页面
  | 'result.title'
  | 'result.export'
  | 'result.download'
  | 'result.share'
  | 'result.header.title'
  | 'result.header.description'
  | 'result.meta.title'
  | 'result.meta.description'
  | 'result.status.generating'
  | 'result.status.ready'
  | 'result.status.preview'
  | 'result.status.completed'
  | 'result.document.title'
  | 'result.document.subtitle'
  | 'result.document.status'
  | 'result.document.id'
  
  // 设置页面
  | 'settings.account'
  | 'settings.preferences'
  | 'settings.billing'
  | 'settings.security'
  | 'settings.notifications'
  | 'settings.integrations'
  | 'settings.integrations.title'
  | 'settings.integrations.description'
  | 'settings.integrations.cloud_sync'
  | 'settings.integrations.cloud_sync_desc'
  | 'settings.integrations.status.connected'
  | 'settings.integrations.status.not_connected'
  | 'settings.integrations.status.error'
  | 'settings.integrations.coming_soon'
  | 'settings.integrations.supports'
  | 'settings.integrations.connect'
  | 'settings.integrations.settings'
  | 'settings.integrations.disconnect'
  | 'settings.integrations.more_coming'
  | 'settings.integrations.more_coming_desc'
  | 'settings.integrations.cloud_dev_toast'
  | 'settings.data_privacy'
  
  // 通知设置
  | 'notifications.in_app.title'
  | 'notifications.email.title'
  | 'notifications.frequency.label'
  | 'notifications.frequency.immediate'
  | 'notifications.frequency.daily'
  | 'notifications.frequency.off'
  | 'notifications.frequency.description'
  | 'notifications.email_types.label'
  | 'notifications.type.generation_complete.title'
  | 'notifications.type.generation_complete.description'
  | 'notifications.type.export_complete.title'
  | 'notifications.type.export_complete.description'
  | 'notifications.type.order_status.title'
  | 'notifications.type.order_status.description'
  | 'notifications.type.system_announcement.title'
  | 'notifications.type.system_announcement.description'
  | 'notifications.save.button'
  | 'notifications.save.loading'
  | 'notifications.save.success'
  | 'notifications.save.error'

  // 偏好设置
  | 'preferences.default_settings'
  | 'preferences.default_citation_format'
  | 'preferences.default_language_level'
  | 'preferences.default_verification_level'
  | 'preferences.editor_settings'
  | 'preferences.auto_save'
  | 'preferences.auto_save_desc'
  | 'preferences.enable_shortcuts'
  | 'preferences.shortcuts_desc'
  | 'preferences.document_width_note_title'
  | 'preferences.document_width_note_desc'
  | 'preferences.evidence_pack_settings'
  | 'preferences.citation_list'
  | 'preferences.citation_list_desc'
  | 'preferences.timeline'
  | 'preferences.timeline_desc'
  | 'preferences.defense_card'
  | 'preferences.defense_card_desc'
  | 'preferences.save_preferences'
  | 'preferences.saving'
  | 'preferences.saved_success'
  | 'preferences.save_failed'

  // 引用格式
  | 'citation.format.apa'
  | 'citation.format.mla'
  | 'citation.format.chicago'
  | 'citation.format.ieee'
  | 'citation.format.gb_t_7714'

  // 语言水平
  | 'language_level.undergraduate'
  | 'language_level.graduate'
  | 'language_level.esl'
  | 'language_level.professional'

  // 核验等级
  | 'verification.basic'
  | 'verification.basic_desc'
  | 'verification.standard'
  | 'verification.standard_desc'
  | 'verification.pro'
  | 'verification.pro_desc'
  
  // SEO页面
  | 'seo.title'
  | 'seo.description'
  | 'seo.keywords'
  | 'seo.og_title'
  | 'seo.og_description'
  
  // 首屏 Hero
  | 'hero.main_title'
  | 'hero.subtitle'
  | 'hero.cta_trial'
  | 'hero.cta_download'
  | 'hero.selling_points'
  | 'hero.disclaimer'
  
  // 痛点分析
  | 'painpoints.section_title'
  | 'painpoints.fake_citations.title'
  | 'painpoints.fake_citations.desc'
  | 'painpoints.style_change.title'
  | 'painpoints.style_change.desc'
  | 'painpoints.ai_detection.title'
  | 'painpoints.ai_detection.desc'
  | 'painpoints.interview_questions.title'
  | 'painpoints.interview_questions.desc'
  | 'painpoints.formatting_work.title'
  | 'painpoints.formatting_work.desc'
  | 'painpoints.read_more'
  | 'painpoints.alt_text'
  
  // 功能概览
  | 'features.section_title'
  | 'features.real_citations.title'
  | 'features.real_citations.desc'
  | 'features.personal_style.title'
  | 'features.personal_style.desc'
  | 'features.full_trace.title'
  | 'features.full_trace.desc'
  | 'features.ai_agent.title'
  | 'features.ai_agent.desc'
  
  // 功能详细
  | 'detailed.real_citations.title'
  | 'detailed.real_citations.point1'
  | 'detailed.real_citations.point2'
  | 'detailed.real_citations.point3'
  | 'detailed.real_citations.point4'
  | 'detailed.real_citations.cta'
  | 'detailed.cite_panel.title'
  | 'detailed.cite_panel.example_title'
  | 'detailed.cite_panel.example_year'
  | 'detailed.cite_panel.insert_btn'
  | 'detailed.cite_panel.replace_btn'
  | 'detailed.cite_panel.success_msg'
  | 'detailed.cite_panel.format_btn'
  
  // 个人文风
  | 'detailed.style.title'
  | 'detailed.style.point1'
  | 'detailed.style.point2'
  | 'detailed.style.point3'
  | 'detailed.style.cta'
  | 'detailed.style.panel_title'
  | 'detailed.style.from_score'
  | 'detailed.style.sentence_length'
  | 'detailed.style.lexical_variety'
  | 'detailed.style.burstiness'
  | 'detailed.style.polish_strength'
  | 'detailed.style.light'
  | 'detailed.style.medium'
  | 'detailed.style.strong'
  | 'detailed.style.align_btn'
  
  // 写作过程
  | 'detailed.process.title'
  | 'detailed.process.point1'
  | 'detailed.process.point2'
  | 'detailed.process.point3'
  | 'detailed.process.point4'
  | 'detailed.process.cta'
  | 'detailed.process.panel_title'
  | 'detailed.process.start_session'
  | 'detailed.process.inserted_citations'
  | 'detailed.process.agent_formatting'
  | 'detailed.process.finished'
  | 'detailed.process.writing_summary'
  | 'detailed.process.sources_csv'
  | 'detailed.process.viva_qa'
  | 'detailed.process.export_btn'
  
  // AI Agent 编辑
  | 'detailed.agent.title'
  | 'detailed.agent.point1'
  | 'detailed.agent.point2'
  | 'detailed.agent.point3'
  | 'detailed.agent.point4'
  | 'detailed.agent.point5'
  | 'detailed.agent.cta'
  | 'detailed.agent.panel_title'
  | 'detailed.agent.input_label'
  | 'detailed.agent.example_command'
  | 'detailed.agent.preview_label'
  | 'detailed.agent.related_work'
  | 'detailed.agent.method'
  | 'detailed.agent.figure_caption'
  | 'detailed.agent.apply_btn'
  | 'detailed.agent.undo_btn'
  | 'detailed.agent.save_recipe_btn'
  
  // 流程步骤
  | 'process.section_title'
  | 'process.step1.title'
  | 'process.step1.desc'
  | 'process.step2.title'
  | 'process.step2.desc'
  | 'process.step3.title'
  | 'process.step3.desc'
  
  // 用户见证
  | 'testimonials.section_title'
  | 'testimonials.student_title'
  | 'testimonials.student_quote'
  | 'testimonials.master_title'
  | 'testimonials.master_quote'
  | 'testimonials.phd_title'
  | 'testimonials.phd_quote'
  | 'testimonials.metric1'
  | 'testimonials.metric1_desc'
  | 'testimonials.metric2'
  | 'testimonials.metric2_desc'
  | 'testimonials.disclaimer'
  
  // FAQ
  | 'faq.section_title'
  | 'faq.q1'
  | 'faq.a1'
  | 'faq.q2'
  | 'faq.a2'
  | 'faq.q3'
  | 'faq.a3'
  | 'faq.q4'
  | 'faq.a4'
  | 'faq.q5'
  | 'faq.a5'
  | 'faq.q6'
  | 'faq.a6'
  | 'faq.q7'
  | 'faq.a7'
  
  // 合规信息
  | 'compliance.section_title'
  | 'compliance.data_privacy.title'
  | 'compliance.data_privacy.desc'
  | 'compliance.education.title'
  | 'compliance.education.desc'
  | 'compliance.teacher_cooperation.title'
  | 'compliance.teacher_cooperation.desc'
  
  // 相关资源
  | 'resources.section_title'
  | 'resources.avoid_misjudge.title'
  | 'resources.avoid_misjudge.desc'
  | 'resources.avoid_misjudge.cta'
  | 'resources.academic_charts.title'
  | 'resources.academic_charts.desc'
  | 'resources.academic_charts.cta'
  | 'resources.viva_qa.title'
  | 'resources.viva_qa.desc'
  | 'resources.viva_qa.cta'
  
  // 底部CTA
  | 'footer_cta.title'
  | 'footer_cta.subtitle'
  | 'footer_cta.start_btn'
  | 'footer_cta.download_btn'
  
  // 首页
  | 'home.welcome_back'
  | 'home.getting_started'
  | 'home.unlock_success'
  | 'home.payment_failed'
  | 'home.purchase_success'
  | 'home.purchase_failed'
  | 'home.files_selected'
  
  // 侧边栏
  | 'sidebar.dashboard'
  | 'sidebar.documents'
  | 'sidebar.writing_history' 
  | 'sidebar.library'
  | 'sidebar.profile'
  | 'sidebar.settings'
  | 'sidebar.logout'
  
  // 搜索
  | 'search.placeholder'
  | 'search.keyboard_hint'
  
  // 快速开始
  | 'quickstart.title'
  | 'quickstart.subtitle'
  | 'quickstart.new_document.title'
  | 'quickstart.new_document.description'
  | 'quickstart.upload_resources.title'
  | 'quickstart.upload_resources.description'
  | 'quickstart.autopilot.title'
  | 'quickstart.autopilot.description'
  
  // 待办面板
  | 'todo.title'
  | 'todo.count_items'
  | 'todo.pending_unlock.title'
  | 'todo.pending_unlock.desc'
  | 'todo.unlock_btn'
  | 'todo.preview_btn'
  | 'todo.pending_export.title'
  | 'todo.pending_export.desc'
  | 'todo.export_btn'
  
  // Todos翻译键 (新增)
  | 'todos.title'
  | 'todos.count'
  | 'todos.words'
  | 'todos.citations'
  | 'todos.expired'
  | 'todos.gate1.title'
  | 'todos.gate1.subtitle'
  | 'todos.gate1.unlock'
  | 'todos.gate1.preview'
  | 'todos.gate1.reprice'
  | 'todos.gate1.price_locked'
  | 'todos.gate2.title'
  | 'todos.gate2.subtitle'
  | 'todos.gate2.missing'
  | 'todos.gate2.buy_export'
  | 'todos.retry.title'
  | 'todos.retry.subtitle'
  | 'todos.retry.failed_message'
  | 'todos.retry.retry_button'
  | 'todos.retry.view_details'
  
  // 最近文档
  | 'recent.title'
  | 'recent.document_count'
  | 'recent.search_placeholder'
  
  // 筛选器
  | 'recent.filters.all'
  | 'recent.filters.draft'
  | 'recent.filters.generating'
  | 'recent.filters.ready'
  | 'recent.filters.gate1'
  | 'recent.filters.addon'
  
  // 排序
  | 'recent.sort.newest'
  | 'recent.sort.oldest'
  | 'recent.sort.title_az'
  | 'recent.sort.title_za'
  | 'recent.sort.most_words'
  | 'recent.sort.least_words'
  
  // 表格列
  | 'recent.table.filename'
  | 'recent.table.status'
  | 'recent.table.words'
  | 'recent.table.citations'
  | 'recent.table.updated'
  | 'recent.table.actions'
  
  // 操作按钮
  | 'recent.continue_writing'
  | 'recent.generating'
  | 'recent.view_result'
  | 'recent.unlock_generate'
  | 'recent.export'
  | 'recent.words'
  | 'recent.citations'
  
  // 时间格式
  | 'recent.time.just_now'
  | 'recent.time.minutes_ago'
  | 'recent.time.hours_ago'
  | 'recent.time.days_ago'
  
  // 右键菜单操作
  | 'recent.actions.continue'
  | 'recent.actions.view'
  | 'recent.actions.rename'
  | 'recent.actions.archive'
  | 'recent.actions.delete'
  
  // 空状态
  | 'recent.empty.title'
  | 'recent.empty.description'
  | 'recent.empty.new_document'
  | 'recent.empty.upload_resources'
  | 'recent.empty.autopilot'

  // 写作流程 - Writing Flow
  | 'writingflow.title'
  | 'writingflow.subtitle'
  | 'writingflow.loading'
  | 'writingflow.saved'
  | 'writingflow.project_id'
  | 'writingflow.meta_title'
  | 'writingflow.meta_description'

  // 步骤导航
  | 'steps.title'
  | 'steps.subtitle'
  | 'steps.progress'
  | 'steps.topic.title'
  | 'steps.topic.description'
  | 'steps.research.title'
  | 'steps.research.description'
  | 'steps.strategy.title'
  | 'steps.strategy.description'
  | 'steps.outline.title'
  | 'steps.outline.description'

  // TopicStep 表单
  | 'topic.page_title'
  | 'topic.page_description'
  | 'topic.form.title.label'
  | 'topic.form.title.placeholder'
  | 'topic.form.title.validation.min'
  | 'topic.form.title.validation.max'
  | 'topic.form.type.label'
  | 'topic.form.type.required'
  | 'topic.form.type.paper'
  | 'topic.form.type.report'
  | 'topic.form.type.review'
  | 'topic.form.type.commentary'
  | 'topic.form.words.label'
  | 'topic.form.words.validation.min'
  | 'topic.form.words.validation.max'
  | 'topic.form.format.label'
  | 'topic.form.format.required'
  | 'topic.form.level.label'
  | 'topic.form.level.required'
  | 'topic.form.level.undergrad'
  | 'topic.form.level.postgrad'
  | 'topic.form.level.esl'
  | 'topic.form.level.pro'
  | 'topic.form.resources.label'
  | 'topic.form.resources.any'
  | 'topic.form.resources.papers'
  | 'topic.form.resources.books'
  | 'topic.form.resources.web'
  | 'topic.form.resources.datasets'
  | 'topic.form.resources.other'
  | 'topic.form.resources.required'
  | 'topic.form.course.label'
  | 'topic.form.course.placeholder'
  | 'topic.form.requirements.label'
  | 'topic.form.requirements.placeholder'
  | 'topic.form.requirements.max'
  | 'topic.form.files.max'
  | 'topic.form.files.drag_drop'
  | 'topic.form.files.select'
  | 'topic.form.files.format_info'
  | 'topic.form.files.error.format'
  | 'topic.form.files.error.size'
  | 'topic.form.files.error.count'
  | 'topic.buttons.save'
  | 'topic.buttons.continue'
  | 'topic.validation.success'
  | 'topic.validation.save_failed'
  | 'topic.cards.basic_info'
  | 'topic.cards.academic_requirements'  
  | 'topic.cards.writing_reference'

  // ResearchStep
  | 'research.page_title'
  | 'research.page_description'
  | 'research.search.placeholder'
  | 'research.search.button'
  | 'research.sources.title'
  | 'research.sources.selected'
  | 'research.sources.verified'
  | 'research.buttons.back'
  | 'research.buttons.continue'

  // StrategyStep  
  | 'strategy.page_title'
  | 'strategy.page_description'
  | 'strategy.thesis.label'
  | 'strategy.thesis.placeholder'
  | 'strategy.claims.label'
  | 'strategy.claims.add'
  | 'strategy.approach.label'
  | 'strategy.approach.placeholder'
  | 'strategy.buttons.back'
  | 'strategy.buttons.continue'

  // OutlineStep
  | 'outline.page_title'
  | 'outline.page_description'
  | 'outline.sections.title'
  | 'outline.sections.add'
  | 'outline.sections.remove'
  | 'outline.sections.edit'
  | 'outline.buttons.back'
  | 'outline.buttons.complete'
  | 'outline.completion.title'
  | 'outline.completion.description'
  
  // ResearchStep 翻译键类型
  | 'research.header.title'
  | 'research.header.description'
  | 'research.warning.title'
  | 'research.warning.min_sources'
  | 'research.warning.no_duplicates'
  | 'research.tabs.academic'
  | 'research.tabs.background'
  | 'research.quality_score'
  | 'research.search.title'
  | 'research.search.placeholder'
  | 'research.search.searching'
  | 'research.search.button'
  | 'research.search.add_manual'
  | 'research.search.import_bibtex'
  | 'research.filters.year_range'
  | 'research.filters.source_types'
  | 'research.filters.sort_by'
  | 'research.filters.relevance'
  | 'research.filters.year'
  | 'research.filters.citations'
  | 'research.type.paper'
  | 'research.type.book'
  | 'research.type.web'
  | 'research.type.dataset'
  | 'research.type.report'
  | 'research.results.title'
  | 'research.results.citations_count'
  | 'research.results.peer_reviewed'
  | 'research.results.open_access'
  | 'research.results.quality'
  | 'research.results.added'
  | 'research.results.add_to_library'
  | 'research.results.copy_apa'
  | 'research.results.copy_mla'
  | 'research.results.copy_chicago'
  | 'research.results.copy_ieee'
  | 'research.results.copy_gbt'
  | 'research.results.view_details'
  | 'research.results.bookmark'
  | 'research.results.view_original'
  | 'research.library.title'
  | 'research.library.selected_count'
  | 'research.library.export'
  | 'research.library.empty_title'
  | 'research.library.empty_description'
  | 'research.library.stats.total'
  | 'research.library.stats.average_quality'
  | 'research.library.stats.expected_citations'
  | 'research.library.item.has_identifier'
  | 'research.buttons.back_to_topic'
  | 'research.buttons.save_draft'
  | 'research.buttons.continue_to_strategy'
  | 'research.toast.search_complete'
  | 'research.toast.found_references'
  | 'research.toast.search_failed'
  | 'research.toast.already_exists'
  | 'research.toast.reference_exists'
  | 'research.toast.added_to_library'
  | 'research.toast.reference_added'
  | 'research.toast.removed_from_library'
  | 'research.toast.reference_removed'
  | 'research.toast.citation_copied'
  | 'research.toast.citation_copied_format'
  | 'research.toast.draft_saved'
  | 'research.toast.progress_saved'
  | 'research.toast.completed'
  | 'research.toast.entering_strategy'
  | 'research.validation.title_min'
  | 'research.validation.authors_min'
  
  // Research Step Toast Messages
  | 'research.toast.verification_updated'
  | 'research.toast.verification_rate'
  | 'research.error.recovery_failed'
  | 'research.error.autopilot_start_failed'
  
  // OutcomePanel 翻译键类型
  | 'outcome.price.locked'
  | 'outcome.price.locked_badge'
  | 'outcome.price.relock'
  | 'outcome.price.estimated'
  | 'outcome.price.eta'
  | 'outcome.verification.level'
  | 'outcome.verification.basic'
  | 'outcome.verification.standard'
  | 'outcome.verification.pro'
  | 'outcome.deliverables.draft'
  | 'outcome.deliverables.citation_verification'
  | 'outcome.deliverables.style_alignment'
  | 'outcome.deliverables.process_tracking'
  | 'outcome.addons.evidence_pack'
  | 'outcome.addons.defense_card'
  | 'outcome.addons.latex'
  | 'outcome.addons.ai_check'
  | 'outcome.addons.plagiarism'
  | 'outcome.addons.share_link'
  | 'outcome.metrics.style_samples'
  | 'outcome.metrics.style_samples_desc'
  | 'outcome.metrics.sources_hit'
  | 'outcome.metrics.sources_hit_desc'
  | 'outcome.metrics.verifiable'
  | 'outcome.metrics.verifiable_desc'
  | 'outcome.metrics.recent_5y'
  | 'outcome.metrics.recent_5y_desc'
  | 'outcome.metrics.thesis_candidates'
  | 'outcome.metrics.thesis_candidates_desc'
  | 'outcome.metrics.picked_structure'
  | 'outcome.metrics.picked_structure_desc'
  | 'outcome.metrics.claim_count'
  | 'outcome.metrics.claim_count_desc'
  | 'outcome.metrics.outline_depth'
  | 'outcome.metrics.outline_depth_desc'
  | 'outcome.metrics.sections'
  | 'outcome.metrics.sections_desc'
  | 'outcome.metrics.citation_balance'
  | 'outcome.metrics.citation_balance_desc'
  | 'outcome.metrics.expected_citations'
  | 'outcome.metrics.expected_citations_desc'
  | 'outcome.metrics.estimated_time'
  | 'outcome.metrics.eta'
  | 'outcome.time.minutes'
  | 'outcome.time.hours'
  | 'outcome.buttons.pay_and_write'
  | 'outcome.buttons.preview_sample'
  | 'outcome.buttons.processing'
  | 'outcome.buttons.retry'
  | 'outcome.disclaimer'
  
  // StrategyStep 翻译键类型
  | 'strategy.header.title'
  | 'strategy.header.description'
  | 'strategy.thesis.label'
  | 'strategy.thesis.placeholder'
  | 'strategy.essay_type.label'
  | 'strategy.audience.label'
  | 'strategy.register.label'
  | 'strategy.claims.title'
  | 'strategy.claims.add'
  | 'strategy.counters.title'
  | 'strategy.structure.title'
  | 'strategy.citation_style.label'
  | 'strategy.sources.label'
  | 'strategy.cards.optimization_suggestions'
  | 'strategy.quality.title'
  | 'strategy.quality.description'
  | 'strategy.quality.feasibility'
  | 'strategy.quality.specificity'
  | 'strategy.quality.consistency'
  | 'strategy.quality.provability'
  | 'strategy.thesis.title'
  | 'strategy.thesis.required'
  | 'strategy.thesis.placeholder'
  | 'strategy.thesis.error.required'
  | 'strategy.form.essay_type'
  | 'strategy.form.audience'
  | 'strategy.form.register'
  | 'strategy.options.essay_type.argument'
  | 'strategy.options.essay_type.analysis'
  | 'strategy.options.essay_type.expository'
  | 'strategy.options.essay_type.compare'
  | 'strategy.options.essay_type.review'
  | 'strategy.options.audience.academic'
  | 'strategy.options.audience.general'
  | 'strategy.options.audience.decision'
  | 'strategy.options.register.formal'
  | 'strategy.options.register.neutral'
  | 'strategy.options.register.explanatory'
  | 'strategy.claims.title'
  | 'strategy.claims.description'
  | 'strategy.claims.add_button'
  | 'strategy.claims.placeholder'
  | 'strategy.claims.empty.title'
  | 'strategy.claims.empty.description'
  | 'strategy.claims.evidence.title'
  | 'strategy.claims.evidence.empty'
  | 'strategy.claims.evidence.ai_generate'
  | 'strategy.claims.evidence.ai_generating'
  | 'strategy.claims.evidence.add_manual'
  | 'strategy.claims.evidence.source_type'
  | 'strategy.claims.evidence.keywords'
  | 'strategy.claims.evidence.keywords_placeholder'
  | 'strategy.claims.evidence.expected_citations'
  | 'strategy.claims.evidence.need_figure'
  | 'strategy.claims.evidence.types.paper'
  | 'strategy.claims.evidence.types.book'
  | 'strategy.claims.evidence.types.web'
  | 'strategy.claims.evidence.types.dataset'
  | 'strategy.claims.evidence.types.report'
  | 'strategy.counters.title'
  | 'strategy.counters.description'
  | 'strategy.counters.add_button'
  | 'strategy.counters.viewpoint'
  | 'strategy.counters.viewpoint_placeholder'
  | 'strategy.counters.rebuttal'
  | 'strategy.counters.rebuttal_placeholder'
  | 'strategy.counters.as_paragraph'
  | 'strategy.structure.title'
  | 'strategy.structure.description'
  | 'strategy.structure.template'
  | 'strategy.structure.allocation'
  | 'strategy.structure.intro'
  | 'strategy.structure.body'
  | 'strategy.structure.conclusion'
  | 'strategy.structure.blueprint.title'
  | 'strategy.structure.blueprint.paragraph'
  | 'strategy.structure.blueprint.function'
  | 'strategy.structure.blueprint.content'
  | 'strategy.structure.blueprint.claim'
  | 'strategy.structure.blueprint.citations'
  | 'strategy.structure.blueprint.intro_summary'
  | 'strategy.structure.blueprint.body_summary'
  | 'strategy.structure.blueprint.conclusion_summary'
  | 'strategy.structure.blueprint.total_info'
  | 'strategy.structure.templates.peel.name'
  | 'strategy.structure.templates.peel.description'
  | 'strategy.structure.templates.peel.example'
  | 'strategy.structure.templates.toulmin.name'
  | 'strategy.structure.templates.toulmin.description'
  | 'strategy.structure.templates.toulmin.example'
  | 'strategy.structure.templates.concede.name'
  | 'strategy.structure.templates.concede.description'
  | 'strategy.structure.templates.concede.example'
  | 'strategy.structure.templates.problem.name'
  | 'strategy.structure.templates.problem.description'
  | 'strategy.structure.templates.problem.example'
  | 'strategy.citation.title'
  | 'strategy.citation.description'
  | 'strategy.citation.format'
  | 'strategy.citation.level'
  | 'strategy.citation.expected_range'
  | 'strategy.citation.readonly'
  | 'strategy.suggestions.title'
  | 'strategy.suggestions.description'
  | 'strategy.suggestions.improve_thesis'
  | 'strategy.suggestions.add_claims'
  | 'strategy.suggestions.add_evidence'
  | 'strategy.suggestions.optional_note'
  | 'strategy.buttons.save_draft'
  | 'strategy.buttons.continue'
  | 'strategy.toast.draft_saved'
  | 'strategy.toast.draft_saved_desc'
  | 'strategy.toast.strategy_saved'
  | 'strategy.toast.strategy_saved_desc'
  | 'strategy.toast.save_failed'
  | 'strategy.toast.save_failed_desc'
  | 'strategy.toast.evidence_generated'
  | 'strategy.toast.evidence_generated_desc'
  | 'strategy.validation.claim_required'
  | 'strategy.validation.keywords_required'
  | 'strategy.validation.viewpoint_required'
  | 'strategy.validation.rebuttal_required'
  | 'strategy.validation.min_claims'
  | 'strategy.validation.max_claims'
  | 'strategy.validation.thesis_required'
  | 'strategy.validation.thesis_max_length'
  | 'strategy.levels.undergrad'
  | 'strategy.levels.postgrad'
  | 'strategy.levels.esl'
  | 'strategy.levels.pro'
  
  // OutlineStep 翻译键类型
  | 'outline.header.title'
  | 'outline.header.description'
  | 'outline.target_words'
  | 'outline.sections.add'
  | 'outline.sections.remove'
  | 'outline.sections.edit'
  | 'outline.sections.expand'
  | 'outline.sections.collapse'
  | 'outline.sections.title'
  | 'outline.sections.summary'
  | 'outline.sections.word_count'
  | 'outline.stats.total_sections'
  | 'outline.stats.total_words'
  | 'outline.stats.completion'
  | 'outline.cards.document_outline'
  | 'outline.overview.title'
  | 'outline.overview.total_words'
  | 'outline.overview.target'
  | 'outline.overview.current'
  | 'outline.overview.sections'
  | 'outline.overview.quality_score'
  | 'outline.suggestions.title'
  | 'outline.buttons.export'
  | 'outline.buttons.ai_assist'
  | 'outline.buttons.add_section'
  
  // New outline keys
  | 'outline.template.label'
  | 'outline.template.standard'
  | 'outline.template.research'
  | 'outline.template.custom'
  | 'outline.template.applied'
  | 'outline.template.switched'
  | 'outline.template.template'
  | 'outline.export.markdown'
  | 'outline.export.docx'
  | 'outline.export.json'
  | 'outline.export.feature'
  | 'outline.export.in_development'
  | 'outline.ai_assist.quick_complete'
  | 'outline.ai_assist.structure_help'
  | 'outline.ai_assist.add_sections'
  | 'outline.ai_assist.balance_content'
  | 'outline.ai_assist.restructure_chapter'
  | 'outline.ai_assist.completed'
  | 'outline.ai_assist.completed_desc'
  | 'outline.ai_assist.balanced'
  | 'outline.ai_assist.balanced_desc'
  | 'outline.validation.required'
  | 'outline.validation.failed'
  | 'outline.validation.passed'
  | 'outline.actions.delete'
  | 'outline.words'
  | 'outline.subsections'
  | 'outline.new_chapter'
  | 'outline.new_section'
  | 'outline.section'
  | 'outline.empty.title'
  | 'outline.empty.description'
  | 'outline.empty.standard_template'
  | 'outline.empty.research_template'
  | 'outline.back_to_strategy'
  | 'outline.continue_to_writing'
  | 'outline.completed'
  | 'outline.completed_desc'
  
  // Additional outline validation and template keys
  | 'outline.validation.title_required'
  | 'outline.validation.min_sections'
  | 'outline.validation.min_subsections' 
  | 'outline.validation.title_duplicate'
  | 'outline.validation.word_count_deviation'
  | 'outline.validation.missing_sections'
  | 'outline.validation.add_chapter'
  | 'outline.validation.fill_titles'
  | 'outline.validation.suggest_min_chapters'
  | 'outline.validation.suggest_subsections'
  | 'outline.validation.suggest_modify_duplicate'
  | 'outline.validation.word_target_deviation'
  | 'outline.validation.suggest_add_sections'
  | 'outline.validation.optimization_tip'
  | 'outline.quality.coverage'
  | 'outline.quality.depth'
  | 'outline.quality.balance'
  | 'outline.quality.writability'
  | 'outline.toast.verification_updated'
  | 'outline.toast.verification_rate'
  | 'outline.toast.structure_suggestion'
  | 'outline.toast.smart_supplement'
  | 'outline.toast.analyzing_outline'
  | 'outline.toast.preview_mode'
  | 'outline.toast.continue_editing'
  | 'outline.toast.payment_success'
  | 'outline.toast.starting_autopilot'
  | 'outline.toast.payment_failed'
  | 'outline.toast.payment_error'
  | 'outline.toast.autopilot_failed'
  | 'outline.toast.manual_steps'
  | 'outline.toast.development'
  | 'outline.toast.sample_preview_coming'
  | 'outline.toast.price_lock_failed'
  | 'outline.toast.retry'
  | 'outline.toast.error'
  | 'outline.templates.intro.title'
  | 'outline.templates.intro.summary'
  | 'outline.templates.intro.background.title'
  | 'outline.templates.intro.background.summary'
  | 'outline.templates.intro.problem.title'
  | 'outline.templates.intro.problem.summary'
  | 'outline.templates.literature.title'
  | 'outline.templates.literature.summary'
  | 'outline.templates.literature.theory.title'
  | 'outline.templates.literature.theory.summary'
  | 'outline.templates.literature.related.title'
  | 'outline.templates.literature.related.summary'
  | 'outline.templates.methodology.title'
  | 'outline.templates.methodology.summary'
  | 'outline.templates.methodology.design.title'
  | 'outline.templates.methodology.design.summary'
  | 'outline.templates.methodology.data.title'
  | 'outline.templates.methodology.data.summary'
  | 'outline.templates.results.title'
  | 'outline.templates.results.summary'
  | 'outline.templates.results.findings.title'
  | 'outline.templates.results.findings.summary'
  | 'outline.templates.results.analysis.title'
  | 'outline.templates.results.analysis.summary'
  | 'outline.templates.discussion.title'
  | 'outline.templates.discussion.summary'
  | 'outline.templates.discussion.interpret.title'
  | 'outline.templates.discussion.interpret.summary'
  | 'outline.templates.discussion.limits.title'
  | 'outline.templates.discussion.limits.summary'
  | 'outline.templates.conclusion.title'
  | 'outline.templates.conclusion.summary'
  | 'outline.templates.conclusion.summary_content.title'
  | 'outline.templates.conclusion.summary_content.summary'
  | 'outline.templates.conclusion.future.title'
  | 'outline.templates.conclusion.future.summary'
  | 'outline.templates.v2.abstract.title'
  | 'outline.templates.v2.abstract.summary'
  | 'outline.templates.v2.intro.title'
  | 'outline.templates.v2.intro.summary'
  | 'outline.templates.v2.intro.context.title'
  | 'outline.templates.v2.intro.context.summary'
  | 'outline.templates.v2.intro.objectives.title'
  | 'outline.templates.v2.intro.objectives.summary'
  | 'outline.templates.v2.background.title'
  | 'outline.templates.v2.background.summary'
  | 'outline.templates.v2.background.theory.title'
  | 'outline.templates.v2.background.theory.summary'
  | 'outline.templates.v2.background.prior.title'
  | 'outline.templates.v2.background.prior.summary'
  | 'outline.templates.v2.methods.title'
  | 'outline.templates.v2.methods.summary'
  | 'outline.templates.v2.methods.approach.title'
  | 'outline.templates.v2.methods.approach.summary'
  | 'outline.templates.v2.methods.procedure.title'
  | 'outline.templates.v2.methods.procedure.summary'
  | 'outline.templates.v2.findings.title'
  | 'outline.templates.v2.findings.summary'
  | 'outline.templates.v2.findings.primary.title'
  | 'outline.templates.v2.findings.primary.summary'
  | 'outline.templates.v2.findings.secondary.title'
  | 'outline.templates.v2.findings.secondary.summary'
  | 'outline.templates.v2.implications.title'
  | 'outline.templates.v2.implications.summary'
  | 'outline.templates.v2.implications.theoretical.title'
  | 'outline.templates.v2.implications.theoretical.summary'
  | 'outline.templates.v2.implications.practical.title'
  | 'outline.templates.v2.implications.practical.summary'
  | 'outline.templates.v2.conclusion.title'
  | 'outline.templates.v2.conclusion.summary'
  | 'outline.templates.quick.intro.title'
  | 'outline.templates.quick.intro.summary'
  | 'outline.templates.quick.intro.background.title'
  | 'outline.templates.quick.intro.background.summary'
  | 'outline.templates.quick.intro.objectives.title'
  | 'outline.templates.quick.intro.objectives.summary'
  | 'outline.templates.quick.main.title'
  | 'outline.templates.quick.main.summary'
  | 'outline.templates.quick.main.part1.title'
  | 'outline.templates.quick.main.part1.summary'
  | 'outline.templates.quick.main.part2.title'
  | 'outline.templates.quick.main.part2.summary'
  | 'outline.templates.quick.conclusion.title'
  | 'outline.templates.quick.conclusion.summary'
  | 'outline.templates.quick.conclusion.findings.title'
  | 'outline.templates.quick.conclusion.findings.summary'
  | 'outline.templates.quick.conclusion.future.title'
  | 'outline.templates.quick.conclusion.future.summary'
  | 'outline.word_count.exceeded'
  | 'outline.word_count.insufficient'
  | 'outline.word_count.chapters'
  | 'outline.word_count.quality_score'
  | 'outline.gate1.benefits.complete_generation'
  | 'outline.gate1.benefits.local_rewrites'
  | 'outline.gate1.benefits.full_verification'
  
  // New result keys
  | 'result.header.title'
  | 'result.header.description'
  | 'result.meta.title'
  | 'result.meta.description'
  | 'result.status.generating'
  | 'result.status.ready'
  | 'result.status.preview'
  | 'result.status.completed'
  | 'result.document.title'
  | 'result.document.subtitle'
  | 'result.document.status'
  | 'result.document.id'

  // ArticleCard comprehensive keys
  | 'result.article.title'
  | 'result.article.document_id'
  | 'result.article.status.idle'
  | 'result.article.status.starting'
  | 'result.article.status.streaming' 
  | 'result.article.status.ready'
  | 'result.article.status.error'
  | 'result.article.export.docx'
  | 'result.article.export.pdf'
  | 'result.article.export.latex'
  | 'result.article.actions.copy_share_link'
  | 'result.article.actions.view_history'
  | 'result.article.preview.mode'
  | 'result.article.preview.title'
  | 'result.article.preview.description'
  | 'result.article.preview.content_limited'
  | 'result.article.preview.abstract'
  | 'result.article.preview.introduction'
  | 'result.article.preview.sample_text_abstract'
  | 'result.article.preview.sample_text_introduction'
  | 'result.article.preview.more_content'
  | 'result.article.generation.completed'
  | 'result.article.generation.streaming'
  | 'result.article.generation.streaming_note'
  | 'result.article.generation.realtime_streaming'
  | 'result.article.waiting.title'
  | 'result.article.waiting.description'
  | 'result.article.waiting.start_generation'
  | 'result.article.metadata.created_time'
  | 'result.article.metadata.format'
  | 'result.article.metadata.word_count'
  | 'result.article.metadata.realtime_sync'
  | 'result.article.metadata.auto_save'
  | 'result.article.metadata.saving'

  // DeckTabs comprehensive keys  
  | 'result.tabs.export'
  | 'result.tabs.evidence'
  | 'result.tabs.verification' 
  | 'result.tabs.style'
  | 'result.tabs.assistant'
  | 'result.tabs.audit'
  | 'result.deliverables.quality_score'
  | 'result.deliverables.quality_description'
  | 'result.deliverables.process_doc'
  | 'result.deliverables.process_description'
  | 'result.deliverables.references'
  | 'result.deliverables.references_description'
  | 'result.deliverables.references_count'
  | 'result.deliverables.timeline'
  | 'result.deliverables.timeline_description'
  | 'result.deliverables.viva_cards'
  | 'result.deliverables.viva_description'
  | 'result.deliverables.media_assets'
  | 'result.deliverables.media_description'
  | 'result.deliverables.share_link'
  | 'result.deliverables.share_description'
  | 'result.deliverables.complete_bundle'
  | 'result.deliverables.complete_description'
  | 'result.deliverables.locked'
  | 'result.deliverables.generating'
  | 'result.deliverables.download'
  | 'result.assistant.ai_chat'
  | 'result.assistant.ai_chat_description'
  | 'result.assistant.ai_chat_content'
  | 'result.assistant.start_conversation'
  | 'result.assistant.edit_suggestions'
  | 'result.assistant.doc_search'
  | 'result.assistant.doc_search_description'
  | 'result.assistant.doc_search_content'
  | 'result.assistant.start_search'
  | 'result.assistant.enhancement'
  | 'result.assistant.enhancement_description'
  | 'result.assistant.enhancement_content'
  | 'result.assistant.language_polish'
  | 'result.assistant.structure_optimize'
  | 'result.audit.title'
  | 'result.audit.document_generated'
  | 'result.audit.citation_verified'
  | 'result.audit.generation_started'
  | 'result.audit.minutes_ago'
  | 'result.audit.view_full_log'

  // CitationVerificationPanel comprehensive keys
  | 'result.citation.verification_center'
  | 'result.citation.realtime_validation'
  | 'result.citation.total'
  | 'result.citation.verified'
  | 'result.citation.failed' 
  | 'result.citation.verifying'
  | 'result.citation.pending'
  | 'result.citation.verification_progress'
  | 'result.citation.batch_verify'
  | 'result.citation.verifying_status'
  | 'result.citation.export_report'
  | 'result.citation.details_count'
  | 'result.citation.status.verified'
  | 'result.citation.status.failed'
  | 'result.citation.status.checking'
  | 'result.citation.status.not_found'
  | 'result.citation.status.pending'
  | 'result.citation.type.paper'
  | 'result.citation.type.book'
  | 'result.citation.type.dataset'
  | 'result.citation.type.web'
  | 'result.citation.no_date'
  | 'result.citation.verify'
  | 'result.citation.retry'
  | 'result.citation.hide_details'
  | 'result.citation.show_details'
  | 'result.citation.doi_validity'
  | 'result.citation.crossref_match'
  | 'result.citation.valid'
  | 'result.citation.invalid'
  | 'result.citation.match'
  | 'result.citation.no_match'
  | 'result.citation.issues_found'
  | 'result.citation.last_checked'
  | 'result.citation.suggested_replacement'
  | 'result.citation.replace'
  | 'result.citation.doi_link'
  | 'result.citation.original_link'
  | 'result.citation.verification_mechanism'
  | 'result.citation.mechanism.doi'
  | 'result.citation.mechanism.pmid'
  | 'result.citation.mechanism.isbn'
  | 'result.citation.mechanism.smart_replacement'
  | 'result.citation.mechanism.format_check'

  // Gate1Modal comprehensive keys
  | 'result.gate1.unlock_title'
  | 'result.gate1.unlock_description'
  | 'result.gate1.locked_price'
  | 'result.gate1.includes_all'
  | 'result.gate1.time_remaining'
  | 'result.gate1.price_expired'
  | 'result.gate1.need_reestimate'
  | 'result.gate1.included_benefits'
  | 'result.gate1.benefit.complete_generation'
  | 'result.gate1.benefit.partial_rewrites'
  | 'result.gate1.benefit.full_verification'
  | 'result.gate1.feature.smart_generation'
  | 'result.gate1.feature.ai_driven'
  | 'result.gate1.feature.precise_citation'
  | 'result.gate1.feature.full_verification'
  | 'result.gate1.feature.flexible_editing'
  | 'result.gate1.feature.multiple_rewrites'
  | 'result.gate1.processing_payment'
  | 'result.gate1.unlock_now'
  | 'result.gate1.preview_only'
  | 'result.gate1.price_locked_until'
  | 'result.gate1.expired'
  | 'result.gate1.payment_info'
  | 'result.gate1.price_locked_text'

  // ExportPreviewPanel comprehensive keys (~50 keys)
  | 'result.export.title'
  | 'result.export.subtitle'
  | 'result.export.formats_supported'
  | 'result.export.format.docx'
  | 'result.export.format.pdf'
  | 'result.export.format.latex'
  | 'result.export.format.html'
  | 'result.export.format.markdown'
  | 'result.export.format.pptx'
  | 'result.export.format.docx_desc'
  | 'result.export.format.pdf_desc'
  | 'result.export.format.latex_desc'
  | 'result.export.format.html_desc'
  | 'result.export.format.markdown_desc'
  | 'result.export.format.pptx_desc'
  | 'result.export.recommended'
  | 'result.export.file_size'
  | 'result.export.features'
  | 'result.export.preview'
  | 'result.export.download'
  | 'result.export.configure'
  | 'result.export.feature.complete_format'
  | 'result.export.feature.revision_mode'
  | 'result.export.feature.best_compatibility'
  | 'result.export.feature.editable'
  | 'result.export.feature.format_locked'
  | 'result.export.feature.cross_platform'
  | 'result.export.feature.print_ready'
  | 'result.export.feature.high_security'
  | 'result.export.feature.professional_typesetting'
  | 'result.export.feature.math_formula'
  | 'result.export.feature.version_control'
  | 'result.export.feature.journal_submission'
  | 'result.export.feature.online_viewing'
  | 'result.export.feature.responsive_design'
  | 'result.export.feature.seo_friendly'
  | 'result.export.feature.interactive_elements'
  | 'result.export.feature.plain_text'
  | 'result.export.feature.lightweight'
  | 'result.export.feature.multi_platform'
  | 'result.export.feature.auto_layout'
  | 'result.export.feature.chart_visualization'
  | 'result.export.feature.presentation_friendly'
  | 'result.export.feature.rich_templates'
  | 'result.export.preview_modal_title'
  | 'result.export.copy_content'
  | 'result.export.download_file'
  | 'result.export.tab.formats'
  | 'result.export.tab.batch'
  | 'result.export.tab.actions'
  | 'result.export.batch.title'
  | 'result.export.batch.description'
  | 'result.export.batch.export_progress'
  | 'result.export.batch.export'
  | 'result.export.batch.exporting'
  | 'result.export.batch.estimated_size'
  | 'result.export.batch.success'
  | 'result.export.action.print_preview'
  | 'result.export.action.print_desc'
  | 'result.export.action.share_online'
  | 'result.export.action.share_desc'
  | 'result.export.action.email_send'
  | 'result.export.action.email_desc'
  | 'result.export.settings.title'
  | 'result.export.settings.citation_format'
  | 'result.export.settings.image_quality'
  | 'result.export.settings.include_comments'
  | 'result.export.settings.include_metadata'
  | 'result.export.settings.quality.low'
  | 'result.export.settings.quality.medium'
  | 'result.export.settings.quality.high'
  | 'result.export.generating'

  // EvidencePackagePanel comprehensive keys (~60 keys)
  | 'result.evidence.title'
  | 'result.evidence.subtitle'
  | 'result.evidence.traceable'
  | 'result.evidence.word_count'
  | 'result.evidence.citation_count'
  | 'result.evidence.session_duration'
  | 'result.evidence.operation_records'
  | 'result.evidence.export_pdf'
  | 'result.evidence.export_data'
  | 'result.evidence.complete_package'
  | 'result.evidence.tab.overview'
  | 'result.evidence.tab.timeline'
  | 'result.evidence.tab.sources'
  | 'result.evidence.tab.viva'
  | 'result.evidence.tab.share'
  | 'result.evidence.quality.title'
  | 'result.evidence.quality.originality'
  | 'result.evidence.quality.citation_accuracy'
  | 'result.evidence.quality.style_consistency'
  | 'result.evidence.quality.structure_integrity'
  | 'result.evidence.quality.score'
  | 'result.evidence.integrity.title'
  | 'result.evidence.integrity.complete_timeline'
  | 'result.evidence.integrity.verified_sources'
  | 'result.evidence.integrity.viva_prepared'
  | 'result.evidence.integrity.session_reasonable'
  | 'result.evidence.integrity.quality_standards'
  | 'result.evidence.timeline.title'
  | 'result.evidence.timeline.description'
  | 'result.evidence.timeline.user'
  | 'result.evidence.timeline.agent'
  | 'result.evidence.timeline.system'
  | 'result.evidence.timeline.other'
  | 'result.evidence.timeline.type.citation'
  | 'result.evidence.timeline.type.edit'
  | 'result.evidence.timeline.type.generation'
  | 'result.evidence.timeline.type.verification'
  | 'result.evidence.timeline.type.export'
  | 'result.evidence.sources.title'
  | 'result.evidence.sources.description'
  | 'result.evidence.sources.verified'
  | 'result.evidence.sources.pending'
  | 'result.evidence.sources.inserted_at'
  | 'result.evidence.sources.view_doi'
  | 'result.evidence.sources.export_csv'
  | 'result.evidence.sources.copy_bibtex'
  | 'result.evidence.sources.exported'
  | 'result.evidence.sources.bibtex_copied'
  | 'result.evidence.viva.title'
  | 'result.evidence.viva.description'
  | 'result.evidence.viva.category.methodology'
  | 'result.evidence.viva.category.sources'
  | 'result.evidence.viva.category.analysis'
  | 'result.evidence.viva.category.contribution'
  | 'result.evidence.viva.category.technical'
  | 'result.evidence.viva.category.other'
  | 'result.evidence.viva.expand'
  | 'result.evidence.viva.collapse'
  | 'result.evidence.viva.suggested_answer'
  | 'result.evidence.viva.key_points'
  | 'result.evidence.viva.related_sources'
  | 'result.evidence.viva.preparation_tips'
  | 'result.evidence.viva.tip1'
  | 'result.evidence.viva.tip2'
  | 'result.evidence.viva.tip3'
  | 'result.evidence.viva.tip4'
  | 'result.evidence.share.title'
  | 'result.evidence.share.description'
  | 'result.evidence.share.generate_link'
  | 'result.evidence.share.generating'
  | 'result.evidence.share.copy_link'
  | 'result.evidence.share.copied'
  | 'result.evidence.share.expires_7days'
  | 'result.evidence.share.readonly_access'
  | 'result.evidence.share.qr_title'
  | 'result.evidence.share.qr_description'
  | 'result.evidence.share.qr_hint'
  | 'result.evidence.share.security_title'
  | 'result.evidence.share.security.sensitive'
  | 'result.evidence.share.security.expires'
  | 'result.evidence.share.security.readonly'
  | 'result.evidence.share.security.revoke'
  | 'result.evidence.share.success'

  // StyleAnalysisPanel comprehensive keys (~40 keys)  
  | 'result.style.analysis.title'
  | 'result.style.analysis.description'
  | 'result.style.baseline.title'
  | 'result.style.baseline.description'
  | 'result.style.metrics.sentence_length'
  | 'result.style.metrics.lexical_variety'
  | 'result.style.metrics.burstiness'
  | 'result.style.metrics.complexity'
  | 'result.style.current_document'
  | 'result.style.baseline_sample'
  | 'result.style.similarity_score'
  | 'result.style.distance_analysis'
  | 'result.style.polish_level.light'
  | 'result.style.polish_level.medium'
  | 'result.style.polish_level.strong'
  | 'result.style.recommendation.title'
  | 'result.style.comparison.title'
  | 'result.style.radar_chart.title'
  | 'result.style.detailed_analysis'
  | 'result.style.upload_sample'
  | 'result.style.sample_info'
  | 'result.style.language'
  | 'result.style.type'
  | 'result.style.upload_date'
  | 'result.style.analysis_result'
  | 'result.style.polish_suggestions'
  | 'result.style.apply_polish'
  | 'result.style.polishing'
  | 'result.style.polish_complete'
  | 'result.style.tab.analysis'
  | 'result.style.tab.comparison'
  | 'result.style.tab.polish'
  | 'result.style.score'
  | 'result.style.excellent'
  | 'result.style.good'
  | 'result.style.needs_improvement'
  | 'result.style.sample.essay'
  | 'result.style.sample.report'
  | 'result.style.sample.thesis'
  | 'result.style.sample.other'

  // StyleAnalysisPanel additional keys
  | 'result.style.title'
  | 'result.style.baseline_sample_name'
  | 'result.style.recommendation'
  | 'result.style.personal_baseline'
  | 'result.style.word_count'
  | 'result.style.type_essay'
  | 'result.style.type_report'
  | 'result.style.type_thesis'
  | 'result.style.type_other'
  | 'result.style.language_label'
  | 'result.style.update_baseline'
  | 'result.style.match.excellent'
  | 'result.style.match.good'
  | 'result.style.match.fair'
  | 'result.style.match.poor'
  | 'result.style.distance'
  | 'result.style.target_distance'
  | 'result.style.based_on_history'
  | 'result.style.analyzing'
  | 'result.style.reanalyze'
  | 'result.style.analysis_updated'
  | 'result.style.tab.overview'
  | 'result.style.tab.metrics'
  | 'result.style.tab.history'
  | 'result.style.style_metrics_comparison'
  | 'result.style.recommended_target'
  | 'result.style.radar_analysis'
  | 'result.style.match_degree'
  | 'result.style.metric.sentence_length'
  | 'result.style.metric.lexical_variety'
  | 'result.style.metric.burstiness'
  | 'result.style.metric.complexity'
  | 'result.style.metric.avg_sentence_length'
  | 'result.style.metric.expression_burstiness'
  | 'result.style.metric.language_complexity'
  | 'result.style.current_value'
  | 'result.style.adjust_suggestion'
  | 'result.style.radar.sentence_fit'
  | 'result.style.radar.lexical_consistency'
  | 'result.style.radar.expression_rhythm'
  | 'result.style.radar.language_complexity'
  | 'result.style.optimization_history'
  | 'result.style.optimization_records'
  | 'result.style.style_distance'
  | 'result.style.version.draft'
  | 'result.style.version.revision1'
  | 'result.style.version.revision2'
  | 'result.style.version.current'
  | 'result.style.polish_intensity'
  | 'result.style.polish_description'
  | 'result.style.polish.light'
  | 'result.style.polish.light_desc'
  | 'result.style.polish.medium'
  | 'result.style.polish.medium_desc'
  | 'result.style.polish.strong'
  | 'result.style.polish.strong_desc'
  | 'result.style.error_rate.light'
  | 'result.style.error_rate.medium'
  | 'result.style.error_rate.strong'
  | 'result.style.natural_error_rate'
  | 'result.style.non_native_friendly'
  | 'result.style.preserve_imperfection'
  | 'result.style.maintain_habits'
  | 'result.style.preserve_academic'
  | 'result.style.auto_adjust'
  | 'result.style.polish_set'

  // AgentCommandPanel comprehensive keys (~45 keys)
  | 'result.agent.title'
  | 'result.agent.description'
  | 'result.agent.quick_commands'
  | 'result.agent.advanced_commands'
  | 'result.agent.custom_command'
  | 'result.agent.send_command'
  | 'result.agent.command_history'
  | 'result.agent.status.pending'
  | 'result.agent.status.executing'
  | 'result.agent.status.completed'
  | 'result.agent.status.failed'
  | 'result.agent.quick.restructure'
  | 'result.agent.quick.restructure_desc'
  | 'result.agent.quick.format_apa'
  | 'result.agent.quick.format_apa_desc'
  | 'result.agent.quick.add_chart'
  | 'result.agent.quick.add_chart_desc'
  | 'result.agent.quick.polish_style'
  | 'result.agent.quick.polish_style_desc'
  | 'result.agent.template.comprehensive_review'
  | 'result.agent.template.section_rewrite'
  | 'result.agent.template.citation_enhance'
  | 'result.agent.template.structure_optimize'
  | 'result.agent.input_placeholder'
  | 'result.agent.examples.title'
  | 'result.agent.examples.structural'
  | 'result.agent.examples.formatting'
  | 'result.agent.examples.content'
  | 'result.agent.examples.citation'
  | 'result.agent.execution_time'
  | 'result.agent.changes_made'
  | 'result.agent.preview_changes'
  | 'result.agent.apply_changes'
  | 'result.agent.reject_changes'
  | 'result.agent.executing_command'
  | 'result.agent.command_completed'
  | 'result.agent.command_failed'
  | 'result.agent.try_again'
  | 'result.agent.clear_history'
  | 'result.agent.export_history'
  | 'result.agent.tab.quick'
  | 'result.agent.tab.advanced'
  | 'result.agent.tab.history'
  | 'result.agent.type.structural'
  | 'result.agent.type.formatting'
  | 'result.agent.type.citation'
  | 'result.agent.type.style'
  | 'result.agent.type.chart'
  
  // Settings keys
  | 'settings.account.title'
  | 'settings.account.basic_info'
  | 'settings.account.change_avatar'
  | 'settings.account.avatar_format'
  | 'settings.account.name'
  | 'settings.account.email' 
  | 'settings.account.verified'
  | 'settings.account.unverified'
  | 'settings.account.timezone'
  | 'settings.account.language'
  | 'settings.account.language.zh_cn'
  | 'settings.account.language.zh_tw'
  | 'settings.account.language.en_us'
  | 'settings.account.save_changes'
  | 'settings.account.saving'
  | 'settings.account.invoice_title'
  | 'settings.account.invoice_type'
  | 'settings.account.invoice_personal'
  | 'settings.account.invoice_company'
  | 'settings.account.company_name'
  | 'settings.account.personal_name'
  | 'settings.account.tax_id'
  | 'settings.account.address'
  | 'settings.account.zip'
  | 'settings.account.phone'
  | 'settings.account.save_invoice'
  | 'settings.toast.basic_saved'
  | 'settings.toast.invoice_saved'
  | 'settings.toast.save_failed'
  | 'settings.toast.avatar_dev'
  
  // Security settings keys
  | 'settings.security.change_password'
  | 'settings.security.current_password'
  | 'settings.security.new_password' 
  | 'settings.security.confirm_password'
  | 'settings.security.changing'
  | 'settings.security.two_factor'
  | 'settings.security.two_factor_enabled'
  | 'settings.security.two_factor_disabled'
  | 'settings.security.two_factor_desc'
  | 'settings.security.sessions_title'
  | 'settings.security.logout_all'
  | 'settings.security.device'
  | 'settings.security.browser'
  | 'settings.security.location'
  | 'settings.security.last_active'
  | 'settings.security.actions'
  | 'settings.security.current_device'
  | 'settings.security.logout'
  | 'settings.security.enable_2fa_title'
  | 'settings.security.enable_2fa_desc'
  | 'settings.security.recovery_codes'
  | 'settings.security.recovery_codes_desc'
  | 'settings.security.copy_codes'
  | 'settings.security.warning_title'
  | 'settings.security.warning_desc'
  | 'settings.security.enable_auth'
  | 'settings.toast.password_required'
  | 'settings.toast.password_mismatch'
  | 'settings.toast.password_length'
  | 'settings.toast.password_changed'
  | 'settings.toast.password_failed'
  | 'settings.toast.disable_2fa_confirm'
  | 'settings.toast.2fa_disabled'
  | 'settings.toast.2fa_enabled'
  | 'settings.toast.device_logout'
  | 'settings.toast.logout_all_confirm'
  | 'settings.toast.logout_all_success'
  | 'settings.toast.codes_copied'
  
  // 计费设置
  | 'settings.billing.word_package_balance'
  | 'settings.billing.remaining_words'
  | 'settings.billing.buy_word_package'
  | 'settings.billing.order_history'
  | 'settings.billing.order_time'
  | 'settings.billing.type'
  | 'settings.billing.title'
  | 'settings.billing.amount'
  | 'settings.billing.status'
  | 'settings.billing.actions'
  | 'settings.billing.basic_unlock'
  | 'settings.billing.additional_service'
  | 'settings.billing.details'
  | 'settings.billing.invoice'
  | 'settings.billing.invoice_management'
  | 'settings.billing.request_invoice'
  | 'settings.billing.download_pdf'
  | 'settings.billing.status_paid'
  | 'settings.billing.status_refunded'
  | 'settings.billing.status_failed'
  | 'settings.billing.invoice_status_issued'
  | 'settings.billing.invoice_status_pending'
  | 'settings.billing.dialog_title'
  | 'settings.billing.dialog_description'
  | 'settings.billing.basic_package'
  | 'settings.billing.standard_package'
  | 'settings.billing.professional_package'
  | 'settings.billing.words_unit'
  | 'settings.billing.save_amount'
  | 'settings.billing.package_desc'
  | 'settings.billing.buy_now'
  | 'settings.billing.toast_view_order'
  | 'settings.billing.toast_download_invoice'
  | 'settings.billing.toast_invoice_not_ready'
  | 'settings.billing.toast_invoice_request_sent'
  | 'settings.billing.toast_package_dev'

  // 数据隐私设置
  | 'settings.data_privacy.export.title'
  | 'settings.data_privacy.export.description'
  | 'settings.data_privacy.export.content_label'
  | 'settings.data_privacy.export.content.documents'
  | 'settings.data_privacy.export.content.documents_desc'
  | 'settings.data_privacy.export.content.citations'
  | 'settings.data_privacy.export.content.citations_desc'
  | 'settings.data_privacy.export.content.audit_logs'
  | 'settings.data_privacy.export.content.audit_logs_desc'
  | 'settings.data_privacy.export.content.orders'
  | 'settings.data_privacy.export.content.orders_desc'
  | 'settings.data_privacy.export.content.settings'
  | 'settings.data_privacy.export.content.settings_desc'
  | 'settings.data_privacy.export.button_idle'
  | 'settings.data_privacy.export.button_loading'
  | 'settings.data_privacy.clear_drafts.title'
  | 'settings.data_privacy.clear_drafts.description'
  | 'settings.data_privacy.clear_drafts.warning'
  | 'settings.data_privacy.clear_drafts.button'
  | 'settings.data_privacy.danger_zone.title'
  | 'settings.data_privacy.danger_zone.close_account.title'
  | 'settings.data_privacy.danger_zone.close_account.description'
  | 'settings.data_privacy.danger_zone.close_account.consequences.title'
  | 'settings.data_privacy.danger_zone.close_account.consequences.docs_deleted'
  | 'settings.data_privacy.danger_zone.close_account.consequences.no_recovery'
  | 'settings.data_privacy.danger_zone.close_account.consequences.subscription_cancel'
  | 'settings.data_privacy.danger_zone.close_account.consequences.email_blocked'
  | 'settings.data_privacy.danger_zone.close_account.button'
  | 'settings.data_privacy.dialog.clear_drafts.title'
  | 'settings.data_privacy.dialog.clear_drafts.description'
  | 'settings.data_privacy.dialog.clear_drafts.warning'
  | 'settings.data_privacy.dialog.clear_drafts.button_idle'
  | 'settings.data_privacy.dialog.clear_drafts.button_loading'
  | 'settings.data_privacy.dialog.close_account.title'
  | 'settings.data_privacy.dialog.close_account.description'
  | 'settings.data_privacy.dialog.close_account.warning'
  | 'settings.data_privacy.dialog.close_account.email_label'
  | 'settings.data_privacy.dialog.close_account.button'
  | 'settings.data_privacy.toast.export_start'
  | 'settings.data_privacy.toast.export_failed'
  | 'settings.data_privacy.toast.drafts_cleared'
  | 'settings.data_privacy.toast.clear_failed'
  | 'settings.data_privacy.toast.email_incorrect'
  | 'settings.data_privacy.toast.account_close_submitted'
  | 'settings.data_privacy.toast.account_close_failed'
  
  // Agent 相关
  | 'agent.status.idle'
  | 'agent.status.planning'
  | 'agent.status.preview'
  | 'agent.status.applying'
  | 'agent.status.success'
  | 'agent.status.error'
  | 'agent.status.partial'
  | 'agent.tabs.command'
  | 'agent.tabs.audit'
  | 'agent.buttons.reset'
  | 'agent.buttons.apply'
  | 'agent.buttons.save_recipe'
  | 'agent.buttons.undo'
  | 'agent.messages.description'
  | 'agent.messages.error_title'
  | 'agent.messages.applying'
  | 'agent.messages.progress_percent'
  | 'agent.plan.title'
  | 'agent.plan.steps_count'
  | 'agent.plan.estimated_time'
  | 'agent.plan.warnings_title'
  | 'agent.plan.dependencies_title'
  | 'agent.plan.dependencies_message'
  | 'agent.diff.title'
  | 'agent.success.message'
  | 'agent.toast.command_failed'
  | 'agent.toast.success_with_time'
  | 'agent.toast.partial_success'
  | 'agent.toast.undo_success'
  | 'agent.toast.undo_failed'
  | 'agent.toast.recipe_saved'
  | 'agent.toast.recipe_save_failed'
  | 'agent.prompt.recipe_name'
  | 'agent.recipe.description_template'
  
  // Agent Panel additional keys
  | 'agent.command.title'
  | 'agent.command.subtitle'
  | 'agent.command.placeholder'
  | 'agent.command.execution_failed'
  | 'agent.command.execution_progress'
  | 'agent.command.processing'
  | 'agent.command.cancelled'
  | 'agent.scope.document'
  | 'agent.scope.chapter'
  | 'agent.scope.section'
  | 'agent.scope.selection'
  | 'agent.scope.label'
  | 'agent.input.examples.title'
  | 'agent.input.examples.structural'
  | 'agent.input.examples.format'
  | 'agent.input.examples.content'
  | 'agent.input.shortcut.execute'
  | 'agent.input.shortcut.focus'
  | 'agent.input.shortcut.examples'
  | 'agent.input.supported_features'
  | 'agent.input.executing'
  | 'agent.input.execute_command'
  | 'agent.input.common_templates'
  
  // Data privacy settings keys
  | 'settings.data_privacy.export_title'
  | 'settings.data_privacy.export_desc'
  | 'settings.data_privacy.export_content'
  | 'settings.data_privacy.export_start'
  | 'settings.data_privacy.exporting'
  | 'settings.data_privacy.export_items.all_content'
  | 'settings.data_privacy.export_items.all_content_desc'
  | 'settings.data_privacy.export_items.citations'
  | 'settings.data_privacy.export_items.citations_desc'
  | 'settings.data_privacy.export_items.audit_logs'
  | 'settings.data_privacy.export_items.audit_logs_desc'
  | 'settings.data_privacy.export_items.orders'
  | 'settings.data_privacy.export_items.orders_desc'
  | 'settings.data_privacy.export_items.settings'
  | 'settings.data_privacy.export_items.settings_desc'
  | 'settings.data_privacy.clear_drafts_title'
  | 'settings.data_privacy.clear_drafts_desc'
  | 'settings.data_privacy.clear_drafts_warning'
  | 'settings.data_privacy.clear_drafts_action'
  | 'settings.data_privacy.danger_zone'
  | 'settings.data_privacy.close_account'
  | 'settings.data_privacy.close_account_desc'
  | 'settings.data_privacy.close_account_warning_title'
  | 'settings.data_privacy.close_account_consequences.all_deleted'
  | 'settings.data_privacy.close_account_consequences.no_recovery'
  | 'settings.data_privacy.close_account_consequences.subscription_cancelled'
  | 'settings.data_privacy.close_account_consequences.no_reregister'
  | 'settings.data_privacy.confirm_clear_title'
  | 'settings.data_privacy.confirm_clear_desc'
  | 'settings.data_privacy.confirm_clear_warning'
  | 'settings.data_privacy.clearing'
  | 'settings.data_privacy.confirm_close_title'
  | 'settings.data_privacy.confirm_close_desc'
  | 'settings.data_privacy.confirm_close_warning'
  | 'settings.data_privacy.confirm_email_label'
  | 'settings.data_privacy.confirm_close_account'
  | 'settings.data_privacy.toast.export_start'
  | 'settings.data_privacy.toast.export_failed'
  | 'settings.data_privacy.toast.drafts_cleared'
  | 'settings.data_privacy.toast.clear_failed'
  | 'settings.data_privacy.toast.email_incorrect'
  | 'settings.data_privacy.toast.account_close_submitted'
  | 'settings.data_privacy.toast.account_close_failed'
  
  // 用户档案头部
  | 'profile.header.email_verified'
  | 'profile.header.email_not_verified'
  | 'profile.header.last_login'
  | 'profile.header.edit_profile'
  | 'profile.header.manage_security'
  | 'profile.header.billing_invoices'
  | 'profile.header.download_data'
  
  // 最近活动
  | 'profile.activity.title'
  | 'profile.activity.time.days_ago'
  | 'profile.activity.time.hours_ago'
  | 'profile.activity.time.minutes_ago'
  | 'profile.activity.time.just_now'
  
  // 用户档案统计
  | 'profile.stats.total_words'
  | 'profile.stats.citation_pass_rate'
  | 'profile.stats.export_count'
  | 'profile.stats.wan_suffix'
  
  // 个人资料 - 快速队列
  | 'profile.quick_queues.gate1.title'
  | 'profile.quick_queues.gate1.empty'
  | 'profile.quick_queues.gate1.unlock_button'
  | 'profile.quick_queues.gate1.preview_button'
  | 'profile.quick_queues.gate2.title'
  | 'profile.quick_queues.gate2.empty'
  | 'profile.quick_queues.gate2.purchase_button'
  | 'profile.quick_queues.word_count'
  | 'profile.quick_queues.citation_count'
  | 'profile.quick_queues.addon.plagiarism'
  | 'profile.quick_queues.addon.ai_check'
  | 'profile.quick_queues.addon.evidence_pack'
  | 'profile.quick_queues.addon.latex'
  | 'profile.quick_queues.addon.defense_card'
  | 'profile.quick_queues.addon.share_link'
  | 'profile.quick_queues.toast.unlock_prepare'
  | 'profile.quick_queues.toast.preview_open'
  | 'profile.quick_queues.toast.addon_purchase_prepare'
  | 'profile.quick_queues.toast.price_expired';

interface Translation {
  zh: string;
  en: string;
}

export const translations: Record<TranslationKey, Translation> = {
  // 通用
  'common.save': { zh: '保存', en: 'Save' },
  'common.cancel': { zh: '取消', en: 'Cancel' },
  'common.submit': { zh: '提交', en: 'Submit' },
  'common.delete': { zh: '删除', en: 'Delete' },
  'common.edit': { zh: '编辑', en: 'Edit' },
  'common.close': { zh: '关闭', en: 'Close' },
  'common.back': { zh: '返回', en: 'Back' },
  'common.next': { zh: '下一步', en: 'Next' },
  'common.confirm': { zh: '确认', en: 'Confirm' },
  'common.loading': { zh: '加载中...', en: 'Loading...' },
  'common.error': { zh: '错误', en: 'Error' },
  'common.success': { zh: '成功', en: 'Success' },
  
  // 导航
  'nav.pricing': { zh: '价格', en: 'Pricing' },
  'nav.about': { zh: '关于', en: 'About' },
  'nav.cases': { zh: '实际案例', en: 'Cases' },
  'nav.blog': { zh: '博客', en: 'Blog' },
  'nav.login': { zh: '登录', en: 'Login' },
  'nav.signup': { zh: '注册', en: 'Sign Up' },
  'nav.dashboard': { zh: '工作台', en: 'Dashboard' },
  'nav.profile': { zh: '个人资料', en: 'Profile' },
  'nav.settings': { zh: '设置', en: 'Settings' },
  'nav.logout': { zh: '退出登录', en: 'Logout' },
  
  // 导航栏无障碍
  'navbar.skipToMain': { zh: '跳到主内容', en: 'Skip to main content' },
  'navbar.logoAriaLabel': { zh: 'EssayPass 首页', en: 'EssayPass home' },
  'navbar.openMenu': { zh: '打开菜单', en: 'Open menu' },

  // 应用级别
  'app.loading': { zh: '加载中...', en: 'Loading...' },
  'app.error.generic': { zh: '发生了未知错误，请稍后重试', en: 'An unknown error occurred, please try again later' },
  'app.error.network': { zh: '网络连接失败，请检查网络设置', en: 'Network connection failed, please check your network settings' },
  'app.error.auth_required': { zh: '需要登录后访问此页面', en: 'Login required to access this page' },
  'app.error.route_not_found': { zh: '页面未找到', en: 'Page not found' },
  'app.notification.success': { zh: '操作成功', en: 'Operation successful' },
  'app.notification.error': { zh: '操作失败', en: 'Operation failed' },
  'app.notification.info': { zh: '信息提示', en: 'Information' },
  'app.status.initializing': { zh: '应用初始化中...', en: 'Initializing application...' },
  'app.status.ready': { zh: '应用已就绪', en: 'Application ready' },
  'app.status.offline': { zh: '离线模式', en: 'Offline mode' },
  
  // 首页/落地页
  'landing.hero.title': { zh: 'AI学术写作助手', en: 'AI Academic Writing Assistant' },
  'landing.hero.subtitle': { zh: '智能引用核验，专业文档生成', en: 'Smart Citation Verification, Professional Document Generation' },
  'landing.cta.start': { zh: '开始写作', en: 'Start Writing' },
  'landing.cta.trial': { zh: '无风险体验', en: 'Try Risk-Free' },
  'landing.cta.learn_more': { zh: '了解更多', en: 'Learn More' },
  
  // 写作流程
  'flow.topic.title': { zh: '选题设置', en: 'Topic Setup' },
  'flow.research.title': { zh: '文献研究', en: 'Research' },
  'flow.strategy.title': { zh: '写作策略', en: 'Strategy' },
  'flow.outline.title': { zh: '大纲规划', en: 'Outline' },
  'flow.writing.title': { zh: '内容生成', en: 'Writing' },
  
  // Topic Step 页面
  'topic.page_description': { zh: '设置论文主题与基本要求', en: 'Set paper topic and basic requirements' },
  'topic.cards.basic_info': { zh: '基本信息', en: 'Basic Information' },
  'topic.cards.academic_requirements': { zh: '学术要求', en: 'Academic Requirements' },
  'topic.cards.style_reference': { zh: '写作风格参考', en: 'Writing Style Reference' },
  'topic.cards.additional_requirements': { zh: '附加要求', en: 'Additional Requirements' },
  
  // Topic Step 表单字段
  'topic.form.title.label': { zh: '论文主题', en: 'Paper Topic' },
  'topic.form.title.placeholder': { zh: '请输入论文题目/主题', en: 'Please enter paper title/topic' },
  'topic.form.title.validation.min': { zh: '主题至少需要2个字符', en: 'Topic must be at least 2 characters' },
  'topic.form.title.validation.max': { zh: '主题不能超过120个字符', en: 'Topic cannot exceed 120 characters' },
  'topic.form.type.label': { zh: '作业类型', en: 'Assignment Type' },
  'topic.form.type.placeholder': { zh: '请选择作业类型', en: 'Please select assignment type' },
  'topic.form.type.required': { zh: '请选择作业类型', en: 'Please select assignment type' },
  'topic.form.words.label': { zh: '字数要求', en: 'Word Count' },
  'topic.form.words.placeholder': { zh: '2000', en: '2000' },
  'topic.form.words.unit': { zh: '字', en: 'words' },
  'topic.form.words.validation.min': { zh: '字数不能少于300', en: 'Word count cannot be less than 300' },
  'topic.form.words.validation.max': { zh: '字数不能超过20000', en: 'Word count cannot exceed 20000' },
  'topic.form.format.label': { zh: '引用格式', en: 'Citation Format' },
  'topic.form.format.placeholder': { zh: '请选择引用格式', en: 'Please select citation format' },
  'topic.form.format.required': { zh: '请选择引用格式', en: 'Please select citation format' },
  'topic.form.level.label': { zh: '语言水平', en: 'Language Level' },
  'topic.form.level.placeholder': { zh: '请选择语言水平', en: 'Please select language level' },
  'topic.form.level.required': { zh: '请选择语言水平', en: 'Please select language level' },
  'topic.form.resources.label': { zh: '允许的资源类型', en: 'Allowed Resource Types' },
  'topic.form.resources.required': { zh: '请至少选择一种资源类型', en: 'Please select at least one resource type' },
  'topic.form.requirements.label': { zh: '额外要求', en: 'Additional Requirements' },
  'topic.form.requirements.placeholder': { zh: '任何额外偏好、禁用点、引用数量、段落结构等', en: 'Any additional preferences, restrictions, citation counts, paragraph structure, etc.' },
  'topic.form.requirements.max': { zh: '额外要求不能超过2000字符', en: 'Additional requirements cannot exceed 2000 characters' },
  'topic.form.requirements.counter': { zh: '最多2000字', en: 'Maximum 2000 characters' },
  
  // Topic Step 文件上传
  'topic.form.files.title': { zh: '写作风格参考', en: 'Writing Style Reference' },
  'topic.form.files.description': { zh: '上传示例文本，生成风格更贴近你的偏好。', en: 'Upload sample texts to generate content that better matches your preferences.' },
  'topic.form.files.drag_drop': { zh: '拖拽文件到这里，或点击选择文件', en: 'Drag files here, or click to select files' },
  'topic.form.files.choose': { zh: '选择文件', en: 'Choose Files' },
  'topic.form.files.supported': { zh: '支持 TXT、DOC、DOCX、PDF 格式，单个文件不超过 10MB，最多 5 个文件', en: 'Support TXT, DOC, DOCX, PDF formats, single file under 10MB, maximum 5 files' },
  'topic.form.files.error.format': { zh: '文件格式不支持', en: 'File format not supported' },
  'topic.form.files.error.size': { zh: '文件过大', en: 'File too large' },
  'topic.form.files.error.count': { zh: '文件数量超限', en: 'Too many files' },
  'topic.form.files.max': { zh: '最多上传 5 个文件', en: 'Maximum 5 files' },
  
  // Topic Step 选项
  'topic.options.assignment.paper': { zh: '论文', en: 'Paper' },
  'topic.options.assignment.report': { zh: '报告', en: 'Report' },
  'topic.options.assignment.review': { zh: '评论', en: 'Review' },
  'topic.options.assignment.commentary': { zh: '综述', en: 'Commentary' },
  'topic.options.level.undergraduate': { zh: '本科', en: 'Undergraduate' },
  'topic.options.level.graduate': { zh: '研究生', en: 'Graduate' },
  'topic.options.level.esl': { zh: '非母语', en: 'ESL' },
  'topic.options.level.professional': { zh: '专业级', en: 'Professional' },
  'topic.options.resources.paper': { zh: '学术论文', en: 'Academic Papers' },
  'topic.options.resources.book': { zh: '书籍', en: 'Books' },
  'topic.options.resources.web': { zh: '网站', en: 'Websites' },
  'topic.options.resources.dataset': { zh: '数据集', en: 'Datasets' },
  'topic.options.resources.other': { zh: '其他', en: 'Other' },
  
  // Topic Step 操作
  'topic.actions.save_draft': { zh: '保存草稿', en: 'Save Draft' },
  'topic.actions.next_step': { zh: '下一步', en: 'Next Step' },
  'topic.validation.success': { zh: '主题设置完成', en: 'Topic setup completed' },
  
  // Topic Step 通知消息
  'topic.toast.draft_saved': { zh: '草稿已保存', en: 'Draft saved' },
  'topic.toast.draft_saved_desc': { zh: '您的设置已保存', en: 'Your settings have been saved' },
  'topic.toast.save_failed': { zh: '保存失败', en: 'Save failed' },
  'topic.toast.save_failed_desc': { zh: '请稍后重试', en: 'Please try again later' },
  'topic.toast.feature_developing': { zh: '功能开发中', en: 'Feature under development' },
  'topic.toast.feature_developing_desc': { zh: '样例预览功能即将上线', en: 'Sample preview feature coming soon' },
  'topic.toast.success_desc': { zh: '已保存您的设置，正在进入研究阶段...', en: 'Settings saved, entering research phase...' },
  'topic.toast.error_title': { zh: '错误', en: 'Error' },
  'topic.toast.lock_price_failed': { zh: '价格锁定失败，请重试', en: 'Price lock failed, please try again' },
  'topic.toast.payment_success': { zh: '支付成功', en: 'Payment successful' },
  'topic.toast.payment_success_desc': { zh: '正在启动自动推进流程...', en: 'Starting autopilot process...' },
  'topic.toast.payment_failed': { zh: '支付失败', en: 'Payment failed' },
  'topic.toast.payment_failed_desc': { zh: '请稍后重试', en: 'Please try again later' },
  'topic.toast.preview_mode': { zh: '预览模式', en: 'Preview mode' },
  'topic.toast.preview_mode_desc': { zh: '您可以继续浏览，稍后再解锁完整功能', en: 'You can continue browsing and unlock full features later' },
  'topic.toast.autopilot_failed': { zh: '自动推进失败', en: 'Autopilot failed' },
  'topic.toast.verification_updated': { zh: '核验等级已更新为', en: 'Verification level updated to' },
  'topic.toast.verification_rate': { zh: '引用核验率：', en: 'Citation verification rate: ' },
  'topic.toast.retry_title': { zh: '重试', en: 'Retry' },
  'topic.toast.retry_desc': { zh: '请重新尝试操作', en: 'Please try the operation again' },
  
  // Gate1 Modal 内容
  'topic.gate1.benefit1': { zh: '一次完整生成', en: 'Complete generation' },
  'topic.gate1.benefit2': { zh: '2 次局部重写', en: '2 partial rewrites' },
  'topic.gate1.benefit3': { zh: '全量引用核验', en: 'Full citation verification' },
  
  // OutcomePanel 右侧面板
  'outcome.verification_level': { zh: '核验等级', en: 'Verification Level' },
  'outcome.price_locked': { zh: '锁定价', en: 'Locked Price' },
  'outcome.eta': { zh: '预计时长', en: 'Estimated Time' },
  'outcome.instant_writing': { zh: '立即写作', en: 'Start Writing' },
  'outcome.preview_sample': { zh: '预览样例片段', en: 'Preview Sample' },
  'outcome.unlock_after_payment': { zh: '付费解锁后自动完成后续步骤并进入结果页', en: 'Complete automatically after payment and go to results' },
  
  // 写作流程表单
  'form.paper': { zh: '论文', en: 'Paper' },
  'form.report': { zh: '报告', en: 'Report' },
  'form.review': { zh: '综述', en: 'Review' },
  'form.commentary': { zh: '评论', en: 'Commentary' },
  'form.upload_style_samples': { zh: '上传风格样本', en: 'Upload Style Samples' },
  'form.drag_drop_files': { zh: '拖拽文件到此区域，或', en: 'Drag files here, or' },
  'form.browse_files': { zh: '浏览文件', en: 'browse files' },
  
  // 表单
  'form.title': { zh: '标题', en: 'Title' },
  'form.assignment_type': { zh: '作业类型', en: 'Assignment Type' },
  'form.word_count': { zh: '字数要求', en: 'Word Count' },
  'form.format': { zh: '格式要求', en: 'Format' },
  'form.level': { zh: '学术水平', en: 'Academic Level' },
  'form.resources': { zh: '资源类型', en: 'Resource Types' },
  'form.notes': { zh: '备注说明', en: 'Notes' },
  
  // 结果页面
  'result.title': { zh: '生成结果', en: 'Generated Result' },
  'result.export': { zh: '导出文档', en: 'Export Document' },
  'result.download': { zh: '下载', en: 'Download' },
  'result.share': { zh: '分享', en: 'Share' },
  'result.header.title': { zh: '结果与交付', en: 'Results & Delivery' },
  'result.header.description': { zh: '查看和管理您的论文生成结果', en: 'View and manage your paper generation results' },
  'result.meta.title': { zh: '结果与交付 - 学术论文助手', en: 'Results & Delivery - Academic Paper Assistant' },
  'result.meta.description': { zh: '查看您的写作流程交付结果和完整文档', en: 'View your writing process deliverables and complete documents' },
  'result.status.generating': { zh: '生成中', en: 'Generating' },
  'result.status.ready': { zh: '已完成', en: 'Ready' },
  'result.status.preview': { zh: '预览模式', en: 'Preview Mode' },
  'result.status.completed': { zh: '已交付', en: 'Delivered' },
  'result.document.title': { zh: '文档', en: 'Document' },
  'result.document.subtitle': { zh: '论文生成结果', en: 'Paper Generation Results' },
  'result.document.status': { zh: '文档状态', en: 'Document Status' },
  'result.document.id': { zh: '文档ID', en: 'Document ID' },
  
  // 设置页面
  'settings.account': { zh: '账户设置', en: 'Account Settings' },
  'settings.preferences': { zh: '偏好设置', en: 'Preferences' },
  'settings.billing': { zh: '计费设置', en: 'Billing' },
  'settings.security': { zh: '安全设置', en: 'Security' },
  'settings.notifications': { zh: '通知设置', en: 'Notifications' },
  'settings.integrations': { zh: '集成设置', en: 'Integrations' },
  'settings.integrations.title': { zh: '第三方集成', en: 'Third-party Integrations' },
  'settings.integrations.description': { zh: '连接第三方服务以增强您的写作体验。我们正在不断添加新的集成选项。', en: 'Connect third-party services to enhance your writing experience. We are continuously adding new integration options.' },
  'settings.integrations.cloud_sync': { zh: '云盘同步', en: 'Cloud Sync' },
  'settings.integrations.cloud_sync_desc': { zh: '将您的文档自动同步到云端存储服务', en: 'Automatically sync your documents to cloud storage services' },
  'settings.integrations.status.connected': { zh: '已连接', en: 'Connected' },
  'settings.integrations.status.not_connected': { zh: '未连接', en: 'Not Connected' },
  'settings.integrations.status.error': { zh: '连接错误', en: 'Connection Error' },
  'settings.integrations.coming_soon': { zh: '即将推出', en: 'Coming Soon' },
  'settings.integrations.supports': { zh: '支持：', en: 'Supports:' },
  'settings.integrations.connect': { zh: '连接', en: 'Connect' },
  'settings.integrations.settings': { zh: '设置', en: 'Settings' },
  'settings.integrations.disconnect': { zh: '断开', en: 'Disconnect' },
  'settings.integrations.more_coming': { zh: '更多集成即将推出', en: 'More Integrations Coming Soon' },
  'settings.integrations.more_coming_desc': { zh: '我们正在开发更多第三方服务集成，包括文献管理工具、写作助手等', en: 'We are developing more third-party service integrations, including literature management tools, writing assistants, and more' },
  'settings.integrations.cloud_dev_toast': { zh: '云盘集成功能正在开发中，敬请期待', en: 'Cloud integration feature is under development, please stay tuned' },
  'settings.data_privacy': { zh: '数据隐私', en: 'Data Privacy' },

  // 偏好设置
  'preferences.default_settings': { zh: '默认设置', en: 'Default Settings' },
  'preferences.default_citation_format': { zh: '默认引用格式', en: 'Default Citation Format' },
  'preferences.default_language_level': { zh: '默认语言水平', en: 'Default Language Level' },
  'preferences.default_verification_level': { zh: '默认核验等级', en: 'Default Verification Level' },
  'preferences.editor_settings': { zh: '编辑器设置', en: 'Editor Settings' },
  'preferences.auto_save': { zh: '自动保存', en: 'Auto Save' },
  'preferences.auto_save_desc': { zh: '自动保存您的编辑内容', en: 'Automatically save your edits' },
  'preferences.enable_shortcuts': { zh: '启用快捷键', en: 'Enable Shortcuts' },
  'preferences.shortcuts_desc': { zh: '/ 搜索、N 新建、U 上传、A 一键完成', en: '/ Search, N New, U Upload, A Auto-complete' },
  'preferences.document_width_note_title': { zh: '结果页文档宽度', en: 'Result Page Document Width' },
  'preferences.document_width_note_desc': { zh: '文档显示宽度固定为 760px，以确保最佳阅读体验。此设置不可更改。', en: 'Document display width is fixed at 760px for optimal reading experience. This setting cannot be changed.' },
  'preferences.evidence_pack_settings': { zh: '证据包默认包含项', en: 'Evidence Package Default Items' },
  'preferences.citation_list': { zh: '引用清单', en: 'Citation List' },
  'preferences.citation_list_desc': { zh: '导出完整的引用来源清单', en: 'Export complete citation source list' },
  'preferences.timeline': { zh: '操作时间线', en: 'Action Timeline' },
  'preferences.timeline_desc': { zh: '包含详细的操作审计记录', en: 'Include detailed action audit records' },
  'preferences.defense_card': { zh: '口头核验卡', en: 'Oral Verification Card' },
  'preferences.defense_card_desc': { zh: '生成面谈答辩要点总结', en: 'Generate interview defense key points summary' },
  'preferences.save_preferences': { zh: '保存偏好设置', en: 'Save Preferences' },
  'preferences.saving': { zh: '保存中...', en: 'Saving...' },
  'preferences.saved_success': { zh: '偏好设置已保存', en: 'Preferences saved successfully' },
  'preferences.save_failed': { zh: '保存失败，请重试', en: 'Save failed, please try again' },

  // 引用格式
  'citation.format.apa': { zh: 'APA (American Psychological Association)', en: 'APA (American Psychological Association)' },
  'citation.format.mla': { zh: 'MLA (Modern Language Association)', en: 'MLA (Modern Language Association)' },
  'citation.format.chicago': { zh: 'Chicago/Turabian', en: 'Chicago/Turabian' },
  'citation.format.ieee': { zh: 'IEEE (Institute of Electrical and Electronics Engineers)', en: 'IEEE (Institute of Electrical and Electronics Engineers)' },
  'citation.format.gb_t_7714': { zh: 'GB/T 7714 (中国国家标准)', en: 'GB/T 7714 (Chinese National Standard)' },

  // 语言水平
  'language_level.undergraduate': { zh: '本科 (Undergraduate)', en: 'Undergraduate' },
  'language_level.graduate': { zh: '研究生 (Graduate)', en: 'Graduate' },
  'language_level.esl': { zh: 'ESL (English as Second Language)', en: 'ESL (English as Second Language)' },
  'language_level.professional': { zh: '专业 (Professional)', en: 'Professional' },

  // 核验等级
  'verification.basic': { zh: '基础', en: 'Basic' },
  'verification.basic_desc': { zh: '基本引用检查', en: 'Basic citation checking' },
  'verification.standard': { zh: '标准', en: 'Standard' },
  'verification.standard_desc': { zh: '全面引用核验', en: 'Comprehensive citation verification' },
  'verification.pro': { zh: '专业', en: 'Pro' },
  'verification.pro_desc': { zh: '深度学术验证', en: 'Deep academic verification' },
  
  // 通知设置
  'notifications.in_app.title': { zh: '站内通知', en: 'In-App Notifications' },
  'notifications.email.title': { zh: '邮件通知', en: 'Email Notifications' },
  'notifications.frequency.label': { zh: '通知频率', en: 'Notification Frequency' },
  'notifications.frequency.immediate': { zh: '即时通知', en: 'Immediate' },
  'notifications.frequency.daily': { zh: '每日汇总', en: 'Daily Summary' },
  'notifications.frequency.off': { zh: '关闭', en: 'Off' },
  'notifications.frequency.description': { zh: '选择 "每日汇总" 将在每天固定时间发送一封邮件汇总', en: 'Select "Daily Summary" to receive a consolidated email at a fixed time each day' },
  'notifications.email_types.label': { zh: '邮件通知类型', en: 'Email Notification Types' },
  'notifications.type.generation_complete.title': { zh: '生成完成', en: 'Generation Complete' },
  'notifications.type.generation_complete.description': { zh: '文档生成完成时通知', en: 'Notify when document generation is complete' },
  'notifications.type.export_complete.title': { zh: '导出完成', en: 'Export Complete' },
  'notifications.type.export_complete.description': { zh: '文档导出完成时通知', en: 'Notify when document export is complete' },
  'notifications.type.order_status.title': { zh: '订单状态', en: 'Order Status' },
  'notifications.type.order_status.description': { zh: '订单状态变更时通知', en: 'Notify when order status changes' },
  'notifications.type.system_announcement.title': { zh: '系统公告', en: 'System Announcements' },
  'notifications.type.system_announcement.description': { zh: '重要系统更新和公告', en: 'Important system updates and announcements' },
  'notifications.save.button': { zh: '保存通知设置', en: 'Save Notification Settings' },
  'notifications.save.loading': { zh: '保存中...', en: 'Saving...' },
  'notifications.save.success': { zh: '通知设置已保存', en: 'Notification settings saved' },
  'notifications.save.error': { zh: '保存失败，请重试', en: 'Save failed, please try again' },
  
  // SEO页面
  'seo.title': { zh: '真引用，像你写，留痕可证 - 可校验学术写作工具', en: 'Real Citations, Your Style, Provable Process - Verifiable Academic Writing Tool' },
  'seo.description': { zh: 'DOI/ISBN实时校验，个人文风基线对齐，全流程留痕证据包。避免AI误判与假引用翻车，支持APA/MLA/GB/T格式，提交更稳。', en: 'Real-time DOI/ISBN verification, personal writing style alignment, full process evidence package. Avoid AI misjudgment and fake citation issues, supports APA/MLA/GB/T formats.' },
  'seo.keywords': { zh: '学术写作, AI检测, 引用校验, DOI验证, 文风分析, 学术诚信, 写作证明', en: 'academic writing, AI detection, citation verification, DOI validation, writing style analysis, academic integrity, writing proof' },
  'seo.og_title': { zh: '真引用，像你写，留痕可证 - 可校验学术写作工具', en: 'Real Citations, Your Style, Provable Process - Verifiable Academic Writing Tool' },
  'seo.og_description': { zh: 'DOI/ISBN实时校验，个人文风基线对齐，全流程留痕证据包。避免AI误判与假引用翻车，支持APA/MLA/GB/T格式，提交更稳。', en: 'Real-time DOI/ISBN verification, personal writing style alignment, full process evidence package. Avoid AI misjudgment and fake citation issues, supports APA/MLA/GB/T formats.' },
  
  // 首屏 Hero
  'hero.main_title': { zh: '真引用，像你写，留痕可证', en: 'Real Citations, Your Style, Provable Process' },
  'hero.subtitle': { zh: '引用核验、个人文风对齐、全流程留痕，配合二次 AI Agent 编辑，提交更稳。', en: 'Citation verification, personal style alignment, full process tracking, with secondary AI Agent editing for confident submission.' },
  'hero.cta_trial': { zh: '无风险体验', en: 'Try Risk-Free' },
  'hero.cta_download': { zh: '下载全套示例', en: 'Download Full Examples' },
  'hero.selling_points': { zh: '真实文献引用 · 个人文风基线 · 证据包可导出 · AI agent文稿编辑', en: 'Real literature citations · Personal style baseline · Exportable evidence package · AI agent manuscript editing' },
  'hero.disclaimer': { zh: '不承诺"过检"。我们提供可校验的证据与整改建议。', en: 'No "pass guarantee". We provide verifiable evidence and improvement suggestions.' },
  
  // 痛点分析
  'painpoints.section_title': { zh: '为什么"能写出来"不等于"敢提交"', en: 'Why "Being Able to Write" Doesn\'t Equal "Daring to Submit"' },
  'painpoints.fake_citations.title': { zh: '假引文/过时结论，抽查即暴露', en: 'Fake citations/outdated conclusions exposed upon spot checks' },
  'painpoints.fake_citations.desc': { zh: 'DOI 失效、期刊信息错误，面谈时无法自圆其说', en: 'Invalid DOIs, incorrect journal info, unable to justify during interviews' },
  'painpoints.style_change.title': { zh: '文风突变像"机器腔"，与过往作品断层', en: 'Sudden style change sounds "robotic", disconnected from past work' },
  'painpoints.style_change.desc': { zh: '句式突变、词汇跃升，容易被怀疑非本人作品', en: 'Sudden sentence pattern and vocabulary changes easily suspected as non-original' },
  'painpoints.ai_detection.title': { zh: '检测工具存在误伤，非母语更易中招', en: 'Detection tools cause false positives, non-native speakers more vulnerable' },
  'painpoints.ai_detection.desc': { zh: 'AI检测工具无法区分"润色"与"生成"', en: 'AI detection tools cannot distinguish "polishing" from "generation"' },
  'painpoints.interview_questions.title': { zh: '面谈要讲检索路径与改动理由，说不清就被追问', en: 'Interviews require explaining search paths and revision reasons, unclear answers lead to follow-up questions' },
  'painpoints.interview_questions.desc': { zh: '无法提供写作过程证据，缺乏口头核验准备', en: 'Cannot provide writing process evidence, lack preparation for oral verification' },
  'painpoints.formatting_work.title': { zh: '临近提交还要排版、插图、编号、格式统一，人工耗时', en: 'Near submission still need formatting, figures, numbering, format unification - time-consuming manual work' },
  'painpoints.formatting_work.desc': { zh: '排版工作量大，容易出错，影响提交进度', en: 'Heavy formatting workload, error-prone, affects submission schedule' },
  'painpoints.read_more': { zh: '阅读更多 →', en: 'Read More →' },
  'painpoints.alt_text': { zh: '痛点分析与解决方案对比图', en: 'Pain points analysis and solution comparison diagram' },
  
  // 功能概览
  'features.section_title': { zh: '一套闭环，从"生成"到"可证"', en: 'A Complete Loop, from "Generation" to "Provable"' },
  'features.real_citations.title': { zh: '真实引用', en: 'Real Citations' },
  'features.real_citations.desc': { zh: 'DOI/PMID/ISBN 实时核验，卷期页码一致性检查；APA/MLA/GB/T 一键规范，假引文标红并给替代建议。', en: 'Real-time DOI/PMID/ISBN verification, volume/issue/page consistency check; One-click APA/MLA/GB/T formatting, mark fake citations in red with alternative suggestions.' },
  'features.personal_style.title': { zh: '个人文风', en: 'Personal Style' },
  'features.personal_style.desc': { zh: '建立个人基线；句长/词汇复杂度/突发度可视化；非母语友好润色，保留自然错误率。', en: 'Establish personal baseline; visualize sentence length/lexical complexity/burstiness; Non-native speaker friendly polishing, preserving natural error rate.' },
  'features.full_trace.title': { zh: '全程留痕', en: 'Full Process Tracking' },
  'features.full_trace.desc': { zh: '写作时间线、段落 diff、来源快照一键打包证据包；附口头核验速答卡。', en: 'Writing timeline, paragraph diff, source snapshots packaged into evidence bundle; Includes oral verification quick answer cards.' },
  'features.ai_agent.title': { zh: '二次 AI Agent 编辑', en: 'Secondary AI Agent Editing' },
  'features.ai_agent.desc': { zh: '用自然语言完成结构化重写、格式排版、图表生成与交叉引用，保证来源与参数可追溯。', en: 'Use natural language for structured rewriting, format typesetting, chart generation and cross-references, ensuring traceable sources and parameters.' },
  
  // 功能详细 - 真实引用
  'detailed.real_citations.title': { zh: '真实引用与零幻觉校验', en: 'Real Citations and Zero Hallucination Verification' },
  'detailed.real_citations.point1': { zh: '写作时自动检索相关论文/书籍/权威网页，给出可引用候选。', en: 'Automatically search relevant papers/books/authoritative websites during writing, providing citable candidates.' },
  'detailed.real_citations.point2': { zh: '生成后，支持用 Cite 工具/Agent 一句话插入或替换引用。', en: 'After generation, support using Cite tool/Agent to insert or replace citations with one sentence.' },
  'detailed.real_citations.point3': { zh: '一键规范正文引注与参考文献（APA/MLA/GB/T）。', en: 'One-click standardization of in-text citations and references (APA/MLA/GB/T).' },
  'detailed.real_citations.point4': { zh: '找不到可靠来源时，明确提示未检得，不会硬凑。', en: 'When reliable sources cannot be found, clearly indicate not found, will not force citations.' },
  'detailed.real_citations.cta': { zh: '试跑 Cite 工具', en: 'Try Cite Tool' },
  'detailed.cite_panel.title': { zh: 'Cite 面板预览', en: 'Cite Panel Preview' },
  'detailed.cite_panel.example_title': { zh: 'Machine Learning in Academia', en: 'Machine Learning in Academia' },
  'detailed.cite_panel.example_year': { zh: '2021 · nature.com', en: '2021 · nature.com' },
  'detailed.cite_panel.insert_btn': { zh: '插入', en: 'Insert' },
  'detailed.cite_panel.replace_btn': { zh: '替换', en: 'Replace' },
  'detailed.cite_panel.success_msg': { zh: '已插入到第 3 段', en: 'Inserted to paragraph 3' },
  'detailed.cite_panel.format_btn': { zh: '一键规范', en: 'One-click Format' },
  
  // 功能详细 - 个人文风
  'detailed.style.title': { zh: '个人文风对齐（非母语友好）', en: 'Personal Style Alignment (Non-native Friendly)' },
  'detailed.style.point1': { zh: '你上传一篇历史作业，建立个人文风基线。', en: 'Upload one historical assignment to establish personal style baseline.' },
  'detailed.style.point2': { zh: '给出 0–100 的风格距离，并可视化句长/词汇复杂度/突发度。', en: 'Provide 0-100 style distance score, visualize sentence length/lexical complexity/burstiness.' },
  'detailed.style.point3': { zh: '润色强度可控，保留"自然错误率"，避免"AI 味"。', en: 'Controllable polish intensity, preserve "natural error rate", avoid "AI flavor".' },
  'detailed.style.cta': { zh: '上传历史样本', en: 'Upload Historical Sample' },
  'detailed.style.panel_title': { zh: 'Style Alignment (1 past essay)', en: 'Style Alignment (1 past essay)' },
  'detailed.style.from_score': { zh: '从 54', en: 'from 54' },
  'detailed.style.sentence_length': { zh: 'Sentence length', en: 'Sentence length' },
  'detailed.style.lexical_variety': { zh: 'Lexical variety', en: 'Lexical variety' },
  'detailed.style.burstiness': { zh: 'Burstiness', en: 'Burstiness' },
  'detailed.style.polish_strength': { zh: 'Polish strength:', en: 'Polish strength:' },
  'detailed.style.light': { zh: 'Light', en: 'Light' },
  'detailed.style.medium': { zh: 'Medium', en: 'Medium' },
  'detailed.style.strong': { zh: 'Strong', en: 'Strong' },
  'detailed.style.align_btn': { zh: 'Align to baseline', en: 'Align to baseline' },
  
  // 功能详细 - 写作过程
  'detailed.process.title': { zh: '可证据的写作过程：留痕 + 证据包 + 口头核验', en: 'Provable Writing Process: Tracking + Evidence Package + Oral Verification' },
  'detailed.process.point1': { zh: '轻量留痕：记录会话开始/结束时间、核心检索关键词、插入/替换的引用、主要Agent 指令、以及用户手动编辑次数。', en: 'Lightweight tracking: record session start/end times, core search keywords, inserted/replaced citations, main Agent commands, and user manual edit counts.' },
  'detailed.process.point2': { zh: '一键导出写作过程摘要（PDF 一页）与引用清单（CSV）；用于老师快速查看与面谈备份。', en: 'One-click export writing process summary (1-page PDF) and citation list (CSV); for quick teacher review and interview backup.' },
  'detailed.process.point3': { zh: '生成面谈速答卡（1 页 PDF）：来源、改动理由、结论依据。', en: 'Generate interview quick answer cards (1-page PDF): sources, revision reasons, conclusion basis.' },
  'detailed.process.point4': { zh: '可创建只读链接，设置有效期与可见范围。', en: 'Can create read-only links with expiration date and visibility scope.' },
  'detailed.process.cta': { zh: '下载示例证据包', en: 'Download Sample Evidence Package' },
  'detailed.process.panel_title': { zh: 'Timeline & Export', en: 'Timeline & Export' },
  'detailed.process.start_session': { zh: 'Start session', en: 'Start session' },
  'detailed.process.inserted_citations': { zh: 'Inserted 2 citations', en: 'Inserted 2 citations' },
  'detailed.process.agent_formatting': { zh: 'Agent formatting', en: 'Agent formatting' },
  'detailed.process.finished': { zh: 'Finished', en: 'Finished' },
  'detailed.process.writing_summary': { zh: 'writing-summary.pdf', en: 'writing-summary.pdf' },
  'detailed.process.sources_csv': { zh: 'sources.csv', en: 'sources.csv' },
  'detailed.process.viva_qa': { zh: 'viva-qa.pdf', en: 'viva-qa.pdf' },
  'detailed.process.export_btn': { zh: 'Export', en: 'Export' },
  
  // 功能详细 - AI Agent编辑
  'detailed.agent.title': { zh: '专业二次 AI Agent 审查编辑', en: 'Professional Secondary AI Agent Review & Editing' },
  'detailed.agent.point1': { zh: '结构化重写：按你给的提纲重排章节并生成变更说明。', en: 'Structured rewriting: rearrange sections according to your outline and generate change descriptions.' },
  'detailed.agent.point2': { zh: '格式排版：题注、脚注、交叉引用、目录自动更新；参考文献批量规范。', en: 'Format typesetting: captions, footnotes, cross-references, automatic table of contents update; batch reference formatting.' },
  'detailed.agent.point3': { zh: '插表插图：从段落/表格数据生成柱/折/散点图，图注写清来源；流程图按描述生成并自动编号。', en: 'Insert tables and figures: generate bar/line/scatter charts from paragraph/table data, figure captions clearly state sources; flowcharts generated from descriptions with automatic numbering.' },
  'detailed.agent.point4': { zh: '自然语言操控：一句话做复杂操作；常用步骤可保存为"配方"。', en: 'Natural language control: perform complex operations with one sentence; common steps can be saved as "recipes".' },
  'detailed.agent.point5': { zh: '护栏：不伪造引用/数据；无法验证会标注"待核验"；全部操作可撤销并留痕。', en: 'Guardrails: no fabricated citations/data; unverifiable content marked as "pending verification"; all operations are reversible and tracked.' },
  'detailed.agent.cta': { zh: '体验 Agent 编辑', en: 'Try Agent Editing' },
  'detailed.agent.panel_title': { zh: 'Agent 命令界面', en: 'Agent Command Interface' },
  'detailed.agent.input_label': { zh: '输入：', en: 'Input:' },
  'detailed.agent.example_command': { zh: '"把第 2 节拆成 related work 和 method，并统一 APA 7，插入统计图。"', en: '"Split section 2 into related work and method, standardize to APA 7, insert statistical chart."' },
  'detailed.agent.preview_label': { zh: '文档更新预览：', en: 'Document update preview:' },
  'detailed.agent.related_work': { zh: '2.1 Related Work', en: '2.1 Related Work' },
  'detailed.agent.method': { zh: '2.2 Method', en: '2.2 Method' },
  'detailed.agent.figure_caption': { zh: 'Figure 1: Statistics (Source: Table 2)', en: 'Figure 1: Statistics (Source: Table 2)' },
  'detailed.agent.apply_btn': { zh: '应用修改', en: 'Apply Changes' },
  'detailed.agent.undo_btn': { zh: '撤销', en: 'Undo' },
  'detailed.agent.save_recipe_btn': { zh: '保存为配方', en: 'Save as Recipe' },
  
  // 流程步骤
  'process.section_title': { zh: '三步走，提交更稳', en: 'Three Steps, Submit with Confidence' },
  'process.step1.title': { zh: '收集写作需求', en: 'Collect Writing Requirements' },
  'process.step1.desc': { zh: '收集写作需求，固定文风', en: 'Collect writing requirements, establish style' },
  'process.step2.title': { zh: '自动规划与首稿生成', en: 'Auto Planning & First Draft Generation' },
  'process.step2.desc': { zh: '补充真实文献，产出大纲与正文，自动整理标准格式', en: 'Add real literature, generate outline and content, automatically organize standard format' },
  'process.step3.title': { zh: 'Agent编辑与导出', en: 'Agent Editing & Export' },
  'process.step3.desc': { zh: '一条指令完成排版/图表/交叉引用，导出证据包并跑一遍口头核验', en: 'Complete formatting/charts/cross-references with one command, export evidence package and run oral verification' },
  
  // 用户见证
  'testimonials.section_title': { zh: '用户见证', en: 'User Testimonials' },
  'testimonials.student_title': { zh: '本科生 / 某985高校', en: 'Undergraduate / Top University' },
  'testimonials.student_quote': { zh: '"引用合规从 12 条报错修到 0，面谈用速答卡顺利通过。"', en: '"Citation compliance fixed from 12 errors to 0, passed interview smoothly with quick answer cards."' },
  'testimonials.master_title': { zh: '硕士｜海外', en: 'Master\'s | Overseas' },
  'testimonials.master_quote': { zh: '"风格偏移从 58 降到 27，老师认可"像本人写"。"', en: '"Style deviation reduced from 58 to 27, teacher approved it "sounds like my own writing"."' },
  'testimonials.phd_title': { zh: '博士｜理工科', en: 'PhD | STEM' },
  'testimonials.phd_quote': { zh: '"Agent 完成图表与编号，LaTeX 导出一次过版。"', en: '"Agent completed charts and numbering, LaTeX export passed typesetting in one go."' },
  'testimonials.metric1': { zh: '96%', en: '96%' },
  'testimonials.metric1_desc': { zh: '引用合规度提升', en: 'Citation Compliance Improvement' },
  'testimonials.metric2': { zh: '-68%', en: '-68%' },
  'testimonials.metric2_desc': { zh: 'AI率 下降', en: 'AI Rate Reduction' },
  'testimonials.disclaimer': { zh: '指标为样例说明，实际效果随文本而异', en: 'Metrics are examples, actual results may vary by text' },
  
  // FAQ
  'faq.section_title': { zh: '常见问题', en: 'Frequently Asked Questions' },
  'faq.q1': { zh: '这是"过检神器"吗？', en: 'Is this a "detection bypass tool"?' },
  'faq.a1': { zh: '不是。我们提供可校验证据与整改建议。', en: 'No. We provide verifiable evidence and improvement suggestions.' },
  'faq.q2': { zh: '支持哪些引用格式？', en: 'Which citation formats are supported?' },
  'faq.a2': { zh: 'APA/MLA/GB/T 7714，校验 DOI/ISBN/PMID。', en: 'APA/MLA/GB/T 7714, with DOI/ISBN/PMID verification.' },
  'faq.q3': { zh: '非母语会不会被修过头？', en: 'Will non-native writing be over-polished?' },
  'faq.a3': { zh: '润色强度可调，保留自然错误率。', en: 'Polish intensity is adjustable, preserving natural error rate.' },
  'faq.q4': { zh: '二次 AI Agent 会乱改吗？', en: 'Will secondary AI Agent make random changes?' },
  'faq.a4': { zh: '所有操作可撤销并留痕；无法验证的来源标"需核验"。', en: 'All operations are reversible and tracked; unverifiable sources marked as "needs verification".' },
  'faq.q5': { zh: '图表的数据来源怎么保证？', en: 'How is data source guaranteed for charts?' },
  'faq.a5': { zh: '生成时写入来源与参数元数据，可追溯。', en: 'Sources and parameter metadata written during generation, fully traceable.' },
  'faq.q6': { zh: '数据会被拿去训练吗？', en: 'Will data be used for training?' },
  'faq.a6': { zh: '默认不用于训练，支持本地优先与自托管。', en: 'Not used for training by default, supports local-first and self-hosting.' },
  'faq.q7': { zh: '老师要看写作过程怎么办？', en: 'What if teachers want to see the writing process?' },
  'faq.a7': { zh: '导出证据包与口头核验提纲即可。', en: 'Export evidence package and oral verification outline.' },
  
  // 合规信息
  'compliance.section_title': { zh: '可信与合规', en: 'Trust & Compliance' },
  'compliance.data_privacy.title': { zh: '数据与隐私', en: 'Data & Privacy' },
  'compliance.data_privacy.desc': { zh: '最小化采集，上传即处理即弃可选；敏感场景可自托管', en: 'Minimal data collection, optional immediate processing and disposal; Self-hosting available for sensitive scenarios' },
  'compliance.education.title': { zh: '教育用途声明', en: 'Educational Use Statement' },
  'compliance.education.desc': { zh: '不提供代写与"包过"承诺；定位为合规辅助', en: 'No ghostwriting or "guaranteed pass" promises; Positioned as compliance assistance' },
  'compliance.teacher_cooperation.title': { zh: '教师合作', en: 'Teacher Cooperation' },
  'compliance.teacher_cooperation.desc': { zh: '申请教育试用与 API', en: 'Apply for educational trial and API' },
  
  // 相关资源
  'resources.section_title': { zh: '相关文章', en: 'Related Articles' },
  'resources.avoid_misjudge.title': { zh: '非母语如何避免 AI 误判', en: 'How Non-native Speakers Can Avoid AI Misjudgment' },
  'resources.avoid_misjudge.desc': { zh: '保持个人写作风格的同时提升学术表达质量的实用技巧', en: 'Practical tips for maintaining personal writing style while improving academic expression quality' },
  'resources.avoid_misjudge.cta': { zh: '阅读文章', en: 'Read Article' },
  'resources.academic_charts.title': { zh: '用自然语言做学术图表', en: 'Creating Academic Charts with Natural Language' },
  'resources.academic_charts.desc': { zh: '从数据到图，如何保证可追溯', en: 'From data to charts, how to ensure traceability' },
  'resources.academic_charts.cta': { zh: '阅读文章', en: 'Read Article' },
  'resources.viva_qa.title': { zh: '口头核验提问 20 例', en: '20 Examples of Oral Verification Questions' },
  'resources.viva_qa.desc': { zh: '与回答框架', en: 'With answer framework' },
  'resources.viva_qa.cta': { zh: '阅读文章', en: 'Read Article' },
  
  // 底部CTA
  'footer_cta.title': { zh: '开始你的学术合规之旅', en: 'Start Your Academic Compliance Journey' },
  'footer_cta.subtitle': { zh: '让每一篇论文都经得起质疑，每一次提交都充满信心', en: 'Make every paper withstand scrutiny, every submission filled with confidence' },
  'footer_cta.start_btn': { zh: '立即开始', en: 'Start Now' },
  'footer_cta.download_btn': { zh: '下载示例', en: 'Download Examples' },
  
  // 首页
  'home.welcome_back': { zh: '欢迎回来，', en: 'Welcome back, ' },
  'home.getting_started': { zh: '开始你的新作品', en: 'Start your new work' },
  'home.unlock_success': { zh: '解锁成功！正在生成您的文档...', en: 'Unlock successful! Generating your document...' },
  'home.payment_failed': { zh: '支付失败，请重试', en: 'Payment failed, please try again' },
  'home.purchase_success': { zh: '购买成功！正在导出您的文档...', en: 'Purchase successful! Exporting your document...' },
  'home.purchase_failed': { zh: '购买失败，请重试', en: 'Purchase failed, please try again' },
  'home.files_selected': { zh: '已选择 ${count} 个文件，正在处理...', en: '${count} files selected, processing...' },
  
  // 侧边栏
  'sidebar.dashboard': { zh: '仪表盘', en: 'Dashboard' },
  'sidebar.documents': { zh: '文档管理', en: 'Documents' },
  'sidebar.writing_history': { zh: '写作记录', en: 'Writing History' },
  'sidebar.library': { zh: '文献库', en: 'Library' },
  'sidebar.profile': { zh: '个人资料', en: 'Profile' },
  'sidebar.settings': { zh: '设置', en: 'Settings' },
  'sidebar.logout': { zh: '退出登录', en: 'Logout' },
  
  // 搜索
  'search.placeholder': { zh: '搜索文稿、引用、标签...', en: 'Search docs, citations, tags...' },
  'search.keyboard_hint': { zh: '/', en: '/' },
  
  // 快速开始
  'quickstart.title': { zh: '快速开始', en: 'Quick Start' },
  'quickstart.subtitle': { zh: '选择您的创作方式', en: 'Choose your creative approach' },
  'quickstart.new_document.title': { zh: '新建文稿', en: 'New Document' },
  'quickstart.new_document.description': { zh: '从空白开始，逐步完成学术写作', en: 'Start from scratch, complete academic writing step by step' },
  'quickstart.upload_resources.title': { zh: '上传资料', en: 'Upload Resources' },
  'quickstart.upload_resources.description': { zh: '上传PDF/Word/图片，自动提取要求和参考资料', en: 'Upload PDF/DOCX/Images, auto extract requirements and references' },
  'quickstart.autopilot.title': { zh: '粘贴要求→一键完成', en: 'Paste Requirements → AI Complete' },
  'quickstart.autopilot.description': { zh: '粘贴要求后一键AI完成全流程', en: 'Paste requirements and let AI complete the entire process' },
  
  // 待办面板
  'todo.title': { zh: '需要你处理', en: 'Needs Your Attention' },
  'todo.count_items': { zh: '${count} 项待办', en: '${count} pending items' },
  'todo.pending_unlock.title': { zh: '待解锁生成', en: 'Pending Generation' },
  'todo.pending_unlock.desc': { zh: '一次付费', en: 'One-time payment' },
  'todo.unlock_btn': { zh: '解锁生成', en: 'Unlock Generation' },
  'todo.preview_btn': { zh: '预览', en: 'Preview' },
  'todo.pending_export.title': { zh: '待导出分享', en: 'Pending Export' },
  'todo.pending_export.desc': { zh: '导出1篇', en: 'Export 1 doc' },
  'todo.export_btn': { zh: '追加导出', en: 'Additional Export' },

  // Todos翻译键 (新增)
  'todos.title': { zh: '待处理事项', en: 'Tasks' },
  'todos.count': { zh: '项待办', en: 'items pending' },
  'todos.words': { zh: '字', en: 'words' },
  'todos.citations': { zh: '引用', en: 'citations' },
  'todos.expired': { zh: '已过期', en: 'Expired' },
  'todos.gate1.title': { zh: '待解锁生成', en: 'Pending Generation' },
  'todos.gate1.subtitle': { zh: '一次付费解锁', en: 'One-time payment to unlock' },
  'todos.gate1.unlock': { zh: '解锁生成', en: 'Unlock' },
  'todos.gate1.preview': { zh: '预览', en: 'Preview' },
  'todos.gate1.reprice': { zh: '重新定价', en: 'Reprice' },
  'todos.gate1.price_locked': { zh: '价格锁定', en: 'Price locked' },
  'todos.gate2.title': { zh: '待导出分享', en: 'Pending Export' },
  'todos.gate2.subtitle': { zh: '购买插件导出', en: 'Purchase addons to export' },
  'todos.gate2.missing': { zh: '缺少', en: 'Missing' },
  'todos.gate2.buy_export': { zh: '购买导出', en: 'Buy & Export' },
  'todos.retry.title': { zh: '失败重试', en: 'Failed Tasks' },
  'todos.retry.subtitle': { zh: '需要重新处理', en: 'Requires reprocessing' },
  'todos.retry.failed_message': { zh: '生成失败，请重试', en: 'Generation failed, please retry' },
  'todos.retry.retry_button': { zh: '重试', en: 'Retry' },
  'todos.retry.view_details': { zh: '查看详情', en: 'View Details' },
  
  // 最近文档
  'recent.title': { zh: '最近文件', en: 'Recent Files' },
  'recent.document_count': { zh: '个文档', en: 'documents' },
  'recent.search_placeholder': { zh: '搜索文档...', en: 'Search documents...' },
  
  // 筛选器
  'recent.filters.all': { zh: '全部', en: 'All' },
  'recent.filters.draft': { zh: '草稿', en: 'Draft' },
  'recent.filters.generating': { zh: '生成中', en: 'Generating' },
  'recent.filters.ready': { zh: '已完成', en: 'Ready' },
  'recent.filters.gate1': { zh: '待解锁', en: 'Pending Unlock' },
  'recent.filters.addon': { zh: '待导出', en: 'Pending Export' },
  
  // 排序
  'recent.sort.newest': { zh: '最新', en: 'Newest' },
  'recent.sort.oldest': { zh: '最旧', en: 'Oldest' },
  'recent.sort.title_az': { zh: '标题A-Z', en: 'Title A-Z' },
  'recent.sort.title_za': { zh: '标题Z-A', en: 'Title Z-A' },
  'recent.sort.most_words': { zh: '字数最多', en: 'Most Words' },
  'recent.sort.least_words': { zh: '字数最少', en: 'Least Words' },
  
  // 表格列
  'recent.table.filename': { zh: '文件名', en: 'File Name' },
  'recent.table.status': { zh: '状态', en: 'Status' },
  'recent.table.words': { zh: '字数', en: 'Words' },
  'recent.table.citations': { zh: '引用数', en: 'Citations' },
  'recent.table.updated': { zh: '更新时间', en: 'Updated' },
  'recent.table.actions': { zh: '操作', en: 'Actions' },
  
  // 操作按钮
  'recent.continue_writing': { zh: '继续写作', en: 'Continue Writing' },
  'recent.generating': { zh: '生成中', en: 'Generating' },
  'recent.view_result': { zh: '查看结果', en: 'View Result' },
  'recent.unlock_generate': { zh: '解锁生成', en: 'Unlock Generate' },
  'recent.export': { zh: '导出', en: 'Export' },
  'recent.words': { zh: '字', en: 'words' },
  'recent.citations': { zh: '引用', en: 'citations' },
  
  // 时间格式
  'recent.time.just_now': { zh: '刚刚', en: 'Just now' },
  'recent.time.minutes_ago': { zh: '${minutes}分钟前', en: '${minutes} minutes ago' },
  'recent.time.hours_ago': { zh: '${hours}小时前', en: '${hours} hours ago' },
  'recent.time.days_ago': { zh: '${days}天前', en: '${days} days ago' },
  
  // 右键菜单操作
  'recent.actions.continue': { zh: '继续编辑', en: 'Continue' },
  'recent.actions.view': { zh: '查看', en: 'View' },
  'recent.actions.rename': { zh: '重命名', en: 'Rename' },
  'recent.actions.archive': { zh: '归档', en: 'Archive' },
  'recent.actions.delete': { zh: '删除', en: 'Delete' },
  
  // 空状态
  'recent.empty.title': { zh: '暂无文档', en: 'No Documents' },
  'recent.empty.description': { zh: '开始创建您的第一个文档', en: 'Start creating your first document' },
  'recent.empty.new_document': { zh: '新建文档', en: 'New Document' },
  'recent.empty.upload_resources': { zh: '上传资源', en: 'Upload Resources' },
  'recent.empty.autopilot': { zh: '自动驾驶', en: 'Autopilot Mode' },

  // 写作流程 - Writing Flow
  'writingflow.title': { zh: '学术写作助手', en: 'Academic Writing Assistant' },
  'writingflow.subtitle': { zh: '请从选题开始您的写作之旅', en: 'Please start your writing journey with topic selection' },
  'writingflow.loading': { zh: '加载中...', en: 'Loading...' },
  'writingflow.saved': { zh: '已保存', en: 'Saved' },
  'writingflow.project_id': { zh: '项目ID', en: 'Project ID' },
  'writingflow.meta_title': { zh: 'AI 写作流程 - 学术论文助手', en: 'AI Writing Process - Academic Paper Assistant' },
  'writingflow.meta_description': { zh: '四步写作流程：选题、检索、策略、大纲', en: 'Four-step writing process: Topic, Research, Strategy, Outline' },

  // 步骤导航
  'steps.title': { zh: '写作流程', en: 'Writing Process' },
  'steps.subtitle': { zh: '四步完成学术写作', en: 'Complete academic writing in four steps' },
  'steps.progress': { zh: '进度', en: 'Progress' },
  'steps.topic.title': { zh: '选题设置', en: 'Topic Setup' },
  'steps.topic.description': { zh: '填写论文关键信息', en: 'Fill in key paper information' },
  'steps.research.title': { zh: '文献检索', en: 'Literature Research' },
  'steps.research.description': { zh: '搜索和整理文献', en: 'Search and organize literature' },
  'steps.strategy.title': { zh: '写作策略', en: 'Writing Strategy' },
  'steps.strategy.description': { zh: '制定论点和论证策略', en: 'Develop arguments and proof strategy' },
  'steps.outline.title': { zh: '大纲构建', en: 'Outline Construction' },
  'steps.outline.description': { zh: '构建文档结构大纲', en: 'Build document structure outline' },

  // ResearchStep 相关翻译
  'research.header.title': { zh: '文献研究', en: 'Literature Research' },
  'research.header.description': { zh: '搜集和整理支持论文写作的参考文献', en: 'Collect and organize references to support your paper writing' },
  'research.warning.title': { zh: '文献库未达标', en: 'Literature Library Below Standard' },
  'research.warning.min_sources': { zh: '至少需要3条文献（任意类型均可）', en: 'At least 3 references required (any type)' },
  'research.warning.no_duplicates': { zh: '存在重复文献，请移除或合并', en: 'Duplicate references found, please remove or merge' },
  'research.tabs.academic': { zh: '学术参考文献', en: 'Academic References' },
  'research.tabs.background': { zh: '背景信息', en: 'Background Information' },
  'research.quality_score': { zh: '质量评分', en: 'Quality Score' },
  'research.search.title': { zh: '文献搜索', en: 'Literature Search' },
  'research.search.placeholder': { zh: '输入主题/关键词/DOI/ISBN', en: 'Enter topic/keywords/DOI/ISBN' },
  'research.search.searching': { zh: '搜索中...', en: 'Searching...' },
  'research.search.button': { zh: '搜索', en: 'Search' },
  'research.search.add_manual': { zh: '手动添加', en: 'Add Manually' },
  'research.search.import_bibtex': { zh: '导入 BibTeX/RIS', en: 'Import BibTeX/RIS' },
  'research.filters.year_range': { zh: '年份范围', en: 'Year Range' },
  'research.filters.source_types': { zh: '来源类型', en: 'Source Types' },
  'research.filters.sort_by': { zh: '排序方式', en: 'Sort By' },
  'research.filters.relevance': { zh: '相关度', en: 'Relevance' },
  'research.filters.year': { zh: '年份', en: 'Year' },
  'research.filters.citations': { zh: '被引数', en: 'Citations' },
  'research.type.paper': { zh: '论文', en: 'Paper' },
  'research.type.book': { zh: '书籍', en: 'Book' },
  'research.type.web': { zh: '网站', en: 'Website' },
  'research.type.dataset': { zh: '数据集', en: 'Dataset' },
  'research.type.report': { zh: '报告', en: 'Report' },
  'research.results.title': { zh: '搜索结果', en: 'Search Results' },
  'research.results.citations_count': { zh: '次引用', en: ' citations' },
  'research.results.peer_reviewed': { zh: '同行评审', en: 'Peer Reviewed' },
  'research.results.open_access': { zh: '开放获取', en: 'Open Access' },
  'research.results.quality': { zh: '质量', en: 'Quality' },
  'research.results.added': { zh: '已加入', en: 'Added' },
  'research.results.add_to_library': { zh: '加入文献库', en: 'Add to Library' },
  'research.results.copy_apa': { zh: '复制 APA 格式', en: 'Copy APA Format' },
  'research.results.copy_mla': { zh: '复制 MLA 格式', en: 'Copy MLA Format' },
  'research.results.copy_chicago': { zh: '复制 Chicago 格式', en: 'Copy Chicago Format' },
  'research.results.copy_ieee': { zh: '复制 IEEE 格式', en: 'Copy IEEE Format' },
  'research.results.copy_gbt': { zh: '复制 GB/T 格式', en: 'Copy GB/T Format' },
  'research.results.view_details': { zh: '查看详情', en: 'View Details' },
  'research.results.bookmark': { zh: '标记关键', en: 'Bookmark' },
  'research.results.view_original': { zh: '查看原文', en: 'View Original' },
  'research.library.title': { zh: '文献库', en: 'Reference Library' },
  'research.library.selected_count': { zh: '已选 ${count}/建议 3+', en: 'Selected ${count}/Recommend 3+' },
  'research.library.export': { zh: '导出', en: 'Export' },
  'research.library.empty_title': { zh: '文献库为空', en: 'Reference Library Empty' },
  'research.library.empty_description': { zh: '搜索并添加相关文献到您的研究库', en: 'Search and add relevant literature to your research library' },
  'research.library.stats.total': { zh: '总数量', en: 'Total' },
  'research.library.stats.average_quality': { zh: '平均质量', en: 'Average Quality' },
  'research.library.stats.expected_citations': { zh: '预计引用', en: 'Expected Citations' },
  'research.library.item.has_identifier': { zh: '有标识', en: 'Has Identifier' },
  'research.buttons.back_to_topic': { zh: '返回选题', en: 'Back to Topic' },
  'research.buttons.save_draft': { zh: '保存草稿', en: 'Save Draft' },
  'research.buttons.continue_to_strategy': { zh: '继续到策略', en: 'Continue to Strategy' },
  'research.toast.search_complete': { zh: '搜索完成', en: 'Search Complete' },
  'research.toast.found_references': { zh: '找到 ${count} 条相关文献', en: 'Found ${count} relevant references' },
  'research.toast.search_failed': { zh: '搜索失败', en: 'Search Failed' },
  'research.toast.already_exists': { zh: '已存在', en: 'Already Exists' },
  'research.toast.reference_exists': { zh: '该文献已在文献库中', en: 'This reference is already in the library' },
  'research.toast.added_to_library': { zh: '已添加', en: 'Added' },
  'research.toast.reference_added': { zh: '文献已加入文献库', en: 'Reference added to library' },
  'research.toast.removed_from_library': { zh: '已移除', en: 'Removed' },
  'research.toast.reference_removed': { zh: '文献已从文献库移除', en: 'Reference removed from library' },
  'research.toast.citation_copied': { zh: '已复制', en: 'Copied' },
  'research.toast.citation_copied_format': { zh: '${format} 格式引用已复制到剪贴板', en: '${format} format citation copied to clipboard' },
  'research.toast.draft_saved': { zh: '草稿已保存', en: 'Draft Saved' },
  'research.toast.progress_saved': { zh: '您的研究进度已保存到本地', en: 'Your research progress has been saved locally' },
  'research.toast.completed': { zh: '文献研究完成', en: 'Literature Research Complete' },
  'research.toast.entering_strategy': { zh: '已保存文献库，正在进入策略制定...', en: 'Reference library saved, entering strategy phase...' },
  'research.validation.title_min': { zh: '标题至少5个字符', en: 'Title must be at least 5 characters' },
  'research.validation.authors_min': { zh: '至少需要一个作者', en: 'At least one author is required' },
  
  // Research Step Toast Messages
  'research.toast.verification_updated': { zh: '核验等级已更新为', en: 'Verification level updated to' },
  'research.toast.verification_rate': { zh: '引用核验率：', en: 'Citation verification rate: ' },
  'research.error.recovery_failed': { zh: '恢复研究数据失败', en: 'Failed to recover research data' },
  'research.error.autopilot_start_failed': { zh: '启动自动推进失败', en: 'Failed to start autopilot' },

  // OutcomePanel 相关翻译
  'outcome.price.locked': { zh: '锁定价 ¥${price}', en: 'Locked Price ¥${price}' },
  'outcome.price.locked_badge': { zh: '已锁价', en: 'Price Locked' },
  'outcome.price.relock': { zh: '重新锁价', en: 'Re-lock Price' },
  'outcome.price.estimated': { zh: '≈ ¥${min}–${max}', en: '≈ ¥${min}–${max}' },
  'outcome.price.eta': { zh: 'ETA ${time}', en: 'ETA ${time}' },
  'outcome.verification.level': { zh: '核验等级', en: 'Verification Level' },
  'outcome.verification.basic': { zh: 'Basic', en: 'Basic' },
  'outcome.verification.standard': { zh: 'Standard', en: 'Standard' },
  'outcome.verification.pro': { zh: 'Pro', en: 'Pro' },
  'outcome.deliverables.draft': { zh: '初稿', en: 'First Draft' },
  'outcome.deliverables.citation_verification': { zh: '引用核验', en: 'Citation Verification' },
  'outcome.deliverables.style_alignment': { zh: '风格对齐', en: 'Style Alignment' },
  'outcome.deliverables.process_tracking': { zh: '过程留痕', en: 'Process Tracking' },
  'outcome.addons.evidence_pack': { zh: '证据包', en: 'Evidence Package' },
  'outcome.addons.defense_card': { zh: '口头核验卡', en: 'Oral Defense Card' },
  'outcome.addons.latex': { zh: 'LaTeX', en: 'LaTeX' },
  'outcome.addons.ai_check': { zh: 'AI 检测', en: 'AI Detection' },
  'outcome.addons.plagiarism': { zh: '抄袭检测', en: 'Plagiarism Check' },
  'outcome.addons.share_link': { zh: '只读链接', en: 'Read-only Link' },
  'outcome.metrics.style_samples': { zh: '风格样本', en: 'Style Samples' },
  'outcome.metrics.style_samples_desc': { zh: '个文件已上传', en: ' files uploaded' },
  'outcome.metrics.sources_hit': { zh: '命中文献', en: 'Sources Hit' },
  'outcome.metrics.sources_hit_desc': { zh: '条相关度高', en: ' high relevance' },
  'outcome.metrics.verifiable': { zh: '可验证', en: 'Verifiable' },
  'outcome.metrics.verifiable_desc': { zh: '可溯源', en: ' traceable' },
  'outcome.metrics.recent_5y': { zh: '近五年', en: 'Recent 5Y' },
  'outcome.metrics.recent_5y_desc': { zh: '时效性', en: ' timeliness' },
  'outcome.metrics.thesis_candidates': { zh: '候选结构', en: 'Candidate Structures' },
  'outcome.metrics.thesis_candidates_desc': { zh: '个待筛选', en: ' pending' },
  'outcome.metrics.picked_structure': { zh: '已选', en: 'Selected' },
  'outcome.metrics.picked_structure_desc': { zh: '个结构', en: ' structure(s)' },
  'outcome.metrics.claim_count': { zh: '论点', en: 'Claims' },
  'outcome.metrics.claim_count_desc': { zh: '个核心论证', en: ' core arguments' },
  'outcome.metrics.outline_depth': { zh: '大纲深度', en: 'Outline Depth' },
  'outcome.metrics.outline_depth_desc': { zh: '层级结构', en: ' hierarchical' },
  'outcome.metrics.sections': { zh: '章节', en: 'Sections' },
  'outcome.metrics.sections_desc': { zh: '个结构化', en: ' structured' },
  'outcome.metrics.citation_balance': { zh: '引用均衡', en: 'Citation Balance' },
  'outcome.metrics.citation_balance_desc': { zh: '分配均衡', en: ' balanced' },
  'outcome.metrics.expected_citations': { zh: '预计引用', en: 'Expected Citations' },
  'outcome.metrics.expected_citations_desc': { zh: '核验${rate}%', en: '${rate}% verified' },
  'outcome.metrics.estimated_time': { zh: '预计时长', en: 'Estimated Time' },
  'outcome.metrics.eta': { zh: 'ETA', en: 'ETA' },
  'outcome.time.minutes': { zh: '${min}–${max} 分钟', en: '${min}–${max} minutes' },
  'outcome.time.hours': { zh: '${min}–${max} 小时', en: '${min}–${max} hours' },
  'outcome.buttons.pay_and_write': { zh: '立即写作', en: 'Write Now' },
  'outcome.buttons.preview_sample': { zh: '预览样例片段', en: 'Preview Sample Fragment' },
  'outcome.buttons.processing': { zh: '处理中...', en: 'Processing...' },
  'outcome.buttons.retry': { zh: '重试', en: 'Retry' },
  'outcome.disclaimer': { zh: '付费解锁后自动完成后续步骤并进入结果页', en: 'Auto-complete subsequent steps and enter results page after payment' },

  // StrategyStep 相关翻译（基础框架）
  'strategy.header.title': { zh: '写作策略', en: 'Writing Strategy' },
  'strategy.header.description': { zh: '制定论点和论证策略', en: 'Develop arguments and proof strategies' },
  'strategy.thesis.label': { zh: '论文主题句', en: 'Thesis Statement' },
  'strategy.thesis.placeholder': { zh: '请输入论文的主要论点', en: 'Please enter the main argument of your paper' },
  'strategy.essay_type.label': { zh: '论文类型', en: 'Essay Type' },
  'strategy.audience.label': { zh: '目标受众', en: 'Target Audience' },
  'strategy.register.label': { zh: '写作风格', en: 'Writing Style' },
  'strategy.claims.title': { zh: '支撑论点', en: 'Supporting Claims' },
  'strategy.claims.add': { zh: '添加论点', en: 'Add Claim' },
  'strategy.counters.title': { zh: '反驳观点', en: 'Counter Arguments' },
  'strategy.structure.title': { zh: '论证结构', en: 'Argument Structure' },
  'strategy.citation_style.label': { zh: '引用格式', en: 'Citation Style' },
  'strategy.sources.label': { zh: '允许来源', en: 'Allowed Sources' },
  'strategy.cards.optimization_suggestions': { zh: '建议优化策略数量', en: 'Strategy Optimization Suggestions' },
  'strategy.quality.title': { zh: '质量评分', en: 'Quality Score' },
  'strategy.quality.description': { zh: '评估写作策略的四个核心维度', en: 'Evaluate four core dimensions of writing strategy' },
  'strategy.quality.feasibility': { zh: '可研数量', en: 'Feasibility' },
  'strategy.quality.specificity': { zh: '具体度', en: 'Specificity' },
  'strategy.quality.consistency': { zh: '一致性', en: 'Consistency' },
  'strategy.quality.provability': { zh: '可证明性', en: 'Provability' },

  // OutlineStep 相关翻译（基础框架）
  'outline.header.title': { zh: '大纲构建', en: 'Outline Construction' },
  'outline.header.description': { zh: '构建文档结构大纲', en: 'Build document structure outline' },
  'outline.target_words': { zh: '目标字数', en: 'Target Word Count' },
  'outline.sections.add': { zh: '添加章节', en: 'Add Section' },
  'outline.sections.remove': { zh: '删除章节', en: 'Remove Section' },
  'outline.sections.edit': { zh: '编辑章节', en: 'Edit Section' },
  'outline.sections.expand': { zh: '展开', en: 'Expand' },
  'outline.sections.collapse': { zh: '折叠', en: 'Collapse' },
  'outline.sections.title': { zh: '章节标题', en: 'Section Title' },
  'outline.sections.summary': { zh: '章节摘要', en: 'Section Summary' },
  'outline.sections.word_count': { zh: '预计字数', en: 'Estimated Words' },
  'outline.stats.total_sections': { zh: '总章节数', en: 'Total Sections' },
  'outline.stats.total_words': { zh: '总字数', en: 'Total Words' },
  'outline.stats.completion': { zh: '完成度', en: 'Completion' },
  'outline.cards.document_outline': { zh: '论文大纲', en: 'Document Outline' },
  'outline.overview.title': { zh: '大纲概览', en: 'Outline Overview' },
  'outline.overview.total_words': { zh: '总字数', en: 'Total Words' },
  'outline.overview.target': { zh: '目标', en: 'Target' },
  'outline.overview.current': { zh: '当前', en: 'Current' },
  'outline.overview.sections': { zh: '章节数量', en: 'Section Count' },
  'outline.overview.quality_score': { zh: '质量评分', en: 'Quality Score' },
  'outline.suggestions.title': { zh: '大纲优化建议', en: 'Outline Optimization Suggestions' },
  'outline.buttons.export': { zh: '导出', en: 'Export' },
  'outline.buttons.ai_assist': { zh: 'AI助手', en: 'AI Assistant' },
  'outline.buttons.add_section': { zh: '添加章节', en: 'Add Section' },

  // Outline template related
  'outline.template.label': { zh: '大纲模板', en: 'Outline Template' },
  'outline.template.standard': { zh: '标准学术', en: 'Standard Academic' },
  'outline.template.research': { zh: '研究报告', en: 'Research Report' },
  'outline.template.custom': { zh: '自定义', en: 'Custom' },
  'outline.template.applied': { zh: '模板已应用', en: 'Template Applied' },
  'outline.template.switched': { zh: '已切换到', en: 'Switched to ' },
  'outline.template.template': { zh: '模板', en: ' template' },

  // Export related  
  'outline.export.markdown': { zh: 'Markdown', en: 'Markdown' },
  'outline.export.docx': { zh: 'Word 文档', en: 'Word Document' },
  'outline.export.json': { zh: 'JSON 格式', en: 'JSON Format' },
  'outline.export.feature': { zh: '导出功能', en: 'Export Feature' },
  'outline.export.in_development': { zh: '导出功能开发中...', en: 'export feature in development...' },

  // AI assist related
  'outline.ai_assist.quick_complete': { zh: '一键完成大纲', en: 'Quick Complete Outline' },
  'outline.ai_assist.structure_help': { zh: '结构建议', en: 'Structure Suggestions' },
  'outline.ai_assist.add_sections': { zh: '智能补充', en: 'Smart Addition' },
  'outline.ai_assist.balance_content': { zh: '平衡内容', en: 'Balance Content' },
  'outline.ai_assist.restructure_chapter': { zh: '用 Agent 重构此章', en: 'Restructure Chapter with Agent' },
  'outline.ai_assist.completed': { zh: '大纲自动完成！', en: 'Outline Auto-completed!' },
  'outline.ai_assist.completed_desc': { zh: '已生成基础大纲结构，您可以直接进入下一步或继续编辑', en: 'Basic outline structure generated, you can proceed to next step or continue editing' },
  'outline.ai_assist.balanced': { zh: '内容已平衡', en: 'Content Balanced' },
  'outline.ai_assist.balanced_desc': { zh: '已根据目标字数重新分配各章节字数', en: 'Chapter word counts redistributed based on target words' },

  // Validation related
  'outline.validation.required': { zh: '必须完成以下项目', en: 'Must complete the following items' },
  'outline.validation.failed': { zh: '大纲验证失败', en: 'Outline validation failed' },
  'outline.validation.passed': { zh: '大纲验证通过', en: 'Outline validation passed' },

  // Actions
  'outline.actions.delete': { zh: '删除', en: 'Delete' },

  // UI elements  
  'outline.words': { zh: 'words', en: 'words' },
  'outline.subsections': { zh: 'subsections', en: 'subsections' },
  'outline.new_chapter': { zh: '新建章节', en: 'New Chapter' },
  'outline.new_section': { zh: '新建小节', en: 'New Section' },
  'outline.section': { zh: '小节', en: 'Section' },

  // Empty state
  'outline.empty.title': { zh: '开始构建大纲', en: 'Start Building Outline' },
  'outline.empty.description': { zh: '选择一个选项来快速开始', en: 'Choose an option to get started quickly' },
  'outline.empty.standard_template': { zh: '标准学术模板', en: 'Standard Academic Template' },
  'outline.empty.research_template': { zh: '研究报告模板', en: 'Research Report Template' },

  // Navigation
  'outline.back_to_strategy': { zh: '返回策略', en: 'Back to Strategy' },
  'outline.continue_to_writing': { zh: '进入内容编写', en: 'Enter Content Writing' },
  'outline.completed': { zh: '大纲已完成', en: 'Outline Completed' },
  'outline.completed_desc': { zh: '写作流程已完成，正在进入结果页面...', en: 'Writing flow completed, entering results page...' },
  
  // Additional outline validation and template translations
  'outline.validation.title_required': { zh: '标题至少3个字符', en: 'Title must be at least 3 characters' },
  'outline.validation.min_sections': { zh: '至少需要3个顶层章节', en: 'At least 3 top-level sections required' },
  'outline.validation.min_subsections': { zh: '至少50字', en: 'At least 50 words' },
  'outline.validation.title_duplicate': { zh: '标题不能超过120个字符', en: 'Title cannot exceed 120 characters' },
  'outline.validation.word_count_deviation': { zh: '简介不能超过200个字符', en: 'Summary cannot exceed 200 characters' },
  'outline.validation.missing_sections': { zh: '不能超过6000字', en: 'Cannot exceed 6000 words' },
  'outline.validation.add_chapter': { zh: '请添加至少1个章节', en: 'Please add at least 1 section' },
  'outline.validation.fill_titles': { zh: '请填写所有章节标题', en: 'Please fill in all section titles' },
  'outline.validation.suggest_min_chapters': { zh: '建议至少添加3个顶层章节', en: 'Suggest adding at least 3 top-level chapters' },
  'outline.validation.suggest_subsections': { zh: '建议第{index}章添加至少2个二级小节', en: 'Suggest adding at least 2 subsections to Chapter {index}' },
  'outline.validation.suggest_modify_duplicate': { zh: '标题"{title}"重复，建议修改', en: 'Title "{title}" is duplicated, suggest modifying' },
  'outline.validation.word_target_deviation': { zh: '总字数偏离目标较多（当前：{current}，目标：{target}），建议调整', en: 'Total word count deviates significantly from target (Current: {current}, Target: {target}), suggest adjustment' },
  'outline.validation.suggest_add_sections': { zh: '建议补充章节：{sections}', en: 'Suggest adding sections: {sections}' },
  'outline.validation.optimization_tip': { zh: '💡 以上为优化建议，您可以直接进入下一步', en: '💡 These are optimization suggestions, you can proceed directly to the next step' },
  'outline.quality.coverage': { zh: '覆盖度', en: 'Coverage' },
  'outline.quality.depth': { zh: '层级深度', en: 'Depth' },
  'outline.quality.balance': { zh: '平衡度', en: 'Balance' },
  'outline.quality.writability': { zh: '可写性', en: 'Writability' },
  'outline.toast.verification_updated': { zh: '核验等级已更新为 {level}', en: 'Verification level updated to {level}' },
  'outline.toast.verification_rate': { zh: '引用核验率：{rate}', en: 'Citation verification rate: {rate}' },
  'outline.toast.structure_suggestion': { zh: '结构建议', en: 'Structure Suggestions' },
  'outline.toast.smart_supplement': { zh: '智能补充', en: 'Smart Supplement' },
  'outline.toast.analyzing_outline': { zh: '正在分析您的大纲，为缺失的部分添加建议章节...', en: 'Analyzing your outline, adding suggested sections for missing parts...' },
  'outline.toast.preview_mode': { zh: '预览模式', en: 'Preview Mode' },
  'outline.toast.continue_editing': { zh: '您可以继续编辑大纲或直接进入写作阶段', en: 'You can continue editing the outline or proceed directly to the writing stage' },
  'outline.toast.payment_success': { zh: '支付成功', en: 'Payment Successful' },
  'outline.toast.starting_autopilot': { zh: '正在启动自动推进流程...', en: 'Starting autopilot process...' },
  'outline.toast.payment_failed': { zh: '支付失败', en: 'Payment Failed' },
  'outline.toast.payment_error': { zh: '支付过程中发生错误', en: 'Error occurred during payment process' },
  'outline.toast.autopilot_failed': { zh: '自动推进失败', en: 'Autopilot Failed' },
  'outline.toast.manual_steps': { zh: '请手动完成剩余步骤', en: 'Please complete the remaining steps manually' },
  'outline.toast.development': { zh: '功能开发中', en: 'Feature in Development' },
  'outline.toast.sample_preview_coming': { zh: '样例预览功能即将上线', en: 'Sample preview feature coming soon' },
  'outline.toast.price_lock_failed': { zh: '价格锁定失败，请重试', en: 'Price lock failed, please try again' },
  'outline.toast.retry': { zh: '请重试', en: 'Please try again' },
  'outline.toast.error': { zh: '错误', en: 'Error' },
  'outline.templates.intro.title': { zh: '引言', en: 'Introduction' },
  'outline.templates.intro.summary': { zh: '研究背景、问题陈述和研究目标', en: 'Research background, problem statement and research objectives' },
  'outline.templates.intro.background.title': { zh: '研究背景', en: 'Research Background' },
  'outline.templates.intro.background.summary': { zh: '领域现状和研究动机', en: 'Current field status and research motivation' },
  'outline.templates.intro.problem.title': { zh: '问题陈述', en: 'Problem Statement' },
  'outline.templates.intro.problem.summary': { zh: '待解决的核心问题', en: 'Core problems to be addressed' },
  'outline.templates.literature.title': { zh: '文献综述', en: 'Literature Review' },
  'outline.templates.literature.summary': { zh: '相关研究回顾和理论框架', en: 'Related research review and theoretical framework' },
  'outline.templates.literature.theory.title': { zh: '理论基础', en: 'Theoretical Foundation' },
  'outline.templates.literature.theory.summary': { zh: '核心理论和概念框架', en: 'Core theories and conceptual framework' },
  'outline.templates.literature.related.title': { zh: '相关研究', en: 'Related Research' },
  'outline.templates.literature.related.summary': { zh: '现有研究成果分析', en: 'Analysis of existing research findings' },
  'outline.templates.methodology.title': { zh: '研究方法', en: 'Research Methods' },
  'outline.templates.methodology.summary': { zh: '研究设计、数据收集和分析方法', en: 'Research design, data collection and analysis methods' },
  'outline.templates.methodology.design.title': { zh: '研究设计', en: 'Research Design' },
  'outline.templates.methodology.design.summary': { zh: '整体研究框架和流程', en: 'Overall research framework and process' },
  'outline.templates.methodology.data.title': { zh: '数据收集', en: 'Data Collection' },
  'outline.templates.methodology.data.summary': { zh: '数据来源和收集方法', en: 'Data sources and collection methods' },
  'outline.templates.results.title': { zh: '结果与分析', en: 'Results and Analysis' },
  'outline.templates.results.summary': { zh: '研究发现和数据分析结果', en: 'Research findings and data analysis results' },
  'outline.templates.results.findings.title': { zh: '主要发现', en: 'Key Findings' },
  'outline.templates.results.findings.summary': { zh: '核心研究结果展示', en: 'Presentation of core research results' },
  'outline.templates.results.analysis.title': { zh: '深入分析', en: 'In-depth Analysis' },
  'outline.templates.results.analysis.summary': { zh: '结果的详细解读', en: 'Detailed interpretation of results' },
  'outline.templates.discussion.title': { zh: '讨论', en: 'Discussion' },
  'outline.templates.discussion.summary': { zh: '结果解释、局限性和影响', en: 'Result interpretation, limitations and implications' },
  'outline.templates.discussion.interpret.title': { zh: '结果解释', en: 'Result Interpretation' },
  'outline.templates.discussion.interpret.summary': { zh: '发现的意义和影响', en: 'Significance and impact of findings' },
  'outline.templates.discussion.limits.title': { zh: '研究局限', en: 'Research Limitations' },
  'outline.templates.discussion.limits.summary': { zh: '方法和结果的局限性', en: 'Limitations of methods and results' },
  'outline.templates.conclusion.title': { zh: '结论', en: 'Conclusion' },
  'outline.templates.conclusion.summary': { zh: '研究总结和未来展望', en: 'Research summary and future prospects' },
  'outline.templates.conclusion.summary_content.title': { zh: '研究总结', en: 'Research Summary' },
  'outline.templates.conclusion.summary_content.summary': { zh: '主要贡献和发现', en: 'Main contributions and findings' },
  'outline.templates.conclusion.future.title': { zh: '未来研究', en: 'Future Research' },
  'outline.templates.conclusion.future.summary': { zh: '后续研究方向', en: 'Future research directions' },
  'outline.templates.v2.abstract.title': { zh: '摘要', en: 'Abstract' },
  'outline.templates.v2.abstract.summary': { zh: '研究概要和主要发现', en: 'Research overview and main findings' },
  'outline.templates.v2.intro.title': { zh: '引言', en: 'Introduction' },
  'outline.templates.v2.intro.summary': { zh: '研究背景和目标', en: 'Research background and objectives' },
  'outline.templates.v2.intro.context.title': { zh: '研究背景', en: 'Research Background' },
  'outline.templates.v2.intro.context.summary': { zh: '问题的重要性和现实意义', en: 'Importance and practical significance of the problem' },
  'outline.templates.v2.intro.objectives.title': { zh: '研究目标', en: 'Research Objectives' },
  'outline.templates.v2.intro.objectives.summary': { zh: '具体的研究问题和假设', en: 'Specific research questions and hypotheses' },
  'outline.templates.v2.background.title': { zh: '理论背景', en: 'Theoretical Background' },
  'outline.templates.v2.background.summary': { zh: '相关理论和前期研究', en: 'Related theories and prior research' },
  'outline.templates.v2.background.theory.title': { zh: '理论框架', en: 'Theoretical Framework' },
  'outline.templates.v2.background.theory.summary': { zh: '支撑研究的核心理论', en: 'Core theories supporting the research' },
  'outline.templates.v2.background.prior.title': { zh: '前期研究', en: 'Prior Research' },
  'outline.templates.v2.background.prior.summary': { zh: '相关领域的研究进展', en: 'Research progress in related fields' },
  'outline.templates.v2.methods.title': { zh: '研究方法', en: 'Research Methods' },
  'outline.templates.v2.methods.summary': { zh: '研究设计和实施过程', en: 'Research design and implementation process' },
  'outline.templates.v2.methods.approach.title': { zh: '研究路径', en: 'Research Approach' },
  'outline.templates.v2.methods.approach.summary': { zh: '总体研究策略和方法选择', en: 'Overall research strategy and method selection' },
  'outline.templates.v2.methods.procedure.title': { zh: '实施程序', en: 'Implementation Procedure' },
  'outline.templates.v2.methods.procedure.summary': { zh: '具体的操作步骤和流程', en: 'Specific operational steps and processes' },
  'outline.templates.v2.findings.title': { zh: '研究发现', en: 'Research Findings' },
  'outline.templates.v2.findings.summary': { zh: '主要结果和关键发现', en: 'Main results and key findings' },
  'outline.templates.v2.findings.primary.title': { zh: '核心发现', en: 'Core Findings' },
  'outline.templates.v2.findings.primary.summary': { zh: '最重要的研究结果', en: 'Most important research results' },
  'outline.templates.v2.findings.secondary.title': { zh: '补充发现', en: 'Supplementary Findings' },
  'outline.templates.v2.findings.secondary.summary': { zh: '其他有价值的观察', en: 'Other valuable observations' },
  'outline.templates.v2.implications.title': { zh: '影响与启示', en: 'Implications and Insights' },
  'outline.templates.v2.implications.summary': { zh: '研究意义和实践价值', en: 'Research significance and practical value' },
  'outline.templates.v2.implications.theoretical.title': { zh: '理论贡献', en: 'Theoretical Contribution' },
  'outline.templates.v2.implications.theoretical.summary': { zh: '对学术理论的推进', en: 'Advancement of academic theory' },
  'outline.templates.v2.implications.practical.title': { zh: '实践启示', en: 'Practical Insights' },
  'outline.templates.v2.implications.practical.summary': { zh: '对现实问题的指导意义', en: 'Guiding significance for real-world problems' },
  'outline.templates.v2.conclusion.title': { zh: '结论与展望', en: 'Conclusion and Prospects' },
  'outline.templates.v2.conclusion.summary': { zh: '研究总结和后续方向', en: 'Research summary and future directions' },
  'outline.templates.quick.intro.title': { zh: '引言', en: 'Introduction' },
  'outline.templates.quick.intro.summary': { zh: '研究背景和目标', en: 'Research background and objectives' },
  'outline.templates.quick.intro.background.title': { zh: '研究背景', en: 'Research Background' },
  'outline.templates.quick.intro.background.summary': { zh: '问题的重要性', en: 'Importance of the problem' },
  'outline.templates.quick.intro.objectives.title': { zh: '研究目标', en: 'Research Objectives' },
  'outline.templates.quick.intro.objectives.summary': { zh: '具体目标和假设', en: 'Specific objectives and hypotheses' },
  'outline.templates.quick.main.title': { zh: '主要内容', en: 'Main Content' },
  'outline.templates.quick.main.summary': { zh: '核心研究内容', en: 'Core research content' },
  'outline.templates.quick.main.part1.title': { zh: '第一部分', en: 'Part One' },
  'outline.templates.quick.main.part1.summary': { zh: '主要观点和论证', en: 'Main viewpoints and arguments' },
  'outline.templates.quick.main.part2.title': { zh: '第二部分', en: 'Part Two' },
  'outline.templates.quick.main.part2.summary': { zh: '支撑论据和分析', en: 'Supporting evidence and analysis' },
  'outline.templates.quick.conclusion.title': { zh: '结论', en: 'Conclusion' },
  'outline.templates.quick.conclusion.summary': { zh: '研究总结和展望', en: 'Research summary and prospects' },
  'outline.templates.quick.conclusion.findings.title': { zh: '主要发现', en: 'Main Findings' },
  'outline.templates.quick.conclusion.findings.summary': { zh: '研究的核心贡献', en: 'Core contributions of the research' },
  'outline.templates.quick.conclusion.future.title': { zh: '未来展望', en: 'Future Prospects' },
  'outline.templates.quick.conclusion.future.summary': { zh: '后续研究方向', en: 'Future research directions' },
  'outline.word_count.exceeded': { zh: '超出', en: 'Exceeded' },
  'outline.word_count.insufficient': { zh: '不足', en: 'Insufficient' },
  'outline.word_count.chapters': { zh: '章', en: 'chapters' },
  'outline.word_count.quality_score': { zh: '质量评分', en: 'Quality Score' },
  'outline.gate1.benefits.complete_generation': { zh: '一次完整生成', en: 'Complete Generation' },
  'outline.gate1.benefits.local_rewrites': { zh: '2 次局部重写', en: '2 Local Rewrites' },
  'outline.gate1.benefits.full_verification': { zh: '全量引用核验', en: 'Full Citation Verification' },

  // ArticleCard comprehensive translations
  'result.article.title': { zh: '学术论文', en: 'Academic Paper' },
  'result.article.document_id': { zh: '文档 ID', en: 'Document ID' },
  'result.article.status.idle': { zh: '等待开始', en: 'Waiting to Start' },
  'result.article.status.starting': { zh: '准备中', en: 'Preparing' },
  'result.article.status.streaming': { zh: '生成中', en: 'Generating' },
  'result.article.status.ready': { zh: '已完成', en: 'Completed' },
  'result.article.status.error': { zh: '生成失败', en: 'Generation Failed' },
  'result.article.export.docx': { zh: '导出 DOCX', en: 'Export DOCX' },
  'result.article.export.pdf': { zh: '导出 PDF', en: 'Export PDF' },
  'result.article.export.latex': { zh: '导出 LaTeX', en: 'Export LaTeX' },
  'result.article.actions.copy_share_link': { zh: '复制分享链接', en: 'Copy Share Link' },
  'result.article.actions.view_history': { zh: '查看变更历史', en: 'View Change History' },
  'result.article.preview.mode': { zh: '预览模式', en: 'Preview Mode' },
  'result.article.preview.title': { zh: '预览模式', en: 'Preview Mode' },
  'result.article.preview.description': { zh: '当前为预览模式，内容受限。解锁后可查看完整内容。', en: 'Currently in preview mode, content is limited. Unlock to view full content.' },
  'result.article.preview.content_limited': { zh: '预览模式 - 内容受限', en: 'Preview Mode - Limited Content' },
  'result.article.preview.abstract': { zh: '摘要', en: 'Abstract' },
  'result.article.preview.introduction': { zh: '引言', en: 'Introduction' },
  'result.article.preview.sample_text_abstract': { zh: '本研究探讨了... [预览内容] ...具有重要的理论意义和实践价值。', en: 'This research explores... [preview content] ...has important theoretical and practical value.' },
  'result.article.preview.sample_text_introduction': { zh: '随着技术的发展... [预览内容] ...本研究的目标是...', en: 'With the development of technology... [preview content] ...the goal of this research is...' },
  'result.article.preview.more_content': { zh: '更多内容请解锁后查看', en: 'More content available after unlock' },
  'result.article.generation.completed': { zh: '生成完成', en: 'Generation Completed' },
  'result.article.generation.streaming': { zh: '正在生成内容...', en: 'Generating content...' },
  'result.article.generation.streaming_note': { zh: '正在生成内容...', en: 'Generating content...' },
  'result.article.generation.realtime_streaming': { zh: '实时流式传输', en: 'Real-time Streaming' },
  'result.article.waiting.title': { zh: '等待生成', en: 'Waiting for Generation' },
  'result.article.waiting.description': { zh: '点击开始按钮开始生成学术论文内容', en: 'Click the start button to begin generating academic paper content' },
  'result.article.waiting.start_generation': { zh: '开始生成', en: 'Start Generation' },
  'result.article.metadata.created_time': { zh: '创建时间', en: 'Created' },
  'result.article.metadata.format': { zh: '格式', en: 'Format' },
  'result.article.metadata.word_count': { zh: '字数', en: 'Words' },
  'result.article.metadata.realtime_sync': { zh: '实时同步', en: 'Real-time Sync' },
  'result.article.metadata.auto_save': { zh: '自动保存', en: 'Auto Save' },
  'result.article.metadata.saving': { zh: '实时保存中', en: 'Saving in real-time' },

  // DeckTabs comprehensive translations
  'result.tabs.export': { zh: '导出', en: 'Export' },
  'result.tabs.evidence': { zh: '证据包', en: 'Evidence' },
  'result.tabs.verification': { zh: '引用验证', en: 'Verification' },
  'result.tabs.style': { zh: '文风分析', en: 'Style' },
  'result.tabs.assistant': { zh: 'AI助手', en: 'AI Assistant' },
  'result.tabs.audit': { zh: '审计', en: 'Audit' },
  'result.deliverables.quality_score': { zh: '质量评分', en: 'Quality Score' },
  'result.deliverables.quality_description': { zh: '综合评价文档质量', en: 'Comprehensive document quality assessment' },
  'result.deliverables.process_doc': { zh: '流程文档', en: 'Process Documentation' },
  'result.deliverables.process_description': { zh: 'PDF 摘要报告', en: 'PDF Summary Report' },
  'result.deliverables.references': { zh: '文献列表', en: 'References List' },
  'result.deliverables.references_description': { zh: 'CSV/BIB/RIS 格式', en: 'CSV/BIB/RIS Format' },
  'result.deliverables.references_count': { zh: '${count} 条', en: '${count} items' },
  'result.deliverables.timeline': { zh: '时间线', en: 'Timeline' },
  'result.deliverables.timeline_description': { zh: '操作审计日志', en: 'Operation Audit Log' },
  'result.deliverables.viva_cards': { zh: '答辩卡', en: 'Viva Cards' },
  'result.deliverables.viva_description': { zh: 'PPT + 答辩要点', en: 'PPT + Defense Points' },
  'result.deliverables.media_assets': { zh: '媒体资源', en: 'Media Assets' },
  'result.deliverables.media_description': { zh: '图表和素材包', en: 'Charts and Material Package' },
  'result.deliverables.share_link': { zh: '分享链接', en: 'Share Link' },
  'result.deliverables.share_description': { zh: '7天只读访问', en: '7-day Read-only Access' },
  'result.deliverables.complete_bundle': { zh: '完整包', en: 'Complete Bundle' },
  'result.deliverables.complete_description': { zh: '全部文件打包', en: 'All Files Packaged' },
  'result.deliverables.locked': { zh: '需解锁', en: 'Requires Unlock' },
  'result.deliverables.generating': { zh: '生成中...', en: 'Generating...' },
  'result.deliverables.download': { zh: '下载', en: 'Download' },
  'result.assistant.ai_chat': { zh: 'AI 助手', en: 'AI Assistant' },
  'result.assistant.ai_chat_description': { zh: '智能问答和编辑建议', en: 'Intelligent Q&A and editing suggestions' },
  'result.assistant.ai_chat_content': { zh: '您可以询问关于文档的任何问题，或请求编辑建议。', en: 'You can ask any questions about the document or request editing suggestions.' },
  'result.assistant.start_conversation': { zh: '开始对话', en: 'Start Conversation' },
  'result.assistant.edit_suggestions': { zh: '编辑建议', en: 'Edit Suggestions' },
  'result.assistant.doc_search': { zh: '文档搜索', en: 'Document Search' },
  'result.assistant.doc_search_description': { zh: '快速定位内容和引用', en: 'Quickly locate content and citations' },
  'result.assistant.doc_search_content': { zh: '搜索文档中的特定内容、引用或关键词。', en: 'Search for specific content, citations, or keywords in the document.' },
  'result.assistant.start_search': { zh: '开始搜索', en: 'Start Search' },
  'result.assistant.enhancement': { zh: '智能增强', en: 'Smart Enhancement' },
  'result.assistant.enhancement_description': { zh: '自动优化和格式化', en: 'Automatic optimization and formatting' },
  'result.assistant.enhancement_content': { zh: '使用 AI 自动改进文档结构、语言和格式。', en: 'Use AI to automatically improve document structure, language, and formatting.' },
  'result.assistant.language_polish': { zh: '语言润色', en: 'Language Polish' },
  'result.assistant.structure_optimize': { zh: '结构优化', en: 'Structure Optimization' },
  'result.audit.title': { zh: '操作审计', en: 'Operation Audit' },
  'result.audit.document_generated': { zh: '文档已生成', en: 'Document Generated' },
  'result.audit.citation_verified': { zh: '引用核验完成', en: 'Citation Verification Completed' },
  'result.audit.generation_started': { zh: '开始内容生成', en: 'Content Generation Started' },
  'result.audit.minutes_ago': { zh: '分钟前', en: 'minutes ago' },
  'result.audit.view_full_log': { zh: '查看完整日志', en: 'View Full Log' },

  // CitationVerificationPanel comprehensive translations
  'result.citation.verification_center': { zh: '引用验证中心', en: 'Citation Verification Center' },
  'result.citation.realtime_validation': { zh: 'DOI/PMID/ISBN 实时校验', en: 'DOI/PMID/ISBN Real-time Validation' },
  'result.citation.total': { zh: '总计', en: 'Total' },
  'result.citation.verified': { zh: '已验证', en: 'Verified' },
  'result.citation.failed': { zh: '失败', en: 'Failed' },
  'result.citation.verifying': { zh: '验证中', en: 'Verifying' },
  'result.citation.pending': { zh: '待验证', en: 'Pending' },
  'result.citation.verification_progress': { zh: '验证进度', en: 'Verification Progress' },
  'result.citation.batch_verify': { zh: '批量验证', en: 'Batch Verify' },
  'result.citation.verifying_status': { zh: '验证中...', en: 'Verifying...' },
  'result.citation.export_report': { zh: '导出报告', en: 'Export Report' },
  'result.citation.details_count': { zh: '引用验证详情', en: 'Citation Verification Details' },
  'result.citation.status.verified': { zh: '已验证', en: 'Verified' },
  'result.citation.status.failed': { zh: '验证失败', en: 'Verification Failed' },
  'result.citation.status.checking': { zh: '验证中', en: 'Checking' },
  'result.citation.status.not_found': { zh: '未找到', en: 'Not Found' },
  'result.citation.status.pending': { zh: '待验证', en: 'Pending' },
  'result.citation.type.paper': { zh: '期刊论文', en: 'Journal Paper' },
  'result.citation.type.book': { zh: '图书', en: 'Book' },
  'result.citation.type.dataset': { zh: '数据集', en: 'Dataset' },
  'result.citation.type.web': { zh: '网页', en: 'Web' },
  'result.citation.no_date': { zh: '无日期', en: 'No Date' },
  'result.citation.verify': { zh: '验证', en: 'Verify' },
  'result.citation.retry': { zh: '重试', en: 'Retry' },
  'result.citation.hide_details': { zh: '隐藏详情', en: 'Hide Details' },
  'result.citation.show_details': { zh: '显示验证详情', en: 'Show Verification Details' },
  'result.citation.doi_validity': { zh: 'DOI 有效性', en: 'DOI Validity' },
  'result.citation.crossref_match': { zh: 'Crossref 匹配', en: 'Crossref Match' },
  'result.citation.valid': { zh: '有效', en: 'Valid' },
  'result.citation.invalid': { zh: '无效', en: 'Invalid' },
  'result.citation.match': { zh: '匹配', en: 'Match' },
  'result.citation.no_match': { zh: '不匹配', en: 'No Match' },
  'result.citation.issues_found': { zh: '发现问题', en: 'Issues Found' },
  'result.citation.last_checked': { zh: '最后检查', en: 'Last Checked' },
  'result.citation.suggested_replacement': { zh: '建议替换为', en: 'Suggested Replacement' },
  'result.citation.replace': { zh: '替换', en: 'Replace' },
  'result.citation.doi_link': { zh: 'DOI链接', en: 'DOI Link' },
  'result.citation.original_link': { zh: '原始链接', en: 'Original Link' },
  'result.citation.verification_mechanism': { zh: '验证机制说明', en: 'Verification Mechanism Description' },
  'result.citation.mechanism.doi': { zh: 'DOI 验证: 通过 Crossref 数据库验证DOI有效性和元数据一致性', en: 'DOI Verification: Validate DOI validity and metadata consistency through Crossref database' },
  'result.citation.mechanism.pmid': { zh: 'PMID 验证: 通过 PubMed 数据库验证医学文献信息', en: 'PMID Verification: Validate medical literature information through PubMed database' },
  'result.citation.mechanism.isbn': { zh: 'ISBN 验证: 验证图书ISBN格式和出版信息', en: 'ISBN Verification: Validate book ISBN format and publication information' },
  'result.citation.mechanism.smart_replacement': { zh: '智能替换: 对无效引用自动推荐更新、可靠的替代文献', en: 'Smart Replacement: Automatically recommend updated, reliable alternative literature for invalid citations' },
  'result.citation.mechanism.format_check': { zh: '格式规范: 自动检查引用格式是否符合APA/MLA/GB/T标准', en: 'Format Standards: Automatically check if citation format complies with APA/MLA/GB/T standards' },

  // Gate1Modal comprehensive translations
  'result.gate1.unlock_title': { zh: '解锁内容生成', en: 'Unlock Content Generation' },
  'result.gate1.unlock_description': { zh: '自动推进已完成，现在可以开始生成您的论文正文。', en: 'Automated progression complete, ready to generate your paper content.' },
  'result.gate1.locked_price': { zh: '锁定价格', en: 'Locked Price' },
  'result.gate1.includes_all': { zh: '含全部服务', en: 'Includes All Services' },
  'result.gate1.time_remaining': { zh: '锁价剩余', en: 'Price Lock Remaining' },
  'result.gate1.price_expired': { zh: '价格已过期，需要重新估算', en: 'Price expired, requires re-estimation' },
  'result.gate1.need_reestimate': { zh: '需要重新估算', en: 'Requires Re-estimation' },
  'result.gate1.included_benefits': { zh: '包含权益', en: 'Included Benefits' },
  'result.gate1.benefit.complete_generation': { zh: '一次完整生成', en: 'One Complete Generation' },
  'result.gate1.benefit.partial_rewrites': { zh: '2 次局部重写', en: '2 Partial Rewrites' },
  'result.gate1.benefit.full_verification': { zh: '全量引用核验', en: 'Full Citation Verification' },
  'result.gate1.feature.smart_generation': { zh: '智能生成', en: 'Smart Generation' },
  'result.gate1.feature.ai_driven': { zh: 'AI驱动写作', en: 'AI-Driven Writing' },
  'result.gate1.feature.precise_citation': { zh: '精准引用', en: 'Precise Citations' },
  'result.gate1.feature.full_verification': { zh: '全量核验', en: 'Full Verification' },
  'result.gate1.feature.flexible_editing': { zh: '灵活编辑', en: 'Flexible Editing' },
  'result.gate1.feature.multiple_rewrites': { zh: '多次重写', en: 'Multiple Rewrites' },
  'result.gate1.processing_payment': { zh: '正在处理支付...', en: 'Processing payment...' },
  'result.gate1.unlock_now': { zh: '立即解锁生成', en: 'Unlock Now' },
  'result.gate1.preview_only': { zh: '仅预览草案', en: 'Preview Only' },
  'result.gate1.price_locked_until': { zh: '后过期', en: 'until expiry' },
  'result.gate1.expired': { zh: '已过期', en: 'Expired' },
  'result.gate1.payment_info': { zh: '未付费前为预览模式，内容受限。', en: 'Preview mode before payment, content is limited.' },
  'result.gate1.price_locked_text': { zh: '报价已锁定，', en: 'Price is locked, ' },

  // ExportPreviewPanel comprehensive translations
  'result.export.title': { zh: '多格式导出', en: 'Multi-format Export' },
  'result.export.subtitle': { zh: '支持6种主流格式，满足不同场景需求', en: 'Supports 6 mainstream formats for different scenario needs' },
  'result.export.formats_supported': { zh: '种主流格式', en: ' mainstream formats' },
  'result.export.format.docx': { zh: 'Microsoft Word', en: 'Microsoft Word' },
  'result.export.format.pdf': { zh: 'PDF文档', en: 'PDF Document' },
  'result.export.format.latex': { zh: 'LaTeX源码', en: 'LaTeX Source Code' },
  'result.export.format.html': { zh: 'HTML网页', en: 'HTML Web Page' },
  'result.export.format.markdown': { zh: 'Markdown', en: 'Markdown' },
  'result.export.format.pptx': { zh: 'PowerPoint演示', en: 'PowerPoint Presentation' },
  'result.export.format.docx_desc': { zh: '标准Word文档，支持所有格式和注释', en: 'Standard Word document, supports all formats and comments' },
  'result.export.format.pdf_desc': { zh: '适合打印和分享的固定格式文档', en: 'Fixed-format document suitable for printing and sharing' },
  'result.export.format.latex_desc': { zh: '专业学术排版源码，支持高级数学公式', en: 'Professional academic typesetting source code with advanced math formulas' },
  'result.export.format.html_desc': { zh: '适合在线发布和分享的网页格式', en: 'Web format suitable for online publishing and sharing' },
  'result.export.format.markdown_desc': { zh: '轻量级标记语言，适合版本控制', en: 'Lightweight markup language, suitable for version control' },
  'result.export.format.pptx_desc': { zh: '基于内容自动生成的演示文稿', en: 'Auto-generated presentation based on content' },
  'result.export.recommended': { zh: '推荐', en: 'Recommended' },
  'result.export.file_size': { zh: '文件大小', en: 'File Size' },
  'result.export.features': { zh: '特性', en: 'Features' },
  'result.export.preview': { zh: '预览', en: 'Preview' },
  'result.export.download': { zh: '下载', en: 'Download' },
  'result.export.configure': { zh: '配置', en: 'Configure' },
  'result.export.feature.complete_format': { zh: '完整格式保留', en: 'Complete Format Preservation' },
  'result.export.feature.revision_mode': { zh: '支持修订模式', en: 'Revision Mode Support' },
  'result.export.feature.best_compatibility': { zh: '兼容性最佳', en: 'Best Compatibility' },
  'result.export.feature.editable': { zh: '可编辑', en: 'Editable' },
  'result.export.feature.format_locked': { zh: '格式锁定', en: 'Format Locked' },
  'result.export.feature.cross_platform': { zh: '跨平台兼容', en: 'Cross-platform Compatible' },
  'result.export.feature.print_ready': { zh: '适合打印', en: 'Print Ready' },
  'result.export.feature.high_security': { zh: '安全性高', en: 'High Security' },
  'result.export.feature.professional_typesetting': { zh: '专业排版', en: 'Professional Typesetting' },
  'result.export.feature.math_formula': { zh: '数学公式支持', en: 'Math Formula Support' },
  'result.export.feature.version_control': { zh: '版本控制友好', en: 'Version Control Friendly' },
  'result.export.feature.journal_submission': { zh: '期刊投稿适用', en: 'Journal Submission Ready' },
  'result.export.feature.online_viewing': { zh: '在线查看', en: 'Online Viewing' },
  'result.export.feature.responsive_design': { zh: '响应式设计', en: 'Responsive Design' },
  'result.export.feature.seo_friendly': { zh: '搜索友好', en: 'SEO Friendly' },
  'result.export.feature.interactive_elements': { zh: '交互式元素', en: 'Interactive Elements' },
  'result.export.feature.plain_text': { zh: '纯文本格式', en: 'Plain Text Format' },
  'result.export.feature.lightweight': { zh: '轻量简洁', en: 'Lightweight & Concise' },
  'result.export.feature.multi_platform': { zh: '多平台支持', en: 'Multi-platform Support' },
  'result.export.feature.auto_layout': { zh: '自动布局', en: 'Auto Layout' },
  'result.export.feature.chart_visualization': { zh: '图表可视化', en: 'Chart Visualization' },
  'result.export.feature.presentation_friendly': { zh: '演示友好', en: 'Presentation Friendly' },
  'result.export.feature.rich_templates': { zh: '模板丰富', en: 'Rich Templates' },
  'result.export.preview_modal_title': { zh: '预览', en: 'Preview' },
  'result.export.copy_content': { zh: '复制内容', en: 'Copy Content' },
  'result.export.download_file': { zh: '下载文件', en: 'Download File' },
  'result.export.tab.formats': { zh: '格式选择', en: 'Format Selection' },
  'result.export.tab.batch': { zh: '批量导出', en: 'Batch Export' },
  'result.export.tab.actions': { zh: '快捷操作', en: 'Quick Actions' },
  'result.export.batch.title': { zh: '批量导出', en: 'Batch Export' },
  'result.export.batch.description': { zh: '选择需要导出的格式，一键生成所有文件', en: 'Select formats to export and generate all files with one click' },
  'result.export.batch.export_progress': { zh: '导出进度', en: 'Export Progress' },
  'result.export.batch.export': { zh: '批量导出', en: 'Batch Export' },
  'result.export.batch.exporting': { zh: '导出中...', en: 'Exporting...' },
  'result.export.batch.estimated_size': { zh: '预计总文件大小', en: 'Estimated Total File Size' },
  'result.export.batch.success': { zh: '已批量导出', en: 'Batch exported' },
  'result.export.action.print_preview': { zh: '打印预览', en: 'Print Preview' },
  'result.export.action.print_desc': { zh: '生成适合打印的PDF版本', en: 'Generate print-ready PDF version' },
  'result.export.action.share_online': { zh: '在线分享', en: 'Share Online' },
  'result.export.action.share_desc': { zh: '生成可分享的在线链接', en: 'Generate shareable online link' },
  'result.export.action.email_send': { zh: '邮件发送', en: 'Email Send' },
  'result.export.action.email_desc': { zh: '直接发送到指定邮箱', en: 'Send directly to specified email' },
  'result.export.settings.title': { zh: '导出设置', en: 'Export Settings' },
  'result.export.settings.citation_format': { zh: '引用格式', en: 'Citation Format' },
  'result.export.settings.image_quality': { zh: '图片质量', en: 'Image Quality' },
  'result.export.settings.include_comments': { zh: '包含注释和修订', en: 'Include comments and revisions' },
  'result.export.settings.include_metadata': { zh: '包含元数据信息', en: 'Include metadata information' },
  'result.export.settings.quality.low': { zh: '低质量 (快速)', en: 'Low Quality (Fast)' },
  'result.export.settings.quality.medium': { zh: '中等质量', en: 'Medium Quality' },
  'result.export.settings.quality.high': { zh: '高质量 (推荐)', en: 'High Quality (Recommended)' },
  'result.export.generating': { zh: '正在生成演示文稿...', en: 'Generating presentation...' },

  // EvidencePackagePanel comprehensive translations
  'result.evidence.title': { zh: '写作过程证据包', en: 'Writing Process Evidence Package' },
  'result.evidence.subtitle': { zh: '写作过程证据包', en: 'Writing Process Evidence Package' },
  'result.evidence.traceable': { zh: '全程留痕可证', en: 'Fully Traceable & Verifiable' },
  'result.evidence.word_count': { zh: '总字数', en: 'Total Words' },
  'result.evidence.citation_count': { zh: '引用数', en: 'Citations' },
  'result.evidence.session_duration': { zh: '会话时长(分钟)', en: 'Session Duration (mins)' },
  'result.evidence.operation_records': { zh: '操作记录', en: 'Operation Records' },
  'result.evidence.export_pdf': { zh: '导出PDF', en: 'Export PDF' },
  'result.evidence.export_data': { zh: '导出数据', en: 'Export Data' },
  'result.evidence.complete_package': { zh: '完整包', en: 'Complete Package' },
  'result.evidence.tab.overview': { zh: '质量概览', en: 'Quality Overview' },
  'result.evidence.tab.timeline': { zh: '操作时间线', en: 'Operation Timeline' },
  'result.evidence.tab.sources': { zh: '引用来源', en: 'Citation Sources' },
  'result.evidence.tab.viva': { zh: '面谈准备', en: 'Viva Preparation' },
  'result.evidence.tab.share': { zh: '分享验证', en: 'Share & Verify' },
  'result.evidence.quality.title': { zh: '质量指标分析', en: 'Quality Metrics Analysis' },
  'result.evidence.quality.originality': { zh: '原创性评分', en: 'Originality Score' },
  'result.evidence.quality.citation_accuracy': { zh: '引用准确性', en: 'Citation Accuracy' },
  'result.evidence.quality.style_consistency': { zh: '风格一致性', en: 'Style Consistency' },
  'result.evidence.quality.structure_integrity': { zh: '结构完整性', en: 'Structure Integrity' },
  'result.evidence.quality.score': { zh: '评分', en: 'Score' },
  'result.evidence.integrity.title': { zh: '证据包完整性检查', en: 'Evidence Package Integrity Check' },
  'result.evidence.integrity.complete_timeline': { zh: '完整的操作时间线记录', en: 'Complete operation timeline record' },
  'result.evidence.integrity.verified_sources': { zh: '所有引用来源均已验证', en: 'All citation sources verified' },
  'result.evidence.integrity.viva_prepared': { zh: '面谈问题准备充分', en: 'Viva questions well prepared' },
  'result.evidence.integrity.session_reasonable': { zh: '写作会话时长合理', en: 'Writing session duration reasonable' },
  'result.evidence.integrity.quality_standards': { zh: '质量指标全部达标', en: 'All quality indicators meet standards' },
  'result.evidence.timeline.title': { zh: '写作活动时间线', en: 'Writing Activity Timeline' },
  'result.evidence.timeline.description': { zh: '记录完整的写作过程，包括用户操作、AI助手协作和系统验证', en: 'Records complete writing process including user operations, AI assistant collaboration and system verification' },
  'result.evidence.timeline.user': { zh: '用户', en: 'User' },
  'result.evidence.timeline.agent': { zh: 'AI助手', en: 'AI Assistant' },
  'result.evidence.timeline.system': { zh: '系统', en: 'System' },
  'result.evidence.timeline.other': { zh: '其他', en: 'Other' },
  'result.evidence.timeline.type.citation': { zh: '引用', en: 'Citation' },
  'result.evidence.timeline.type.edit': { zh: '编辑', en: 'Edit' },
  'result.evidence.timeline.type.generation': { zh: '生成', en: 'Generation' },
  'result.evidence.timeline.type.verification': { zh: '验证', en: 'Verification' },
  'result.evidence.timeline.type.export': { zh: '导出', en: 'Export' },
  'result.evidence.sources.title': { zh: '引用来源清单', en: 'Citation Sources List' },
  'result.evidence.sources.description': { zh: '所有引用均经过DOI/PMID验证，确保来源真实可靠', en: 'All citations verified through DOI/PMID to ensure authentic and reliable sources' },
  'result.evidence.sources.verified': { zh: '已验证', en: 'Verified' },
  'result.evidence.sources.pending': { zh: '待验证', en: 'Pending' },
  'result.evidence.sources.inserted_at': { zh: '插入时间', en: 'Inserted at' },
  'result.evidence.sources.view_doi': { zh: '查看DOI', en: 'View DOI' },
  'result.evidence.sources.export_csv': { zh: '导出CSV', en: 'Export CSV' },
  'result.evidence.sources.copy_bibtex': { zh: '复制BibTeX', en: 'Copy BibTeX' },
  'result.evidence.sources.exported': { zh: '引用清单已导出', en: 'Citation list exported' },
  'result.evidence.sources.bibtex_copied': { zh: 'BibTeX格式已复制', en: 'BibTeX format copied' },
  'result.evidence.viva.title': { zh: '口头核验问题准备', en: 'Oral Verification Question Preparation' },
  'result.evidence.viva.description': { zh: '根据论文内容生成的可能问题和建议答案', en: 'Possible questions and suggested answers generated based on paper content' },
  'result.evidence.viva.category.methodology': { zh: '研究方法', en: 'Research Methodology' },
  'result.evidence.viva.category.sources': { zh: '文献来源', en: 'Literature Sources' },
  'result.evidence.viva.category.analysis': { zh: '分析论证', en: 'Analysis & Argumentation' },
  'result.evidence.viva.category.contribution': { zh: '学术贡献', en: 'Academic Contribution' },
  'result.evidence.viva.category.technical': { zh: '技术细节', en: 'Technical Details' },
  'result.evidence.viva.category.other': { zh: '其他', en: 'Other' },
  'result.evidence.viva.expand': { zh: '展开', en: 'Expand' },
  'result.evidence.viva.collapse': { zh: '收起', en: 'Collapse' },
  'result.evidence.viva.suggested_answer': { zh: '建议回答', en: 'Suggested Answer' },
  'result.evidence.viva.key_points': { zh: '关键要点', en: 'Key Points' },
  'result.evidence.viva.related_sources': { zh: '相关文献', en: 'Related Sources' },
  'result.evidence.viva.preparation_tips': { zh: '面谈准备提示', en: 'Viva Preparation Tips' },
  'result.evidence.viva.tip1': { zh: '熟悉每个引用来源的核心观点和方法论', en: 'Familiarize yourself with core viewpoints and methodology of each citation source' },
  'result.evidence.viva.tip2': { zh: '准备解释自己的研究贡献和创新点', en: 'Prepare to explain your research contribution and innovation points' },
  'result.evidence.viva.tip3': { zh: '能够详细说明数据收集和分析过程', en: 'Be able to explain data collection and analysis process in detail' },
  'result.evidence.viva.tip4': { zh: '准备回答关于研究局限性和未来工作的问题', en: 'Prepare to answer questions about research limitations and future work' },
  'result.evidence.share.title': { zh: '分享链接生成', en: 'Share Link Generation' },
  'result.evidence.share.description': { zh: '生成只读分享链接，供导师或同事查看写作过程', en: 'Generate read-only share link for supervisors or colleagues to view writing process' },
  'result.evidence.share.generate_link': { zh: '生成分享链接', en: 'Generate Share Link' },
  'result.evidence.share.generating': { zh: '生成中...', en: 'Generating...' },
  'result.evidence.share.copy_link': { zh: '复制', en: 'Copy' },
  'result.evidence.share.copied': { zh: '链接已复制到剪贴板', en: 'Link copied to clipboard' },
  'result.evidence.share.expires_7days': { zh: '7天后过期', en: 'Expires in 7 days' },
  'result.evidence.share.readonly_access': { zh: '只读访问', en: 'Read-only access' },
  'result.evidence.share.qr_title': { zh: '二维码分享', en: 'QR Code Sharing' },
  'result.evidence.share.qr_description': { zh: '扫码即可访问证据包', en: 'Scan to access evidence package' },
  'result.evidence.share.qr_hint': { zh: '链接包含完整的写作过程记录和验证信息', en: 'Link contains complete writing process records and verification information' },
  'result.evidence.share.security_title': { zh: '分享安全提示', en: 'Share Security Tips' },
  'result.evidence.share.security.sensitive': { zh: '分享链接包含敏感的学术信息，请谨慎分享', en: 'Share link contains sensitive academic information, please share carefully' },
  'result.evidence.share.security.expires': { zh: '链接7天后自动过期，过期后无法访问', en: 'Link expires automatically after 7 days and becomes inaccessible' },
  'result.evidence.share.security.readonly': { zh: '访问者只能查看不能修改或下载', en: 'Visitors can only view but cannot modify or download' },
  'result.evidence.share.security.revoke': { zh: '可随时在设置中撤销分享权限', en: 'Can revoke share permissions in settings at any time' },
  'result.evidence.share.success': { zh: '分享链接生成成功', en: 'Share link generated successfully' },

  // StyleAnalysisPanel comprehensive translations
  'result.style.analysis.title': { zh: '文风相似度分析', en: 'Writing Style Similarity Analysis' },
  'result.style.analysis.description': { zh: '通过多维指标分析，评估当前文档与基准样本的文风相似程度', en: 'Assess writing style similarity between current document and baseline sample through multi-dimensional metrics analysis' },
  'result.style.baseline.title': { zh: '基准样本信息', en: 'Baseline Sample Information' },
  'result.style.baseline.description': { zh: '用于文风对比的参考样本详情', en: 'Reference sample details for style comparison' },
  'result.style.metrics.sentence_length': { zh: '平均句长', en: 'Average Sentence Length' },
  'result.style.metrics.lexical_variety': { zh: '词汇丰富度', en: 'Lexical Variety' },
  'result.style.metrics.burstiness': { zh: '句式变化', en: 'Sentence Variation' },
  'result.style.metrics.complexity': { zh: '语言复杂度', en: 'Language Complexity' },
  'result.style.current_document': { zh: '当前文档', en: 'Current Document' },
  'result.style.baseline_sample': { zh: '基准样本', en: 'Baseline Sample' },
  'result.style.similarity_score': { zh: '相似度评分', en: 'Similarity Score' },
  'result.style.distance_analysis': { zh: '距离分析', en: 'Distance Analysis' },
  'result.style.polish_level.light': { zh: '轻度润色', en: 'Light Polish' },
  'result.style.polish_level.medium': { zh: '中度润色', en: 'Medium Polish' },
  'result.style.polish_level.strong': { zh: '深度润色', en: 'Strong Polish' },
  'result.style.recommendation.title': { zh: '润色建议', en: 'Polish Recommendations' },
  'result.style.comparison.title': { zh: '对比分析', en: 'Comparison Analysis' },
  'result.style.radar_chart.title': { zh: '文风雷达图', en: 'Style Radar Chart' },
  'result.style.detailed_analysis': { zh: '详细分析', en: 'Detailed Analysis' },
  'result.style.upload_sample': { zh: '上传样本', en: 'Upload Sample' },
  'result.style.sample_info': { zh: '样本信息', en: 'Sample Information' },
  'result.style.language': { zh: '语言', en: 'Language' },
  'result.style.type': { zh: '类型', en: 'Type' },
  'result.style.upload_date': { zh: '上传时间', en: 'Upload Date' },
  'result.style.analysis_result': { zh: '分析结果', en: 'Analysis Result' },
  'result.style.polish_suggestions': { zh: '润色建议', en: 'Polish Suggestions' },
  'result.style.apply_polish': { zh: '应用润色', en: 'Apply Polish' },
  'result.style.polishing': { zh: '润色中...', en: 'Polishing...' },
  'result.style.polish_complete': { zh: '润色完成', en: 'Polish Complete' },
  'result.style.tab.analysis': { zh: '相似度分析', en: 'Similarity Analysis' },
  'result.style.tab.comparison': { zh: '对比分析', en: 'Comparison Analysis' },
  'result.style.tab.polish': { zh: '智能润色', en: 'Smart Polish' },
  'result.style.score': { zh: '分', en: 'points' },
  'result.style.excellent': { zh: '优秀', en: 'Excellent' },
  'result.style.good': { zh: '良好', en: 'Good' },
  'result.style.needs_improvement': { zh: '需要改进', en: 'Needs Improvement' },
  'result.style.sample.essay': { zh: '论文', en: 'Essay' },
  'result.style.sample.report': { zh: '报告', en: 'Report' },
  'result.style.sample.thesis': { zh: '学位论文', en: 'Thesis' },
  'result.style.sample.other': { zh: '其他', en: 'Other' },

  // StyleAnalysisPanel additional translations
  'result.style.title': { zh: '文风匹配分析', en: 'Style Matching Analysis' },
  'result.style.baseline_sample_name': { zh: '我的历史论文样本', en: 'My Historical Essay Sample' },
  'result.style.recommendation': { zh: '建议采用中度润色，在保持个人写作特点的同时提升学术表达的准确性和流畅性', en: 'Recommend medium polish to maintain personal writing characteristics while improving academic expression accuracy and fluency' },
  'result.style.personal_baseline': { zh: '个人基准', en: 'Personal Baseline' },
  'result.style.word_count': { zh: '字数', en: 'Word Count' },
  'result.style.type_essay': { zh: '论文', en: 'Essay' },
  'result.style.type_report': { zh: '报告', en: 'Report' },
  'result.style.type_thesis': { zh: '学位论文', en: 'Thesis' },
  'result.style.type_other': { zh: '其他', en: 'Other' },
  'result.style.language_label': { zh: '语言', en: 'Language' },
  'result.style.update_baseline': { zh: '更新基准', en: 'Update Baseline' },
  'result.style.match.excellent': { zh: '高度匹配', en: 'Excellent Match' },
  'result.style.match.good': { zh: '良好匹配', en: 'Good Match' },
  'result.style.match.fair': { zh: '一般匹配', en: 'Fair Match' },
  'result.style.match.poor': { zh: '匹配度低', en: 'Poor Match' },
  'result.style.distance': { zh: '距离', en: 'Distance' },
  'result.style.target_distance': { zh: '目标距离', en: 'Target Distance' },
  'result.style.based_on_history': { zh: '基于历史样本', en: 'Based on History' },
  'result.style.analyzing': { zh: '分析中...', en: 'Analyzing...' },
  'result.style.reanalyze': { zh: '重新分析', en: 'Re-analyze' },
  'result.style.analysis_updated': { zh: '分析结果已更新', en: 'Analysis results updated' },
  
  // Tab names
  'result.style.tab.overview': { zh: '概览', en: 'Overview' },
  'result.style.tab.metrics': { zh: '指标', en: 'Metrics' },
  'result.style.tab.history': { zh: '历史', en: 'History' },
  
  // Metrics
  'result.style.style_metrics_comparison': { zh: '文风指标对比', en: 'Style Metrics Comparison' },
  'result.style.recommended_target': { zh: '推荐目标', en: 'Recommended Target' },
  'result.style.radar_analysis': { zh: '雷达图分析', en: 'Radar Analysis' },
  'result.style.match_degree': { zh: '匹配度', en: 'Match Degree' },
  'result.style.metric.sentence_length': { zh: '句长', en: 'Sentence Length' },
  'result.style.metric.lexical_variety': { zh: '词汇丰富度', en: 'Lexical Variety' },
  'result.style.metric.burstiness': { zh: '突发性', en: 'Burstiness' },
  'result.style.metric.complexity': { zh: '复杂度', en: 'Complexity' },
  'result.style.metric.avg_sentence_length': { zh: '平均句长', en: 'Average Sentence Length' },
  'result.style.metric.expression_burstiness': { zh: '表达突发性', en: 'Expression Burstiness' },
  'result.style.metric.language_complexity': { zh: '语言复杂度', en: 'Language Complexity' },
  'result.style.current_value': { zh: '当前值', en: 'Current Value' },
  'result.style.adjust_suggestion': { zh: '建议调整以更好匹配基准样本', en: 'Recommend adjustment to better match baseline sample' },
  
  // Radar chart
  'result.style.radar.sentence_fit': { zh: '句长适配度', en: 'Sentence Length Fit' },
  'result.style.radar.lexical_consistency': { zh: '词汇一致性', en: 'Lexical Consistency' },
  'result.style.radar.expression_rhythm': { zh: '表达节奏', en: 'Expression Rhythm' },
  'result.style.radar.language_complexity': { zh: '语言复杂度', en: 'Language Complexity' },
  
  // History
  'result.style.optimization_history': { zh: '优化历史', en: 'Optimization History' },
  'result.style.optimization_records': { zh: '优化记录', en: 'Optimization Records' },
  'result.style.style_distance': { zh: '文风距离', en: 'Style Distance' },
  'result.style.version.draft': { zh: '初稿', en: 'Draft' },
  'result.style.version.revision1': { zh: '修订版1', en: 'Revision 1' },
  'result.style.version.revision2': { zh: '修订版2', en: 'Revision 2' },
  'result.style.version.current': { zh: '当前版本', en: 'Current' },
  
  // Polish settings
  'result.style.polish_intensity': { zh: '润色强度', en: 'Polish Intensity' },
  'result.style.polish_description': { zh: '选择合适的润色强度，平衡自然性和学术性', en: 'Choose appropriate polish intensity to balance naturalness and academic style' },
  'result.style.polish.light': { zh: '轻度润色', en: 'Light Polish' },
  'result.style.polish.light_desc': { zh: '保持原有表达风格，仅修正明显错误', en: 'Maintain original expression style, fix only obvious errors' },
  'result.style.polish.medium': { zh: '中度润色', en: 'Medium Polish' },
  'result.style.polish.medium_desc': { zh: '在保持个人特色的基础上提升学术表达', en: 'Enhance academic expression while maintaining personal characteristics' },
  'result.style.polish.strong': { zh: '深度润色', en: 'Strong Polish' },
  'result.style.polish.strong_desc': { zh: '全面优化学术表达，但保留核心思想', en: 'Comprehensively optimize academic expression while preserving core ideas' },
  'result.style.error_rate.light': { zh: '2-3%', en: '2-3%' },
  'result.style.error_rate.medium': { zh: '1-2%', en: '1-2%' },
  'result.style.error_rate.strong': { zh: '<1%', en: '<1%' },
  'result.style.natural_error_rate': { zh: '自然错误率', en: 'Natural Error Rate' },
  'result.style.non_native_friendly': { zh: '非母语友好设计', en: 'Non-Native Friendly Design' },
  'result.style.preserve_imperfection': { zh: '保留微小不完美，模拟真实写作', en: 'Preserve minor imperfections to simulate authentic writing' },
  'result.style.maintain_habits': { zh: '维持个人表达习惯和用词偏好', en: 'Maintain personal expression habits and word preferences' },
  'result.style.preserve_academic': { zh: '保持学术严谨性和逻辑结构', en: 'Preserve academic rigor and logical structure' },
  'result.style.auto_adjust': { zh: '根据文档类型自动调节润色程度', en: 'Auto-adjust polish level based on document type' },
  'result.style.polish_set': { zh: '润色级别已设置为 {{level}}', en: 'Polish level set to {{level}}' },

  // AgentCommandPanel comprehensive translations
  'result.agent.title': { zh: 'AI 智能助手', en: 'AI Smart Assistant' },
  'result.agent.description': { zh: '通过自然语言命令控制AI助手完成文档编辑任务', en: 'Control AI assistant with natural language commands to complete document editing tasks' },
  'result.agent.quick_commands': { zh: '快捷命令', en: 'Quick Commands' },
  'result.agent.advanced_commands': { zh: '高级命令', en: 'Advanced Commands' },
  'result.agent.custom_command': { zh: '自定义命令', en: 'Custom Command' },
  'result.agent.send_command': { zh: '发送命令', en: 'Send Command' },
  'result.agent.command_history': { zh: '命令历史', en: 'Command History' },
  'result.agent.status.pending': { zh: '等待执行', en: 'Pending' },
  'result.agent.status.executing': { zh: '执行中', en: 'Executing' },
  'result.agent.status.completed': { zh: '已完成', en: 'Completed' },
  'result.agent.status.failed': { zh: '执行失败', en: 'Failed' },
  'result.agent.quick.restructure': { zh: '将第2节拆分为"相关工作"和"研究方法"两个小节', en: 'Split Section 2 into "Related Work" and "Research Method" subsections' },
  'result.agent.quick.restructure_desc': { zh: '结构化重组织', en: 'Structural Reorganization' },
  'result.agent.quick.format_apa': { zh: '统一所有引用为APA 7格式，并检查一致性', en: 'Unify all citations to APA 7 format and check consistency' },
  'result.agent.quick.format_apa_desc': { zh: 'APA格式规范', en: 'APA Format Standards' },
  'result.agent.quick.add_chart': { zh: '根据第3段的数据生成对比图表，并添加图注', en: 'Generate comparison chart based on paragraph 3 data and add captions' },
  'result.agent.quick.add_chart_desc': { zh: '图表生成', en: 'Chart Generation' },
  'result.agent.quick.polish_style': { zh: '润色第1节语言表达，保持学术风格', en: 'Polish Section 1 language expression, maintain academic style' },
  'result.agent.quick.polish_style_desc': { zh: '语言润色', en: 'Language Polish' },
  'result.agent.template.comprehensive_review': { zh: '对全文进行综合评审：检查逻辑结构、引用完整性、语言表达，并生成修改建议', en: 'Comprehensive review of full text: check logical structure, citation integrity, language expression, and generate modification suggestions' },
  'result.agent.template.section_rewrite': { zh: '重写指定章节，提升逻辑清晰度和学术表达', en: 'Rewrite specified section to improve logical clarity and academic expression' },
  'result.agent.template.citation_enhance': { zh: '增强引用质量，添加权威文献支撑关键观点', en: 'Enhance citation quality, add authoritative literature to support key viewpoints' },
  'result.agent.template.structure_optimize': { zh: '优化文档结构，调整段落顺序和章节组织', en: 'Optimize document structure, adjust paragraph order and section organization' },
  'result.agent.input_placeholder': { zh: '输入自定义命令，例如："润色第3节的语言表达"或"添加更多关于机器学习的引用"', en: 'Enter custom command, e.g.: "Polish Section 3 language" or "Add more citations about machine learning"' },
  'result.agent.examples.title': { zh: '命令示例', en: 'Command Examples' },
  'result.agent.examples.structural': { zh: '结构调整："将第二章拆分为两个小节"', en: 'Structural: "Split Chapter 2 into two subsections"' },
  'result.agent.examples.formatting': { zh: '格式规范："统一所有图表的标题格式"', en: 'Formatting: "Standardize all chart title formats"' },
  'result.agent.examples.content': { zh: '内容修改："扩展结论部分，增加实践意义讨论"', en: 'Content: "Expand conclusion section, add practical significance discussion"' },
  'result.agent.examples.citation': { zh: '引用管理："检查所有DOI链接的有效性"', en: 'Citation: "Check validity of all DOI links"' },
  'result.agent.execution_time': { zh: '执行时间', en: 'Execution Time' },
  'result.agent.changes_made': { zh: '更改内容', en: 'Changes Made' },
  'result.agent.preview_changes': { zh: '预览更改', en: 'Preview Changes' },
  'result.agent.apply_changes': { zh: '应用更改', en: 'Apply Changes' },
  'result.agent.reject_changes': { zh: '拒绝更改', en: 'Reject Changes' },
  'result.agent.executing_command': { zh: '正在执行命令...', en: 'Executing command...' },
  'result.agent.command_completed': { zh: '命令执行完成', en: 'Command execution completed' },
  'result.agent.command_failed': { zh: '命令执行失败', en: 'Command execution failed' },
  'result.agent.try_again': { zh: '重试', en: 'Try Again' },
  'result.agent.clear_history': { zh: '清空历史', en: 'Clear History' },
  'result.agent.export_history': { zh: '导出历史', en: 'Export History' },
  'result.agent.tab.quick': { zh: '快捷命令', en: 'Quick Commands' },
  'result.agent.tab.advanced': { zh: '高级模板', en: 'Advanced Templates' },
  'result.agent.tab.history': { zh: '执行历史', en: 'Execution History' },
  'result.agent.type.structural': { zh: '结构调整', en: 'Structural' },
  'result.agent.type.formatting': { zh: '格式规范', en: 'Formatting' },
  'result.agent.type.citation': { zh: '引用管理', en: 'Citation' },
  'result.agent.type.style': { zh: '风格润色', en: 'Style' },
  'result.agent.type.chart': { zh: '图表生成', en: 'Chart' },

  // Settings translations
  'settings.account.title': { zh: '账户设置', en: 'Account Settings' },
  'settings.account.basic_info': { zh: '基本信息', en: 'Basic Information' },
  'settings.account.change_avatar': { zh: '更换头像', en: 'Change Avatar' },
  'settings.account.avatar_format': { zh: '支持 JPG、PNG 格式，不超过 2MB', en: 'Supports JPG, PNG format, max 2MB' },
  'settings.account.name': { zh: '姓名', en: 'Name' },
  'settings.account.email': { zh: '邮箱', en: 'Email' },
  'settings.account.verified': { zh: '已验证', en: 'Verified' },
  'settings.account.unverified': { zh: '未验证', en: 'Unverified' },
  'settings.account.timezone': { zh: '时区', en: 'Timezone' },
  'settings.account.language': { zh: '界面语言', en: 'Interface Language' },
  'settings.account.language.zh_cn': { zh: '简体中文', en: 'Simplified Chinese' },
  'settings.account.language.zh_tw': { zh: '繁体中文', en: 'Traditional Chinese' },
  'settings.account.language.en_us': { zh: '英语', en: 'English' },
  'settings.account.save_changes': { zh: '保存更改', en: 'Save Changes' },
  'settings.account.saving': { zh: '保存中...', en: 'Saving...' },
  'settings.account.invoice_title': { zh: '发票抬头信息', en: 'Invoice Information' },
  'settings.account.invoice_type': { zh: '抬头类型', en: 'Invoice Type' },
  'settings.account.invoice_personal': { zh: '个人', en: 'Personal' },
  'settings.account.invoice_company': { zh: '企业', en: 'Company' },
  'settings.account.company_name': { zh: '企业名称', en: 'Company Name' },
  'settings.account.personal_name': { zh: '姓名', en: 'Name' },
  'settings.account.tax_id': { zh: '统一社会信用代码', en: 'Tax ID' },
  'settings.account.address': { zh: '地址', en: 'Address' },
  'settings.account.zip': { zh: '邮政编码', en: 'ZIP Code' },
  'settings.account.phone': { zh: '联系电话', en: 'Phone' },
  'settings.account.save_invoice': { zh: '保存发票抬头', en: 'Save Invoice Info' },
  'settings.toast.basic_saved': { zh: '基本信息已保存', en: 'Basic info saved' },
  'settings.toast.invoice_saved': { zh: '发票抬头已保存', en: 'Invoice info saved' },
  'settings.toast.save_failed': { zh: '保存失败，请重试', en: 'Save failed, please try again' },
  'settings.toast.avatar_dev': { zh: '头像上传功能开发中', en: 'Avatar upload in development' },

  // Security settings translations
  'settings.security.change_password': { zh: '修改密码', en: 'Change Password' },
  'settings.security.current_password': { zh: '当前密码', en: 'Current Password' },
  'settings.security.new_password': { zh: '新密码', en: 'New Password' },
  'settings.security.confirm_password': { zh: '确认新密码', en: 'Confirm New Password' },
  'settings.security.changing': { zh: '修改中...', en: 'Changing...' },
  'settings.security.two_factor': { zh: '双重验证 (2FA)', en: 'Two-Factor Authentication (2FA)' },
  'settings.security.two_factor_enabled': { zh: '双重验证已开启', en: 'Two-factor authentication enabled' },
  'settings.security.two_factor_disabled': { zh: '双重验证已关闭', en: 'Two-factor authentication disabled' },
  'settings.security.two_factor_desc': { zh: '通过手机应用程序增强您的账户安全性', en: 'Enhance your account security with mobile app' },
  'settings.security.sessions_title': { zh: '登录设备与会话', en: 'Login Devices & Sessions' },
  'settings.security.logout_all': { zh: '退出所有设备', en: 'Logout All Devices' },
  'settings.security.device': { zh: '设备', en: 'Device' },
  'settings.security.browser': { zh: '浏览器', en: 'Browser' },
  'settings.security.location': { zh: '位置', en: 'Location' },
  'settings.security.last_active': { zh: '最后活跃', en: 'Last Active' },
  'settings.security.actions': { zh: '操作', en: 'Actions' },
  'settings.security.current_device': { zh: '当前设备', en: 'Current Device' },
  'settings.security.logout': { zh: '退出', en: 'Logout' },
  'settings.security.enable_2fa_title': { zh: '开启双重验证', en: 'Enable Two-Factor Authentication' },
  'settings.security.enable_2fa_desc': { zh: '使用认证应用扫描二维码来设置双重验证', en: 'Scan QR code with authenticator app to setup 2FA' },
  'settings.security.recovery_codes': { zh: '恢复码 (请安全保存)', en: 'Recovery Codes (Save Securely)' },
  'settings.security.recovery_codes_desc': { zh: '请妥善保存恢复码', en: 'Please save recovery codes safely' },
  'settings.security.copy_codes': { zh: '复制恢复码', en: 'Copy Recovery Codes' },
  'settings.security.warning_title': { zh: '请妥善保存恢复码', en: 'Please save recovery codes safely' },
  'settings.security.warning_desc': { zh: '如果您丢失了认证设备，恢复码是找回账户的唯一方式。', en: 'Recovery codes are the only way to access your account if you lose your authentication device.' },
  'settings.security.enable_auth': { zh: '开启验证', en: 'Enable Authentication' },
  'settings.toast.password_required': { zh: '请填写所有密码字段', en: 'Please fill in all password fields' },
  'settings.toast.password_mismatch': { zh: '新密码和确认密码不匹配', en: 'New password and confirmation do not match' },
  'settings.toast.password_length': { zh: '新密码长度至少8位', en: 'New password must be at least 8 characters' },
  'settings.toast.password_changed': { zh: '密码修改成功', en: 'Password changed successfully' },
  'settings.toast.password_failed': { zh: '密码修改失败，请重试', en: 'Password change failed, please try again' },
  'settings.toast.disable_2fa_confirm': { zh: '确定要关闭双重验证吗？这会降低您的账户安全性。', en: 'Are you sure to disable 2FA? This will reduce your account security.' },
  'settings.toast.2fa_disabled': { zh: '双重验证已关闭', en: 'Two-factor authentication disabled' },
  'settings.toast.2fa_enabled': { zh: '双重验证已开启', en: 'Two-factor authentication enabled' },
  'settings.toast.device_logout': { zh: '设备已退出登录', en: 'Device logged out' },
  'settings.toast.logout_all_confirm': { zh: '确定要退出所有设备的登录吗？（当前设备除外）', en: 'Log out of all devices? (except current device)' },
  'settings.toast.logout_all_success': { zh: '已退出所有其他设备', en: 'Logged out of all other devices' },
  'settings.toast.codes_copied': { zh: '恢复码已复制到剪贴板', en: 'Recovery codes copied to clipboard' },
  
  // 计费设置
  'settings.billing.word_package_balance': { zh: '字数包余额', en: 'Word Package Balance' },
  'settings.billing.remaining_words': { zh: '剩余字数', en: 'Remaining Words' },
  'settings.billing.buy_word_package': { zh: '购买字数包', en: 'Buy Word Package' },
  'settings.billing.order_history': { zh: '订单记录', en: 'Order History' },
  'settings.billing.order_time': { zh: '订单时间', en: 'Order Time' },
  'settings.billing.type': { zh: '类型', en: 'Type' },
  'settings.billing.title': { zh: '标题', en: 'Title' },
  'settings.billing.amount': { zh: '金额', en: 'Amount' },
  'settings.billing.status': { zh: '状态', en: 'Status' },
  'settings.billing.actions': { zh: '操作', en: 'Actions' },
  'settings.billing.basic_unlock': { zh: '基础解锁', en: 'Basic Unlock' },
  'settings.billing.additional_service': { zh: '附加服务', en: 'Additional Service' },
  'settings.billing.details': { zh: '详情', en: 'Details' },
  'settings.billing.invoice': { zh: '发票', en: 'Invoice' },
  'settings.billing.invoice_management': { zh: '发票管理', en: 'Invoice Management' },
  'settings.billing.request_invoice': { zh: '申请补开', en: 'Request Invoice' },
  'settings.billing.download_pdf': { zh: '下载 PDF', en: 'Download PDF' },
  'settings.billing.status_paid': { zh: '已付费', en: 'Paid' },
  'settings.billing.status_refunded': { zh: '已退款', en: 'Refunded' },
  'settings.billing.status_failed': { zh: '支付失败', en: 'Payment Failed' },
  'settings.billing.invoice_status_issued': { zh: '已开具', en: 'Issued' },
  'settings.billing.invoice_status_pending': { zh: '处理中', en: 'Pending' },
  'settings.billing.dialog_title': { zh: '购买字数包', en: 'Buy Word Package' },
  'settings.billing.dialog_description': { zh: '选择适合您需求的字数包，一次购买，多次使用', en: 'Choose a word package that suits your needs, buy once and use multiple times' },
  'settings.billing.basic_package': { zh: '基础包', en: 'Basic Package' },
  'settings.billing.standard_package': { zh: '标准包', en: 'Standard Package' },
  'settings.billing.professional_package': { zh: '专业包', en: 'Professional Package' },
  'settings.billing.words_unit': { zh: '字', en: 'words' },
  'settings.billing.save_amount': { zh: '节省', en: 'Save' },
  'settings.billing.package_desc': { zh: '字数包永不过期，可用于任何写作项目', en: 'Word packages never expire and can be used for any writing project' },
  'settings.billing.buy_now': { zh: '立即购买', en: 'Buy Now' },
  'settings.billing.toast_view_order': { zh: '查看订单详情', en: 'View order details' },
  'settings.billing.toast_download_invoice': { zh: '开始下载发票', en: 'Starting invoice download' },
  'settings.billing.toast_invoice_not_ready': { zh: '发票尚未生成', en: 'Invoice not ready yet' },
  'settings.billing.toast_invoice_request_sent': { zh: '补开发票申请已提交，我们将在3个工作日内处理', en: 'Invoice request submitted, we will process it within 3 business days' },
  'settings.billing.toast_package_dev': { zh: '字数包购买功能开发中', en: 'Word package purchase feature in development' },

  // 数据隐私设置
  'settings.data_privacy.export.title': { zh: '导出全部数据', en: 'Export All Data' },
  'settings.data_privacy.export.description': { zh: '您可以导出账户中的所有数据，包括文档、引用、审计记录等。数据将以ZIP格式打包，并发送下载链接到您的邮箱。', en: 'You can export all data in your account, including documents, citations, audit records, etc. Data will be packaged in ZIP format and a download link will be sent to your email.' },
  'settings.data_privacy.export.content_label': { zh: '导出内容包括：', en: 'Export content includes:' },
  'settings.data_privacy.export.content.documents': { zh: '所有文稿内容', en: 'All Document Content' },
  'settings.data_privacy.export.content.documents_desc': { zh: '包括草稿和已完成的文档', en: 'Including drafts and completed documents' },
  'settings.data_privacy.export.content.citations': { zh: '引用数据', en: 'Citation Data' },
  'settings.data_privacy.export.content.citations_desc': { zh: '所有引用来源和核验记录', en: 'All citation sources and verification records' },
  'settings.data_privacy.export.content.audit_logs': { zh: '审计日志', en: 'Audit Logs' },
  'settings.data_privacy.export.content.audit_logs_desc': { zh: '完整的操作历史记录', en: 'Complete operation history records' },
  'settings.data_privacy.export.content.orders': { zh: '订单记录', en: 'Order Records' },
  'settings.data_privacy.export.content.orders_desc': { zh: '付费记录和发票信息', en: 'Payment records and invoice information' },
  'settings.data_privacy.export.content.settings': { zh: '个人设置', en: 'Personal Settings' },
  'settings.data_privacy.export.content.settings_desc': { zh: '偏好设置和配置信息', en: 'Preferences and configuration information' },
  'settings.data_privacy.export.button_idle': { zh: '开始导出数据', en: 'Start Data Export' },
  'settings.data_privacy.export.button_loading': { zh: '正在打包...', en: 'Packaging...' },
  'settings.data_privacy.clear_drafts.title': { zh: '清除草稿数据', en: 'Clear Draft Data' },
  'settings.data_privacy.clear_drafts.description': { zh: '清除本地缓存的草稿数据和临时文件。这将删除您在浏览器中保存的未提交内容。', en: 'Clear locally cached draft data and temporary files. This will delete unsaved content stored in your browser.' },
  'settings.data_privacy.clear_drafts.warning': { zh: '此操作不可逆转。请确保您已保存所有重要的草稿内容。', en: 'This operation is irreversible. Please ensure you have saved all important draft content.' },
  'settings.data_privacy.clear_drafts.button': { zh: '清除草稿数据', en: 'Clear Draft Data' },
  'settings.data_privacy.danger_zone.title': { zh: '危险操作区域', en: 'Danger Zone' },
  'settings.data_privacy.danger_zone.close_account.title': { zh: '关闭账户', en: 'Close Account' },
  'settings.data_privacy.danger_zone.close_account.description': { zh: '永久删除您的账户和所有相关数据。此操作不可逆转，请谨慎考虑。', en: 'Permanently delete your account and all related data. This operation is irreversible, please consider carefully.' },
  'settings.data_privacy.danger_zone.close_account.consequences.title': { zh: '账户关闭后将发生以下情况：', en: 'The following will happen after account closure:' },
  'settings.data_privacy.danger_zone.close_account.consequences.docs_deleted': { zh: '所有文档和数据将被永久删除', en: 'All documents and data will be permanently deleted' },
  'settings.data_privacy.danger_zone.close_account.consequences.no_recovery': { zh: '无法恢复任何内容或访问历史记录', en: 'Cannot recover any content or access history' },
  'settings.data_privacy.danger_zone.close_account.consequences.subscription_cancel': { zh: '订阅服务将被取消（按比例退款）', en: 'Subscription services will be canceled (prorated refund)' },
  'settings.data_privacy.danger_zone.close_account.consequences.email_blocked': { zh: '您将无法使用此邮箱重新注册', en: 'You will not be able to re-register with this email' },
  'settings.data_privacy.danger_zone.close_account.button': { zh: '关闭账户', en: 'Close Account' },
  'settings.data_privacy.dialog.clear_drafts.title': { zh: '确认清除草稿', en: 'Confirm Clear Drafts' },
  'settings.data_privacy.dialog.clear_drafts.description': { zh: '此操作将清除所有本地缓存的草稿数据和临时文件。', en: 'This operation will clear all locally cached draft data and temporary files.' },
  'settings.data_privacy.dialog.clear_drafts.warning': { zh: '清除后无法恢复未保存的草稿内容，请确保您已保存所有重要数据。', en: 'Cleared content cannot be recovered. Please ensure you have saved all important data.' },
  'settings.data_privacy.dialog.clear_drafts.button_idle': { zh: '确认清除', en: 'Confirm Clear' },
  'settings.data_privacy.dialog.clear_drafts.button_loading': { zh: '清除中...', en: 'Clearing...' },
  'settings.data_privacy.dialog.close_account.title': { zh: '关闭账户确认', en: 'Confirm Account Closure' },
  'settings.data_privacy.dialog.close_account.description': { zh: '此操作将永久删除您的账户，无法撤销。', en: 'This operation will permanently delete your account and cannot be undone.' },
  'settings.data_privacy.dialog.close_account.warning': { zh: '警告：账户关闭后，所有数据将被永久删除且无法恢复。', en: 'Warning: After account closure, all data will be permanently deleted and cannot be recovered.' },
  'settings.data_privacy.dialog.close_account.email_label': { zh: '请输入您的邮箱地址以确认此操作：', en: 'Please enter your email address to confirm this operation:' },
  'settings.data_privacy.dialog.close_account.button': { zh: '确认关闭账户', en: 'Confirm Close Account' },
  'settings.data_privacy.toast.export_start': { zh: '数据打包已开始，完成后将发送下载链接到您的邮箱', en: 'Data packaging has started. Download link will be sent to your email when completed' },
  'settings.data_privacy.toast.export_failed': { zh: '数据导出失败，请重试', en: 'Data export failed, please try again' },
  'settings.data_privacy.toast.drafts_cleared': { zh: '草稿数据已清除', en: 'Draft data has been cleared' },
  'settings.data_privacy.toast.clear_failed': { zh: '清除失败，请重试', en: 'Clear failed, please try again' },
  'settings.data_privacy.toast.email_incorrect': { zh: '邮箱地址不正确', en: 'Email address is incorrect' },
  'settings.data_privacy.toast.account_close_submitted': { zh: '账户关闭请求已提交，我们将在7个工作日内处理', en: 'Account closure request has been submitted, we will process it within 7 business days' },
  'settings.data_privacy.toast.account_close_failed': { zh: '账户关闭失败，请联系客服', en: 'Account closure failed, please contact customer service' },

  // 用户档案头部
  'profile.header.email_verified': { zh: '已验证', en: 'Verified' },
  'profile.header.email_not_verified': { zh: '未验证', en: 'Unverified' },
  'profile.header.last_login': { zh: '最后登录：', en: 'Last login: ' },
  'profile.header.edit_profile': { zh: '编辑资料', en: 'Edit Profile' },
  'profile.header.manage_security': { zh: '管理安全', en: 'Manage Security' },
  'profile.header.billing_invoices': { zh: '订单发票', en: 'Billing & Invoices' },
  'profile.header.download_data': { zh: '下载数据', en: 'Download Data' },

  // 最近活动翻译
  'profile.activity.title': { zh: '最近活动', en: 'Recent Activity' },
  'profile.activity.time.days_ago': { zh: '天前', en: ' days ago' },
  'profile.activity.time.hours_ago': { zh: '小时前', en: ' hours ago' },
  'profile.activity.time.minutes_ago': { zh: '分钟前', en: ' minutes ago' },
  'profile.activity.time.just_now': { zh: '刚刚', en: 'Just now' },

  // 用户档案统计
  'profile.stats.total_words': { zh: '累计字数', en: 'Total Words' },
  'profile.stats.citation_pass_rate': { zh: '引用核验通过率', en: 'Citation Verification Pass Rate' },
  'profile.stats.export_count': { zh: '已导出次数', en: 'Export Count' },
  'profile.stats.wan_suffix': { zh: '万', en: 'K' },

  // 个人资料 - 快速队列
  'profile.quick_queues.gate1.title': { zh: '待解锁生成', en: 'Pending Generation' },
  'profile.quick_queues.gate1.empty': { zh: '暂无待解锁文档', en: 'No pending documents' },
  'profile.quick_queues.gate1.unlock_button': { zh: '解锁生成', en: 'Unlock & Generate' },
  'profile.quick_queues.gate1.preview_button': { zh: '预览', en: 'Preview' },
  'profile.quick_queues.gate2.title': { zh: '待导出/需补购', en: 'Export/Purchase Required' },
  'profile.quick_queues.gate2.empty': { zh: '暂无待处理文档', en: 'No documents to process' },
  'profile.quick_queues.gate2.purchase_button': { zh: '追加并导出', en: 'Add & Export' },
  'profile.quick_queues.word_count': { zh: '字', en: ' words' },
  'profile.quick_queues.citation_count': { zh: '个引用', en: ' citations' },
  'profile.quick_queues.addon.plagiarism': { zh: '抄袭检测', en: 'Plagiarism Check' },
  'profile.quick_queues.addon.ai_check': { zh: 'AI检测', en: 'AI Detection' },
  'profile.quick_queues.addon.evidence_pack': { zh: '证据包', en: 'Evidence Pack' },
  'profile.quick_queues.addon.latex': { zh: 'LaTeX', en: 'LaTeX' },
  'profile.quick_queues.addon.defense_card': { zh: '答辩卡', en: 'Defense Card' },
  'profile.quick_queues.addon.share_link': { zh: '分享链接', en: 'Share Link' },
  'profile.quick_queues.toast.unlock_prepare': { zh: '准备解锁文档', en: 'Preparing to unlock document' },
  'profile.quick_queues.toast.preview_open': { zh: '打开预览模式', en: 'Opening preview mode' },
  'profile.quick_queues.toast.addon_purchase_prepare': { zh: '准备购买附加服务', en: 'Preparing to purchase add-ons' },
  'profile.quick_queues.toast.price_expired': { zh: '价格已过期', en: 'Price has expired' },

  // Agent 相关翻译
  'agent.status.idle': { zh: '待命中', en: 'Idle' },
  'agent.status.planning': { zh: '解析中', en: 'Planning' },
  'agent.status.preview': { zh: '预览中', en: 'Preview' },
  'agent.status.applying': { zh: '执行中', en: 'Applying' },
  'agent.status.success': { zh: '已完成', en: 'Success' },
  'agent.status.error': { zh: '执行失败', en: 'Error' },
  'agent.status.partial': { zh: '部分成功', en: 'Partial Success' },
  'agent.tabs.command': { zh: '命令执行', en: 'Command Execution' },
  'agent.tabs.audit': { zh: '操作审计', en: 'Operation Audit' },
  'agent.buttons.reset': { zh: '重置', en: 'Reset' },
  'agent.buttons.apply': { zh: '应用修改', en: 'Apply Changes' },
  'agent.buttons.save_recipe': { zh: '保存为配方', en: 'Save as Recipe' },
  'agent.buttons.undo': { zh: '撤销上次操作', en: 'Undo Last Operation' },
  'agent.messages.description': { zh: '使用自然语言描述您想要的修改，Agent 将解析并预览变更。', en: 'Describe the changes you want in natural language, Agent will parse and preview the modifications.' },
  'agent.messages.error_title': { zh: '执行出错', en: 'Execution Error' },
  'agent.messages.applying': { zh: '正在应用修改...', en: 'Applying changes...' },
  'agent.messages.progress_percent': { zh: '%', en: '%' },
  'agent.plan.title': { zh: '执行计划', en: 'Execution Plan' },
  'agent.plan.steps_count': { zh: '个步骤', en: ' steps' },
  'agent.plan.estimated_time': { zh: '预计用时', en: 'Estimated Time' },
  'agent.plan.warnings_title': { zh: '注意事项', en: 'Warnings' },
  'agent.plan.dependencies_title': { zh: '缺少依赖', en: 'Missing Dependencies' },
  'agent.plan.dependencies_message': { zh: '需要解决以下问题才能执行', en: 'The following issues need to be resolved before execution' },
  'agent.diff.title': { zh: '变更预览', en: 'Change Preview' },
  'agent.success.message': { zh: '修改已成功应用到文档', en: 'Changes have been successfully applied to the document' },
  'agent.toast.command_failed': { zh: '命令解析失败', en: 'Command parsing failed' },
  'agent.toast.success_with_time': { zh: '修改已成功应用！耗时', en: 'Changes successfully applied! Time taken' },
  'agent.toast.partial_success': { zh: '部分修改成功，失败', en: 'Partial success, failed' },
  'agent.toast.undo_success': { zh: '操作已成功撤销', en: 'Operation successfully undone' },
  'agent.toast.undo_failed': { zh: '撤销失败', en: 'Undo failed' },
  'agent.toast.recipe_saved': { zh: '配方已保存', en: 'Recipe saved' },
  'agent.toast.recipe_save_failed': { zh: '保存配方失败', en: 'Failed to save recipe' },
  'agent.prompt.recipe_name': { zh: '请为这个命令配方命名:', en: 'Please name this command recipe:' },
  'agent.recipe.description_template': { zh: '包含 个步骤的 Agent 命令', en: 'Agent command containing  steps' },

  // Agent Panel additional translations
  'agent.command.title': { zh: 'AI 智能助手', en: 'AI Smart Assistant' },
  'agent.command.subtitle': { zh: '通过自然语言命令控制AI助手完成文档编辑任务', en: 'Control AI assistant with natural language commands to complete document editing tasks' },
  'agent.command.placeholder': { zh: '输入 Agent 命令，例如：把第 2 章拆成 related work 和 method，统一 APA7，插入统计图...', en: 'Enter Agent command, e.g.: Split Chapter 2 into related work and method, standardize APA7, insert statistics chart...' },
  'agent.command.execution_failed': { zh: '执行失败', en: 'Execution Failed' },
  'agent.command.execution_progress': { zh: '执行进度', en: 'Execution Progress' },
  'agent.command.processing': { zh: '处理中', en: 'Processing' },
  'agent.command.cancelled': { zh: '命令已取消', en: 'Command Cancelled' },
  'agent.scope.document': { zh: '整个文档', en: 'Entire Document' },
  'agent.scope.chapter': { zh: '第 章', en: 'Chapter ' },
  'agent.scope.section': { zh: '第 节', en: 'Section ' },
  'agent.scope.selection': { zh: '选中内容', en: 'Selected Content' },
  'agent.scope.label': { zh: '作用域', en: 'Scope' },
  'agent.input.examples.title': { zh: '示例命令', en: 'Example Commands' },
  'agent.input.examples.structural': { zh: '结构调整', en: 'Structural Adjustment' },
  'agent.input.examples.format': { zh: '格式规范', en: 'Format Standards' },
  'agent.input.examples.content': { zh: '内容增补', en: 'Content Enhancement' },
  'agent.input.shortcut.execute': { zh: 'Ctrl+Enter 执行', en: 'Ctrl+Enter to Execute' },
  'agent.input.shortcut.focus': { zh: 'A 键聚焦', en: 'A key to Focus' },
  'agent.input.shortcut.examples': { zh: '查看示例', en: 'View Examples' },
  'agent.input.supported_features': { zh: '支持的功能', en: 'Supported Features' },
  'agent.input.executing': { zh: '执行中', en: 'Executing' },
  'agent.input.execute_command': { zh: '执行命令', en: 'Execute Command' },
  'agent.input.common_templates': { zh: '常用模板', en: 'Common Templates' }
};

// 翻译函数
export const translate = (key: TranslationKey, language: Language): string => {
  const translation = translations[key];
  if (!translation) {
    // Fallback: 返回key本身，便于开发时发现缺失的翻译
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }
  return translation[language];
};