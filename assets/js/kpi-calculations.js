export async function loadData() {
    const response = await fetch('../assets/data/pendle_dummy_data.json');
    if (!response.ok) {
        throw new Error('Failed to load data');
    }
    return await response.json();
}

export function calculateUnusedMeals(data) {
    // Aggregiere die Daten für "amount_loaded - amount_used"
    return data.reduce((total, row) => total + (row.amount_loaded - row.amount_used), 0);
}
export function calculatePotentialCO2Savings(data) {
    return data.reduce((total, flight) => total + (flight.potential_co2_savings || 0), 0).toFixed(2);
}

export function calculateCustomerSatisfaction(data) {
    const totalSatisfaction = data.reduce((total, flight) => total + (flight.customer_satisfaction || 0), 0);
    const count = data.filter(flight => flight.customer_satisfaction !== undefined).length;
    return count ? (totalSatisfaction / count).toFixed(1) : 'N/A';
}

export function calculateCostSavings(data) {
    return data.reduce((total, flight) => total + (flight.potential_cost_savings || 0), 0).toFixed(2);
}
