// 配置管理器和数据管理器
class ScheduleDataManager {
    constructor() {
        this.events = [];
        this.featuredPerson = null;
        this.categories = new Map();
    }

    // 添加活动
    addEvent(event) {
        // 验证活动数据
        if (!event.id || !event.title || !event.dateRange) {
            console.warn('活动数据不完整:', event);
            return;
        }

        // 检查是否已存在相同ID的活动
        const existingIndex = this.events.findIndex(e => e.id === event.id);
        if (existingIndex !== -1) {
            this.events[existingIndex] = event;
        } else {
            this.events.push(event);
        }

        // 按日期排序
        this.events.sort((a, b) => this.compareDates(a, b));
    }

    // 设置特色人物
    setFeaturedPerson(person) {
        this.featuredPerson = person;
    }

    // 添加分类
    addCategory(category) {
        this.categories.set(category.id, category);
    }

    // 获取活动列表
    getEvents(filters = {}) {
        let filteredEvents = [...this.events];

        // 按分类过滤
        if (filters.category) {
            filteredEvents = filteredEvents.filter(event => event.category === filters.category);
        }

        // 按月份过滤
        if (filters.month) {
            filteredEvents = filteredEvents.filter(event => {
                const match = event.dateRange.match(/^(\d+)\./);
                return match && parseInt(match[1]) === filters.month;
            });
        }

        // 按年份过滤
        if (filters.year) {
            filteredEvents = filteredEvents.filter(event => {
                return event.year === filters.year;
            });
        }

        // 按周过滤
        if (filters.week) {
            filteredEvents = filteredEvents.filter(event => {
                return this.isEventInWeek(event, filters.week);
            });
        }

        // 按时间范围过滤（新增）
        if (filters.timeRange) {
            let weekRange = null;
            
            // 如果提供了具体的起始和结束日期，优先使用
            if (filters.startDate && filters.endDate) {
                weekRange = this.getCustomDateRange(filters.startDate, filters.endDate);
            } else {
                // 否则使用预设的时间范围
                switch (filters.timeRange) {
                    case 'thisWeek':
                        weekRange = this.getThisWeekRange();
                        break;
                    case 'nextWeek':
                        weekRange = this.getNextWeekRange();
                        break;
                    case 'thisMonth':
                        weekRange = this.getThisMonthRange();
                        break;
                    case 'nextMonth':
                        weekRange = this.getNextMonthRange();
                        break;
                }
            }
            
            if (weekRange) {
                filteredEvents = filteredEvents.filter(event => {
                    return this.isEventInWeek(event, weekRange);
                });
            }
        }

        return filteredEvents;
    }

    // 获取本周日期范围
    getThisWeekRange() {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // 设置为本周日
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // 设置为本周六
        weekEnd.setHours(23, 59, 59, 999);
        
        return { start: weekStart, end: weekEnd };
    }

