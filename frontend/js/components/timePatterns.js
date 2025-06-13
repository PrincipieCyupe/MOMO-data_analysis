
import { mockData } from '../data/mockData.js';

let charts = {};

// Time Patterns
export function renderTimePatterns() {
    renderHourlyChart();
    renderDailyChart();
    renderFrequencyAnalysis();
}

function renderHourlyChart() {
    const ctx = document.getElementById('hourlyChart').getContext('2d');

    const hourlyData = Array(24).fill(0);
    mockData.forEach(transaction => {
        const hour = new Date(transaction.date).getHours();
        hourlyData[hour] += parseFloat(transaction.extracted_amount);
    });

    if (charts.hourly) charts.hourly.destroy();
    charts.hourly = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Transaction Volume',
                data: hourlyData,
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString() + ' RWF';
                        }
                    }
                }
            }
        }
    });
}

function renderDailyChart() {
    const ctx = document.getElementById('dailyChart').getContext('2d');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyData = Array(7).fill(0);
    const dailyCount = Array(7).fill(0);

    mockData.forEach(transaction => {
        const day = new Date(transaction.date).getDay();
        dailyData[day] += parseFloat(transaction.extracted_amount);
        dailyCount[day] += 1;
    });

    if (charts.daily) charts.daily.destroy();
    charts.daily = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Transaction Volume',
                data: dailyData,
                backgroundColor: days.map((_, i) => `hsl(${i * 50}, 70%, 60%)`),
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString() + ' RWF';
                        }
                    }
                }
            }
        }
    });
}

function renderFrequencyAnalysis() {
    const container = document.getElementById('frequencyAnalysis');

    // Calculate time between transactions
    const sortedTransactions = [...mockData].sort((a, b) => a.date - b.date);
    const intervals = [];

    for (let i = 1; i < sortedTransactions.length; i++) {
        const timeDiff = sortedTransactions[i].date - sortedTransactions[i - 1].date;
        intervals.push(timeDiff / (1000 * 60 * 60)); // Convert to hours
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const minInterval = Math.min(...intervals);
    const maxInterval = Math.max(...intervals);

    container.innerHTML = `
        <div class="bg-white p-4 rounded-lg border text-center">
            <div class="text-2xl font-bold text-blue-600">${avgInterval.toFixed(1)}</div>
            <div class="text-sm text-gray-600">Avg Hours Between</div>
        </div>
        <div class="bg-white p-4 rounded-lg border text-center">
            <div class="text-2xl font-bold text-green-600">${minInterval.toFixed(1)}</div>
            <div class="text-sm text-gray-600">Min Hours Between</div>
        </div>
        <div class="bg-white p-4 rounded-lg border text-center">
            <div class="text-2xl font-bold text-orange-600">${maxInterval.toFixed(1)}</div>
            <div class="text-sm text-gray-600">Max Hours Between</div>
        </div>
    `;
}