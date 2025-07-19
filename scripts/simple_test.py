#!/usr/bin/env python3
# -*- coding: utf-8 -*-

print("Python环境测试开始...")

try:
    import requests
    print("✓ requests 库已安装")
except ImportError:
    print("✗ requests 库未安装")

try:
    from bs4 import BeautifulSoup
    print("✓ beautifulsoup4 库已安装")
except ImportError:
    print("✗ beautifulsoup4 库未安装")

try:
    import lxml
    print("✓ lxml 库已安装")
except ImportError:
    print("✗ lxml 库未安装")

print("测试完成！") 