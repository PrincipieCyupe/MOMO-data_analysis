
import { mockData } from '../data/mockData.js';
import { extractBalance } from '../utils/calculations.js';

let filteredData = [...mockData];

// Render transaction list
export function renderTransactionList() {
    const container = document.getElementById('transactionList');
    const countElement = document.getElementById('transactionCount');

    countElement.textContent = `Showing ${filteredData.length} of ${mockData.length} transactions`;

    container.innerHTML = filteredData.map(transaction => `
        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer card-hover" 
             onclick="showTransactionDetails(${transaction.id})">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="p-2 rounded-full ${transaction.transaction_type === 'received'
            ? 'bg-green-100 text-green-600'
            : 'bg-orange-100 text-orange-600'
        }">
                        <i class="fas ${transaction.transaction_type === 'received'
            ? 'fa-arrow-down'
            : 'fa-arrow-up'
        }"></i>
                    </div>
                    <div>
                        <p class="font-semibold">${transaction.sender_or_receiver}</p>
                        <p class="text-sm text-gray-600">${transaction.readable_date}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold ${transaction.transaction_type === 'received'
            ? 'text-green-600'
            : 'text-orange-600'
        }">
                        ${transaction.transaction_type === 'received' ? '+' : '-'}
                        ${parseFloat(transaction.extracted_amount).toLocaleString()} RWF
                    </p>
                    <span class="inline-block px-2 py-1 text-xs rounded-full ${transaction.transaction_type === 'received'
            ? 'bg-green-100 text-green-800'
            : 'bg-orange-100 text-orange-800'
        }">
                        ${transaction.transaction_type}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter transactions
export function filterTransactions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;

    filteredData = mockData.filter(transaction => {
        const matchesSearch = transaction.sender_or_receiver.toLowerCase().includes(searchTerm) ||
            transaction.body.toLowerCase().includes(searchTerm);
        const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
        return matchesSearch && matchesType;
    });

    renderTransactionList();
}

// Show transaction details modal
export function showTransactionDetails(transactionId) {
    const transaction = mockData.find(t => t.id === transactionId);
    if (!transaction) return;

    const modal = document.getElementById('transactionModal');
    const content = document.getElementById('modalContent');

    const extractedBalance = extractBalance(transaction.body);

    content.innerHTML = `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
                <p class="text-sm font-medium text-gray-600">Transaction ID</p>
                <p class="font-mono">${transaction.id}</p>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-600">Amount</p>
                <p class="text-lg font-bold">${parseFloat(transaction.extracted_amount).toLocaleString()} RWF</p>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-600">Contact</p>
                <p>${transaction.sender_or_receiver}</p>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-600">Type</p>
                <span class="inline-block px-2 py-1 text-xs rounded-full ${transaction.transaction_type === 'received'
            ? 'bg-green-100 text-green-800'
            : 'bg-orange-100 text-orange-800'
        }">
                    ${transaction.transaction_type}
                </span>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-600">Date</p>
                <p>${transaction.readable_date}</p>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-600">Service</p>
                <p>${transaction.address}</p>
            </div>
            ${extractedBalance ? `
            <div>
                <p class="text-sm font-medium text-gray-600">Balance After</p>
                <p class="font-bold text-blue-600">${extractedBalance.toLocaleString()} RWF</p>
            </div>
            ` : ''}
        </div>
        <div>
            <p class="text-sm font-medium text-gray-600 mb-2">Full Message</p>
            <div class="bg-gray-50 p-3 rounded-md">
                <p class="text-sm">${transaction.body}</p>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

// Make functions globally available
window.showTransactionDetails = showTransactionDetails;