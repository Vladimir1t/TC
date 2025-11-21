// survey.js - Enhanced Logic for New Glass Design

// Структура тем и подтем на основе предоставленного дерева
const SURVEY_TOPICS = {
    'IT и технологии': {
        icon: '💻',
        value: 'IT',
        subTopics: ['Программирование', 'Нейросети и ИИ', 'DevOps/SRE', 'Кибербезопасность']
    },
    'Медиа и развлечения': {
        icon: '🎬',
        value: 'Медиа и развлечения',
        subTopics: ['Фильмы и сериалы', 'Музыка', 'Игры', 'Аниме']
    },
    'Бизнес и финансы': {
        icon: '💼',
        value: 'Бизнес и финансы',
        subTopics: ['Бизнес', 'Криптовалюты', 'Маркетинг', 'Инвестиции']
    },
    'Образование': {
        icon: '📚',
        value: 'Образование',
        subTopics: ['Книги и литература', 'Наука', 'Познавательные']
    },
    'Лайфстайл': {
        icon: '✨',
        value: 'Лайфстайл',
        subTopics: ['Психология', 'Красота и мода', 'Здоровье', 'Отношения']
    },
    'Путешествия': {
        icon: '✈️',
        value: 'Путешествия',
        subTopics: []
    },
    'Спорт': {
        icon: '⚽',
        value: 'Спорт',
        subTopics: []
    },
    'Авто/мото': {
        icon: '🚗',
        value: 'Авто и мото',
        subTopics: []
    },
    'Наука/тех': {
        icon: '🔬',
        value: 'Наука и технологии',
        subTopics: []
    },
    'Хобби/дом': {
        icon: '🏡',
        value: 'Хобби и дом',
        subTopics: ['Искусство', 'Дизайн', 'Кулинария', 'Животные']
    },
    'Новости/политика': {
        icon: '📰',
        value: 'Новости',
        subTopics: ['Политика', 'Региональные']
    },
    'Региональное': {
        icon: '🌍',
        value: 'Региональные',
        subTopics: []
    }
};

class Survey {
    constructor() {
        this.selectedMainTopics = [];
        this.selectedSubTopics = [];
        this.maxMainTopics = 7;
        this.currentScreen = 1;
        this.totalScreens = 2;
        
        // DOM элементы
        this.overlay = document.getElementById('surveyOverlay');
        this.screen1 = document.getElementById('surveyScreen1');
        this.screen2 = document.getElementById('surveyScreen2');
        this.mainTopicsChips = document.getElementById('mainTopicsChips');
        this.surveySubTopics = document.getElementById('surveySubTopics');
        this.selectedCount = document.getElementById('selectedCount');
        this.nextBtn = document.getElementById('surveyNextBtn');
        this.skipBtn = document.getElementById('surveySkipBtn');
        this.backBtn = document.getElementById('surveyBackBtn');
        this.completeBtn = document.getElementById('surveyCompleteBtn');
        
        this.init();
    }
    
