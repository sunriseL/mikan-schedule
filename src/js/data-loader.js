// 数据加载器 - 用于从不同来源加载日程数据
class DataLoader {
    constructor() {
        this.baseUrl = '';
        this.cache = new Map();
    }
    
    // 设置基础URL
    setBaseUrl(url) {
        this.baseUrl = url;
        return this;
    }
    
    // 从本地JSON文件加载数据
    async loadFromLocalFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.cache.set(filePath, data);
            return data;
        } catch (error) {
            console.error('加载本地文件失败:', error);
            throw error;
        }
    }
    
    // 从API加载数据
    async loadFromAPI(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const cacheKey = `${url}_${JSON.stringify(options)}`;
        
        // 检查缓存
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
        }
    }
    
    // 从多个来源加载数据并合并
    async loadFromMultipleSources(sources) {
        const results = [];
        
        for (const source of sources) {
            try {
                let data;
                if (source.type === 'file') {
                    data = await this.loadFromLocalFile(source.path);
                } else if (source.type === 'api') {
                    data = await this.loadFromAPI(source.endpoint, source.options);
                }
                results.push(data);
            } catch (error) {
                console.warn(`加载数据源失败: ${source.name}`, error);
            }
        }
        
        return this.mergeData(results);
    }
    
    // 合并多个数据源的数据
    mergeData(dataArray) {
        const merged = {
            events: [],
            featuredPerson: null,
            categories: []
        };
        
        const categoryMap = new Map();
        const eventMap = new Map();
        
        dataArray.forEach(data => {
            // 合并活动
            if (data.events) {
                data.events.forEach(event => {
                    if (!eventMap.has(event.id)) {
                        eventMap.set(event.id, event);
                        merged.events.push(event);
                    }
                });
            }
            
            // 合并分类
            if (data.categories) {
                data.categories.forEach(category => {
                    if (!categoryMap.has(category.id)) {
                        categoryMap.set(category.id, category);
                        merged.categories.push(category);
                    }
                });
            }
            
            // 特色人物（使用最后一个非空的）
            if (data.featuredPerson && !merged.featuredPerson) {
                merged.featuredPerson = data.featuredPerson;
            }
        });
        
        return merged;
    }
    
    // 保存数据到本地存储
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存到本地存储失败:', error);
            return false;
        }
    }
    
    // 从本地存储加载数据
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('从本地存储加载失败:', error);
            return null;
        }
    }
    
    // 清除缓存
    clearCache() {
        this.cache.clear();
    }
    
    // 获取缓存统计
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// 数据验证器
class DataValidator {
    // 验证活动数据
    static validateEvent(event) {
        const required = ['id', 'title', 'dateRange', 'day'];
        const missing = required.filter(field => !event[field]);
        
        if (missing.length > 0) {
            throw new Error(`活动数据缺少必需字段: ${missing.join(', ')}`);
        }
        
        // 验证日期格式
        if (!this.isValidDateRange(event.dateRange)) {
            throw new Error(`无效的日期格式: ${event.dateRange}`);
        }
        
        return true;
    }
    
    // 验证分类数据
    static validateCategory(category) {
        const required = ['id', 'name', 'color', 'icon'];
        const missing = required.filter(field => !category[field]);
        
        if (missing.length > 0) {
            throw new Error(`分类数据缺少必需字段: ${missing.join(', ')}`);
        }
        
        // 验证颜色格式
        if (!this.isValidColor(category.color)) {
            throw new Error(`无效的颜色格式: ${category.color}`);
        }
        
        return true;
    }
    
    // 验证特色人物数据
    static validateFeaturedPerson(person) {
        const required = ['name', 'image'];
        const missing = required.filter(field => !person[field]);
        
        if (missing.length > 0) {
            throw new Error(`特色人物数据缺少必需字段: ${missing.join(', ')}`);
        }
        
        return true;
    }
    
    // 验证完整的数据集
    static validateDataset(data) {
        const errors = [];
        
        // 验证活动
        if (data.events) {
            data.events.forEach((event, index) => {
                try {
                    this.validateEvent(event);
                } catch (error) {
                    errors.push(`活动 ${index + 1}: ${error.message}`);
                }
            });
        }
        
        // 验证分类
        if (data.categories) {
            data.categories.forEach((category, index) => {
                try {
                    this.validateCategory(category);
                } catch (error) {
                    errors.push(`分类 ${index + 1}: ${error.message}`);
                }
            });
        }
        
        // 验证特色人物
        if (data.featuredPerson) {
            try {
                this.validateFeaturedPerson(data.featuredPerson);
            } catch (error) {
                errors.push(`特色人物: ${error.message}`);
            }
        }
        
        if (errors.length > 0) {
            throw new Error(`数据验证失败:\n${errors.join('\n')}`);
        }
        
        return true;
    }
    
    // 验证日期范围格式
    static isValidDateRange(dateRange) {
        // 支持格式: "M.DD", "M.DD-DD", "M.DD-M.DD"
        const pattern = /^\d+\.\d+(-\d+)?(-\d+\.\d+)?$/;
        return pattern.test(dateRange);
    }
    
    // 验证颜色格式
    static isValidColor(color) {
        // 支持十六进制颜色
        const hexPattern = /^#[0-9A-Fa-f]{6}$/;
        return hexPattern.test(color);
    }
}

// 数据转换器
class DataTransformer {
    // 转换日期格式
    static transformDateRange(dateRange) {
        // 这里可以添加日期格式转换逻辑
        return dateRange;
    }
    
    // 转换图片路径
    static transformImagePath(imagePath, baseUrl = '') {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `${baseUrl}${imagePath}`;
    }
    
    // 转换完整数据集
    static transformDataset(data, options = {}) {
        const transformed = { ...data };
        
        if (transformed.events) {
            transformed.events = transformed.events.map(event => ({
                ...event,
                dateRange: this.transformDateRange(event.dateRange),
                image: this.transformImagePath(event.image, options.baseUrl)
            }));
        }
        
        if (transformed.featuredPerson) {
            transformed.featuredPerson = {
                ...transformed.featuredPerson,
                image: this.transformImagePath(transformed.featuredPerson.image, options.baseUrl)
            };
        }
        
        return transformed;
    }
}

// 导出类
window.DataLoader = DataLoader;
window.DataValidator = DataValidator;
window.DataTransformer = DataTransformer; 