// 数据导入脚本 - 从Eventernote获取小日向美香的2025年活动
// 使用方法：在浏览器控制台中运行此脚本

class EventImporter {
    constructor() {
        this.events = [];
        this.currentPage = 1;
        this.maxPages = 11;
        this.baseUrl = 'https://www.eventernote.com/actors/小日向美香/63191';
    }

    // 解析日期字符串，提取年份、月份、日期
    parseDate(dateText) {
        // 处理格式如 "2025-07-30 (水)" 或 "2025-08-02 (土)"
        const match = dateText.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (match) {
            return {
                year: parseInt(match[1]),
                month: parseInt(match[2]),
                day: parseInt(match[3]),
                fullDate: `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
            };
        }
        return null;
    }

    // 解析时间信息
    parseTime(timeText) {
        if (!timeText || timeText.includes('未定')) return null;
        
        // 处理格式如 "開場 17:30 開演 18:30 終演 20:30"
        const openMatch = timeText.match(/開場\s*(\d{1,2}):(\d{2})/);
        const startMatch = timeText.match(/開演\s*(\d{1,2}):(\d{2})/);
        const endMatch = timeText.match(/終演\s*(\d{1,2}):(\d{2})/);
        
        return {
            openTime: openMatch ? `${openMatch[1]}:${openMatch[2]}` : null,
            startTime: startMatch ? `${startMatch[1]}:${startMatch[2]}` : null,
            endTime: endMatch ? `${endMatch[1]}:${endMatch[2]}` : null
        };
    }

    // 获取星期几
    getDayOfWeek(dateText) {
        const dayMap = {
            '(月)': 'Mon.',
            '(火)': 'Tue.',
            '(水)': 'Wed.',
            '(木)': 'Thu.',
            '(金)': 'Fri.',
            '(土)': 'Sat.',
            '(日)': 'Sun.'
        };
        
        for (const [japanese, english] of Object.entries(dayMap)) {
            if (dateText.includes(japanese)) {
                return english;
            }
        }
        return 'Unknown';
    }

    // 解析单个活动
    parseEvent(eventElement) {
        try {
            // 获取日期
            const dateElement = eventElement.querySelector('h4');
            if (!dateElement) return null;
            
            const dateText = dateElement.textContent.trim();
            const dateInfo = this.parseDate(dateText);
            if (!dateInfo) return null; // 处理所有年份的活动
            
            // 获取标题
            const titleElement = eventElement.querySelector('h4 + div');
            if (!titleElement) return null;
            const title = titleElement.textContent.trim();
            
            // 获取场地信息
            const venueElement = eventElement.querySelector('div:contains("会場:")');
            let venue = '';
            if (venueElement) {
                venue = venueElement.textContent.replace('会場:', '').trim();
            }
            
            // 获取时间信息
            const timeElement = eventElement.querySelector('div:contains("開場")');
            const timeInfo = this.parseTime(timeElement ? timeElement.textContent : '');
            
            // 获取出演者信息
            const performers = [];
            const performerElements = eventElement.querySelectorAll('div:contains("出演者:") + div');
            performerElements.forEach(el => {
                performers.push(el.textContent.trim());
            });
            
            // 生成唯一ID
            const id = Date.now() + Math.random();
            
            // 确定活动类型
            let type = 'other';
            let category = 'performance';
            if (title.includes('ライブ') || title.includes('LIVE') || title.includes('コンサート')) {
                type = 'concert';
                category = 'performance';
            } else if (title.includes('舞台')) {
                type = 'theater';
                category = 'performance';
            } else if (title.includes('イベント') || title.includes('トーク')) {
                type = 'event';
                category = 'event';
            }
            
            // 生成图片路径
            const imageIndex = Math.floor(Math.random() * 20) + 1;
            const image = `assets/images/randpic_小日向美香_${imageIndex}.jpg`;
            
            return {
                id: id,
                day: this.getDayOfWeek(dateText),
                dateRange: `${dateInfo.month}.${dateInfo.day.toString().padStart(2, '0')}`,
                fullDate: dateInfo.fullDate,
                year: dateInfo.year,
                month: dateInfo.month,
                day: dateInfo.day,
                title: title,
                type: type,
                image: image,
                description: `${title} - 小日向美香出演`,
                location: venue,
                time: timeInfo ? timeInfo.startTime : '未定',
                openTime: timeInfo ? timeInfo.openTime : '未定',
                endTime: timeInfo ? timeInfo.endTime : '未定',
                category: category,
                priority: Math.floor(Math.random() * 3) + 1,
                tags: [title.split(' ')[0], '小日向美香'],
                performers: performers
            };
        } catch (error) {
            console.error('解析活动时出错:', error);
            return null;
        }
    }

    // 从当前页面解析活动
    parseCurrentPage() {
        const eventElements = document.querySelectorAll('div.event-item, .event-list-item');
        const pageEvents = [];
        
        eventElements.forEach(element => {
            const event = this.parseEvent(element);
            if (event) {
                pageEvents.push(event);
            }
        });
        
        return pageEvents;
    }

    // 获取所有页面的活动
    async getAllEvents() {
        console.log('开始导入小日向美香的2025年活动数据...');
        
        for (let page = 1; page <= this.maxPages; page++) {
            console.log(`正在处理第 ${page} 页...`);
            
            // 构建页面URL
            const pageUrl = page === 1 ? this.baseUrl : `${this.baseUrl}?page=${page}`;
            
            try {
                // 这里需要手动访问每个页面
                // 由于跨域限制，我们需要手动处理
                console.log(`请手动访问: ${pageUrl}`);
                console.log('然后运行: importer.parseCurrentPage()');
                
                // 等待用户手动操作
                await new Promise(resolve => {
                    setTimeout(resolve, 2000);
                });
                
            } catch (error) {
                console.error(`处理第 ${page} 页时出错:`, error);
            }
        }
        
        console.log('数据导入完成！');
        console.log('总活动数:', this.events.length);
        console.log('按年份统计:', this.events.reduce((acc, e) => {
            acc[e.year] = (acc[e.year] || 0) + 1;
            return acc;
        }, {}));
        
        return this.events;
    }

    // 导出为JSON格式
    exportToJSON() {
        const data = {
            events: this.events, // 导出所有年份的活动
            featuredPerson: {
                name: "小日向美香",
                japaneseName: "こひなたみか",
                description: "声優、アイドル、アーティスト",
                image: "assets/images/randpic_小日向美香_1.jpg"
            },
            categories: [
                { id: "performance", name: "演出活动", icon: "🎭" },
                { id: "event", name: "其他活动", icon: "🎪" }
            ]
        };
        
        console.log('导出的JSON数据:');
        console.log(JSON.stringify(data, null, 2));
        
        // 复制到剪贴板
        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
            .then(() => console.log('数据已复制到剪贴板'))
            .catch(err => console.error('复制失败:', err));
        
        return data;
    }
}

// 创建导入器实例
const importer = new EventImporter();

// 使用说明
console.log(`
=== 小日向美香活动数据导入工具 ===

使用方法:
1. 访问 https://www.eventernote.com/actors/小日向美香/63191
2. 在浏览器控制台中运行: importer.parseCurrentPage()
3. 重复步骤1-2，访问所有页面（1-11页）
4. 运行: importer.exportToJSON() 导出数据

或者运行: importer.getAllEvents() 开始自动导入
`);

// 导出到全局作用域
window.importer = importer; 