    init() {
        this.renderMainTopics();
        this.attachEventListeners();
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        const progress = (this.currentScreen - 1) / (this.totalScreens - 1) * 100;
        const progressBar = document.querySelector('.survey-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
    
    renderMainTopics() {
        this.mainTopicsChips.innerHTML = '';
        
        Object.entries(SURVEY_TOPICS).forEach(([name, data], index) => {
            const chip = document.createElement('div');
            chip.className = 'survey-chip';
            chip.dataset.topic = data.value;
            chip.style.animationDelay = `${index * 0.05}s`;
            chip.innerHTML = `
                <span class="survey-chip-icon">${data.icon}</span>
                <span>${name}</span>
            `;
            
            chip.addEventListener('click', () => this.toggleMainTopic(chip, data.value));
            chip.addEventListener('mouseenter', () => this.animateChipHover(chip));
            this.mainTopicsChips.appendChild(chip);
        });
    }
    
    animateChipHover(chip) {
        if (!chip.classList.contains('selected')) {
            chip.style.transform = 'translateY(-2px) scale(1.02)';
            setTimeout(() => {
                if (!chip.classList.contains('selected')) {
                    chip.style.transform = '';
                }
            }, 150);
        }
    }
    
    toggleMainTopic(chip, topic) {
        if (chip.classList.contains('selected')) {
            // Убираем выбор с анимацией
            this.animateChipDeselection(chip);
            const index = this.selectedMainTopics.indexOf(topic);
            if (index > -1) {
                this.selectedMainTopics.splice(index, 1);
            }
        } else {
            // Добавляем выбор если не достигнут лимит
            if (this.selectedMainTopics.length < this.maxMainTopics) {
                this.animateChipSelection(chip);
                this.selectedMainTopics.push(topic);
            } else {
                // Показываем уведомление о лимите
                this.showLimitNotification();
                return;
            }
        }
        
        this.updateCounter();
        this.updateNextButton();
    }
    
    animateChipSelection(chip) {
        chip.classList.add('selected');
        
        // Ripple эффект
        this.createRippleEffect(chip);
        
        // Микро-анимация иконки
        const icon = chip.querySelector('.survey-chip-icon');
        if (icon) {
            icon.style.animation = 'iconBounce 0.6s ease';
        }
    }
    
    animateChipDeselection(chip) {
        chip.classList.remove('selected');
        
        // Анимация уменьшения
        chip.style.animation = 'none';
        setTimeout(() => {
            chip.style.animation = 'chipShrink 0.3s ease';
        }, 10);
        
        setTimeout(() => {
            chip.style.animation = '';
        }, 300);
    }
    
    createRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(96, 165, 250, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2;
        const y = rect.height / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        
        element.appendChild(ripple);
        
        // Удаляем ripple после анимации
        setTimeout(() => {
            if (ripple.parentNode === element) {
                element.removeChild(ripple);
            }
        }, 600);
    }
    
    updateCounter() {
        this.selectedCount.textContent = this.selectedMainTopics.length;
        
        // Анимация обновления счетчика
        this.selectedCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.selectedCount.style.transform = 'scale(1)';
        }, 150);
    }
    
    updateNextButton() {
        // Кнопка всегда активна в новом дизайне
        this.nextBtn.disabled = false;
    }
    
