export async function loadData() {
    const response = await fetch('../assets/data/pendle_dummy_data.json');
    if (!response.ok) {
        throw new Error('Failed to load data');
    }
    const data = await response.json();
    return data;
}

export function filterDataByDate(data, selectedDate) {
    return data.filter(entry => entry.date === selectedDate);
}



export function calculateUnusedMeals(data) {
    // Berechnung der ungenutzten Mahlzeiten
    return data.reduce((total, row) => total + (row.amount_loaded - row.amount_used), 0);
}

export function calculatePotentialCO2Savings(data) {
    // Berechnung der potenziellen CO2-Einsparungen
    return data.reduce((total, flight) => total + (flight.potential_co2_savings || 0), 0);
}

export function calculateCustomerSatisfaction(data) {
    // Berechnung der durchschnittlichen Kundenzufriedenheit
    const totalSatisfaction = data.reduce((total, flight) => total + (flight.customer_satisfaction || 0), 0);
    const count = data.filter(flight => flight.customer_satisfaction !== undefined).length;
    return count ? (totalSatisfaction / count) : 'N/A';
}

export function calculateCostSavings(data) {
    // Berechnung der potenziellen Kosteneinsparungen
    return data.reduce((total, flight) => total + (flight.potential_cost_savings || 0), 0);
}

export function updateKPIs(filteredData) {
    if (filteredData.length === 0) {
        document.getElementById('unusedMeals').textContent = 'No data';
        document.getElementById('co2Savings').textContent = 'No data';
        document.getElementById('customerSatisfaction').textContent = 'No data';
        document.getElementById('costSavings').textContent = 'No data';
        return;
    }

    const unusedMeals = calculateUnusedMeals(filteredData);
    const co2Savings = calculatePotentialCO2Savings(filteredData);
    const customerSatisfaction = calculateCustomerSatisfaction(filteredData);
    const costSavings = calculateCostSavings(filteredData);

    document.getElementById('unusedMeals').textContent = `${unusedMeals} meals`;
    document.getElementById('co2Savings').textContent = `${co2Savings.toFixed(2)} kg`;
    document.getElementById('customerSatisfaction').textContent =
        customerSatisfaction !== 'N/A' ? `${customerSatisfaction.toFixed(1)} / 100` : 'N/A';
    document.getElementById('costSavings').textContent = `$${costSavings.toFixed(2)}`;
}

export function validateDate(data, selectedDate) {
    const dates = data.map(entry => entry.date);
    return dates.includes(selectedDate); // Nur gültige Daten akzeptieren
}
