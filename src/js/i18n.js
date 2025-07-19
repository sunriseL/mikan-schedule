// 多语言支持配置
const I18N = {
    zh: {
        // 页面标题和头部
        siteTitle: "小日向美香 活动日程",
        siteDescription: "声优、偶像、艺术家的活动・演唱会信息",
        loadingText: "正在加载日程表...",
        errorTitle: "加载失败",
        errorMessage: "无法加载活动数据，请检查网络连接或刷新页面重试。",
        refreshButton: "刷新页面",
        
        // 过滤器相关
        filterTitle: "筛选活动",
        allCategories: "全部分类",
        allMonths: "全部月份",
        currentCount: "当前显示",
        eventsCount: "个活动",
        calendarView: "日历视图",
        listView: "列表视图",
        sortByDate: "按日期排序",
        sortByTitle: "按标题排序",
        clearFilters: "清除筛选",
        
        // 新增的筛选选项
        filterByMonth: "按月筛选",
        filterByWeek: "按周筛选",
        thisWeek: "本周",
        nextWeek: "下周",
        thisMonth: "本月",
        nextMonth: "下月",
        customWeek: "自定义周",
        customMonth: "自定义月",
        customDateRange: "自定义日期范围",
        startDate: "起始日期",
        endDate: "终止日期",
        selectDateRange: "选择日期范围",
        applyDateRange: "应用日期范围",
        resetDateRange: "重置日期范围",
        
        // 活动详情
        venue: "会场",
        undetermined: "未定",
        openTime: "开场",
        startTime: "开演",
        endTime: "终演",
        date: "日期",
        time: "时间",
        description: "描述",
        tags: "标签",
        
        // 统计信息
        statsTitle: "活动统计",
        totalEvents: "总活动数",
        upcomingEvents: "即将到来的活动",
        thisMonthEvents: "本月活动",
        nextMonthEvents: "下月活动",
        
        // 月份名称
        months: {
            1: "1月", 2: "2月", 3: "3月", 4: "4月", 5: "5月", 6: "6月",
            7: "7月", 8: "8月", 9: "9月", 10: "10月", 11: "11月", 12: "12月"
        },
        
        // 星期名称
        weekdays: {
            'Mon.': '周一', 'Tue.': '周二', 'Wed.': '周三', 'Thu.': '周四',
            'Fri.': '周五', 'Sat.': '周六', 'Sun.': '周日'
        },
        
        // 底部装饰
        prNote: "pr: 截止发圈前",
        
        // 语言切换
        languageSwitch: "语言切换",
        chinese: "中文",
        japanese: "日本語"
    },
    
    ja: {
        // 页面标题和头部
        siteTitle: "小日向美香 イベントスケジュール",
        siteDescription: "声優、アイドル、アーティストのイベント・ライブ情報",
        loadingText: "スケジュールを読み込み中...",
        errorTitle: "読み込みエラー",
        errorMessage: "イベントデータを読み込めませんでした。ネットワーク接続を確認するか、ページを再読み込みしてください。",
        refreshButton: "ページを再読み込み",
        
        // 过滤器相关
        filterTitle: "イベントをフィルター",
        allCategories: "全カテゴリー",
        allMonths: "全月",
        currentCount: "現在表示中",
        eventsCount: "件のイベント",
        calendarView: "カレンダー表示",
        listView: "リスト表示",
        sortByDate: "日付順",
        sortByTitle: "タイトル順",
        clearFilters: "フィルターをクリア",
        
        // 新增的筛选选项
        filterByMonth: "月別フィルター",
        filterByWeek: "週別フィルター",
        thisWeek: "今週",
        nextWeek: "来週",
        thisMonth: "今月",
        nextMonth: "来月",
        customWeek: "カスタム週",
        customMonth: "カスタム月",
        customDateRange: "カスタム日付範囲",
        startDate: "開始日",
        endDate: "終了日",
        selectDateRange: "日付範囲を選択",
        applyDateRange: "日付範囲を適用",
        resetDateRange: "日付範囲をリセット",
        
        // 活动详情
        venue: "会場",
        undetermined: "未定",
        openTime: "開場",
        startTime: "開演",
        endTime: "終演",
        date: "日付",
        time: "時間",
        description: "説明",
        tags: "タグ",
        
        // 统计信息
        statsTitle: "イベント統計",
        totalEvents: "総イベント数",
        upcomingEvents: "今後のイベント",
        thisMonthEvents: "今月のイベント",
        nextMonthEvents: "来月のイベント",
        
        // 月份名称
        months: {
            1: "1月", 2: "2月", 3: "3月", 4: "4月", 5: "5月", 6: "6月",
            7: "7月", 8: "8月", 9: "9月", 10: "10月", 11: "11月", 12: "12月"
        },
        
        // 星期名称
        weekdays: {
            'Mon.': '月', 'Tue.': '火', 'Wed.': '水', 'Thu.': '木',
            'Fri.': '金', 'Sat.': '土', 'Sun.': '日'
        },
        
        // 底部装饰
        prNote: "pr: 発信前まで",
        
        // 语言切换
        languageSwitch: "言語切り替え",
        chinese: "中文",
        japanese: "日本語"
    }
};

// 语言管理器
class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'zh';
        this.listeners = [];
    }
    
    // 获取存储的语言设置
    getStoredLanguage() {
        return localStorage.getItem('schedule-language') || 'zh';
    }
    
    // 设置语言
    setLanguage(lang) {
        if (I18N[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('schedule-language', lang);
            this.notifyListeners();
        }
    }
    
    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // 获取翻译文本
    t(key) {
        const keys = key.split('.');
        
        // 尝试当前语言
        let value = I18N[this.currentLanguage];
        let found = true;
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                found = false;
                break;
            }
        }
        
        if (found) {
            return value;
        }
        
        // 如果当前语言没有找到，尝试中文
        value = I18N.zh;
        found = true;
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                found = false;
                break;
            }
        }
        
        if (found) {
            return value;
        }
        
        // 如果都没有找到，返回原始键名
        return key;
    }
    
    // 添加语言变化监听器
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    // 移除监听器
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
    
    // 通知所有监听器
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentLanguage));
    }
    
    // 获取可用语言列表
    getAvailableLanguages() {
        return Object.keys(I18N);
    }
}

// 创建全局语言管理器实例
const languageManager = new LanguageManager();

// 导出到全局作用域
window.I18N = I18N;
window.languageManager = languageManager; 