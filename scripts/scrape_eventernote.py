#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import json
import os
import time
import re
from urllib.parse import urljoin, urlparse
import urllib.request
from datetime import datetime

class EventernoteScraper:
    def __init__(self):
        self.base_url = 'https://www.eventernote.com/actors/小日向美香/63191'
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        self.all_events = []
        self.image_dir = 'scraped_images'
        
        # 创建图片目录
        if not os.path.exists(self.image_dir):
            os.makedirs(self.image_dir)
    
    def get_page(self, url):
        """获取页面内容"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            response.encoding = 'utf-8'
            return response.text
        except Exception as e:
            print(f"获取页面失败: {e}")
            return None
    
    def get_total_pages(self, html):
        """获取总页数"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # 查找分页信息
        text = soup.get_text()
        match = re.search(r'小日向美香の全てのイベントを見る\((\d+)件\)', text)
        if match:
            total_events = int(match.group(1))
            # 假设每页显示20个活动
            return max(1, (total_events + 19) // 20)
        
        # 如果没有找到，尝试查找分页链接
        pagination_links = soup.find_all('a', href=re.compile(r'page=\d+'))
        if pagination_links:
            page_numbers = []
            for link in pagination_links:
                match = re.search(r'page=(\d+)', link.get('href', ''))
                if match:
                    page_numbers.append(int(match.group(1)))
            return max(page_numbers) if page_numbers else 1
        
        return 1
    
    def scrape_events_from_page(self, html):
        """从页面中提取活动信息"""
        soup = BeautifulSoup(html, 'html.parser')
        events = []
        
        # 查找活动列表项
        event_items = soup.find_all('li', class_='clearfix')
        
        print(f"找到 {len(event_items)} 个活动项")
        
        for item in event_items:
            event = self.extract_event_info(item)
            if event and event.get('title'):
                events.append(event)
        
        return events
    
    def extract_event_info(self, container):
        """从容器中提取活动信息"""
        try:
            # 提取日期
            date_text = self.extract_date(container)
            
            # 提取标题
            title = self.extract_title(container)
            
            # 提取地点
            venue = self.extract_venue(container)
            
            # 提取时间
            time_text = self.extract_time(container)
            
            # 提取出演者
            performers = self.extract_performers(container)
            
            # 提取图片
            image_url = self.extract_image(container)
            
            # 解析日期
            date_info = self.parse_date(date_text)
            
            if not title:
                return None
            
            event = {
                'id': self.generate_id(),
                'day': date_info['day'],
                'dateRange': date_info['dateRange'],
                'fullDate': date_info['fullDate'],
                'year': date_info['year'],
                'month': date_info['month'],
                'day': date_info['day'],
                'title': title,
                'type': self.determine_event_type(title),
                'image': self.download_image(image_url, title),
                'description': f"{title} - 小日向美香出演",
                'location': venue,
                'time': self.extract_time_from_text(time_text),
                'openTime': self.extract_open_time(time_text),
                'endTime': self.extract_end_time(time_text),
                'category': self.determine_category(title),
                'priority': self.determine_priority(title),
                'tags': self.generate_tags(title),
                'performers': performers if performers else ['小日向美香']
            }
            
            return event
            
        except Exception as e:
            print(f"提取活动信息失败: {e}")
            return None
    
    def extract_date(self, container):
        """提取日期信息"""
        # 查找日期元素
        date_element = container.find('div', class_='date')
        if date_element:
            day_element = date_element.find('p', class_=re.compile(r'day\d+'))
            if day_element:
                return day_element.get_text(strip=True)
        
        # 如果没有找到，尝试在文本中查找
        text = container.get_text()
        date_match = re.search(r'(\d{4}-\d{2}-\d{2})\s*\(([^)]+)\)', text)
        if date_match:
            return date_match.group(0)
        
        return ""
    
    def extract_title(self, container):
        """提取标题"""
        # 查找事件元素
        event_element = container.find('div', class_='event')
        if event_element:
            title_element = event_element.find('h4')
            if title_element:
                return title_element.get_text(strip=True)
        
        return ""
    
    def extract_venue(self, container):
        """提取地点"""
        event_element = container.find('div', class_='event')
        if event_element:
            place_elements = event_element.find_all('div', class_='place')
            for place_element in place_elements:
                text = place_element.get_text()
                if '会場:' in text:
                    venue_match = re.search(r'会場:\s*([^\n\r]+)', text)
                    if venue_match:
                        return venue_match.group(1).strip()
        
        return ""
    
    def extract_time(self, container):
        """提取时间信息"""
        event_element = container.find('div', class_='event')
        if event_element:
            place_elements = event_element.find_all('div', class_='place')
            for place_element in place_elements:
                text = place_element.get_text()
                if '開場' in text and '開演' in text:
                    return text.strip()
        
        return ""
    
    def extract_performers(self, container):
        """提取出演者"""
        performers = []
        
        event_element = container.find('div', class_='event')
        if event_element:
            actor_element = event_element.find('div', class_='actor')
            if actor_element:
                performer_links = actor_element.find_all('a')
                for link in performer_links:
                    performer = link.get_text(strip=True)
                    if performer and performer not in performers and performer != '出演者:':
                        performers.append(performer)
        
        # 如果没有找到，尝试从标题中提取
        if not performers:
            title = self.extract_title(container)
            if 'MyGO!!!!!' in title:
                performers = ['MyGO!!!!!', '小日向美香']
            elif '立石凛' in title:
                performers = ['立石凛', '小日向美香']
            else:
                performers = ['小日向美香']
        
        return performers
    
    def extract_image(self, container):
        """提取图片URL"""
        date_element = container.find('div', class_='date')
        if date_element:
            img_element = date_element.find('img')
            if img_element:
                src = img_element.get('src')
                if src and not src.endswith('logo201607_m.png'):  # 排除logo图片
                    return urljoin(self.base_url, src)
        
        return None
    
    def download_image(self, image_url, title):
        """下载图片并返回本地路径"""
        if not image_url:
            # 如果没有图片，使用默认图片
            return "image/randpic_小日向美香_1.jpg"
        
        try:
            # 生成文件名
            safe_title = re.sub(r'[^\w\s-]', '', title)[:50]
            file_extension = os.path.splitext(urlparse(image_url).path)[1] or '.jpg'
            filename = f"{safe_title}_{int(time.time())}{file_extension}"
            filepath = os.path.join(self.image_dir, filename)
            
            # 下载图片
            response = self.session.get(image_url, timeout=10)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"下载图片: {filename}")
            return filepath
            
        except Exception as e:
            print(f"下载图片失败: {e}")
            return "image/randpic_小日向美香_1.jpg"
    
    def parse_date(self, date_text):
        """解析日期"""
        # 匹配格式: "2025-07-30 (水)"
        match = re.search(r'(\d{4})-(\d{2})-(\d{2})\s*\(([^)]+)\)', date_text)
        if match:
            year = int(match.group(1))
            month = int(match.group(2))
            day = int(match.group(3))
            weekday = match.group(4)
            
            return {
                'year': year,
                'month': month,
                'day': day,
                'dateRange': f"{month}.{day:02d}",
                'fullDate': f"{year}-{match.group(2)}-{match.group(3)}",
                'day': self.get_weekday_abbr(weekday)
            }
        
        # 默认返回
        return {
            'year': 2025,
            'month': 1,
            'day': 1,
            'dateRange': "01.01",
            'fullDate': "2025-01-01",
            'day': "Mon."
        }
    
    def get_weekday_abbr(self, weekday):
        """获取星期缩写"""
        weekday_map = {
            '月': 'Mon.',
            '火': 'Tue.',
            '水': 'Wed.',
            '木': 'Thu.',
            '金': 'Fri.',
            '土': 'Sat.',
            '日': 'Sun.'
        }
        return weekday_map.get(weekday, 'Mon.')
    
    def determine_event_type(self, title):
        """确定活动类型"""
        title_lower = title.lower()
        if any(keyword in title_lower for keyword in ['ライブ', 'live', 'concert']):
            return 'concert'
        elif any(keyword in title_lower for keyword in ['舞台', 'theater']):
            return 'theater'
        elif any(keyword in title_lower for keyword in ['イベント', 'event']):
            return 'event'
        else:
            return 'event'
    
    def determine_category(self, title):
        """确定活动分类"""
        title_lower = title.lower()
        if any(keyword in title_lower for keyword in ['ライブ', 'live', 'concert', '舞台', 'theater']):
            return 'performance'
        else:
            return 'event'
    
    def determine_priority(self, title):
        """确定优先级"""
        title_lower = title.lower()
        if any(keyword in title_lower for keyword in ['ライブ', 'live', 'concert']):
            return 3
        elif any(keyword in title_lower for keyword in ['舞台', 'theater']):
            return 2
        else:
            return 1
    
    def generate_tags(self, title):
        """生成标签"""
        tags = []
        title_lower = title.lower()
        
        if 'mygo' in title_lower:
            tags.append('MyGO!!!!!')
        if any(keyword in title_lower for keyword in ['ライブ', 'live']):
            tags.append('演唱会')
        if '舞台' in title_lower:
            tags.append('舞台剧')
        if any(keyword in title_lower for keyword in ['イベント', 'event']):
            tags.append('活动')
        
        return tags
    
    def extract_time_from_text(self, time_text):
        """从时间文本中提取开演时间"""
        match = re.search(r'開演\s*(\d{1,2}:\d{2})', time_text)
        return match.group(1) if match else ""
    
    def extract_open_time(self, time_text):
        """从时间文本中提取开场时间"""
        match = re.search(r'開場\s*(\d{1,2}:\d{2})', time_text)
        return match.group(1) if match else ""
    
    def extract_end_time(self, time_text):
        """从时间文本中提取结束时间"""
        match = re.search(r'終演\s*(\d{1,2}:\d{2})', time_text)
        return match.group(1) if match else ""
    
    def generate_id(self):
        """生成唯一ID"""
        return int(time.time() * 1000) + hash(str(time.time()))
    
    def scrape_all_events(self):
        """爬取所有活动"""
        print("开始爬取小日向美香的活动数据...")
        
        # 获取总页数（从第一页获取）
        first_page_url = f"{self.base_url}/events?actor_id=63191&limit=20&page=1"
        html = self.get_page(first_page_url)
        if not html:
            print("无法获取页面内容")
            return
        
        # 获取总页数
        total_pages = self.get_total_pages(html)
        print(f"检测到总共有 {total_pages} 页数据")
        
        # 爬取所有页面
        for page in range(1, total_pages + 1):
            print(f"正在爬取第 {page} 页...")
            
            # 使用正确的分页URL格式
            page_url = f"{self.base_url}/events?actor_id=63191&limit=20&page={page}"
            html = self.get_page(page_url)
            
            if html:
                events = self.scrape_events_from_page(html)
                # 去重处理
                new_events = self.remove_duplicates(events)
                self.all_events.extend(new_events)
                print(f"第 {page} 页完成，获取到 {len(events)} 个活动，去重后 {len(new_events)} 个")
            else:
                print(f"第 {page} 页获取失败")
            
            # 添加延迟避免被反爬
            time.sleep(2)
        
        print(f"爬取完成！总共获取到 {len(self.all_events)} 个活动")
        
        # 保存数据
        self.save_data()
    
    def remove_duplicates(self, new_events):
        """去除重复的活动"""
        existing_titles = set()
        for event in self.all_events:
            existing_titles.add(event['title'])
        
        unique_events = []
        for event in new_events:
            if event['title'] not in existing_titles:
                unique_events.append(event)
        
        return unique_events
    
    def save_data(self):
        """保存数据到JSON文件"""
        data = {
            'events': self.all_events,
            'featuredPerson': {
                'name': "小日向美香",
                'japaneseName': "こひなたみか",
                'description': "声優、アイドル、アーティスト",
                'image': "image/randpic_小日向美香_1.jpg"
            },
            'categories': [
                {
                    'id': "performance",
                    'name': "演出活动",
                    'icon': "🎭"
                },
                {
                    'id': "event",
                    'name': "其他活动",
                    'icon': "🎪"
                }
            ]
        }
        
        # 保存为JSON文件
        with open('scraped_activities.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print("数据已保存到 scraped_activities.json")
        
        # 生成统计报告
        self.generate_report()
    
    def generate_report(self):
        """生成统计报告"""
        report = {
            'totalEvents': len(self.all_events),
            'eventsByMonth': {},
            'eventsByType': {},
            'eventsByCategory': {}
        }
        
        for event in self.all_events:
            # 按月份统计
            month = event['month']
            report['eventsByMonth'][month] = report['eventsByMonth'].get(month, 0) + 1
            
            # 按类型统计
            event_type = event['type']
            report['eventsByType'][event_type] = report['eventsByType'].get(event_type, 0) + 1
            
            # 按分类统计
            category = event['category']
            report['eventsByCategory'][category] = report['eventsByCategory'].get(category, 0) + 1
        
        with open('scraping_report.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print("统计报告已保存到 scraping_report.json")
        print(f"总活动数: {report['totalEvents']}")
        print(f"按月份分布: {report['eventsByMonth']}")
        print(f"按类型分布: {report['eventsByType']}")
        print(f"按分类分布: {report['eventsByCategory']}")

def main():
    scraper = EventernoteScraper()
    scraper.scrape_all_events()

if __name__ == "__main__":
    main() 