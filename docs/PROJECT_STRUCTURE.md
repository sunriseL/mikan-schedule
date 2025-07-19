# 项目结构概览

## 📁 目录结构

```
Schedule/
├── 📄 index.html                    # 主页面入口
├── 📄 README.md                     # 项目主文档
├── 📄 .gitignore                    # Git忽略文件配置
│
├── 📁 src/                          # 源代码目录
│   ├── 📁 js/                       # JavaScript文件
│   │   ├── 📄 app.js               # 主应用逻辑
│   │   ├── 📄 components.js        # UI组件库
│   │   ├── 📄 config.js            # 应用配置
│   │   ├── 📄 i18n.js              # 国际化模块
│   │   ├── 📄 import_events.js     # 数据导入模块
│   │   ├── 📄 script.js            # 工具脚本
│   │   └── 📄 data-loader.js       # 数据加载器
│   ├── 📁 css/                      # 样式文件
│   │   └── 📄 styles.css           # 主样式表
│   └── 📁 components/               # 组件目录（预留）
│
├── 📁 assets/                       # 静态资源
│   ├── 📁 images/                   # 图片资源
│   │   ├── 📄 小日向美香.png       # 头像图片
│   │   └── 📄 *.jpg                # 活动相关图片
│   └── 📁 data/                     # 数据文件
│       ├── 📄 activities.json      # 主要活动数据
│       ├── 📄 config_events.json   # 配置数据
│       ├── 📄 raw_events.json      # 原始数据备份
│       └── 📄 example-data.json    # 示例数据
│
├── 📁 scripts/                      # 脚本工具
│   ├── 📄 scrape_eventernote.py    # 数据爬取脚本
│   ├── 📄 run_scraper.py           # 爬虫运行脚本
│   ├── 📄 simple_test.py           # 简单测试脚本
│   └── 📄 test_scraper.py          # 爬虫测试脚本
│
├── 📁 tests/                        # 测试文件
│   ├── 📄 test_*.html              # 功能测试页面
│   ├── 📄 debug_*.html             # 调试页面
│   └── 📄 weekday_test.html        # 周历测试页面
│
└── 📁 docs/                         # 文档目录
    ├── 📄 DEVELOPMENT.md            # 开发指南
    ├── 📄 PROJECT_STRUCTURE.md      # 项目结构说明（本文件）
    ├── 📄 requirements.txt          # Python依赖
    ├── 📄 README.md                 # 原项目说明
    └── 📄 *.md                      # 各种功能说明文档
```

## 🔧 核心文件说明

### 前端核心文件

#### `index.html`
- **作用**: 应用的主入口页面
- **功能**: 
  - 加载所有必要的CSS和JavaScript文件
  - 提供应用容器
  - 初始化应用实例

#### `src/js/app.js`
- **作用**: 主应用控制器
- **功能**:
  - 管理应用生命周期
  - 协调各组件交互
  - 处理全局事件
  - 提供公共API

#### `src/js/components.js`
- **作用**: UI组件库
- **主要组件**:
  - `CalendarComponent`: 日历视图
  - `EventCard`: 活动卡片
  - `FilterPanel`: 筛选面板
  - `ModalComponent`: 模态框

#### `src/js/config.js`
- **作用**: 应用配置管理
- **内容**:
  - 默认设置
  - 活动类型定义
  - UI配置参数
  - 常量定义

#### `src/js/i18n.js`
- **作用**: 国际化支持
- **功能**:
  - 多语言文本管理
  - 动态语言切换
  - 文本本地化

#### `src/css/styles.css`
- **作用**: 主样式表
- **特点**:
  - 响应式设计
  - 现代化UI风格
  - 支持主题切换

### 数据文件

#### `assets/data/activities.json`
- **作用**: 主要活动数据源
- **格式**: JSON格式的活动列表
- **内容**: 包含活动的详细信息

#### `assets/data/config_events.json`
- **作用**: 配置数据
- **内容**: 活动类型、标签等配置信息

#### `assets/data/raw_events.json`
- **作用**: 原始数据备份
- **用途**: 数据恢复和对比

### 工具脚本

#### `scripts/scrape_eventernote.py`
- **作用**: 数据爬取主脚本
- **功能**: 从网站爬取活动数据

#### `scripts/run_scraper.py`
- **作用**: 爬虫运行脚本
- **功能**: 执行数据爬取任务

## 📊 数据流

```
数据源 → 爬虫脚本 → 原始数据 → 数据处理 → 活动数据 → 前端应用
   ↓         ↓         ↓         ↓         ↓         ↓
网站数据   scrape_   raw_     import_   activities  UI展示
         eventernote events   events    .json
         .py        .json    .js
```

## 🔄 开发工作流

### 1. 数据更新流程
```bash
# 1. 运行爬虫更新数据
cd scripts
python run_scraper.py

# 2. 数据会自动保存到 assets/data/
# 3. 前端应用会自动加载新数据
```

### 2. 功能开发流程
```bash
# 1. 在 src/js/ 中添加新功能
# 2. 在 src/css/styles.css 中添加样式
# 3. 在 tests/ 中创建测试文件
# 4. 在 docs/ 中更新文档
```

### 3. 测试流程
```bash
# 1. 启动本地服务器
python -m http.server 8000

# 2. 访问测试页面
# http://localhost:8000/tests/test_*.html

# 3. 检查功能是否正常
```

## 🎯 文件命名规范

### JavaScript文件
- 使用小写字母和连字符
- 描述性名称
- 示例: `data-loader.js`, `import-events.js`

### CSS文件
- 使用小写字母和连字符
- 功能描述
- 示例: `styles.css`, `components.css`

### 数据文件
- 使用描述性名称
- JSON格式
- 示例: `activities.json`, `config.json`

### 图片文件
- 使用描述性名称
- 支持中文文件名
- 示例: `小日向美香.png`, `event-icon.jpg`

## 🔍 查找文件指南

### 快速定位文件

#### 前端代码
- **主应用逻辑**: `src/js/app.js`
- **UI组件**: `src/js/components.js`
- **样式文件**: `src/css/styles.css`
- **配置管理**: `src/js/config.js`

#### 数据文件
- **活动数据**: `assets/data/activities.json`
- **配置数据**: `assets/data/config_events.json`
- **原始数据**: `assets/data/raw_events.json`

#### 工具脚本
- **爬虫主脚本**: `scripts/scrape_eventernote.py`
- **爬虫运行**: `scripts/run_scraper.py`
- **测试脚本**: `scripts/test_scraper.py`

#### 文档文件
- **开发指南**: `docs/DEVELOPMENT.md`
- **项目结构**: `docs/PROJECT_STRUCTURE.md`
- **功能说明**: `docs/*.md`

## 📝 维护建议

### 定期维护
1. **数据更新**: 定期运行爬虫脚本更新活动数据
2. **代码清理**: 删除不再使用的测试文件和临时文件
3. **文档更新**: 及时更新相关文档
4. **依赖检查**: 检查并更新Python依赖

### 备份策略
1. **数据备份**: 定期备份 `assets/data/` 目录
2. **代码备份**: 使用Git进行版本控制
3. **配置备份**: 备份重要的配置文件

---

这个结构设计遵循了现代Web开发的最佳实践，便于维护和扩展。 