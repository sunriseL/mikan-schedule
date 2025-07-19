# 小小日向美香的传声筒 - 日程表框架

一个现代化的、可扩展的日程表展示框架，采用组件化架构，支持动态数据加载和自定义配置。

## 🚀 框架特色

### 🏗️ 架构设计
- **组件化架构**: 基于类的组件系统，易于扩展和维护
- **数据驱动**: 支持多种数据源，自动生成页面布局
- **配置化**: 通过配置文件自定义主题、布局和行为
- **模块化**: 清晰的模块分离，便于开发和维护

### 🎨 视觉设计
- **温暖色调**: 采用温暖的浅黄色背景，营造温馨氛围
- **日式风格**: 参考日本设计美学，包含可爱的装饰元素
- **响应式布局**: 适配桌面和移动设备
- **动画效果**: 包含悬停动画、加载动画和装饰元素动画

### 📅 功能特性
- **动态数据加载**: 支持从API、本地文件、本地存储加载数据
- **智能过滤**: 按分类、类型、日期范围筛选活动
- **实时统计**: 显示活动总数、分类统计等
- **交互功能**: 点击查看详情、图片放大、模态框等
- **数据验证**: 内置数据验证和错误处理

## 📁 项目结构

```
Schedule/
├── index.html              # 主页面文件
├── styles.css              # 样式文件
├── config.js               # 配置文件
├── components.js           # 组件系统
├── app.js                  # 主应用类
├── api/
│   └── data-loader.js      # 数据加载器
├── data/
│   └── example-data.json   # 示例数据
├── image/                  # 图片资源
│   ├── randpic_小日向美香_16.jpg
│   ├── randpic_小日向美香_2.jpg
│   └── randpic_小日向美香_9.jpg
└── README.md               # 项目说明
```

## 🛠️ 快速开始

### 1. 基本使用

```html
<!DOCTYPE html>
<html>
<head>
    <title>日程表</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app"></div>
    
    <script src="config.js"></script>
    <script src="components.js"></script>
    <script src="app.js"></script>
    <script>
        // 初始化应用
        const app = new ScheduleApp(document.getElementById('app'));
    </script>
</body>
</html>
```

### 2. 自定义配置

```javascript
// 自定义配置
const customConfig = {
    site: {
        title: "我的日程表",
        logo: {
            fruit: "🍎",
            character: "🐱"
        }
    },
    theme: {
        colors: {
            primary: "#FFF8DC",
            secondary: "#8B4513"
        }
    }
};

// 使用自定义配置初始化
const app = new ScheduleApp(document.getElementById('app'), customConfig);
```

### 3. 动态添加活动

```javascript
// 添加新活动
app.addEvent({
    day: 'Mon.',
    dateRange: '6.25',
    title: '新活动',
    type: 'meeting',
    image: 'image/event.jpg',
    description: '活动描述',
    category: 'meeting',
    priority: 1,
    tags: ['新活动', '测试']
});
```

## 📊 数据格式

### 活动数据结构

```json
{
  "id": 1,
  "day": "Fri.",
  "dateRange": "6.15-19",
  "title": "活动标题",
  "type": "theater",
  "image": "image/event.jpg",
  "description": "活动描述",
  "location": "活动地点",
  "time": "19:00",
  "category": "performance",
  "priority": 2,
  "tags": ["标签1", "标签2"]
}
```

### 分类数据结构

```json
{
  "id": "performance",
  "name": "演出活动",
  "color": "#FF6B6B",
  "icon": "🎭"
}
```

### 特色人物数据结构

```json
{
  "name": "小日向美香",
  "image": "image/person.jpg",
  "book": "书名",
  "description": "描述"
}
```

## 🔧 高级功能

### 1. 数据加载器

```javascript
// 创建数据加载器
const loader = new DataLoader();

// 从本地文件加载
const data = await loader.loadFromLocalFile('data/events.json');

// 从API加载
const apiData = await loader.loadFromAPI('/api/events');

// 从多个来源加载并合并
const mergedData = await loader.loadFromMultipleSources([
    { type: 'file', path: 'data/local.json', name: '本地数据' },
    { type: 'api', endpoint: '/api/events', name: 'API数据' }
]);

// 加载到应用
app.loadData(mergedData);
```

### 2. 数据验证

```javascript
// 验证单个活动
DataValidator.validateEvent(event);

// 验证完整数据集
DataValidator.validateDataset(data);
```

### 3. 数据转换

```javascript
// 转换数据集
const transformedData = DataTransformer.transformDataset(data, {
    baseUrl: 'https://example.com'
});
```

## 🎯 组件系统

### 核心组件

- **HeaderComponent**: 头部横幅组件
- **FeaturedPersonComponent**: 特色人物组件
- **EventCardComponent**: 活动卡片组件
- **EventListComponent**: 活动列表组件
- **FilterComponent**: 过滤器组件
- **StatsComponent**: 统计信息组件
- **ModalComponent**: 模态框组件

### 自定义组件

```javascript
// 创建自定义组件
class CustomComponent extends Component {
    render() {
        const element = document.createElement('div');
        element.innerHTML = '<h1>自定义组件</h1>';
        return element;
    }
}

// 使用自定义组件
const custom = new CustomComponent();
custom.mount(container);
```

## 🌐 API集成

### RESTful API示例

```javascript
// 配置API基础URL
const loader = new DataLoader().setBaseUrl('https://api.example.com');

// 获取活动列表
const events = await loader.loadFromAPI('/events');

// 添加新活动
const newEvent = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
});

// 更新活动
const updatedEvent = await fetch(`/api/events/${eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
});
```

## 🎨 主题定制

### 颜色主题

```javascript
const theme = {
    colors: {
        primary: "#FFF8DC",    // 主背景色
        secondary: "#8B4513",  // 文字颜色
        accent: "#FFD700",     // 强调色
        orange: "#FF8C00",     // 橙色
        red: "#FF6B6B",        // 红色
        teal: "#4ECDC4"        // 青色
    }
};
```

### 布局配置

```javascript
const layout = {
    maxWidth: "1200px",
    gridColumns: 2,
    gap: "30px"
};
```

## 📱 响应式设计

框架自动适配不同屏幕尺寸：

- **桌面端**: 双列布局，完整功能
- **平板端**: 单列布局，优化触摸交互
- **移动端**: 紧凑布局，简化界面

## 🔍 调试和开发

### 控制台调试

```javascript
// 访问应用实例
console.log(window.scheduleApp);

// 获取应用状态
const state = app.getState();
console.log(state);

// 导出数据
const data = app.exportData();
console.log(data);
```

### 开发工具

```javascript
// 获取缓存统计
const cacheStats = loader.getCacheStats();
console.log(cacheStats);

// 清除缓存
loader.clearCache();
```

## 🚀 部署

### 静态部署

1. 将所有文件上传到Web服务器
2. 确保图片路径正确
3. 配置数据源

### CDN部署

```html
<!-- 使用CDN -->
<script src="https://cdn.example.com/schedule-framework/config.js"></script>
<script src="https://cdn.example.com/schedule-framework/components.js"></script>
<script src="https://cdn.example.com/schedule-framework/app.js"></script>
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🆘 支持

- 查看 [Issues](../../issues) 获取帮助
- 提交 [Bug Report](../../issues/new)
- 请求 [新功能](../../issues/new)

---

**注意**: 这是一个完整的框架系统，支持动态数据加载和自定义配置。所有功能都是模块化的，可以根据需要选择性使用。 