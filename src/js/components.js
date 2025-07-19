// 组件系统
class Component {
    constructor() {
        this.element = null;
    }
    
    render() {
        throw new Error('render方法必须被子类实现');
    }
    
    mount(container) {
        if (!this.element) {
            this.element = this.render();
        }
        if (container) {
            container.appendChild(this.element);
        }
        return this.element;
    }
    
    update() {
        if (this.element) {
            const newElement = this.render();
            this.element.parentNode.replaceChild(newElement, this.element);
            this.element = newElement;
        }
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// 语言切换器组件
class LanguageSwitcherComponent extends Component {
    constructor() {
        super();
        this.currentLanguage = languageManager.getCurrentLanguage();
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'language-switcher';
        
        container.innerHTML = `
            <div class="language-switcher-container">
                <span class="language-label">${languageManager.t('languageSwitch')}:</span>
                <div class="language-buttons">
                    <button class="language-btn ${this.currentLanguage === 'zh' ? 'active' : ''}" data-lang="zh">
                        ${languageManager.t('chinese')}
                    </button>
                    <button class="language-btn ${this.currentLanguage === 'ja' ? 'active' : ''}" data-lang="ja">
                        ${languageManager.t('japanese')}
                    </button>
                </div>
            </div>
        `;
        
        this.bindEvents(container);
        return container;
    }
    
    bindEvents(container) {
        const buttons = container.querySelectorAll('.language-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang && lang !== this.currentLanguage) {
                    languageManager.setLanguage(lang);
                    this.currentLanguage = lang;
                    this.update();
                }
            });
        });
    }
}

// 头部组件
class HeaderComponent extends Component {
    constructor(config) {
        super();
        this.config = config;
    }
    
    render() {
        const header = document.createElement('header');
        header.className = 'header-banner';
        
        header.innerHTML = `
            <div class="logo-container">
                <div class="logo-circle">
                    <div class="logo-fruit">${this.config.site.logo.fruit}</div>
                </div>
                <h1 class="site-title">${languageManager.t('siteTitle')}</h1>
            </div>
            <div class="header-decoration">
                <div class="flower-decoration">✿</div>
                <div class="flower-decoration">✿</div>
            </div>
        `;
        
        // 添加语言切换器
        const languageSwitcher = new LanguageSwitcherComponent();
        const switcherElement = languageSwitcher.render();
        header.appendChild(switcherElement);
        
        return header;
    }
}

// 特色人物组件
class FeaturedPersonComponent extends Component {
    constructor(person) {
        super();
        this.person = person;
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'left-panel';
        
        container.innerHTML = `
            <div class="featured-person">
                <div class="person-image">
                    <img src="assets/images/小日向美香.png" alt="${this.person.name}" class="person-photo-no-border">
                </div>
                <div class="person-name">
                    <div class="name-text">${this.person.name}</div>
                </div>
            </div>
        `;
        
        return container;
    }
}

// 活动卡片组件
class EventCardComponent extends Component {
    constructor(event, category) {
        super();
        this.event = event;
        this.category = category;
    }
    
    render() {
        const eventSection = document.createElement('div');
        eventSection.className = 'event-section';
        eventSection.dataset.eventId = this.event.id;
        
        // 格式化日期显示
        const formattedDate = this.formatDate(this.event.dateRange);
        const dayOfWeek = this.getDayOfWeek(this.event.day);
        
        eventSection.innerHTML = `
            <div class="event-info-header">
                <div class="event-date-title">
                    <div class="event-date">${formattedDate} (${dayOfWeek})</div>
                    <div class="event-title">${this.event.title}</div>
                </div>
                <div class="event-details">
                    <div class="event-venue">${languageManager.t('venue')}: ${this.event.location || languageManager.t('undetermined')}</div>
                    <div class="event-time">${languageManager.t('openTime')} ${this.event.openTime || this.event.time || languageManager.t('undetermined')} ${languageManager.t('openTime')} ${this.event.time || languageManager.t('undetermined')} ${languageManager.t('endTime')} ${this.event.endTime || this.getEndTime(this.event.time) || languageManager.t('undetermined')}</div>
                </div>
            </div>
            <div class="event-content">
                <div class="event-image">
                    <img src="${this.event.image}" alt="${this.event.title}" class="group-photo">
                </div>
            </div>
        `;
        
        return eventSection;
    }
    