    // 获取下周日期范围
    getNextWeekRange() {
        const today = new Date();
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() - today.getDay() + 7); // 设置为下周日
        nextWeekStart.setHours(0, 0, 0, 0);
        
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6); // 设置为下周六
        nextWeekEnd.setHours(23, 59, 59, 999);
        
        return { start: nextWeekStart, end: nextWeekEnd };
    }

    // 获取本月日期范围
    getThisMonthRange() {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        
        return { start: monthStart, end: monthEnd };
    }

    // 获取下月日期范围
    getNextMonthRange() {
        const today = new Date();
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59, 999);
        
        return { start: nextMonthStart, end: nextMonthEnd };
    }

    // 获取自定义日期范围
    getCustomDateRange(startDate, endDate) {
        if (!startDate || !endDate) return null;
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // 设置时间为一天的开始和结束
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        
        return { start: start, end: end };
    }

    // 检查活动是否在指定周内
    isEventInWeek(event, weekRange) {
        if (!event.dateRange || !weekRange) return false;
        
        // 传递活动的年份信息
        const eventDate = this.parseDateFromRange(event.dateRange, event.year);
        if (!eventDate) return false;
        
        const weekStart = new Date(weekRange.start);
        const weekEnd = new Date(weekRange.end);
        
        return eventDate >= weekStart && eventDate <= weekEnd;
    }

    // 检查活动是否在自定义日期范围内
    isEventInCustomRange(event, customRange) {
        if (!event.dateRange || !customRange) return false;
        
        // 传递活动的年份信息
        const eventDate = this.parseDateFromRange(event.dateRange, event.year);
        if (!eventDate) return false;
        
        const rangeStart = new Date(customRange.start);
        const rangeEnd = new Date(customRange.end);
        
        return eventDate >= rangeStart && eventDate <= rangeEnd;
    }

    // 从日期范围解析日期对象
    parseDateFromRange(dateRange, eventYear = null) {
        const match = dateRange.match(/^(\d+)\.(\d+)/);
        if (match) {
            const month = parseInt(match[1]);
            const day = parseInt(match[2]);
            // 优先使用活动数据中的年份，如果没有则使用当前年份
            const year = eventYear || new Date().getFullYear();
            return new Date(year, month - 1, day);
        }
        return null;
    }

    // 获取指定周的活动
    getEventsForWeek(weekRange) {
        return this.events.filter(event => this.isEventInWeek(event, weekRange));
    }

    // 获取本周的活动（从今天开始的一周）
    getThisWeekEvents() {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // 设置为本周日
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // 设置为本周六
        weekEnd.setHours(23, 59, 59, 999);
        
        return this.getEventsForWeek({ start: weekStart, end: weekEnd });
    }

    // 获取下周的活动
    getNextWeekEvents() {
        const today = new Date();
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() - today.getDay() + 7); // 设置为下周日
        nextWeekStart.setHours(0, 0, 0, 0);
        
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6); // 设置为下周六
        nextWeekEnd.setHours(23, 59, 59, 999);
        
        return this.getEventsForWeek({ start: nextWeekStart, end: nextWeekEnd });
    }

    // 获取本月的活动
    getThisMonthEvents() {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        
        return this.getEventsForWeek({ start: monthStart, end: monthEnd });
    }

    // 获取下月的活动
    getNextMonthEvents() {
        const today = new Date();
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59, 999);
        
        return this.getEventsForWeek({ start: nextMonthStart, end: nextMonthEnd });
    }

    // 比较日期
    compareDates(dateA, dateB) {
        // 如果两个活动都有fullDate，直接比较fullDate
        if (dateA.fullDate && dateB.fullDate) {
            return new Date(dateA.fullDate) - new Date(dateB.fullDate);
        }
        
        // 如果没有fullDate，回退到原来的dateRange比较逻辑
        const parseDate = (dateStr, eventYear = null) => {
            const match = dateStr.match(/^(\d+)\.(\d+)/);
            if (match) {
                const month = parseInt(match[1]);
                const day = parseInt(match[2]);
                // 优先使用活动数据中的年份，如果没有则使用当前年份
                const year = eventYear || new Date().getFullYear();
                return year * 10000 + month * 100 + day; // 转换为可比较的数字
            }
            return 0;
        };
        
        const dateAValue = parseDate(dateA.dateRange || dateA, dateA.year);
        const dateBValue = parseDate(dateB.dateRange || dateB, dateB.year);
        
        return dateAValue - dateBValue;
    }

    // 获取特色人物
    getFeaturedPerson() {
        return this.featuredPerson;
    }

    // 获取分类
    getCategories() {
        return Array.from(this.categories.values());
    }

    // 从JSON数据加载
    loadFromJSON(data) {
        if (data.events) {
            // 加载所有活动，不限制年份
            data.events.forEach(event => this.addEvent(event));
        }
        if (data.featuredPerson) {
            this.setFeaturedPerson(data.featuredPerson);
        }
        if (data.categories) {
            data.categories.forEach(category => this.addCategory(category));
        }
        return this;
    }

    // 检查活动是否在2025年
    isEventIn2025(event) {
        if (!event.dateRange) return false;
        
        const match = event.dateRange.match(/^(\d+)\.(\d+)/);
        if (match) {
            const month = parseInt(match[1]);
            const day = parseInt(match[2]);
            
            // 检查是否是有效的2025年日期
            // 2025年1月1日到12月31日
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                // 检查每个月的实际天数
                const daysInMonth = new Date(2025, month, 0).getDate();
                if (day <= daysInMonth) {
                    return true;
                }
            }
        }
        return false;
    }

    // 导出为JSON
    toJSON() {
        return {
            events: this.events,
            featuredPerson: this.featuredPerson,
            categories: this.getCategories()
        };
    }

    // 清理历史活动数据
    cleanHistoricalEvents() {
        // 移除过去的活动（保留当前年份及未来的活动）
        const currentYear = new Date().getFullYear();
        this.events = this.events.filter(event => {
            return event.year >= currentYear;
        });
        return this;
    }

    // 获取指定年份的活动数量
    getEventsCount(year) {
        return this.events.filter(event => event.year === year).length;
    }
}

// 默认数据 - 从外部JSON文件加载
let DEFAULT_DATA = {
    "events": [],
    "featuredPerson": null,
    "categories": []
};

// 从外部JSON文件加载活动数据
async function loadActivitiesData() {
    try {
        const response = await fetch('assets/data/activities.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        DEFAULT_DATA = data;
        console.log('活动数据加载成功:', data);
        return data;
    } catch (error) {
        console.error('加载活动数据失败:', error);
        // 如果加载失败，使用默认的空数据结构
        return DEFAULT_DATA;
    }
}

// 导出到全局作用域
window.CONFIG = {
    DEFAULT_DATA,
    ScheduleDataManager,
    loadActivitiesData,
            site: {
            title: "小日向美香 活动日程", // 这个会被语言管理器覆盖
        logo: {
            fruit: "🍊",
            character: "みか"
        },
        description: "声優、アイドル、アーティストのイベント・ライブ情報" // 这个会被语言管理器覆盖
    }
}; 