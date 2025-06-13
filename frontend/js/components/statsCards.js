
import { calculateStats } from '../utils/calculations.js';

// Render enhanced stats cards
export function renderStatsCards() {
    const stats = calculateStats();
    const statsContainer = document.getElementById('statsCards');

    const cards = [
        {
            title: 'Total Volume',
            value: `${stats.total.toLocaleString()} RWF`,
            subtitle: 'All transactions',
            icon: 'fas fa-dollar-sign',
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Money Received',
            value: `${stats.received.toLocaleString()} RWF`,
            subtitle: 'Incoming funds',
            icon: 'fas fa-arrow-down',
            gradient: 'from-green-500 to-green-600'
        },
        {
            title: 'Payments Made',
            value: `${stats.payments.toLocaleString()} RWF`,
            subtitle: 'Outgoing funds',
            icon: 'fas fa-arrow-up',
            gradient: 'from-orange-500 to-orange-600'
        },
        {
            title: 'Net Flow',
            value: `${stats.netFlow.toLocaleString()} RWF`,
            subtitle: stats.netFlow >= 0 ? 'Net positive' : 'Net negative',
            icon: stats.netFlow >= 0 ? 'fas fa-trending-up' : 'fas fa-trending-down',
            gradient: stats.netFlow >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
        },
        {
            title: 'Avg Transaction',
            value: `${Math.round(stats.avgTransaction).toLocaleString()} RWF`,
            subtitle: 'Per transaction',
            icon: 'fas fa-calculator',
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Unique Contacts',
            value: stats.uniqueContacts,
            subtitle: 'Different people',
            icon: 'fas fa-users',
            gradient: 'from-indigo-500 to-indigo-600'
        }
    ];

    statsContainer.innerHTML = cards.map(card => `
        <div class="bg-gradient-to-r ${card.gradient} text-white rounded-lg p-4 card-hover animate-fade-in">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs opacity-80">${card.title}</p>
                    <p class="text-lg font-bold">${card.value}</p>
                    <p class="text-xs opacity-70">${card.subtitle}</p>
                </div>
                <i class="${card.icon} text-2xl opacity-80"></i>
            </div>
        </div>
    `).join('');
}