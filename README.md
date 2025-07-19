# 小小日向美香的传声筒 - 日程表框架

一个现代化的活动日程管理Web应用，支持多语言、响应式设计和丰富的交互功能。

## 🚀 功能特性

- 📅 **智能日程管理** - 支持按日期、类型、优先级等多种方式组织活动
- 🌍 **多语言支持** - 支持中文、英文、日文等多种语言切换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **现代化UI** - 美观的界面设计和流畅的动画效果
- 🔍 **高级筛选** - 支持按类型、日期范围、标签等多维度筛选
- 📊 **数据可视化** - 直观的日历视图和统计信息
- 🔧 **易于扩展** - 模块化架构，便于添加新功能

## 📁 项目结构

```
Schedule/
├── index.html              # 主页面
├── src/                    # 源代码目录
│   ├── js/                 # JavaScript文件
│   │   ├── app.js          # 主应用逻辑
│   │   ├── components.js   # UI组件
│   │   ├── config.js       # 配置文件
│   │   ├── i18n.js         # 国际化
│   │   ├── import_events.js # 数据导入
│   │   ├── script.js       # 工具脚本
│   │   └── data-loader.js  # 数据加载器
│   └── css/                # 样式文件
│       └── styles.css      # 主样式表
├── assets/                 # 静态资源
│   ├── images/             # 图片资源
│   └── data/               # 数据文件
│       ├── activities.json # 活动数据
│       ├── config_events.json # 配置数据
│       └── raw_events.json # 原始数据
├── scripts/                # 脚本工具
│   ├── scrape_eventernote.py # 数据爬取脚本
│   ├── run_scraper.py      # 爬虫运行脚本
│   └── test_scraper.py     # 爬虫测试
├── tests/                  # 测试文件
│   └── *.html              # 各种测试页面
└── docs/                   # 文档
    ├── README.md           # 项目说明
    ├── requirements.txt    # Python依赖
    └── *.md               # 其他文档
```

## 🛠️ 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd Schedule
```

### 2. 启动应用
由于这是一个纯前端项目，你可以：

**方法一：直接打开**
- 双击 `index.html` 文件在浏览器中打开

**方法二：使用本地服务器**
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 使用PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

### 3. 数据更新（可选）
如果需要更新活动数据：

```bash
cd scripts
pip install -r ../docs/requirements.txt
python run_scraper.py
```

## 🎯 核心功能

### 日程管理
- 添加、编辑、删除活动
- 按日期、类型、优先级排序
- 支持重复活动设置

### 多语言支持
- 中文（简体/繁体）
- 英文
- 日文
- 支持动态切换语言

### 高级筛选
- 按活动类型筛选
- 按日期范围筛选
- 按标签筛选
- 按优先级筛选

### 数据导入导出
- 支持JSON格式数据导入
- 支持CSV格式导出
- 支持批量数据更新

## 🔧 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: 自定义CSS，响应式设计
- **数据**: JSON格式
- **工具**: Python爬虫脚本

## 📝 开发指南

### 添加新功能
1. 在 `src/js/` 目录下创建新的JavaScript文件
2. 在 `index.html` 中引入新文件
3. 在 `src/css/styles.css` 中添加相应样式

### 添加新语言
1. 在 `src/js/i18n.js` 中添加新的语言配置
2. 更新语言切换逻辑

### 自定义样式
1. 修改 `src/css/styles.css` 文件
2. 支持CSS变量自定义主题色彩

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢所有为这个项目做出贡献的开发者
- 特别感谢小日向美香粉丝团的支持

---

**注意**: 这是一个开源项目，仅供学习和研究使用。请遵守相关法律法规和网站使用条款。 