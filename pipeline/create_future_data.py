import pandas as pd
import random
from datetime import datetime, timedelta

# Flight routes with 'route' column
flight_routes = [
    ("4Y001", "FRA", "JFK", "08:00", "11:00", "08:00", "intercont", "North America"),
    ("4Y002", "FRA", "SIN", "09:00", "17:00", "12:00", "intercont", "Asia"),
    ("4Y003", "FRA", "LAX", "12:00", "15:00", "11:00", "intercont", "North America"),
    ("4Y004", "FRA", "BKK", "13:30", "07:00", "10:00", "intercont", "Asia"),
    ("4Y005", "FRA", "HND", "10:00", "00:00", "10:00", "intercont", "Asia"),
    ("4Y006", "FRA", "GRU", "21:00", "06:00", "11:00", "intercont", "South America"),
    ("4Y007", "FRA", "LHR", "07:00", "08:00", "01:00", "cont", "Europe"),
    ("4Y008", "FRA", "CDG", "09:00", "10:00", "01:00", "cont", "Europe"),
    ("4Y009", "FRA", "MAD", "11:00", "13:00", "02:00", "cont", "Europe"),
    ("4Y010", "FRA", "AMS", "14:00", "15:00", "01:00", "cont", "Europe"),
    ("4Y011", "FRA", "BCN", "16:00", "18:00", "02:00", "cont", "Europe"),
    ("4Y012", "FRA", "ZRH", "19:00", "20:00", "01:00", "cont", "Europe")
]

# Full services and dish types
services_and_dish_types = {
    "intercont": {
        "Business": {
            "First": {
                "components": ["Starter", "Main", "Dessert"],
                "dish_types": {
                    "Starter": {"options": ["Meat", "Veg"], "ratio": 0.6},
                    "Main": {"options": ["Meat", "Veg", "Fish"], "ratio": 0.4},
                    "Dessert": {"options": ["Cheese", "Sweet"], "ratio": 0.6}
                }
            },
            "Second": {
                "components": ["Breakfast", "Dinner"],
                "dish_types": {
                    "Breakfast": {"options": ["Breakfast"], "ratio": 1},
                    "Dinner": {"options": ["Meat", "Veg"], "ratio": 0.6}
                }
            }
        },
    },
    "cont": {
        "Business": {
            "First": {
                "components": ["Breakfast", "Hot Meal"],
                "dish_types": {
                    "Breakfast": {"options": ["Breakfast"], "ratio": 1},
                    "Hot Meal": {"options": ["Meat", "Veg"], "ratio": 0.6}
                }
            }
        }
    }
}
# Prices (in euros) and CO₂ impacts (in kg) for each dish type
dish_type_prices = {
    "Meat": 5.00, "Veg": 4.50, "Fish": 6.00, "Cheese": 3.50,
    "Sweet": 2.50, "Breakfast": 4.00, "Snack": 2.00,
    "Non-Veg": 5.50, "Bread": 1.00, "Savory": 2.50
}

dish_type_co2 = {
    "Meat": 2.5, "Veg": 1.2, "Fish": 3.0, "Cheese": 1.8,
    "Sweet": 0.8, "Breakfast": 1.5, "Snack": 0.5,
    "Non-Veg": 2.7, "Bread": 0.3, "Savory": 0.9
}

# Generate dates for the past 9 months and future 6 months
today = datetime.today()
past_dates = [today - timedelta(days=365-x) for x in range(0, 365)]
future_dates = [today + timedelta(days=x) for x in range(1, 180)]

# Data storage
data = []

def vary_times(departure_time_str, arrival_time_str, max_variation=300):
    dep_time = datetime.strptime(departure_time_str, "%H:%M")
    arr_time = datetime.strptime(arrival_time_str, "%H:%M")
    variation = random.randint(-max_variation, max_variation)
    varied_dep_time = (dep_time + timedelta(minutes=variation)).time()
    varied_arr_time = (arr_time + timedelta(minutes=variation)).time()
    return varied_dep_time.strftime("%H:%M"), varied_arr_time.strftime("%H:%M")

# Generate data function
def generate_data(date):
    for flight_number, departure, destination, departure_time, arrival_time, flight_duration, route, region in flight_routes:
        departure_time, arrival_time = vary_times(departure_time, arrival_time)
        services = services_and_dish_types[route]
        for travel_class, details in services.items():
            passengers = random.randint(30, 60)
            for service, service_details in details.items():
                for component in service_details["components"]:
                    dish_types = service_details["dish_types"][component]["options"]
                    ratio = service_details["dish_types"][component]["ratio"]
                    load_factor = len(dish_types) * ratio
                    for dish_type in dish_types:
                        #region = random.choice(["region1", "region2"])

                        # Load factors

                        # Get price and CO₂ per item
                        price_per_dish = dish_type_prices.get(dish_type, 0.00)
                        co2_per_item = dish_type_co2.get(dish_type, 0.00)


                        # Append to data
                        data.append([
                            date.strftime("%Y-%m-%d"),
                            flight_number,
                            departure,
                            destination,
                            travel_class,
                            service,
                            component,
                            dish_type,
                            region,
                            passengers,
                            ratio,
                            load_factor, 
                            price_per_dish,
                            co2_per_item,
                            departure_time,
                            arrival_time,
                            flight_duration,
                            route
                        ])

# Generate data for past and future dates
#for date in past_dates:
#    generate_data(date, is_future=False)

for date in future_dates:
    generate_data(date)

# Columns
columns = [
    "date", "flight_number", "departure", "destination", "travel_class",
    "service", "component", "dish_type", "region", "passengers",
    "ratio","load_factor", "price_per_dish",
    "co2_per_item", "departure_time", "arrival_time", "flight_duration", "route"
]

# Create DataFrame and save to Excel
df = pd.DataFrame(data, columns=columns)
df.to_excel("future_data_dummy.xlsx", index=False)
print("done")