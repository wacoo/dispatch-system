import jsreport from 'jsreport-browser-client-dist'

export const generateReport = async (name, data) => {
    try {
        console.log(data);
    // jsreport.serverUrl = 'http://localhost:4444';
    jsreport.serverUrl = 'http://192.168.5.6:4444';
    const response = await jsreport.render({
        template: {
        name: name,
        // content: 'Hello from {{message}}',
        // engine: 'handlebars',
        // recipe: 'chrome-pdf'
        },
        data: {
            cdispatch: data
        }
    });
    response.download('myreport.pdf');
    response.openInWindow({title: 'My Report'});
    // setReportData(response.data.toString('utf8'));
    } catch (error) {
        console.error('Error generating report:', error);
    }
};

export const generateReportTwo = async (name, data) => {
    try {
        console.log(data);
    // jsreport.serverUrl = 'http://localhost:4444';
    jsreport.serverUrl = 'http://192.168.5.6:5555';
    const response = await jsreport.render({
        template: {
        name: name,
        // content: 'Hello from {{message}}',
        // engine: 'handlebars',
        // recipe: 'chrome-pdf'
        },
        data: {
            cmonthly: data
        }
    });
    response.download('myreport.pdf');
    response.openInWindow({title: 'My Report'});
    // setReportData(response.data.toString('utf8'));
    } catch (error) {
        console.error('Error generating report:', error);
    }
};


// const refuelData = [
//     {
//         id: 7,
//         refuel_request_date: "2024-07-05",
//         refuel_date: "2024-07-05",
//         benzine: "5",
//         benzine_price_ppl: 0,
//         current_fuel_level: 0,
//         km_during_previous_refuel: 1678,
//         km_during_refuel: 200,
//         km_per_liter: 8,
//         nafta: "70",
//         nafta_price_ppl: 0,
//         remark: "FDD",
//         vehicle: {
//             id: 1,
//             make: "Toyota",
//             model: "Corolla",
//             license_plate: "A242424",
//             type: "CAR",
//             year: 2000
//         }
//     },
//     {
//         id: 8,
//         refuel_request_date: "2024-07-08",
//         refuel_date: "2024-07-07",
//         benzine: "50",
//         benzine_price_ppl: 0,
//         current_fuel_level: 20,
//         km_during_previous_refuel: 900,
//         km_during_refuel: 1000,
//         km_per_liter: 5,
//         nafta: "",
//         nafta_price_ppl: 0,
//         remark: "DDDD",
//         vehicle: {
//             id: 1,
//             make: "Toyota",
//             model: "Corolla",
//             license_plate: "A242424",
//             type: "CAR",
//             year: 2000
//         }
//     },
//     {
//         id: 9,
//         refuel_request_date: "2024-07-16",
//         refuel_date: "2024-07-16",
//         benzine: "90",
//         benzine_price_ppl: 0,
//         current_fuel_level: "70",
//         km_during_previous_refuel: 4500,
//         km_during_refuel: 5000,
//         km_per_liter: 5,
//         nafta: "30",
//         nafta_price_ppl: 0,
//         remark: "r",
//         vehicle: {
//             id: 1,
//             make: "Toyota",
//             model: "Corolla",
//             license_plate: "A242424",
//             type: "CAR",
//             year: 2000
//         }
//     }
// ];

function parseNumbers(obj) {
    const parsedObj = {};
    for (const key in obj) {
        if (typeof obj[key] === 'string' && !isNaN(obj[key])) {
            parsedObj[key] = parseFloat(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            parsedObj[key] = parseNumbers(obj[key]);
        } else {
            parsedObj[key] = obj[key];
        }
    }
    return parsedObj;
}

export function calculateRefuelData(refuelData, startDate, endDate, benzinePricePerLiter, naftaPricePerLiter) {
    const parsedRefuelData = refuelData.map(entry => parseNumbers(entry));

    const start = new Date(startDate);
    const end = new Date(endDate);

    const results = {};

    parsedRefuelData.forEach(entry => {
        const refuelDate = new Date(entry.refuel_date);

        if (refuelDate >= start && refuelDate <= end) {
            const vehicleId = entry.vehicle.id;

            if (!results[vehicleId]) {
                results[vehicleId] = {
                    vehicle: entry.vehicle,
                    initialKilometers: null,
                    lastKilometers: null,
                    totalBenzineCost: 0,
                    totalNaftaCost: 0,
                    totalBenzineUsed: 0,
                    totalNaftaUsed: 0,
                    initialFuelLevel: 0,
                    calculatedFuelLevel: 0
                };
            }

            // Record the initial kilometers using km_during_previous_refuel for the first entry within the date range
            if (results[vehicleId].initialKilometers === null) {
                results[vehicleId].initialKilometers = entry.km_during_previous_refuel;
            }

            results[vehicleId].lastKilometers = entry.km_during_refuel;

            const benzineUsed = entry.benzine || 0;
            const naftaUsed = entry.nafta || 0;

            results[vehicleId].totalBenzineCost += benzineUsed * benzinePricePerLiter;
            results[vehicleId].totalNaftaCost += naftaUsed * naftaPricePerLiter;

            results[vehicleId].totalBenzineUsed += benzineUsed;
            results[vehicleId].totalNaftaUsed += naftaUsed;

            if (refuelDate.getTime() === start.getTime()) {
                results[vehicleId].initialFuelLevel = entry.current_fuel_level;
            }

            results[vehicleId].calculatedFuelLevel += benzineUsed + naftaUsed;
            const fuelUsed = entry.km_during_refuel / entry.km_per_liter;
            results[vehicleId].calculatedFuelLevel -= fuelUsed;

            // Ensure fuel level is not negative
            if (results[vehicleId].calculatedFuelLevel < 0) {
                results[vehicleId].calculatedFuelLevel = 0;
            }
        }
    });

    // Calculate total kilometers and remaining fuel
    for (const vehicleId in results) {
        if (results[vehicleId].initialKilometers !== null && results[vehicleId].lastKilometers !== null) {
            results[vehicleId].totalKilometers = results[vehicleId].lastKilometers - results[vehicleId].initialKilometers;
        }
        results[vehicleId].remainingFuel = results[vehicleId].initialFuelLevel + results[vehicleId].calculatedFuelLevel;
    }

    return results;
}

// const benzinePricePerLiter = 1.2; // Example price per liter for benzine
// const naftaPricePerLiter = 1.0; // Example price per liter for nafta
// const result = calculateRefuelData(refuelData, '2024-07-01', '2024-07-31', benzinePricePerLiter, naftaPricePerLiter);

// console.log(result);