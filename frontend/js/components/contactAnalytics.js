
import { mockData } from '../data/mockData.js';

let charts = {};

export function renderContactAnalytics() {
    renderTopContacts();
    renderContactChart();
    renderTransactionHeatmap();
}

function renderTopContacts() {
    const contactData = mockData.reduce((acc, transaction) => {
        const contact = transaction.sender_or_receiver;
        if (!acc[contact]) {
            acc[contact] = { total: 0, received: 0, sent: 0, count: 0 };
        }
        const amount = parseFloat(transaction.extracted_amount);
        acc[contact].total += amount;
        acc[contact].count += 1;
        if (transaction.transaction_type === 'received') {
            acc[contact].received += amount;
        } else {
            acc[contact].sent += amount;
        }
        return acc;
    }, {});

    const sortedContacts = Object.entries(contactData)
        .sort(([, a], [, b]) => b.total - a.total);

    const container = document.getElementById('topContactsList');
    container.innerHTML = sortedContacts.map(([contact, data]) => `
        <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    ${contact.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p class="font-medium">${contact}</p>
                    <p class="text-sm text-gray-600">${data.count} transactions</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold">${data.total.toLocaleString()} RWF</p>
                <p class="text-xs text-green-600">+${data.received.toLocaleString()}</p>
                <p class="text-xs text-orange-600">-${data.sent.toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

function renderContactChart() {
    const ctx = document.getElementById('contactChart').getContext('2d');

    const contactData = mockData.reduce((acc, transaction) => {
        const contact = transaction.sender_or_receiver;
        if (!acc[contact]) {
            acc[contact] = { received: 0, sent: 0 };
        }
        const amount = parseFloat(transaction.extracted_amount);
        if (transaction.transaction_type === 'received') {
            acc[contact].received += amount;
        } else {
            acc[contact].sent += amount;
        }
        return acc;
    }, {});

    const contacts = Object.keys(contactData);
    const receivedData = contacts.map(contact => contactData[contact].received);
    const sentData = contacts.map(contact => contactData[contact].sent);

    if (charts.contact) charts.contact.destroy();
    charts.contact = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: contacts,
            datasets: [
                {
                    label: 'Received',
                    data: receivedData,
                    backgroundColor: '#10B981',
                    borderRadius: 4
                },
                {
                    label: 'Sent',
                    data: sentData,
                    backgroundColor: '#F59E0B',
                    borderRadius: 4
                }
            ]
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

function renderTransactionHeatmap() {
    const container = document.getElementById('transactionHeatmap');

    // Create a simple heatmap showing transaction activity over time
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const heatmapData = {};

    mockData.forEach(transaction => {
        const date = new Date(transaction.date);
        const day = date.getDay();
        const hour = date.getHours();
        const key = `${day}-${hour}`;
        heatmapData[key] = (heatmapData[key] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(heatmapData));

    let heatmapHTML = '<div class="text-sm font-medium mb-2">Activity by Day and Hour</div>';
    heatmapHTML += '<div class="flex"><div class="w-12"></div>';
    hours.forEach(hour => {
        heatmapHTML += `<div class="heatmap-cell text-xs text-center">${hour}</div>`;
    });
    heatmapHTML += '</div>';

    days.forEach((day, dayIndex) => {
        heatmapHTML += '<div class="flex items-center">';
        heatmapHTML += `<div class="w-12 text-xs text-right pr-2">${day}</div>`;
        hours.forEach(hour => {
            const count = heatmapData[`${dayIndex}-${hour}`] || 0;
            const intensity = count / maxCount;
            const opacity = Math.max(0.1, intensity);
            const color = count > 0 ? `rgba(59, 130, 246, ${opacity})` : 'rgba(229, 231, 235, 0.5)';
            heatmapHTML += `<div class="heatmap-cell" style="background-color: ${color}" title="${day} ${hour}:00 - ${count} transactions"></div>`;
        });
        heatmapHTML += '</div>';
    });

    container.innerHTML = heatmapHTML;
}