    formatDate(dateRange) {
        // 将 "6.15-19" 格式转换为 "YYYY-MM-DD" 格式
        const match = dateRange.match(/^(\d+)\.(\d+)/);
        if (match) {
            const month = match[1].padStart(2, '0');
            const day = match[2].padStart(2, '0');
            // 使用活动数据中的年份，如果没有则使用当前年份
            const year = this.event.year || new Date().getFullYear();
            return `${year}-${month}-${day}`;
        }
        return dateRange;
    }
    
    getDayOfWeek(day) {
        // 使用日文一字表示法
        const dayMap = {
            'Sun.': '日', 'Mon.': '月', 'Tue.': '火', 'Wed.': '水',
            'Thu.': '木', 'Fri.': '金', 'Sat.': '土'
        };
        return dayMap[day] || day;
    }
    
    getEndTime(startTime) {
        if (!startTime) return null;
        
        // 简单的结束时间计算（假设活动持续1.5小时）
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHours = hours + 1;
        const endMinutes = minutes + 30;
        
        if (endMinutes >= 60) {
            return `${endHours + 1}:${(endMinutes - 60).toString().padStart(2, '0')}`;
        }
        return `${endHours}:${endMinutes.toString().padStart(2, '0')}`;
    }
}

// 活动列表组件
class EventListComponent extends Component {
    constructor(events, categories) {
        super();
        this.events = events;
        this.categories = categories;
        this.categoryMap = new Map(categories.map(cat => [cat.id, cat]));
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'right-panel';
        
        this.events.forEach(event => {
            const category = this.categoryMap.get(event.category);
            const eventCard = new EventCardComponent(event, category);
            eventCard.mount(container);
        });
        
        return container;
    }
}

// 日历视图组件
class CalendarViewComponent extends Component {
    constructor(events, categories) {
        super();
        this.events = events;
        this.categories = categories;
        this.categoryMap = new Map(categories.map(cat => [cat.id, cat]));
        this.currentMonth = new Date().getMonth() + 1; // 默认显示当前月
        this.currentYear = new Date().getFullYear(); // 默认显示当前年
        this.hoverEventsBound = false; // 初始化悬停事件绑定状态
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'calendar-container';
        
        container.innerHTML = `
            <div class="calendar-header">
                <button class="calendar-nav prev-month">‹</button>
                <h3 class="calendar-title">${this.currentYear}年${languageManager.t(`months.${this.currentMonth}`)}</h3>
                <button class="calendar-nav next-month">›</button>
            </div>
            <div class="calendar-grid">
                ${this.renderCalendarGrid()}
            </div>
        `;
        
        this.bindEvents(container);
        
        // 在DOM渲染完成后检测截断状态
        setTimeout(() => {
            this.detectTruncation();
        }, 100);
        
        return container;
    }
    
    renderCalendarGrid() {
        const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
        const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
        
        // 获取星期名称 - 使用日文一字表示法
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        
        let gridHTML = `
            <div class="calendar-weekdays">
                <div class="weekday">${weekdays[0]}</div>
                <div class="weekday">${weekdays[1]}</div>
                <div class="weekday">${weekdays[2]}</div>
                <div class="weekday">${weekdays[3]}</div>
                <div class="weekday">${weekdays[4]}</div>
                <div class="weekday">${weekdays[5]}</div>
                <div class="weekday">${weekdays[6]}</div>
            </div>
        `;
        
        for (let i = 0; i < totalCells; i++) {
            const dayNumber = i - firstDayOfMonth + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            const dayEvents = isCurrentMonth ? this.getEventsForDay(dayNumber) : [];
            
            gridHTML += `
                <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${dayEvents.length > 0 ? 'has-events' : ''}">
                    <div class="day-number">${isCurrentMonth ? dayNumber : ''}</div>
                    ${this.renderDayEvents(dayEvents)}
                </div>
            `;
        }
        
        return gridHTML;
    }
    
    renderDayEvents(events) {
        if (events.length === 0) return '';
        
        return `
            <div class="day-events">
                ${events.map(event => this.renderEventCard(event)).join('')}
            </div>
        `;
    }
    
