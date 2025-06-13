
// Import all modules
import { renderStatsCards } from './components/statsCards.js';
import { renderCharts } from './components/charts.js';
import { renderTransactionList, filterTransactions } from './components/transactionList.js';
import { renderContactAnalytics } from './components/contactAnalytics.js';
import { renderTimePatterns } from './components/timePatterns.js';
import { renderFinancialInsights } from './components/financialInsights.js';
import { switchTab } from './utils/tabManager.js';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    renderStatsCards();
    renderCharts();
    renderTransactionList();
    setupEventListeners();
    renderContactAnalytics();
    renderTimePatterns();
    renderFinancialInsights();
});

// Setup event listeners
function setupEventListeners() {
    // Search and filter
    document.getElementById('searchInput').addEventListener('input', filterTransactions);
    document.getElementById('filterType').addEventListener('change', filterTransactions);

    // Tab buttons - Add explicit event listeners
    document.getElementById('tab-overview').addEventListener('click', () => switchTab('overview'));
    document.getElementById('tab-contacts').addEventListener('click', () => switchTab('contacts'));
    document.getElementById('tab-patterns').addEventListener('click', () => switchTab('patterns'));
    document.getElementById('tab-insights').addEventListener('click', () => switchTab('insights'));

    // Modal close
    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('transactionModal').classList.remove('show');
    });

    // Close modal when clicking outside
    document.getElementById('transactionModal').addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
}