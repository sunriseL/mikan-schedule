# Eventernote 爬虫使用说明

## 概述

这个Python爬虫脚本用于从Eventernote网站抓取小日向美香的所有活动数据，包括活动信息和相关图片。

## 功能特点

- 🕷️ 自动爬取Eventernote网站的活动数据
- 📄 支持分页抓取（共11页，200多个活动）
- 🖼️ 自动下载活动相关图片
- 📊 生成详细的统计报告
- 🔄 自动处理日期、时间、地点等信息
- 🏷️ 智能分类和标签生成

## 文件说明

- `scrape_eventernote.py` - 主爬虫脚本
- `test_scraper.py` - 网站结构测试脚本
- `simple_test.py` - Python环境测试脚本
- `requirements.txt` - Python依赖列表
- `scraped_activities.json` - 爬取结果（运行后生成）
- `scraping_report.json` - 统计报告（运行后生成）
- `scraped_images/` - 下载的图片目录（运行后生成）

## 安装依赖

### 方法1：使用pip安装
```bash
pip install requests beautifulsoup4 lxml
```

### 方法2：使用requirements.txt
```bash
pip install -r requirements.txt
```

## 使用方法

### 1. 测试环境
首先测试Python环境是否正常：
```bash
python simple_test.py
```

### 2. 测试网站结构
测试网站结构，了解页面布局：
```bash
python test_scraper.py
```

### 3. 运行爬虫
开始爬取所有活动数据：
```bash
python scrape_eventernote.py
```

## 输出文件

### scraped_activities.json
包含所有爬取的活动数据，格式如下：
```json
{
  "events": [
    {
      "id": 1234567890,
      "day": "Wed.",
      "dateRange": "07.30",
      "fullDate": "2025-07-30",
      "year": 2025,
      "month": 7,
      "day": 30,
      "title": "MyGO!!!!! ZEPP TOUR 2025「心のはしを辿って」愛知公演",
      "type": "concert",
      "image": "scraped_images/MyGO_ZEPP_TOUR_2025_1234567890.jpg",
      "description": "MyGO!!!!! ZEPP TOUR 2025「心のはしを辿って」愛知公演 - 小日向美香出演",
      "location": "Zepp Nagoya",
      "time": "18:30",
      "openTime": "17:30",
      "endTime": "20:30",
      "category": "performance",
      "priority": 3,
      "tags": ["MyGO!!!!!", "演唱会"],
      "performers": ["MyGO!!!!!", "羊宮妃那", "立石凛", "青木陽菜", "小日向美香", "林鼓子"]
    }
  ],
  "featuredPerson": {
    "name": "小日向美香",
    "japaneseName": "こひなたみか",
    "description": "声優、アイドル、アーティスト",
    "image": "image/randpic_小日向美香_1.jpg"
  },
  "categories": [
    {
      "id": "performance",
      "name": "演出活动",
      "icon": "🎭"
    },
    {
      "id": "event",
      "name": "其他活动",
      "icon": "🎪"
    }
  ]
}
```

### scraping_report.json
包含统计信息：
```json
{
  "totalEvents": 202,
  "eventsByMonth": {
    "7": 15,
    "8": 25,
    "9": 20
  },
  "eventsByType": {
    "concert": 50,
    "theater": 30,
    "event": 122
  },
  "eventsByCategory": {
    "performance": 80,
    "event": 122
  }
}
```

## 数据字段说明

### 必需字段
- `id`: 活动唯一标识符
- `title`: 活动标题
- `dateRange`: 日期范围（格式：MM.DD）
- `year`: 年份
- `month`: 月份
- `day`: 日期

### 可选字段
- `day`: 星期几（如 "Wed.", "Sat."）
- `fullDate`: 完整日期（格式：YYYY-MM-DD）
- `image`: 活动图片路径
- `description`: 活动描述
- `location`: 活动地点
- `time`: 活动时间
- `openTime`: 开场时间
- `endTime`: 结束时间
- `priority`: 优先级（1-5）
- `tags`: 标签数组
- `performers`: 表演者数组

## 智能分类

脚本会自动根据活动标题进行分类：

### 活动类型 (type)
- `concert`: 演唱会、Live
- `theater`: 舞台剧
- `event`: 其他活动

### 活动分类 (category)
- `performance`: 演出活动（演唱会、舞台剧）
- `event`: 其他活动

### 优先级 (priority)
- `3`: 演唱会
- `2`: 舞台剧
- `1`: 其他活动

### 标签 (tags)
- `MyGO!!!!!`: 包含MyGO的活动
- `演唱会`: 演唱会活动
- `舞台剧`: 舞台剧活动
- `活动`: 一般活动

## 注意事项

1. **网络连接**: 确保网络连接稳定
2. **反爬虫**: 脚本包含延迟机制，避免被网站反爬虫
3. **图片下载**: 图片会下载到 `scraped_images/` 目录
4. **数据验证**: 建议检查生成的JSON文件确保数据正确
5. **更新数据**: 可以将 `scraped_activities.json` 重命名为 `activities.json` 来更新网站数据

## 故障排除

### 常见问题

1. **模块未找到错误**
   ```bash
   pip install requests beautifulsoup4 lxml
   ```

2. **网络连接错误**
   - 检查网络连接
   - 尝试使用VPN
   - 增加超时时间

3. **数据提取失败**
   - 运行 `test_scraper.py` 检查网站结构
   - 查看 `page_source.html` 分析页面源码

4. **图片下载失败**
   - 检查网络连接
   - 确认图片URL是否有效
   - 查看错误日志

## 更新网站数据

爬取完成后，可以更新网站的活动数据：

1. 备份原有的 `activities.json`
2. 将 `scraped_activities.json` 重命名为 `activities.json`
3. 刷新网页查看新数据

## 技术实现

- **请求库**: requests
- **解析库**: BeautifulSoup4 + lxml
- **图片下载**: urllib.request
- **数据格式**: JSON
- **编码**: UTF-8

## 法律声明

本脚本仅用于学习和研究目的，请遵守网站的使用条款和robots.txt文件。建议：

1. 控制爬取频率，避免对服务器造成压力
2. 尊重网站的版权和隐私政策
3. 不要用于商业用途
4. 遵守相关法律法规 