    renderEventCard(event) {
        const category = this.categoryMap.get(event.category);
        const dayOfWeek = this.getDayOfWeek(event.day);
        
        // 检查标题长度，如果超过50个字符则添加截断类
        const isTitleLong = event.title.length > 50;
        const truncatedClass = isTitleLong ? 'truncated' : '';
        
        // 检查是否有图片
        const hasImage = event.image && event.image.trim() !== '';
        
        return `
            <div class="calendar-event-card ${truncatedClass}" data-event-id="${event.id}">
                <div class="event-info-header">
                    <div class="event-date-title">
                        <div class="event-title">${event.title}</div>
                        <div class="event-venue" style="display: none;">${languageManager.t('venue')}: ${event.location || languageManager.t('undetermined')}</div>
                    </div>
                </div>
                ${hasImage ? `
                <div class="event-content">
                    <div class="event-image">
                        <img src="${event.image}" alt="${event.title}" class="group-photo">
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    getEventsForDay(day) {
        return this.events.filter(event => {
            const eventDay = this.extractDayFromDateRange(event.dateRange);
            // 检查年份是否匹配当前年份
            return eventDay === day && event.year === this.currentYear;
        });
    }
    
    extractDayFromDateRange(dateRange) {
        // 处理多种日期格式
        // 格式1: "6.15-19" -> 提取开始日期
        // 格式2: "6.15" -> 直接提取
        const match = dateRange.match(/^(\d+)\.(\d+)/);
        if (match) {
            const month = parseInt(match[1]);
            const day = parseInt(match[2]);
            
            // 如果月份不匹配当前月份，返回0表示不显示
            if (month !== this.currentMonth) {
                return 0;
            }
            
            return day;
        }
        return 0;
    }
    
    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    
    formatDate(dateRange) {
        const match = dateRange.match(/^(\d+)\.(\d+)/);
        if (match) {
            const month = match[1].padStart(2, '0');
            const day = match[2].padStart(2, '0');
            return `${this.currentYear}-${month}-${day}`;
        }
        return dateRange;
    }
    
    getDayOfWeek(day) {
        // 使用日文一字表示法
        const dayMap = {
            'Sun.': '日', 'Mon.': '月', 'Tue.': '火', 'Wed.': '水',
            'Thu.': '木', 'Fri.': '金', 'Sat.': '土'
        };
        return dayMap[day] || day;
    }
    
    getEndTime(startTime) {
        if (!startTime) return null;
        
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHours = hours + 1;
        const endMinutes = minutes + 30;
        
        if (endMinutes >= 60) {
            return `${endHours + 1}:${(endMinutes - 60).toString().padStart(2, '0')}`;
        }
        return `${endHours}:${endMinutes.toString().padStart(2, '0')}`;
    }
    
    bindEvents(container) {
        const prevBtn = container.querySelector('.prev-month');
        const nextBtn = container.querySelector('.next-month');
        
        prevBtn.addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 1) {
                this.currentMonth = 12;
                this.currentYear--;
            }
            this.updateCalendar(container);
        });
        
        nextBtn.addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 12) {
                this.currentMonth = 1;
                this.currentYear++;
            }
            this.updateCalendar(container);
        });
    }
    
    updateCalendar(container) {
        const title = container.querySelector('.calendar-title');
        const grid = container.querySelector('.calendar-grid');
        
        title.textContent = `${this.currentYear}年${languageManager.t(`months.${this.currentMonth}`)}`;
        grid.innerHTML = this.renderCalendarGrid();
        
        // 在更新后检测截断状态
        this.detectTruncation();
    }
    
    detectTruncation() {
        // 检测所有事件卡片的截断状态
        const eventCards = document.querySelectorAll('.calendar-event-card');
        eventCards.forEach(card => {
            const title = card.querySelector('.event-title');
            const venue = card.querySelector('.event-venue');
            
            let isTruncated = false;
            
            // 检查标题是否被截断
            if (title && title.scrollHeight > title.clientHeight) {
                isTruncated = true;
            }
            
            // 检查场地信息是否被截断
            if (venue && venue.scrollHeight > venue.clientHeight) {
                isTruncated = true;
            }
            
            // 添加或移除截断类
            if (isTruncated) {
                card.classList.add('truncated');
            } else {
                card.classList.remove('truncated');
            }
        });
        
        // 只在第一次调用时绑定悬停事件
        if (!this.hoverEventsBound) {
            this.bindHoverEvents();
            this.hoverEventsBound = true;
        }
    }
    
    bindHoverEvents() {
        // 移除悬停事件绑定，因为app.js中已经使用事件委托处理所有事件
        // 悬停效果可以通过CSS实现，避免重复绑定事件
        const eventCards = document.querySelectorAll('.calendar-event-card');
        eventCards.forEach(card => {
            // 检查是否已经绑定过事件
            if (card.dataset.hoverBound) return;
            
            // 标记为已绑定，避免重复处理
            card.dataset.hoverBound = 'true';
        });
    }
}

