# Hinata Mika's Voice Relay - Schedule Framework

A modern web application for activity schedule management with multi-language support, responsive design, and rich interactive features.

## 🚀 Features

- 📅 **Smart Schedule Management** - Support for organizing activities by date, type, priority, and more
- 🌍 **Multi-language Support** - Support for Chinese, English, Japanese, and other language switching
- 📱 **Responsive Design** - Perfect adaptation for desktop and mobile devices
- 🎨 **Modern UI** - Beautiful interface design and smooth animation effects
- 🔍 **Advanced Filtering** - Support for filtering by type, date range, tags, and multiple dimensions
- 📊 **Data Visualization** - Intuitive calendar view and statistical information
- 🔧 **Easy to Extend** - Modular architecture for easy addition of new features

## 📁 Project Structure

```
Schedule/
├── index.html              # Main page
├── src/                    # Source code directory
│   ├── js/                 # JavaScript files
│   │   ├── app.js          # Main application logic
│   │   ├── components.js   # UI components
│   │   ├── config.js       # Configuration files
│   │   ├── i18n.js         # Internationalization
│   │   ├── import_events.js # Data import
│   │   ├── script.js       # Utility scripts
│   │   └── data-loader.js  # Data loader
│   └── css/                # Style files
│       └── styles.css      # Main stylesheet
├── assets/                 # Static resources
│   ├── images/             # Image resources
│   └── data/               # Data files
│       ├── activities.json # Activity data
│       ├── config_events.json # Configuration data
│       └── raw_events.json # Raw data
├── scripts/                # Script tools
│   ├── scrape_eventernote.py # Data scraping script
│   ├── run_scraper.py      # Scraper execution script
│   └── test_scraper.py     # Scraper testing
├── tests/                  # Test files
│   └── *.html              # Various test pages
└── docs/                   # Documentation
    ├── README.md           # Project description
    ├── requirements.txt    # Python dependencies
    └── *.md               # Other documentation
```

## 🛠️ Quick Start

### 1. Clone the project
```bash
git clone <repository-url>
cd Schedule
```

### 2. Start the application
Since this is a pure frontend project, you can:

**Method 1: Direct opening**
- Double-click the `index.html` file to open in browser

**Method 2: Use local server**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser

### 3. Data update (optional)
If you need to update activity data:

```bash
cd scripts
pip install -r ../docs/requirements.txt
python run_scraper.py
```

## 🎯 Core Features

### Schedule Management
- Add, edit, delete activities
- Sort by date, type, priority
- Support for recurring activity settings

### Multi-language Support
- Chinese (Simplified/Traditional)
- English
- Japanese
- Support for dynamic language switching

### Advanced Filtering
- Filter by activity type
- Filter by date range
- Filter by tags
- Filter by priority

### Data Import/Export
- Support for JSON format data import
- Support for CSV format export
- Support for batch data updates

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS, responsive design
- **Data**: JSON format
- **Tools**: Python scraping scripts

## 📝 Development Guide

### Adding New Features
1. Create new JavaScript files in the `src/js/` directory
2. Include new files in `index.html`
3. Add corresponding styles in `src/css/styles.css`

### Adding New Languages
1. Add new language configuration in `src/js/i18n.js`
2. Update language switching logic

### Customizing Styles
1. Modify the `src/css/styles.css` file
2. Support CSS variables for custom theme colors

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Thanks to all developers who contributed to this project
- Special thanks to Hinata Mika fan club for their support

---

**Note**: This is an open-source project for learning and research purposes only. Please comply with relevant laws and regulations and website terms of use. 