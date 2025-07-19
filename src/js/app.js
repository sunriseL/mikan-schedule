// 主应用类
class ScheduleApp {
    constructor(container, config = CONFIG) {
        this.container = container;
        this.config = config;
        this.dataManager = new ScheduleDataManager();
        this.components = new Map();
        this.currentFilters = {};
        this.currentView = 'calendar'; // 默认日历视图
        
        this.init();
    }
    
    // 初始化应用
    async init() {
        await this.loadDefaultData();
        this.render();
        this.bindEvents();
        this.startAnimations();
        
        // 初始化语言相关文本
        this.updateLanguageTexts();
        
        // 监听语言变化
        languageManager.addListener((newLanguage) => {
            this.onLanguageChange(newLanguage);
        });
    }
    
    // 加载默认数据
    async loadDefaultData() {
        // 先尝试从外部JSON文件加载数据
        const data = await loadActivitiesData();
        this.dataManager.loadFromJSON(data);
        // 不再清理历史活动，保留所有年份的活动
        // this.dataManager.cleanHistoricalEvents();
    }
    
    // 渲染页面
    render() {
        this.container.innerHTML = '';
        this.components.clear(); // 清理所有组件
        
        // 渲染头部
        const header = new HeaderComponent(this.config);
        header.mount(this.container);
        this.components.set('header', header);
        
        // 渲染过滤器（移到活动列表上面）
        this.renderFilter();
        
        // 渲染主要内容区域
        const mainContent = document.createElement('main');
        mainContent.className = this.currentView === 'calendar' ? 'main-content calendar-view' : 'main-content';
        this.container.appendChild(mainContent);
        
        // 根据当前视图决定布局
        if (this.currentView === 'calendar') {
            // 日历视图：全宽显示，不显示左侧特色人物
            this.renderEventList(mainContent);
        } else {
            // 列表视图：显示左侧特色人物和右侧活动列表
            const featuredPerson = this.dataManager.getFeaturedPerson();
            if (featuredPerson) {
                const personComponent = new FeaturedPersonComponent(featuredPerson);
                personComponent.mount(mainContent);
                this.components.set('featuredPerson', personComponent);
            }
            
            // 渲染右侧面板（活动列表）
            this.renderEventList(mainContent);
        }
        
        // 渲染统计信息
        this.renderStats();
        
        // 渲染底部装饰
        this.renderBottomDecoration();
    }
    
    // 渲染活动列表
    renderEventList(container) {
        const categories = this.dataManager.getCategories();
        
        if (this.currentView === 'calendar') {
            // 对于日历视图，传递所有活动，让日历组件自己根据年份过滤
            const events = this.dataManager.getEvents();
            const calendarView = new CalendarViewComponent(events, categories);
            calendarView.mount(container);
            this.components.set('eventList', calendarView);
        } else {
            // 对于列表视图，使用新的筛选逻辑
            // 如果没有设置筛选条件，默认显示本周的活动
            if (!this.currentFilters.timeRange) {
                this.currentFilters.timeRange = 'thisWeek';
            }
            const events = this.dataManager.getEvents(this.currentFilters);
            const eventList = new EventListComponent(events, categories);
            eventList.mount(container);
            this.components.set('eventList', eventList);
        }
    }
    
    // 渲染过滤器
    renderFilter() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-section';
        this.container.appendChild(filterContainer);
        
        // 渲染视图切换组件
        const viewToggle = new ViewToggleComponent((view) => {
            this.currentView = view;
            this.render(); // 重新渲染整个页面
        }, this.currentView);
        viewToggle.mount(filterContainer);
        this.components.set('viewToggle', viewToggle);
        
