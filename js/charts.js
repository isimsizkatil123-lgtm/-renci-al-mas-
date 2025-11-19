function initializeCharts() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1.Hafta', '2.Hafta', '3.Hafta', '4.Hafta', '5.Hafta'],
            datasets: [{
                label: 'Performans Puanı',
                data: [45, 60, 55, 75, 80],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Haftalık Performans Gelişimi'
                }
            }
        }
    });
}