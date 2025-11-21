// survey.js - Enhanced version with beautiful animations

class Survey {
    constructor() {
        this.selectedMainTopics = [];
        this.selectedSubTopics = [];
        this.maxMainTopics = 7;
        this.currentScreen = 1;
        this.totalScreens = 2;
        
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
            this.mainTopicsChips.appendChild(chip);
        });
    }
    
    toggleMainTopic(chip, topic) {
        if (chip.classList.contains('selected')) {
            // Remove selection with animation
            this.animateChipDeselection(chip);
            const index = this.selectedMainTopics.indexOf(topic);
            if (index > -1) {
                this.selectedMainTopics.splice(index, 1);
            }
        } else {
            // Add selection if not reached limit
            if (this.selectedMainTopics.length < this.maxMainTopics) {
                this.animateChipSelection(chip);
                this.selectedMainTopics.push(topic);
            } else {
                this.showLimitNotification();
            }
        }
        
        this.updateCounter();
        this.updateNextButton();
    }
    
    animateChipSelection(chip) {
        chip.classList.add('selected');
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(var(--color-primary-rgb), 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = chip.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2;
        const y = rect.height / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        
        chip.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode === chip) {
                chip.removeChild(ripple);
            }
        }, 600);
    }
    
    animateChipDeselection(chip) {
        chip.classList.remove('selected');
        
        // Shrink animation
        chip.style.animation = 'none';
        setTimeout(() => {
            chip.style.animation = 'chipShrink 0.3s ease';
        }, 10);
        
        setTimeout(() => {
            chip.style.animation = '';
        }, 300);
    }
    
    updateCounter() {
        this.selectedCount.textContent = this.selectedMainTopics.length;
        
        // Animate counter update
        this.selectedCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.selectedCount.style.transform = 'scale(1)';
        }, 150);
    }
    
    updateNextButton() {
        this.nextBtn.disabled = false;
    }
    
    showLimitNotification() {
        // Enhanced notification with shake and color change
        this.selectedCount.style.animation = 'shake 0.5s ease, colorPulse 1s ease';
        
        // Create floating notification
        const notification = document.createElement('div');
        notification.textContent = `Максимум ${this.maxMainTopics} тем`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--color-error);
            color: white;
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-lg);
            z-index: 10002;
            animation: floatUp 0.5s ease forwards;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'floatDown 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
        
        setTimeout(() => {
            this.selectedCount.style.animation = '';
        }, 500);
    }
    
    goToScreen2() {
        const topicsWithSubTopics = this.selectedMainTopics.filter(topic => {
            const topicData = Object.values(SURVEY_TOPICS).find(t => t.value === topic);
            return topicData && topicData.subTopics && topicData.subTopics.length > 0;
        });
        
        if (topicsWithSubTopics.length > 0) {
            const topicsToRefine = topicsWithSubTopics.slice(0, 3);
            
            // Animate screen transition
            this.animateScreenTransition(() => {
                this.renderSubTopics(topicsToRefine);
                this.screen1.classList.remove('active');
                this.screen2.classList.add('active');
                this.screen2.style.display = 'block';
                this.currentScreen = 2;
                this.updateProgressBar();
            });
        } else {
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
        
        const topicsToRender = topicsToShow || this.selectedMainTopics;
        
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
        // Show loading state
        this.completeBtn.innerHTML = '<span class="survey-loading"></span> Сохраняем...';
        this.completeBtn.disabled = true;
        
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? window.DEBUG_USER_ID;
        
        if (!userId) {
            this.hideWithAnimation();
            return;
        }
        
        try {
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
            this.hideWithAnimation();
        }
    }
    
    showSuccessAnimation() {
        // Add success checkmark animation
        this.completeBtn.innerHTML = '✓ Готово!';
        this.completeBtn.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            this.hideWithAnimation();
        }, 1000);
    }
    
    hideWithAnimation() {
        this.overlay.style.animation = 'glassFadeOut 0.4s ease forwards';
        
        setTimeout(() => {
            this.hide();
            
            // Load recommendations if available
            if (typeof window.loadRecommendationsBasedOnPreferences === 'function') {
                window.loadRecommendationsBasedOnPreferences();
            }
        }, 400);
    }
    
    skip() {
        this.selectedMainTopics = [];
        this.selectedSubTopics = [];
        this.completeSurvey();
    }
    
    show() {
        this.overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    hide() {
        this.overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    attachEventListeners() {
        this.nextBtn.addEventListener('click', () => this.goToScreen2());
        this.skipBtn.addEventListener('click', () => this.skip());
        this.backBtn.addEventListener('click', () => this.goBack());
        this.completeBtn.addEventListener('click', () => this.completeSurvey());
    }
}

// Add additional CSS animations
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
        0%, 100% { color: var(--color-primary); }
        50% { color: var(--color-error); }
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
            backdrop-filter: blur(20px) saturate(180%);
        }
        to {
            opacity: 0;
            backdrop-filter: blur(0px) saturate(100%);
        }
    }
`;
document.head.appendChild(additionalStyles);

window.Survey = Survey;