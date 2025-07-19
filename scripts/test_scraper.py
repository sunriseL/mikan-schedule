#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import re

def test_page_structure():
    """测试页面结构"""
    url = 'https://www.eventernote.com/actors/小日向美香/63191'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8',
    }
    
    try:
        print("正在获取页面...")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        print("页面获取成功！")
        print(f"页面标题: {soup.title.string if soup.title else '无标题'}")
        
        # 查找分页信息
        text = soup.get_text()
        match = re.search(r'小日向美香の全てのイベントを見る\((\d+)件\)', text)
        if match:
            total_events = int(match.group(1))
            print(f"总活动数: {total_events}")
        
        # 查找活动容器
        print("\n查找活动容器...")
        
        # 尝试不同的选择器
        selectors = [
            '.event-list',
            '.event-item',
            '.event',
            'article',
            '.item',
            'div[class*="event"]',
            'div[class*="item"]'
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                print(f"选择器 '{selector}' 找到 {len(elements)} 个元素")
                
                # 检查前几个元素的内容
                for i, element in enumerate(elements[:3]):
                    print(f"  元素 {i+1}:")
                    print(f"    类名: {element.get('class', [])}")
                    print(f"    文本预览: {element.get_text()[:100]}...")
                    print()
        
        # 查找所有包含日期的元素
        print("查找包含日期的元素...")
        date_elements = soup.find_all(text=re.compile(r'\d{4}-\d{2}-\d{2}'))
        print(f"找到 {len(date_elements)} 个包含日期的元素")
        
        # 查找所有标题元素
        print("查找标题元素...")
        title_elements = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        print(f"找到 {len(title_elements)} 个标题元素")
        
        for i, title in enumerate(title_elements[:5]):
            print(f"  标题 {i+1}: {title.get_text(strip=True)}")
        
        # 查找所有图片
        print("查找图片...")
        images = soup.find_all('img')
        print(f"找到 {len(images)} 个图片")
        
        for i, img in enumerate(images[:3]):
            src = img.get('src', '')
            alt = img.get('alt', '')
            print(f"  图片 {i+1}: src={src}, alt={alt}")
        
        # 保存页面源码以供分析
        with open('page_source.html', 'w', encoding='utf-8') as f:
            f.write(response.text)
        print("\n页面源码已保存到 page_source.html")
        
    except Exception as e:
        print(f"获取页面失败: {e}")

if __name__ == "__main__":
    test_page_structure() 