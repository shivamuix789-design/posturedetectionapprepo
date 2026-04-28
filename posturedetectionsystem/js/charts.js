/* ============================================
   SpineUp — Chart.js Configurations
   ============================================ */

let progressChart = null;
let insightChart = null;

function initProgressCharts() {
  const ctx = document.getElementById('progressBarChart');
  if (!ctx) return;

  if (progressChart) progressChart.destroy();

  const scores = MOCK_DATA.weeklyScores.map(d => d.score);
  const labels = MOCK_DATA.weeklyScores.map(d => d.day);
  const colors = scores.map(s => s >= 75 ? '#00c853' : s >= 50 ? '#ff9800' : '#ff5252');

  progressChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: scores,
        backgroundColor: colors.map(c => c + '99'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.55
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a2a1a',
          titleColor: '#fff',
          bodyColor: '#8a9a8a',
          borderColor: 'rgba(0,200,83,0.3)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          callbacks: {
            title: (items) => MOCK_DATA.weeklyScores[items[0].dataIndex].label,
            label: (item) => `Score: ${item.raw}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#5a6a5a', font: { size: 10 }, stepSize: 25 },
          border: { display: false }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#8a9a8a', font: { size: 11, weight: '500' } },
          border: { display: false }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });
}

function initInsightCharts() {
  const ctx = document.getElementById('insightLineChart');
  if (!ctx) return;

  if (insightChart) insightChart.destroy();

  const scores = MOCK_DATA.dailyScores.map(d => d.score);
  const labels = MOCK_DATA.dailyScores.map(d => d.time);

  insightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: scores,
        borderColor: '#00c853',
        borderWidth: 2.5,
        pointBackgroundColor: '#00c853',
        pointBorderColor: '#0a0f0a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'transparent';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0, 200, 83, 0.25)');
          gradient.addColorStop(1, 'rgba(0, 200, 83, 0.02)');
          return gradient;
        },
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a2a1a',
          titleColor: '#fff',
          bodyColor: '#00c853',
          borderColor: 'rgba(0,200,83,0.3)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10
        }
      },
      scales: {
        y: {
          min: 40,
          max: 100,
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#5a6a5a', font: { size: 10 }, stepSize: 20 },
          border: { display: false }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#8a9a8a', font: { size: 9 }, maxRotation: 0 },
          border: { display: false }
        }
      },
      animation: { duration: 1000, easing: 'easeOutQuart' }
    }
  });
}
