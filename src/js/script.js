// 日程表数据
const scheduleData = {
    events: [
        {
            id: 1,
            day: 'Fri.',
            dateRange: '6.15-19',
            title: '明日の卒業生たち',
            type: 'theater',
            image: 'assets/images/randpic_小日向美香_2.jpg',
            description: '毕业季特别演出 - 小日向美香精彩表演'
        },
        {
            id: 2,
            day: 'Sun.',
            dateRange: '6.22',
            title: '超時空機',
            type: 'anime',
            image: 'assets/images/randpic_小日向美香_9.jpg',
            description: '科幻主题展览 - 穿越时空的奇妙体验'
        }
    ],
    featuredPerson: {
        name: '小日向美香',
                    image: 'assets/images/randpic_小日向美香_16.jpg',
        book: '明日の卒業生たち'
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    addEventListeners();
    startAnimations();
});

// 初始化页面
function initializePage() {
    console.log('日程表页面初始化完成');
    
    // 添加页面加载动画
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.8s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
}

// 添加事件监听器
function addEventListeners() {
    // 为活动卡片添加点击事件
    const eventSections = document.querySelectorAll('.event-section');
    eventSections.forEach(section => {
        section.addEventListener('click', function() {
            showEventDetails(this);
        });
        
        // 添加悬停效果
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.2)';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(139, 69, 19, 0.1)';
        });
    });
    
    // 为图片添加点击放大效果
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            showImageModal(this.src, this.alt);
        });
    });
    
    // 为头部标题添加点击效果
    const siteTitle = document.querySelector('.site-title');
    siteTitle.addEventListener('click', function() {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
}

// 显示活动详情
function showEventDetails(eventSection) {
    const dayLabel = eventSection.querySelector('.day-label').textContent;
    const dateRange = eventSection.querySelector('.date-range').textContent;
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'event-modal';
    // 根据活动类型获取详细信息
    let eventInfo = '';
    if (dayLabel === 'Fri.') {
        eventInfo = `
            <h4>明日の卒業生たち</h4>
            <p>🎭 毕业季特别演出</p>
            <p>📅 时间：6月15日-19日</p>
            <p>📍 地点：待定</p>
            <p>🎪 小日向美香将带来精彩的毕业季特别表演，让我们一起见证这个难忘的时刻！</p>
        `;
    } else if (dayLabel === 'Sun.') {
        eventInfo = `
            <h4>超時空機</h4>
            <p>🚀 科幻主题展览</p>
            <p>📅 时间：6月22日</p>
            <p>📍 地点：待定</p>
            <p>🌟 穿越时空的奇妙体验，小日向美香带你探索科幻世界的无限可能！</p>
        `;
    }

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${dayLabel} ${dateRange}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                ${eventInfo}
                <p><em>点击关闭按钮或点击外部区域关闭此窗口。</em></p>
            </div>
        </div>
    `;
    
    // 添加模态框样式
    const style = document.createElement('style');
    style.textContent = `
        .event-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content {
            background: #FFF8DC;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #FFD700;
            padding-bottom: 10px;
        }
        
        .modal-header h3 {
            color: #8B4513;
            margin: 0;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: #8B4513;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.3s;
        }
        
        .close-btn:hover {
            background-color: rgba(139, 69, 19, 0.1);
        }
        
        .modal-body {
            color: #8B4513;
            line-height: 1.6;
        }
        
        .modal-body h4 {
            color: #FF8C00;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .modal-body p {
            margin-bottom: 10px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 关闭模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

// 显示图片模态框
function showImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <img src="${src}" alt="${alt}" class="modal-image">
            <button class="close-btn">&times;</button>
        </div>
    `;
    
    // 添加图片模态框样式
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .image-modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .modal-image {
            width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .image-modal .close-btn {
            position: absolute;
            top: -40px;
            right: 0;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 50%;
            transition: background-color 0.3s;
        }
        
        .image-modal .close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 关闭图片模态框
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

// 启动动画
function startAnimations() {
    // 为装饰元素添加随机动画延迟
    const decorations = document.querySelectorAll('.flower-decoration, .diamond');
    decorations.forEach((decoration, index) => {
        decoration.style.animationDelay = `${index * 0.5}s`;
    });
    
    // 为活动卡片添加依次出现的动画
    const eventSections = document.querySelectorAll('.event-section');
    eventSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease-out';
            section.style.opacity = '1';
            section.style.transform = 'translateX(0)';
        }, 300 + index * 200);
    });
}

// 工具函数：格式化日期
function formatDate(date) {
    const options = { month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('zh-CN', options);
}

// 工具函数：获取当前时间
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// 添加时钟功能（可选）
function addClock() {
    const clockElement = document.createElement('div');
    clockElement.className = 'clock';
    clockElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 248, 220, 0.9);
        padding: 10px 15px;
        border-radius: 20px;
        color: #8B4513;
        font-weight: 500;
        box-shadow: 0 2px 10px rgba(139, 69, 19, 0.1);
        z-index: 100;
    `;
    
    document.body.appendChild(clockElement);
    
    // 更新时间
    function updateClock() {
        clockElement.textContent = getCurrentTime();
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// 如果需要时钟功能，取消注释下面的行
// addClock(); 