    showLimitNotification() {
        // Улучшенное уведомление с анимацией
        this.selectedCount.style.animation = 'shake 0.5s ease, colorPulse 1s ease';
        
        // Создаем плавающее уведомление
        const notification = document.createElement('div');
        notification.className = 'survey-notification';
        notification.textContent = `Максимум ${this.maxMainTopics} тем`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: var(--space-12) var(--space-16);
            border-radius: 12px;
            z-index: 10002;
            animation: floatUp 0.5s ease forwards;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-weight: var(--font-weight-medium);
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие уведомления
        setTimeout(() => {
            notification.style.animation = 'floatDown 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
        
        // Сброс анимации счетчика
        setTimeout(() => {
            this.selectedCount.style.animation = '';
        }, 500);
    }
    
    goToScreen2() {
        // Проверяем нужно ли показывать экран 2
        const topicsWithSubTopics = this.selectedMainTopics.filter(topic => {
            const topicData = Object.values(SURVEY_TOPICS).find(t => t.value === topic);
            return topicData && topicData.subTopics && topicData.subTopics.length > 0;
        });
        
        // Показываем экран 2 только если есть темы с подтемами
        // И ограничиваем максимум 3 темами для уточнения (самые широкие)
        if (topicsWithSubTopics.length > 0) {
            // Берем только первые 3 темы с подтемами для уточнения
            const topicsToRefine = topicsWithSubTopics.slice(0, 3);
            
            // Анимируем переход между экранами
            this.animateScreenTransition(() => {
                this.renderSubTopics(topicsToRefine);
                this.screen1.classList.remove('active');
                this.screen2.classList.add('active');
                this.screen2.style.display = 'block';
                this.currentScreen = 2;
                this.updateProgressBar();
            });
        } else {
            // Пропускаем экран 2 и завершаем
            this.completeSurvey();
        }
    }
    
    animateScreenTransition(callback) {
        const currentScreen = this.currentScreen === 1 ? this.screen1 : this.screen2;
        currentScreen.style.animation = 'slideOutLeft 0.4s ease forwards';
        
        setTimeout(() => {
            callback();
            const nextScreen = this.currentScreen === 1 ? this.screen1 : this.screen2;
            nextScreen.style.animation = 'slideInRight 0.4s ease forwards';
        }, 400);
    }
    
    renderSubTopics(topicsToShow = null) {
        this.surveySubTopics.innerHTML = '';
        
        // Используем переданный список тем или все выбранные
        const topicsToRender = topicsToShow || this.selectedMainTopics;
        
        // Отображаем только те темы, которые были выбраны и имеют подтемы
        topicsToRender.forEach((topic, sectionIndex) => {
            const topicEntry = Object.entries(SURVEY_TOPICS).find(([name, data]) => data.value === topic);
            
            if (topicEntry) {
                const [name, data] = topicEntry;
                
                if (data.subTopics && data.subTopics.length > 0) {
                    const section = document.createElement('div');
                    section.className = 'survey-section';
                    section.style.animationDelay = `${sectionIndex * 0.1}s`;
                    
                    const sectionHeader = document.createElement('h3');
                    sectionHeader.innerHTML = `<span class="survey-chip-icon">${data.icon}</span> ${name}`;
                    section.appendChild(sectionHeader);
                    
                    const chipsContainer = document.createElement('div');
                    chipsContainer.className = 'survey-section-chips';
                    
                    data.subTopics.forEach((subTopic, chipIndex) => {
                        const chip = document.createElement('div');
                        chip.className = 'survey-chip';
                        chip.dataset.subtopic = subTopic;
                        chip.textContent = subTopic;
                        chip.style.animationDelay = `${chipIndex * 0.05}s`;
                        
                        chip.addEventListener('click', () => this.toggleSubTopic(chip, subTopic));
                        chip.addEventListener('mouseenter', () => this.animateChipHover(chip));
                        chipsContainer.appendChild(chip);
                    });
                    
                    section.appendChild(chipsContainer);
                    this.surveySubTopics.appendChild(section);
                }
            }
        });
    }
    
    toggleSubTopic(chip, subTopic) {
        if (chip.classList.contains('selected')) {
            this.animateChipDeselection(chip);
            const index = this.selectedSubTopics.indexOf(subTopic);
            if (index > -1) {
                this.selectedSubTopics.splice(index, 1);
            }
        } else {
            this.animateChipSelection(chip);
            this.selectedSubTopics.push(subTopic);
        }
    }
    
    goBack() {
        this.animateScreenTransition(() => {
            this.screen2.classList.remove('active');
            this.screen2.style.display = 'none';
            this.screen1.classList.add('active');
            this.currentScreen = 1;
            this.updateProgressBar();
        });
    }
    
    async completeSurvey() {
        // Показываем состояние загрузки
        this.showLoadingState();
        
        // Получаем ID пользователя из Telegram WebApp
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? window.DEBUG_USER_ID;
        
        if (!userId) {
            this.hideWithAnimation();
            return;
        }
        
        try {
            // Отправляем данные на сервер
            const response = await fetch(`${window.API_URL}/users/${userId}/survey`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    main_topics: this.selectedMainTopics,
                    sub_topics: this.selectedSubTopics
                })
            });
            
            if (response.ok) {
                this.showSuccessAnimation();
            } else {
                this.hideWithAnimation();
            }
        } catch (error) {
            console.error('Survey submission error:', error);
            this.hideWithAnimation();
        }
    }
    
    showLoadingState() {
        // Показываем индикатор загрузки на кнопке
        const originalText = this.completeBtn.innerHTML;
        this.completeBtn.innerHTML = `
            <span class="survey-loading"></span>
            <span>Сохраняем...</span>
        `;
        this.completeBtn.disabled = true;
        
        // Сохраняем оригинальный текст для восстановления
        this.completeBtn.dataset.originalText = originalText;
    }
    
    showSuccessAnimation() {
        // Анимация успешного завершения
        this.completeBtn.innerHTML = '✓ Готово!';
        this.completeBtn.style.background = 'rgba(34, 197, 94, 0.2)';
        this.completeBtn.style.borderColor = 'rgba(34, 197, 94, 0.4)';
        this.completeBtn.style.color = '#86efac';
        
        setTimeout(() => {
            this.hideWithAnimation();
        }, 1000);
    }
    
    restoreCompleteButton() {
        // Восстанавливаем оригинальное состояние кнопки
        if (this.completeBtn.dataset.originalText) {
            this.completeBtn.innerHTML = this.completeBtn.dataset.originalText;
            delete this.completeBtn.dataset.originalText;
        }
        this.completeBtn.disabled = false;
        this.completeBtn.style.background = '';
        this.completeBtn.style.borderColor = '';
        this.completeBtn.style.color = '';
    }
    
    hideWithAnimation() {
        this.overlay.style.animation = 'glassFadeOut 0.4s ease forwards';
        
        setTimeout(() => {
            this.hide();
            this.restoreCompleteButton();
            
            // Загружаем рекомендации если доступно
            if (typeof window.loadRecommendationsBasedOnPreferences === 'function') {
                window.loadRecommendationsBasedOnPreferences();
            }
        }, 400);
    }
    
    skip() {
        // Пропускаем опрос, сохраняем пустые предпочтения
        this.selectedMainTopics = [];
        this.selectedSubTopics = [];
        this.completeSurvey();
    }
    
    show() {
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Сброс состояний при показе
        this.currentScreen = 1;
        this.updateProgressBar();
    }
    
    hide() {
        this.overlay.style.display = 'none';
        document.body.style.overflow = '';
        this.overlay.style.animation = '';
    }
    
    attachEventListeners() {
        this.nextBtn.addEventListener('click', () => this.goToScreen2());
        this.skipBtn.addEventListener('click', () => this.skip());
        this.backBtn.addEventListener('click', () => this.goBack());
        this.completeBtn.addEventListener('click', () => this.completeSurvey());
        
        // Добавляем обработчики для анимаций кнопок
        [this.nextBtn, this.skipBtn, this.backBtn, this.completeBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => this.animateButtonHover(btn));
            btn.addEventListener('mouseleave', () => this.animateButtonLeave(btn));
        });
    }
    
    animateButtonHover(button) {
        if (!button.disabled) {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        }
    }
    
    animateButtonLeave(button) {
        if (!button.disabled) {
            button.style.transform = '';
        }
    }
}

// Добавляем дополнительные CSS анимации
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes chipShrink {
        from { transform: translateY(-4px) scale(1.02); }
        to { transform: translateY(0) scale(1); }
    }
    
    @keyframes colorPulse {
        0%, 100% { color: #60a5fa; }
        50% { color: #ef4444; }
    }
    
    @keyframes floatUp {
        from {
            opacity: 0;
            transform: translate(-50%, -40%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    @keyframes floatDown {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -60%);
        }
    }
    
    @keyframes slideOutLeft {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes glassFadeOut {
        from {
            opacity: 1;
            backdrop-filter: blur(24px) saturate(200%);
        }
        to {
            opacity: 0;
            backdrop-filter: blur(0px) saturate(100%);
        }
    }
    
    @keyframes iconBounce {
        0%, 20%, 53%, 80%, 100% {
            transform: scale(1.3);
        }
        40%, 43% {
            transform: scale(1.4);
        }
        70% {
            transform: scale(1.35);
        }
    }
    
    .survey-loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: surveySpin 1s linear infinite;
    }
    
    @keyframes surveySpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(additionalStyles);

// Экспортируем класс Survey для использования в main.js
window.Survey = Survey;