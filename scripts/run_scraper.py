#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import subprocess
import importlib

def check_and_install_dependencies():
    """检查并安装依赖"""
    required_packages = ['requests', 'bs4', 'lxml']
    missing_packages = []
    
    print("检查Python依赖...")
    
    for package in required_packages:
        try:
            if package == 'bs4':
                importlib.import_module('bs4')
            else:
                importlib.import_module(package)
            print(f"✓ {package} 已安装")
        except ImportError:
            print(f"✗ {package} 未安装")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n需要安装以下包: {', '.join(missing_packages)}")
        try:
            # 尝试安装缺失的包
            for package in missing_packages:
                if package == 'bs4':
                    package_name = 'beautifulsoup4'
                else:
                    package_name = package
                
                print(f"正在安装 {package_name}...")
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package_name])
                print(f"✓ {package_name} 安装成功")
            
            print("\n所有依赖安装完成！")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"安装失败: {e}")
            print("请手动运行: pip install requests beautifulsoup4 lxml")
            return False
    else:
        print("所有依赖都已安装！")
        return True

def main():
    """主函数"""
    print("=" * 50)
    print("Eventernote 爬虫启动器")
    print("=" * 50)
    
    # 检查依赖
    if not check_and_install_dependencies():
        return
    
    print("\n" + "=" * 50)
    print("开始运行爬虫...")
    print("=" * 50)
    
    try:
        # 导入并运行爬虫
        from scrape_eventernote import EventernoteScraper
        
        scraper = EventernoteScraper()
        scraper.scrape_all_events()
        
        print("\n" + "=" * 50)
        print("爬虫运行完成！")
        print("=" * 50)
        print("生成的文件:")
        print("- scraped_activities.json: 活动数据")
        print("- scraping_report.json: 统计报告")
        print("- scraped_images/: 下载的图片")
        print("\n如需更新网站数据，请将 scraped_activities.json 重命名为 activities.json")
        
    except Exception as e:
        print(f"运行爬虫时出错: {e}")
        print("请检查网络连接或查看错误信息")

if __name__ == "__main__":
    main() 