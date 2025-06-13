
import { mockData } from '../data/mockData.js';
import { extractBalance } from '../utils/calculations.js';

let charts = {};

// Render volume chart
export function renderVolumeChart() {
    const ctx = document.getElementById('volumeChart').getContext('2d');

    const typeData = mockData.reduce((acc, transaction) => {
        const type = transaction.transaction_type;
        acc[type] = (acc[type] || 0) + parseFloat(transaction.extracted_amount);
        return acc;
    }, {});

    const data = Object.entries(typeData).map(([type, amount]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        amount
    }));

    if (charts.volume) charts.volume.destroy();
    charts.volume = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.type),
            datasets: [{
                label: 'Amount (RWF)',
                data: data.map(item => item.amount),
                backgroundColor: ['#3B82F6', '#10B981'],
                borderColor: ['#2563EB', '#059669'],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
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

// Render distribution chart
export function renderDistributionChart() {
    const ctx = document.getElementById('distributionChart').getContext('2d');

    const typeCount = mockData.reduce((acc, transaction) => {
        const type = transaction.transaction_type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    if (charts.distribution) charts.distribution.destroy();
    charts.distribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(typeCount).map(type =>
                type.charAt(0).toUpperCase() + type.slice(1)
            ),
            datasets: [{
                data: Object.values(typeCount),
                backgroundColor: ['#8B5CF6', '#F59E0B'],
                borderColor: ['#7C3AED', '#D97706'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Render timeline chart with balance tracking
export function renderTimelineChart() {
    const ctx = document.getElementById('timelineChart').getContext('2d');

    const sortedData = [...mockData].sort((a, b) => a.date - b.date);
    let runningBalance = 0;

    const timelineData = sortedData.map(transaction => {
        const amount = parseFloat(transaction.extracted_amount);

        // Extract balance from message if available
        const extractedBalance = extractBalance(transaction.body);
        if (extractedBalance !== null) {
            runningBalance = extractedBalance;
        } else {
            // Calculate running balance
            if (transaction.transaction_type === 'received') {
                runningBalance += amount;
            } else {
                runningBalance -= amount;
            }
        }

        return {
            date: new Date(transaction.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            amount: amount,
            type: transaction.transaction_type,
            balance: runningBalance
        };
    });

    if (charts.timeline) charts.timeline.destroy();
    charts.timeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timelineData.map(item => item.date),
            datasets: [
                {
                    label: 'Transaction Amount',
                    data: timelineData.map(item => item.amount),
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4
                },
                {
                    label: 'Balance',
                    data: timelineData.map(item => item.balance),
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString() + ' RWF';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
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

export function renderCharts() {
    renderVolumeChart();
    renderDistributionChart();
    renderTimelineChart();
}