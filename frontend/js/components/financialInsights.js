
import { mockData } from '../data/mockData.js';
import { calculateStats } from '../utils/calculations.js';

let charts = {};

// Financial Insights
export function renderFinancialInsights() {
    renderSizeChart();
    renderCashFlowChart();
    renderFinancialSummary();
}

function renderSizeChart() {
    const ctx = document.getElementById('sizeChart').getContext('2d');

    // Categorize transactions by size
    const sizeCategories = {
        'Small (0-500)': 0,
        'Medium (500-1500)': 0,
        'Large (1500+)': 0
    };

    mockData.forEach(transaction => {
        const amount = parseFloat(transaction.extracted_amount);
        if (amount <= 500) {
            sizeCategories['Small (0-500)']++;
        } else if (amount <= 1500) {
            sizeCategories['Medium (500-1500)']++;
        } else {
            sizeCategories['Large (1500+)']++;
        }
    });

    if (charts.size) charts.size.destroy();
    charts.size = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(sizeCategories),
            datasets: [{
                data: Object.values(sizeCategories),
                backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
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

function renderCashFlowChart() {
    const ctx = document.getElementById('cashFlowChart').getContext('2d');

    // Calculate running balance
    const sortedTransactions = [...mockData].sort((a, b) => a.date - b.date);
    const balanceData = [];
    let runningBalance = 0;

    sortedTransactions.forEach(transaction => {
        const amount = parseFloat(transaction.extracted_amount);
        if (transaction.transaction_type === 'received') {
            runningBalance += amount;
        } else {
            runningBalance -= amount;
        }
        balanceData.push({
            date: new Date(transaction.date).toLocaleDateString(),
            balance: runningBalance
        });
    });

    if (charts.cashFlow) charts.cashFlow.destroy();
    charts.cashFlow = new Chart(ctx, {
        type: 'line',
        data: {
            labels: balanceData.map(item => item.date),
            datasets: [{
                label: 'Running Balance',
                data: balanceData.map(item => item.balance),
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
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

function renderFinancialSummary() {
    const container = document.getElementById('financialSummary');

    const stats = calculateStats();
    const amounts = mockData.map(t => parseFloat(t.extracted_amount));
    const avgAmount = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const maxAmount = Math.max(...amounts);
    const minAmount = Math.min(...amounts);

    // Calculate velocity (transactions per day)
    const dateRange = Math.max(...mockData.map(t => t.date)) - Math.min(...mockData.map(t => t.date));
    const daysSpan = dateRange / (1000 * 60 * 60 * 24);
    const velocity = mockData.length / daysSpan;

    container.innerHTML = `
        <div class="bg-white p-4 rounded-lg border text-center">
            <div class="text-xl font-bold text-green-600">${avgAmount.toFixed(0)} RWF</div>
            <div class="text-sm text-gray-600">Average Amount</div>
        </div>
        <div class="bg-white p-4 rounded-lg border text-center">
            <div class="text-xl font-bold text-blue-600">${maxAmount.toLocaleString()} RWF</div>
            <div class="text-sm text-gray-600">Largest Transaction</div>
        </div>
        <div class="bg-white p-4 rounded-lg border text-center">
            <div class="text-xl font-bold text-orange-600">${minAmount.toLocaleString()} RWF</div>
            <div class="text-sm text-gray-600">Smallest Transaction</div>
        </div>
        <div class="bg-white p-4 rounded-lg border text-center">
            <div class="text-xl font-bold text-purple-600">${velocity.toFixed(1)}</div>
            <div class="text-sm text-gray-600">Transactions/Day</div>
        </div>
    `;
}