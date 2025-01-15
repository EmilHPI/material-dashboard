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
    // if (filteredData.length === 0) {
    //     document.getElementById('unusedMeals').textContent = 'No data';
    //     document.getElementById('co2Savings').textContent = 'No data';
    //     document.getElementById('customerSatisfaction').textContent = 'No data';
    //     document.getElementById('costSavings').textContent = 'No data';
    //     return;
    // }

    // const unusedMeals = calculateUnusedMeals(filteredData);
    // const co2Savings = calculatePotentialCO2Savings(filteredData);
    // const customerSatisfaction = calculateCustomerSatisfaction(filteredData);
    // const costSavings = calculateCostSavings(filteredData);

    // document.getElementById('unusedMeals').textContent = `${unusedMeals} meals`;
    // document.getElementById('co2Savings').textContent = `${co2Savings.toFixed(2)} kg`;
    // document.getElementById('customerSatisfaction').textContent =
    //     customerSatisfaction !== 'N/A' ? `${customerSatisfaction.toFixed(1)} / 100` : 'N/A';
    // document.getElementById('costSavings').textContent = `$${costSavings.toFixed(2)}`;
}

export function getDestinations(data) {
    const seenFlightNumbers = new Set();
    return data
        .filter(entry => {
            if (seenFlightNumbers.has(entry.flight_number)) {
                return false; // Ignoriere doppelte flight_number
            }
            seenFlightNumbers.add(entry.flight_number);
            return true;
        })
        .map(entry => {
            // Filtere die Passagieranzahl für Business-Class
            let businessPassengers = data
                .filter(item => item.flight_number === entry.flight_number && item.travel_class === "Business")
                .reduce((total, item) => (item.passengers || 0), 0);

            return {
                destination: entry.destination,
                flight_number: entry.flight_number,
                departure_time: entry.departure_time,
                passengers: businessPassengers
            };
        })
        .sort((a, b) => a.departure_time.localeCompare(b.departure_time)); // Sortiere nach departure_time
}



export function updateDepartures(filteredData) {

    if (filteredData.length === 0) {
        document.getElementById('flight1_dest').textContent = 'No data';

    }

    let destinations = getDestinations(filteredData);
    console.log(destinations);


    for (let i = 0; i < destinations.length; i++){
        document.getElementById(`flight${i+1}_dest`).textContent = destinations[i].destination;
        document.getElementById(`flight${i+1}_dep_time`).textContent = destinations[i].departure_time;
        document.getElementById(`flight${i+1}_number`).textContent = destinations[i].flight_number;
        document.getElementById(`flight${i+1}_pax`).textContent = destinations[i].passengers;
    }
}

export function validateDate(data, selectedDate) {
    const dates = data.map(entry => entry.date);
    return dates.includes(selectedDate); // Nur gültige Daten akzeptieren
}


export function updateCategoryPredictions(filteredData, flightNumber) {
    // Definiere die Services und Komponenten
    const services = ['First', 'Second'];
    const components = ['Starter', 'Main', 'Dessert', 'Breakfast', 'Dinner'];

    // Filtere die Daten nach "travel_class" == "Business" und der angegebenen "flight_number"
    const flightData = filteredData.filter(
        entry => entry.travel_class === "Business" && entry.flight_number === flightNumber
    );

    // Iteriere durch Services und Komponenten
    services.forEach(service => {
        components.forEach(component => {
            // Filtere die Daten nach Service und Komponente
            const relevantData = flightData.filter(
                entry => entry.service === service && entry.component === component
            );

            // Iteriere durch Dish Types (z. B. Meat, Veg, Fish)
            relevantData.forEach(item => {
                const dishType = item.dish_type ? item.dish_type.toLowerCase() : null; // Dish-Typ klein schreiben
                const elementId = `${component.toLowerCase()}-${dishType}`; // ID erstellen (z. B. starter-meat)
                
                if (dishType && document.getElementById(elementId)) {
                    document.getElementById(elementId).textContent = item.amount_predicted_demand || 'N/A';
                }
            });
        });
    });
}


export function selectFlight(filteredData, flightNumber) {

          const selectedFlightData = filteredData.filter(entry => entry.flight_number === flightNumber);
      
      if (selectedFlightData.length > 0) {
        // Update the flight information cards
        updateCategoryPredictions(filteredData, flightNumber);
        document.querySelector('.flight-info-header').textContent = 
          `Information for: Flight ${selectedFlightData[0].flight_number} to ${selectedFlightData[0].destination} at ${selectedFlightData[0].departure_time}`;
      } else {
        console.warn('No data found for the selected flight.');
      }
    
  }
  