// 视图切换组件
class ViewToggleComponent extends Component {
    constructor(onViewChange, currentView = 'calendar') {
        super();
        this.onViewChange = onViewChange;
        this.currentView = currentView;
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'view-toggle-container';
        
        container.innerHTML = `
            <div class="view-toggle">
                <button class="view-btn ${this.currentView === 'list' ? 'active' : ''}" data-view="list">
                    📋 ${languageManager.t('listView')}
                </button>
                <button class="view-btn ${this.currentView === 'calendar' ? 'active' : ''}" data-view="calendar">
                    📅 ${languageManager.t('calendarView')}
                </button>
            </div>
        `;
        
        this.bindEvents(container);
        return container;
    }
    
    bindEvents(container) {
        const viewButtons = container.querySelectorAll('.view-btn');
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.currentView = view;
                
                // 更新按钮状态
                viewButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // 通知父组件视图改变
                this.onViewChange(view);
            });
        });
    }
}

// 列表视图筛选组件
class ListViewFilterComponent extends Component {
    constructor(categories, onFilterChange) {
        super();
        this.categories = categories;
        this.onFilterChange = onFilterChange;
        this.currentFilters = {
            timeRange: 'thisWeek' // 默认本周
        };
        this.dateRange = {
            startDate: '',
            endDate: ''
        };
        this.updateDateRangeFromTimeRange();
    }
    
    updateDateRangeFromTimeRange() {
        const today = new Date();
        let startDate, endDate;
        
        switch (this.currentFilters.timeRange) {
            case 'thisWeek':
                startDate = new Date(today);
                endDate = new Date(today);
                endDate.setDate(today.getDate() + 7);
                break;
            case 'nextWeek':
                startDate = new Date(today);
                startDate.setDate(today.getDate() + 7);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 7);
                break;
            case 'thisMonth':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'nextMonth':
                startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                break;
            default:
                startDate = new Date(today);
                endDate = new Date(today);
                endDate.setDate(today.getDate() + 7);
        }
        
        this.dateRange.startDate = this.formatDateForInput(startDate);
        this.dateRange.endDate = this.formatDateForInput(endDate);
    }
    
    formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'list-filter-container';
        
        container.innerHTML = `
            <div class="filter-header">
                <h3>${languageManager.t('filterTitle')}</h3>
                <div class="filter-count">
                    <span class="count-text">${languageManager.t('currentCount')} <span class="current-count">0</span> ${languageManager.t('eventsCount')}</span>
                </div>
            </div>
            <div class="filter-options">
                <div class="filter-group">
                    <label>${languageManager.t('filterByWeek')}:</label>
                    <select class="time-range-filter">
                        <option value="thisWeek">${languageManager.t('thisWeek')}</option>
                        <option value="nextWeek">${languageManager.t('nextWeek')}</option>
                        <option value="thisMonth">${languageManager.t('thisMonth')}</option>
                        <option value="nextMonth">${languageManager.t('nextMonth')}</option>
                    </select>
                </div>
                <div class="date-range-section">
                    <div class="date-input-group">
                        <div class="date-input">
                            <label>${languageManager.t('startDate')}:</label>
                            <input type="date" class="start-date-input" value="${this.dateRange.startDate}">
                        </div>
                        <div class="date-input">
                            <label>${languageManager.t('endDate')}:</label>
                            <input type="date" class="end-date-input" value="${this.dateRange.endDate}">
                        </div>
                    </div>
                </div>
                <button class="clear-filters">${languageManager.t('clearFilters')}</button>
            </div>
        `;
        
        this.bindEvents(container);
        return container;
    }
    
    bindEvents(container) {
        const timeRangeFilter = container.querySelector('.time-range-filter');
        const clearButton = container.querySelector('.clear-filters');
        const countElement = container.querySelector('.current-count');
        const startDateInput = container.querySelector('.start-date-input');
        const endDateInput = container.querySelector('.end-date-input');
        
        const updateCount = () => {
            if (window.scheduleApp && window.scheduleApp.dataManager) {
                const filteredEvents = window.scheduleApp.dataManager.getEvents(this.currentFilters);
                countElement.textContent = filteredEvents.length;
            }
        };
        
        const updateDateInputs = () => {
            this.updateDateRangeFromTimeRange();
            startDateInput.value = this.dateRange.startDate;
            endDateInput.value = this.dateRange.endDate;
        };
        
        timeRangeFilter.addEventListener('change', (e) => {
            this.currentFilters.timeRange = e.target.value;
            updateDateInputs();
            this.onFilterChange(this.currentFilters);
            updateCount();
        });
        
        startDateInput.addEventListener('change', (e) => {
            this.dateRange.startDate = e.target.value;
            this.currentFilters.startDate = e.target.value;
            this.currentFilters.endDate = this.dateRange.endDate;
            this.onFilterChange(this.currentFilters);
            updateCount();
        });
        
        endDateInput.addEventListener('change', (e) => {
            this.dateRange.endDate = e.target.value;
            this.currentFilters.startDate = this.dateRange.startDate;
            this.currentFilters.endDate = e.target.value;
            this.onFilterChange(this.currentFilters);
            updateCount();
        });
        
        clearButton.addEventListener('click', () => {
            this.currentFilters = {
                timeRange: 'thisWeek'
            };
            timeRangeFilter.value = 'thisWeek';
            updateDateInputs();
            this.onFilterChange(this.currentFilters);
            updateCount();
        });
        
        // 初始化计数和日期输入框
        setTimeout(() => {
            updateCount();
            updateDateInputs();
        }, 100);
    }
}