        // 根据当前视图渲染不同的筛选组件
        if (this.currentView === 'list') {
            const categories = this.dataManager.getCategories();
            const listFilter = new ListViewFilterComponent(categories, (filters) => {
                this.currentFilters = filters;
                this.updateEventList();
            });
            listFilter.mount(filterContainer);
            this.components.set('listFilter', listFilter);
        }
        // 日历视图不需要额外的筛选选项
    }
    
    // 渲染统计信息
    renderStats() {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-section';
        this.container.appendChild(statsContainer);
        
        const stats = new StatsComponent(this.dataManager);
        stats.mount(statsContainer);
        this.components.set('stats', stats);
    }
    
    // 渲染底部装饰
    renderBottomDecoration() {
        const decoration = document.createElement('div');
        decoration.className = 'bottom-decoration';
        decoration.innerHTML = `
            <div class="diamond-patterns">
                <div class="diamond">◆</div>
                <div class="diamond">◆</div>
                <div class="diamond">◆</div>
                <div class="diamond">◆</div>
                <div class="diamond">◆</div>
            </div>
            <div class="pr-note">${languageManager.t('prNote')}</div>
        `;
        this.container.appendChild(decoration);
    }
    
    // 更新活动列表
    updateEventList() {
        const eventList = this.components.get('eventList');
        if (eventList) {
            eventList.destroy();
        }
        
        const mainContent = this.container.querySelector('.main-content');
        this.renderEventList(mainContent);
        
        // 更新过滤器计数
        this.updateFilterCount();
    }
    
    // 更新过滤器计数
    updateFilterCount() {
        // 更新列表视图筛选组件的计数
        const listFilter = this.components.get('listFilter');
        if (listFilter && listFilter.element) {
            const countElement = listFilter.element.querySelector('.current-count');
            if (countElement) {
                const filteredEvents = this.dataManager.getEvents(this.currentFilters);
                countElement.textContent = filteredEvents.length;
            }
        }
    }
    
    // 绑定事件
    bindEvents() {
        // 事件委托：处理活动卡片点击（包括列表视图和日历视图）
        this.container.addEventListener('click', (e) => {
            const eventSection = e.target.closest('.event-section');
            const calendarEventCard = e.target.closest('.calendar-event-card');
            
            // 检查是否点击的是活动卡片内的图片
            const isImageInEventCard = e.target.closest('img') && 
                (eventSection || calendarEventCard);
            
            // 防止重复触发
            if (e.defaultPrevented) return;
            
            if (eventSection) {
                console.log('点击列表视图活动卡片:', eventSection.dataset.eventId);
                this.showEventDetails(eventSection);
            } else if (calendarEventCard) {
                console.log('点击日历视图活动卡片:', calendarEventCard.dataset.eventId);
                this.showEventDetails(calendarEventCard);
            } else if (!isImageInEventCard) {
                // 只有在不是活动卡片内的图片时才显示图片模态框
                const image = e.target.closest('img');
                if (image) {
                    console.log('点击独立图片:', image.src);
                    e.stopPropagation();
                    this.showImageModal(image.src, image.alt);
                }
            }
        });
        
        // 处理悬停效果
        this.container.addEventListener('mouseenter', (e) => {
            const eventSection = e.target.closest('.event-section');
            if (eventSection) {
                eventSection.style.transform = 'translateY(-5px)';
                eventSection.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.2)';
            }
        }, true);
        
        this.container.addEventListener('mouseleave', (e) => {
            const eventSection = e.target.closest('.event-section');
            if (eventSection) {
                eventSection.style.transform = 'translateY(0)';
                eventSection.style.boxShadow = '0 4px 15px rgba(139, 69, 19, 0.1)';
            }
        }, true);
    }
    
    // 显示活动详情
    showEventDetails(eventSection) {
        const eventId = eventSection.dataset.eventId;
        const events = this.dataManager.getEvents();
        const event = events.find(e => e.id == eventId);
        
        console.log('显示活动详情:', eventId, event);
        
        if (!event) {
            console.warn('未找到活动:', eventId);
            return;
        }
        
        const category = this.dataManager.getCategories().find(c => c.id === event.category);
        
        // 格式化完整日期（包含年份）
        const formattedDate = this.formatFullDate(event.dateRange, event.year);
        
        // 格式化时间信息
        const timeInfo = this.formatTimeInfo(event);
        
        // 构建活动图片HTML
        const imageHtml = event.image ? `
            <div class="event-modal-image">
                <img src="${event.image}" alt="${event.title}" class="modal-event-image">
            </div>
        ` : '';
        
        const content = `
            ${imageHtml}
            <div class="event-modal-details">
                <div class="event-detail-item">
                    <span class="detail-icon">📅</span>
                    <span class="detail-label">${languageManager.t('date')}:</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="event-detail-item">
                    <span class="detail-icon">🕐</span>
                    <span class="detail-label">${languageManager.t('time')}:</span>
                    <span class="detail-value">${timeInfo}</span>
                </div>
                <div class="event-detail-item">
                    <span class="detail-icon">📍</span>
                    <span class="detail-label">${languageManager.t('venue')}:</span>
                    <span class="detail-value">${event.location || languageManager.t('undetermined')}</span>
                </div>
                ${event.description ? `
                <div class="event-detail-item">
                    <span class="detail-icon">📝</span>
                    <span class="detail-label">${languageManager.t('description')}:</span>
                    <span class="detail-value">${event.description}</span>
                </div>
                ` : ''}
                ${event.tags && event.tags.length > 0 ? `
                <div class="event-detail-item">
                    <span class="detail-icon">🏷️</span>
                    <span class="detail-label">${languageManager.t('tags')}:</span>
                    <div class="event-tags-modal">
                        ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        const modal = new ModalComponent(content, event.title);
        modal.mount(document.body);
    }
    
    // 格式化完整日期
    formatFullDate(dateRange, year) {
        const match = dateRange.match(/^(\d+)\.(\d+)/);
        if (match) {
            const month = match[1].padStart(2, '0');
            const day = match[2].padStart(2, '0');
            const eventYear = year || new Date().getFullYear();
            return `${eventYear}-${month}-${day}`;
        }
        return dateRange;
    }
    
    // 格式化时间信息
    formatTimeInfo(event) {
        const parts = [];
        
        if (event.openTime) {
            parts.push(`${languageManager.t('openTime')} ${event.openTime}`);
        }
        if (event.time) {
            parts.push(`${languageManager.t('startTime')} ${event.time}`);
        }
        if (event.endTime) {
            parts.push(`${languageManager.t('endTime')} ${event.endTime}`);
        }
        
        if (parts.length === 0) {
            return languageManager.t('undetermined');
        }
        
        return parts.join(' ');
    }
    
    // 显示图片模态框
    showImageModal(src, alt) {
        const content = `<img src="${src}" alt="${alt}" style="width: 100%; height: auto; border-radius: 10px;">`;
        const modal = new ModalComponent(content);
        modal.mount(document.body);
    }
    
    // 启动动画
    startAnimations() {
        // 页面加载动画
        this.container.style.opacity = '0';
        this.container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.container.style.transition = 'all 0.8s ease-out';
            this.container.style.opacity = '1';
            this.container.style.transform = 'translateY(0)';
        }, 100);
        
        // 装饰元素动画
        const decorations = this.container.querySelectorAll('.flower-decoration, .diamond');
        decorations.forEach((decoration, index) => {
            decoration.style.animationDelay = `${index * 0.5}s`;
        });
        
        // 活动卡片依次出现动画
        const eventSections = this.container.querySelectorAll('.event-section');
        eventSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateX(0)';
            }, 300 + index * 200);
        });
    }
    
    // 添加新活动
    addEvent(event) {
        this.dataManager.addEvent(event);
        this.updateEventList();
        this.updateStats();
    }
    
    // 更新统计信息
    updateStats() {
        const stats = this.components.get('stats');
        if (stats) {
            stats.update();
        }
    }
    
    // 加载外部数据
    loadData(data) {
        this.dataManager.loadFromJSON(data);
        this.render();
    }
    
    // 导出数据
    exportData() {
        return this.dataManager.toJSON();
    }
    
    // 更新语言相关文本
    updateLanguageTexts() {
        // 更新页面标题
        document.title = languageManager.t('siteTitle');
        
        // 更新加载文本
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = languageManager.t('loadingText');
        }
    }
    
    // 语言变化处理
    onLanguageChange(newLanguage) {
        // 更新页面标题
        document.title = languageManager.t('siteTitle');
        
        // 更新加载文本
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = languageManager.t('loadingText');
        }
        
        // 重新渲染整个应用
        this.render();
        
        // 重新启动动画
        this.startAnimations();
    }
    
    // 获取应用状态
    getState() {
        return {
            filters: this.currentFilters,
            data: this.exportData(),
            config: this.config
        };
    }
}

// 工具函数
class ScheduleUtils {
    // 格式化日期
    static formatDate(date) {
        const options = { month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('zh-CN', options);
    }
    
    // 获取当前时间
    static getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    // 验证活动数据
    static validateEvent(event) {
        const required = ['title', 'dateRange', 'day'];
        const missing = required.filter(field => !event[field]);
        
        if (missing.length > 0) {
            throw new Error(`缺少必需字段: ${missing.join(', ')}`);
        }
        
        return true;
    }
    
    // 生成唯一ID
    static generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }
}

// 导出应用和工具
window.ScheduleApp = ScheduleApp;
window.ScheduleUtils = ScheduleUtils; 