function saveProfile() {
    const examType = document.getElementById('examType').value;
    const studyHours = document.getElementById('studyHours').value;

    window.aiCoach.userData.examType = examType;
    window.aiCoach.userData.studyHours = parseInt(studyHours);
    window.aiCoach.saveUserData();

    alert('Profil kaydedildi! 🎉');
}

async function generatePlan() {
    const plan = await window.aiCoach.generateStudyPlan();
    displayPlan(plan);
}

function displayPlan(plan) {
    const planContainer = document.getElementById('dailyPlan');
    
    let planHTML = `
        <h3>📅 Günlük Çalışma Planın</h3>
        <div class="plan-details">
    `;

    plan.daily.forEach(item => {
        planHTML += `
            <div class="plan-item">
                <strong>${item.subject}</strong>: ${item.topic} 
                <span class="duration">(${item.duration} dakika)</span>
                <span class="priority ${item.priority}">${item.priority}</span>
            </div>
        `;
    });

    planHTML += `
        </div>
        <div class="weekly-goal">
            <strong>🎯 Haftalık Hedef:</strong> ${plan.weeklyGoal}
        </div>
        <div class="focus-area">
            <strong>💡 Odak Noktası:</strong> ${plan.focusArea}
        </div>
    `;

    planContainer.innerHTML = planHTML;
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Profil bilgilerini yükle
    document.getElementById('examType').value = window.aiCoach.userData.examType;
    document.getElementById('studyHours').value = window.aiCoach.userData.studyHours;
    
    // Performans grafiğini oluştur
    initializeCharts();
});