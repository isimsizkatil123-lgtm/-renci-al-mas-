class AICoach {
    constructor() {
        this.userData = this.loadUserData();
    }

    loadUserData() {
        const saved = localStorage.getItem('akilmentorData');
        return saved ? JSON.parse(saved) : {
            examType: 'yks',
            studyHours: 3,
            performance: {},
            studyHistory: []
        };
    }

    saveUserData() {
        localStorage.setItem('akilmentorData', JSON.stringify(this.userData));
    }

    async generateStudyPlan() {
        // AI planı oluşturma simülasyonu
        const plan = {
            daily: [
                { subject: 'Matematik', topic: 'Problemler', duration: 45, priority: 'high' },
                { subject: 'Türkçe', topic: 'Paragraf Soruları', duration: 30, priority: 'medium' },
                { subject: 'Geometri', topic: 'Üçgenler', duration: 35, priority: 'medium' },
                { subject: 'Fizik', topic: 'Hareket', duration: 40, priority: 'low' }
            ],
            weeklyGoal: 'Bu hafta temel konuların %70 tamamlanacak',
            focusArea: 'Matematik problem çözme hızını artır'
        };

        return plan;
    }

    analyzePerformance() {
        const analysis = {
            strongTopics: ['Paragraf', 'Temel Matematik'],
            weakTopics: ['Geometri', 'Fizik Problemleri'],
            recommendation: 'Geometri çalışma süresini %20 artır',
            weeklyProgress: 65
        };

        return analysis;
    }
}

window.aiCoach = new AICoach();