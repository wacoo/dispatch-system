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

export function calculateRefuelData(refuelData, startDate, endDate, benzinePricePerLiter, naftaPricePerLiter, plan, oilUses, maintenaces) {
    const parsedRefuelData = refuelData?.map(parseNumbers);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const oilTire = {
        totalOilLts: 0,
        totalOilCost: 0,
        totalTireMaintCount: 0,
        totalTireMaintCost: 0
    }
    const results = {};
    const summary = {
        nafta: 0,
        benzine: 0,
        naftaPrice: 0,
        benzinePrice: 0,
    };

    oilUses.forEach(item => {
        oilTire.totalOilLts += item.liters;
        oilTire.totalOilCost += item.cost;
    });

    maintenaces.forEach(item => {
        oilTire.totalTireMaintCount += item.count;
        oilTire.totalTireMaintCost += item.cost;
    });

    parsedRefuelData.forEach(entry => {
        const refuelDate = new Date(entry.refuel_date);

        if (refuelDate >= start && refuelDate <= end) {
            const { id: vehicleId } = entry.vehicle;
            const benzineUsed = entry.benzine || 0;
            const naftaUsed = entry.nafta || 0;

            if (!results[vehicleId]) {
                results[vehicleId] = {
                    vehicle: entry.vehicle,
                    initialKilometers: entry.km_during_previous_refuel ?? null,
                    lastKilometers: entry.km_during_refuel,
                    totalBenzineCost: 0,
                    totalNaftaCost: 0,
                    totalBenzineUsed: 0,
                    totalNaftaUsed: 0,
                    initialFuelLevel: 0,
                    calculatedFuelLevel: 0,
                    kmShouldHaveTraveled: 0,
                    differenceKM: 0,
                    usedLiters: 0,
                    differenceLts: 0
                };
            }

            const vehicle = results[vehicleId];

            vehicle.lastKilometers = entry.km_during_refuel;
            vehicle.totalBenzineCost += benzineUsed * benzinePricePerLiter;
            vehicle.totalNaftaCost += naftaUsed * naftaPricePerLiter;
            vehicle.totalBenzineUsed += benzineUsed;
            vehicle.totalNaftaUsed += naftaUsed;

            summary.benzine += benzineUsed;
            summary.nafta += naftaUsed;
            summary.benzinePrice += benzineUsed * benzinePricePerLiter;
            summary.naftaPrice += naftaUsed * naftaPricePerLiter;

            vehicle.kmShouldHaveTraveled = vehicle.totalBenzineUsed > 0 
                ? benzinePricePerLiter * vehicle.totalBenzineUsed
                : vehicle.totalNaftaUsed > 0 
                    ? naftaPricePerLiter * vehicle.totalNaftaUsed
                    : 0;

            vehicle.differenceKM = vehicle.kmShouldHaveTraveled - (vehicle.lastKilometers - vehicle.initialKilometers ?? 0);

            if (refuelDate.getTime() === start.getTime()) {
                vehicle.initialFuelLevel = entry.current_fuel_level;
            }

            vehicle.calculatedFuelLevel += benzineUsed + naftaUsed;
            const fuelUsed = entry.km_during_refuel / entry.km_per_liter;
            vehicle.calculatedFuelLevel -= fuelUsed;
            vehicle.calculatedFuelLevel = Math.max(vehicle.calculatedFuelLevel, 0);
        }
    });

    // Calculate total kilometers and remaining fuel
    for (const vehicleId in results) {
        const vehicle = results[vehicleId];

        if (vehicle.initialKilometers !== null && vehicle.lastKilometers !== null) {
            vehicle.totalKilometers = vehicle.lastKilometers - vehicle.initialKilometers;
        } else {
            vehicle.totalKilometers = 0;
        }

        vehicle.remainingFuel = vehicle.initialFuelLevel + vehicle.calculatedFuelLevel;

        vehicle.usedLiters = vehicle.totalBenzineUsed > 0
            ? (vehicle.totalKilometers / vehicle.totalBenzineUsed).toFixed(3)
            : vehicle.totalNaftaUsed > 0
                ? (vehicle.totalKilometers / vehicle.totalNaftaUsed).toFixed(3)
                : 0;

        vehicle.differenceKM = vehicle.kmShouldHaveTraveled - vehicle.totalKilometers;
        vehicle.differenceLts = vehicle.vehicle.km_per_liter - vehicle.usedLiters;
    }

    results.summary = summary;
    const full_plan = {...plan};
    full_plan.nafta_diff_lts = results.summary.nafta - plan.nafta;
    full_plan.nafta_diff_cost = results.summary.naftaPrice - plan.nafta_cost;
    full_plan.benzine_diff_lts = results.summary.benzine - plan.benzine;
    full_plan.benzine_diff_cost = results.summary.benzinePrice - plan.benzine_cost;
    full_plan.nafta_perc_lts = ((results.summary.nafta / plan.nafta) * 100).toFixed(3);
    full_plan.nafta_perc_cost = ((results.summary.naftaPrice / plan.nafta_cost) * 100).toFixed(3);
    full_plan.benzine_perc_lts = ((results.summary.benzine / plan.benzine) * 100).toFixed(3);
    full_plan.benzine_perc_cost = ((results.summary.benzinePrice / plan.nafta_cost) * 100).toFixed(3);
    results.mlplan = full_plan;
    results.oil_tire = oilTire;
    full_plan.oil_lts_diff = full_plan.oil_lts - oilTire.totalOilLts;
    full_plan.oil_cost_diff = full_plan.oil_cost - oilTire.totalOilCost;
    full_plan.tire_cnt_diff = full_plan.tire_maint_cnt - oilTire.totalTireMaintCount;
    full_plan.tire_cost_diff = full_plan.tire_maint_cost - oilTire.totalTireMaintCost;
    full_plan.oil_lts_perc = ((oilTire.totalOilLts/ full_plan.oil_lts) * 100).toFixed(3);
    full_plan.oil_cost_perc = ((oilTire.totalOilCost / full_plan.oil_cost) * 100).toFixed(3);
    full_plan.tire_cnt_perc = ((oilTire.totalTireMaintCount / full_plan.tire_maint_cnt) * 100).toFixed(3);
    full_plan.tire_cost_perc= ((full_plan.tire_maint_cost / oilTire.totalTireMaintCost) * 100).toFixed(3);
    return results;
}

// const planNafta = Number(plan.nafta);
// const summaryNafta = Number(results.summary.nafta);

// // Calculate the percentage
// const percentage = (summaryNafta / planNafta) * 100;
// const benzinePricePerLiter = 1.2; // Example price per liter for benzine
// const naftaPricePerLiter = 1.0; // Example price per liter for nafta
// const result = calculateRefuelData(refuelData, '2024-07-01', '2024-07-31', benzinePricePerLiter, naftaPricePerLiter);

// console.log(result);