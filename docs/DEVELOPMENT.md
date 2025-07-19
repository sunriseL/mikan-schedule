# 开发指南

## 项目架构

### 目录结构说明

```
src/
├── js/           # JavaScript源代码
│   ├── app.js    # 主应用类，负责整体逻辑控制
│   ├── components.js # UI组件库，包含各种可复用组件
│   ├── config.js # 应用配置，包含默认设置和常量
│   ├── i18n.js   # 国际化模块，处理多语言切换
│   ├── import_events.js # 数据导入模块
│   ├── script.js # 工具函数和辅助脚本
│   └── data-loader.js # 数据加载器，处理数据获取和缓存
└── css/          # 样式文件
    └── styles.css # 主样式表，包含所有UI样式

assets/
├── images/       # 图片资源
└── data/         # 数据文件
    ├── activities.json # 活动数据（主要数据源）
    ├── config_events.json # 配置数据
    └── raw_events.json # 原始数据备份
```

### 核心模块说明

#### 1. 主应用模块 (app.js)
- **ScheduleApp类**: 应用的主控制器
- **职责**: 
  - 初始化应用
  - 管理组件生命周期
  - 处理全局事件
  - 协调各模块交互

#### 2. 组件模块 (components.js)
- **UI组件库**: 包含所有可复用的UI组件
- **主要组件**:
  - `CalendarComponent`: 日历视图组件
  - `EventCard`: 活动卡片组件
  - `FilterPanel`: 筛选面板组件
  - `ModalComponent`: 模态框组件

#### 3. 配置模块 (config.js)
- **应用配置**: 包含所有配置项和常量
- **主要内容**:
  - 默认设置
  - 活动类型定义
  - UI配置
  - API端点

#### 4. 国际化模块 (i18n.js)
- **多语言支持**: 处理语言切换和文本翻译
- **支持语言**: 中文、英文、日文
- **功能**: 动态语言切换、文本本地化

## 开发规范

### 代码风格

#### JavaScript
```javascript
// 使用ES6+语法
class MyComponent {
    constructor(options) {
        this.options = options;
        this.init();
    }
    
    init() {
        // 初始化逻辑
    }
    
    // 方法名使用驼峰命名
    handleClick() {
        // 处理点击事件
    }
}

// 常量使用大写
const DEFAULT_CONFIG = {
    theme: 'light',
    language: 'zh-CN'
};
```

#### CSS
```css
/* 使用BEM命名规范 */
.schedule-app {
    /* 主容器样式 */
}

.schedule-app__header {
    /* 头部样式 */
}

.schedule-app__content {
    /* 内容区域样式 */
}

.schedule-app__content--loading {
    /* 加载状态样式 */
}
```

### 文件命名规范

- **JavaScript文件**: 使用小写字母和连字符，如 `data-loader.js`
- **CSS文件**: 使用小写字母和连字符，如 `styles.css`
- **图片文件**: 使用描述性名称，如 `event-icon.png`
- **数据文件**: 使用描述性名称，如 `activities.json`

## 开发流程

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd Schedule

# 启动开发服务器
python -m http.server 8000
# 或使用其他本地服务器
```

### 2. 添加新功能

#### 步骤1: 创建功能分支
```bash
git checkout -b feature/new-feature
```

#### 步骤2: 开发功能
1. 在 `src/js/` 目录下创建新的JavaScript文件
2. 在 `src/css/styles.css` 中添加相应样式
3. 在 `index.html` 中引入新文件

#### 步骤3: 测试功能
1. 在 `tests/` 目录下创建测试文件
2. 确保功能在不同浏览器中正常工作
3. 测试响应式设计

#### 步骤4: 提交代码
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### 3. 代码审查

- 确保代码符合项目规范
- 检查是否有潜在的性能问题
- 验证功能是否按预期工作
- 确保代码有适当的注释

## 调试指南

### 浏览器调试

1. **打开开发者工具**
   - Chrome/Edge: F12 或 Ctrl+Shift+I
   - Firefox: F12 或 Ctrl+Shift+I

2. **查看控制台**
   ```javascript
   // 应用实例已暴露到全局
   console.log(window.scheduleApp);
   
   // 查看当前数据
   console.log(window.scheduleApp.getEvents());
   ```

3. **调试特定功能**
   ```javascript
   // 添加新活动
   window.scheduleApp.addEvent({
       day: 'Mon.',
       dateRange: '6.25',
       title: '测试活动',
       type: 'meeting'
   });
   ```

### 常见问题

#### 1. 数据加载失败
- 检查 `assets/data/` 目录下的数据文件是否存在
- 确认JSON格式是否正确
- 检查浏览器控制台是否有错误信息

#### 2. 样式不生效
- 确认CSS文件路径是否正确
- 检查CSS选择器是否正确
- 确认没有CSS语法错误

#### 3. 功能不工作
- 检查JavaScript文件是否正确引入
- 确认没有JavaScript语法错误
- 检查浏览器控制台是否有错误信息

## 性能优化

### 1. 代码优化
- 使用事件委托减少事件监听器数量
- 避免频繁的DOM操作
- 使用防抖和节流优化事件处理

### 2. 资源优化
- 压缩图片资源
- 合并和压缩CSS/JS文件
- 使用CDN加载外部资源

### 3. 数据优化
- 实现数据分页加载
- 使用本地存储缓存数据
- 优化数据结构

## 部署指南

### 1. 生产环境准备
```bash
# 压缩静态资源
# 可以使用工具如 gulp, webpack 等

# 检查文件路径
# 确保所有资源路径都是相对路径或正确的绝对路径
```

### 2. 服务器配置
- 配置正确的MIME类型
- 启用Gzip压缩
- 设置缓存策略

### 3. 监控和维护
- 监控应用性能
- 定期更新依赖
- 备份重要数据

## 贡献指南

### 提交规范

使用约定式提交格式：
```
type(scope): description

feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

### 示例
```bash
git commit -m "feat(calendar): add month view support"
git commit -m "fix(filter): resolve date range filter issue"
git commit -m "docs(readme): update installation guide"
```

---

更多详细信息请参考项目中的其他文档文件。 