// 过滤器组件
class FilterComponent extends Component {
    constructor(categories, onFilterChange, onViewChange, currentView = 'calendar') {
        super();
        this.categories = categories;
        this.onFilterChange = onFilterChange;
        this.onViewChange = onViewChange;
        this.currentFilters = {};
        this.currentView = currentView; // 'list' 或 'calendar'
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'filter-container';
        
        // 获取所有可用的月份
        const months = this.getAvailableMonths();
        
        container.innerHTML = `
            <div class="filter-header">
                <h3>${languageManager.t('filterTitle')}</h3>
                <div class="filter-controls">
                    <div class="view-toggle">
                        <button class="view-btn ${this.currentView === 'list' ? 'active' : ''}" data-view="list">📋 ${languageManager.t('listView')}</button>
                        <button class="view-btn ${this.currentView === 'calendar' ? 'active' : ''}" data-view="calendar">📅 ${languageManager.t('calendarView')}</button>
                    </div>
                    <div class="filter-count">
                        <span class="count-text">${languageManager.t('currentCount')} <span class="current-count">0</span> ${languageManager.t('eventsCount')}</span>
                    </div>
                </div>
            </div>
            <div class="filter-options">
                <div class="filter-group">
                    <label>月份:</label>
                    <select class="month-filter">
                        <option value="">${languageManager.t('allMonths')}</option>
                        ${months.map(month => 
                            `<option value="${month.value}">${month.label}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="filter-group">
                    <label>分类:</label>
                    <select class="category-filter">
                        <option value="">${languageManager.t('allCategories')}</option>
                        ${this.categories.map(cat => 
                            `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="filter-group">
                    <label>排序:</label>
                    <select class="sort-filter">
                        <option value="date">${languageManager.t('sortByDate')}</option>
                        <option value="title">${languageManager.t('sortByTitle')}</option>
                    </select>
                </div>
                <button class="clear-filters">${languageManager.t('clearFilters')}</button>
            </div>
        `;
        
        this.bindEvents(container);
        return container;
    }
    
    getAvailableMonths() {
        // 从全局数据中动态获取月份
        if (window.scheduleApp && window.scheduleApp.dataManager) {
            const events = window.scheduleApp.dataManager.getEvents();
            const months = new Set();
            
            events.forEach(event => {
                const monthMatch = event.dateRange.match(/^(\d+)\./);
                if (monthMatch) {
                    months.add(monthMatch[1]);
                }
            });
            
            return Array.from(months)
                .sort()
                .map(month => ({
                    value: month,
                    label: languageManager.t(`months.${parseInt(month)}`)
                }));
        }
        
        // 默认月份
        return [
            { value: '6', label: languageManager.t('months.6') },
            { value: '7', label: languageManager.t('months.7') },
            { value: '8', label: languageManager.t('months.8') }
        ];
    }
    
    bindEvents(container) {
        const monthFilter = container.querySelector('.month-filter');
        const categoryFilter = container.querySelector('.category-filter');
        const sortFilter = container.querySelector('.sort-filter');
        const clearButton = container.querySelector('.clear-filters');
        const countElement = container.querySelector('.current-count');
        const viewButtons = container.querySelectorAll('.view-btn');
        
        const updateCount = () => {
            if (window.scheduleApp && window.scheduleApp.dataManager) {
                const filteredEvents = window.scheduleApp.dataManager.getEvents(this.currentFilters);
                countElement.textContent = filteredEvents.length;
            }
        };
        
        // 视图切换事件
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.currentView = view;
                
                // 更新按钮状态
                viewButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // 通知父组件视图改变
                this.onViewChange(view);
            });
        });
        
        monthFilter.addEventListener('change', (e) => {
            this.currentFilters.month = e.target.value || null;
            this.onFilterChange(this.currentFilters);
            updateCount();
        });
        
        categoryFilter.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value || null;
            this.onFilterChange(this.currentFilters);
            updateCount();
        });
        
        sortFilter.addEventListener('change', (e) => {
            this.currentFilters.sort = e.target.value || 'date';
            this.onFilterChange(this.currentFilters);
            updateCount();
        });
        
        clearButton.addEventListener('click', () => {
            this.currentFilters = {};
            monthFilter.value = '';
            categoryFilter.value = '';
            sortFilter.value = 'date';
            this.onFilterChange(this.currentFilters);
            updateCount();
        });
        
        // 初始化计数
        setTimeout(updateCount, 100);
    }
}

