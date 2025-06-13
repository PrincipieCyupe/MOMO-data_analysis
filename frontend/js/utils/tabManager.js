
import { renderCharts } from '../components/charts.js';
import { renderContactAnalytics } from '../components/contactAnalytics.js';
import { renderTimePatterns } from '../components/timePatterns.js';
import { renderFinancialInsights } from '../components/financialInsights.js';

let currentTab = 'overview';

// Tab switching functionality
export function switchTab(tabName) {
    console.log('Switching to tab:', tabName); // Debug log

    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeTabButton = document.getElementById(`tab-${tabName}`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
    }

    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    const activeContent = document.getElementById(`${tabName}-content`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }

    currentTab = tabName;

    // Render specific content for the tab
    setTimeout(() => {
        if (tabName === 'overview') {
            renderCharts();
        } else if (tabName === 'contacts') {
            renderContactAnalytics();
        } else if (tabName === 'patterns') {
            renderTimePatterns();
        } else if (tabName === 'insights') {
            renderFinancialInsights();
        }
    }, 100);
}

// Make switchTab globally available
window.switchTab = switchTab;

export { currentTab };