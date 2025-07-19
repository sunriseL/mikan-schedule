# 活动数据管理说明

## 概述

现在活动数据已经从 `config.js` 中分离出来，存储在独立的 `activities.json` 文件中。这样的设计使得活动数据更容易管理和维护。

## 文件结构

### activities.json
这是存储所有活动数据的JSON文件，包含以下结构：

```json
{
    "events": [
        {
            "id": 1,
            "day": "Wed.",
            "dateRange": "07.30",
            "fullDate": "2025-07-30",
            "year": 2025,
            "month": 7,
            "day": 30,
            "title": "活动标题",
            "type": "concert",
            "image": "image/randpic_小日向美香_1.jpg",
            "description": "活动描述",
            "location": "活动地点",
            "time": "18:30",
            "openTime": "17:30",
            "endTime": "20:30",
            "category": "performance",
            "priority": 3,
            "tags": ["标签1", "标签2"],
            "performers": ["表演者1", "表演者2"]
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

## 活动数据字段说明

### 必需字段
- `id`: 活动唯一标识符
- `title`: 活动标题
- `dateRange`: 日期范围（格式：MM.DD 或 MM.DD-DD）
- `year`: 年份
- `month`: 月份
- `day`: 日期
- `type`: 活动类型
- `category`: 活动分类

### 可选字段
- `day`: 星期几（如 "Wed.", "Sat."）
- `fullDate`: 完整日期（格式：YYYY-MM-DD）
- `image`: 活动图片路径
- `description`: 活动描述
- `location`: 活动地点
- `time`: 活动时间
- `openTime`: 开场时间
- `endTime`: 结束时间
- `priority`: 优先级（1-5，数字越大优先级越高）
- `tags`: 标签数组
- `performers`: 表演者数组

## 如何添加新活动

1. 打开 `activities.json` 文件
2. 在 `events` 数组中添加新的活动对象
3. 确保新活动的 `id` 是唯一的
4. 保存文件
5. 刷新网页即可看到新活动

## 如何修改现有活动

1. 在 `activities.json` 文件中找到要修改的活动
2. 修改相应的字段
3. 保存文件
4. 刷新网页即可看到修改后的活动

## 特色人物设置

在 `featuredPerson` 对象中可以设置特色人物的信息：
- `name`: 中文姓名
- `japaneseName`: 日文姓名
- `description`: 描述
- `image`: 头像图片路径

## 分类管理

在 `categories` 数组中可以定义活动分类：
- `id`: 分类唯一标识符
- `name`: 分类名称
- `icon`: 分类图标（emoji）

## 注意事项

1. 确保JSON格式正确，可以使用在线JSON验证工具验证
2. 图片路径要确保文件存在
3. 日期格式要符合要求
4. 修改后需要刷新网页才能看到效果
5. 如果加载失败，会显示错误提示，可以点击刷新按钮重试

## 技术实现

- 应用启动时会自动从 `activities.json` 文件加载数据
- 如果加载失败，会使用默认的空数据结构
- 支持异步加载，不会阻塞页面渲染
- 包含错误处理和用户友好的错误提示 