// 模态框组件
class ModalComponent extends Component {
    constructor(content, title = '') {
        super();
        this.content = content;
        this.title = title;
    }
    
    render() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="modal-content">
                ${this.title ? `<div class="modal-header">
                    <h3>${this.title}</h3>
                    <button class="close-btn">&times;</button>
                </div>` : ''}
                <div class="modal-body">
                    ${this.content}
                </div>
            </div>
        `;
        
        this.bindEvents(modal);
        return modal;
    }
    
    bindEvents(modal) {
        const closeBtn = modal.querySelector('.close-btn');
        const closeModal = () => {
            modal.remove();
        };
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// 统计组件
class StatsComponent extends Component {
    constructor(dataManager) {
        super();
        this.dataManager = dataManager;
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'stats-container';
        
        const events = this.dataManager.getEvents();
        const categories = this.dataManager.getCategories();
        
        const stats = {
            total: events.length,
            byCategory: {},
            upcoming: events.filter(e => this.isUpcoming(e)).length
        };
        
        categories.forEach(cat => {
            stats.byCategory[cat.name] = events.filter(e => e.category === cat.id).length;
        });
        
        container.innerHTML = `
            <div class="stats-header">
                <h3>📊 ${languageManager.t('statsTitle')}</h3>
            </div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">${languageManager.t('totalEvents')}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.upcoming}</div>
                    <div class="stat-label">${languageManager.t('upcomingEvents')}</div>
                </div>
                ${Object.entries(stats.byCategory).map(([name, count]) => `
                    <div class="stat-item">
                        <div class="stat-number">${count}</div>
                        <div class="stat-label">${name}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        return container;
    }
    
    isUpcoming(event) {
        // 使用活动数据中的年份信息进行判断
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();
        
        // 假设日期格式为 "M.DD" 或 "M.DD-DD"
        const match = event.dateRange.match(/(\d+)\.(\d+)/);
        if (match) {
            const month = parseInt(match[1]);
            const day = parseInt(match[2]);
            const eventYear = event.year || currentYear;
            
            // 如果活动年份大于当前年份，则认为是即将到来的
            if (eventYear > currentYear) {
                return true;
            }
            // 如果活动年份等于当前年份，检查月份和日期
            else if (eventYear === currentYear) {
                if (month > currentMonth) {
                    return true;
                } else if (month === currentMonth && day >= currentDay) {
                    return true;
                }
            }
        }
        return false;
    }
}

// 导出组件
window.Component = Component;
window.HeaderComponent = HeaderComponent;
window.FeaturedPersonComponent = FeaturedPersonComponent;
window.EventCardComponent = EventCardComponent;
window.EventListComponent = EventListComponent;
window.FilterComponent = FilterComponent;
window.ModalComponent = ModalComponent;
window.StatsComponent = StatsComponent; 