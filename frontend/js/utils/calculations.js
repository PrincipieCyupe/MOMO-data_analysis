
import { mockData } from '../data/mockData.js';

// Enhanced statistics calculation
export function calculateStats() {
    const total = mockData.reduce((sum, t) => sum + parseFloat(t.extracted_amount), 0);
    const received = mockData.filter(t => t.transaction_type === 'received')
        .reduce((sum, t) => sum + parseFloat(t.extracted_amount), 0);
    const payments = mockData.filter(t => t.transaction_type === 'payment')
        .reduce((sum, t) => sum + parseFloat(t.extracted_amount), 0);
    const uniqueContacts = new Set(mockData.map(t => t.sender_or_receiver)).size;

    // Additional stats
    const avgTransaction = total / mockData.length;
    const netFlow = received - payments;

    return { total, received, payments, uniqueContacts, avgTransaction, netFlow };
}

// Extract balance from transaction messages
export function extractBalance(body) {
    const balanceMatch = body.match(/balance[:\s]*([0-9,]+)\s*RWF/i);
    return balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '')) : null;
}