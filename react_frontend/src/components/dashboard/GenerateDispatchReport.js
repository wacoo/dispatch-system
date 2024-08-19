import { Alert, Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import VehiclesTable from "./VehiclesTable";
import DriversTable from "./DriversTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDriver, fetchDrivers } from "../../redux/driver/driverSlice";
import { createDispatch, fetchDispatchById, fetchDispatches, updateDispatch } from "../../redux/dispatch/dispatchSlice";
import { EthiopianDate } from "mui-ethiopian-datepicker/dist/util/EthiopianDateUtils";
import EtDatePicker from "mui-ethiopian-datepicker";
import { fetchUsers } from "../../redux/user/userSlice";
import jsreport from 'jsreport-browser-client-dist';
import { convertTo24HourFormat, convertToEthiopianDateTime, formatDateToYYYYMMDD, times } from "../../functions/date";
import DispatchTable from "./DispatchTable";
import { fetchActivePPL, fetchMonthlyPlan, fetchRefuels, fetchRefuelsById } from "../../redux/refuel/refuelSlice";
import { fetchMaintenance, fetchOilUses, fetchVehicles } from "../../redux/vehicle/vehicleSlice";
// import { createDispatchReport } from "../../redux/dispatch_report/dispatchReportSlice";
import { calculateRefuelData, generateReport, generateReportTwo } from "../../functions/report";

const GenerateDispatchReport = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [ddate, setDdate] = useState(null);
    const [rdate, setRdate] = useState(null);
    const [dtime, setDtime] = useState('12: 00 AM');
    const [rtime, setRtime] = useState('12: 00 AM');
    const dispatch = useDispatch();
    const dispatches = useSelector((state) => state.dispatches.dispatches.results) ?? [];
    const refuels = useSelector((state) => state.refuels.refuels) ?? [];
    // const supervisors = useSelector((state) => state.users.users.results) ?? [];
    const ppls = useSelector((state) => state.refuels.activePPLs.results) ?? [];
    const vehicles = useSelector((state) => state.vehicles.vehicles.results) ?? [];
    const monthlyFuelPlan = useSelector((state) => state.refuels.monthlyPlans) ?? [];
    const oilUses = useSelector((state) => state.vehicles.oilUses) ?? [];
    const maintenances = useSelector((state) => state.vehicles.maints) ?? [];
    const [dispatchId, setDispatchID] = useState('');
    const [vehicleId, setVehicleID] = useState('');
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    const [refuelMData, setRefuelMData] = useState(
        {
            from: '',
            to: ''
        }
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess(false);
            //   dispatch(fetchDispatchById({dispatchId: id}));
        }, 5000);

        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [error, success]);


    useEffect(() => {
        setRefuelMData(prevData => ({
            ...prevData,
            from: formatDateToYYYYMMDD(new Date(from)),
            to: formatDateToYYYYMMDD(new Date(to))
        }));
    }, [from, to]);

    useEffect(() => {
        // You can initialize dispatchID here if necessary, for example:
        if (dispatches.length > 0) {
          setDispatchID(dispatches[1]?.id);
        }
      }, [dispatches]);


      useEffect(() => {
        console.log(maintenances);
      }, [maintenances]);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchDispatchById({ dispatchId: dispatchId })).then((res) => {
            console.log(res.payload);
            if (res.payload?.id) {
                let data = { ...res.payload };
                data.request = data.vehicle_requests[0];
                data.difference = data.return_milage - data.departure_milage;
                data.assigned_date = convertToEthiopianDateTime(data.assigned_date.split('T')[0]);
                data.departure_date = convertToEthiopianDateTime(data.departure_date, data.departure_time_act);
                data.return_date_est = convertToEthiopianDateTime(data.return_date_est, data.return_time_est);
                data.return_date_act = convertToEthiopianDateTime(data.return_date_act, data.return_time_act);
                generateReport('dispatch', data);
            }
        })
    }

    const handleAllowance = (e) => {
        e.preventDefault();
        dispatch(fetchDispatchById({ dispatchId: dispatchId })).then((res) => {
            if (res.payload?.id) {
                let data = { ...res.payload };
                data.request = data.vehicle_requests[0];
                data.difference = data.return_milage - data.departure_milage;
                data.assigned_date = convertToEthiopianDateTime(data.assigned_date.split('T')[0]);
                data.departure_date = convertToEthiopianDateTime(data.departure_date);
                data.departure_time_est = convertToEthiopianDateTime(null, data.departure_time_est);
                console.log(data.departure_time_est)
                data.return_date_est = convertToEthiopianDateTime(data.return_date_est);
                data.return_time_est = convertToEthiopianDateTime(null, data.return_time_est);
                console.log(data.return_time_est)
                data.return_date_act = convertToEthiopianDateTime(data.return_date_act);
                data.return_time_act = convertToEthiopianDateTime(null, data.return_time_act);
                console.log(data.return_time_act)
                generateReport('wage', data);
            }
        })
    }
    useEffect(() => {
        dispatch(fetchDispatches());
        dispatch(fetchUsers());
        dispatch(fetchVehicles());
        dispatch(fetchMonthlyPlan());
    }, []);


    const handleExpense = (e) => {
        e.preventDefault();
        dispatch(fetchDispatchById({ dispatchId: dispatchId })).then((res) => {
            if (res.payload?.id) {
                let data = { ...res.payload };
                data.request = data.vehicle_requests[0];
                data.difference = data.return_milage - data.departure_milage;
                data.assigned_date = convertToEthiopianDateTime(data.assigned_date.split('T')[0], null);
                data.departure_date = convertToEthiopianDateTime(data.departure_date, null);
                data.departure_time_est = convertToEthiopianDateTime(null, data.departure_time_est);
                console.log(data.departure_date_est)
                data.return_date_est = convertToEthiopianDateTime(data.return_date_est, null);
                data.return_time_est = convertToEthiopianDateTime(null, data.return_time_est);
                console.log(data.return_date_est)
                data.return_date_act = convertToEthiopianDateTime(data.return_date_act, null);
                data.return_time_act = convertToEthiopianDateTime(null, data.return_time_act);
                console.log(data.return_date_act)
                generateReport('expense', data);
            }
        })
    }


    const handleRefuelReport = (e) => {
        e.preventDefault();
        dispatch(fetchRefuelsById({ vehicleId: vehicleId })).then((res) => {
            if (res.payload[0]?.id) {
                let data = [...res.payload];
                if (Array.isArray(data)) {
                    data = data.map((ref, idx) => ({
                        ...ref,
                        no: idx + 1
                    }));
                } else {
                    console.error("data is not an array");
                }
                console.log(res.payload);
                generateReport('refuel', data);
            }
        });
    }

    useEffect(() => {
        dispatch(fetchDispatches());
        dispatch(fetchUsers());
        dispatch(fetchRefuels());        
        dispatch(fetchActivePPL());
        dispatch(fetchOilUses());
        dispatch(fetchMaintenance());
    }, []);


    const handleRefuelAllReport = (e) => {
        e.preventDefault();
        console.log('LM', oilUses, maintenances);
        const monthly = calculateRefuelData(refuels, refuelMData.from, refuelMData.to, ppls[ppls.length - 1]?.benzine, ppls[ppls.length - 1]?.nafta, monthlyFuelPlan[monthlyFuelPlan.length - 1], oilUses, maintenances);
        
        // console.log('M: ', ppls[ppls]);
        generateReportTwo('monthly', monthly);
    }

    useEffect(() => {
        dispatch(fetchDispatches());
        dispatch(fetchUsers());
        dispatch(fetchRefuels());
    }, []);



    return <>
        {/* Recent Orders */}
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Dispatch Report (የስምሪት ሪፖርት)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    {/* <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Dispatch (ስምሪት)</InputLabel> */}
                    <Autocomplete
                        options={dispatches}
                        getOptionLabel={(disp) => `(${disp.id}) ${convertToEthiopianDateTime(disp.assigned_date.split('T')[0])}; ${disp.vehicle.license_plate}; ${disp.vehicle.make} ${disp.vehicle.model}; ${disp.driver.fname} ${disp.driver.lname}`}
                        renderInput={(params) => <TextField {...params} label="Dispatch" sx={{ minWidth: '100%' }} />}
                        onChange={(event, newValue) => setDispatchID(newValue?.id ?? '')}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Generate Report</Button>
                    </FormControl>
                </form>
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Allowance form (የአበል ቅጽ)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    {/* <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Dispatch (ስምሪት)</InputLabel> */}
                    <Autocomplete
                        options={dispatches}
                        getOptionLabel={(disp) => 
                            `(${disp.id}) ${convertToEthiopianDateTime(disp.assigned_date.split('T')[0])}; ${disp.vehicle.license_plate}; ${disp.vehicle.make} ${disp.vehicle.model}; ${disp.driver.fname} ${disp.driver.lname}`}
                        renderInput={(params) => (
                            <TextField {...params} label="Dispatch" variant="outlined" sx={{ minWidth: '100%' }} />
                        )}
                        onChange={(event, newValue) => setDispatchID(newValue?.id ?? '')}
                        />
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleAllowance(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Generate Form</Button>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Expense form (የወጪ ቅጽ)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Dispatch (ስምሪት)</InputLabel>
                    <Autocomplete
                        options={dispatches}
                        getOptionLabel={(disp) => 
                            `(${disp.id}) ${convertToEthiopianDateTime(disp.assigned_date.split('T')[0])}; ${disp.vehicle.license_plate}; ${disp.vehicle.make} ${disp.vehicle.model}; ${disp.driver.fname} ${disp.driver.lname}`}
                        renderInput={(params) => (
                            <TextField {...params} label="Dispatch" variant="outlined" sx={{ minWidth: '100%' }} />
                        )}
                        onChange={(event, newValue) => setDispatchID(newValue?.id ?? '')}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        value={dispatches?.find(disp => disp.id === dispatchId) || null} // Handle the selected value
                        />
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleExpense(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Generate Form</Button>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Refuel report (የነዳጅ መቆጣጠርያ ቅጽ)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    {/* <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Vehicle (ተሽከርካሪ)</InputLabel> */}
                    <Autocomplete
                        options={vehicles}
                        getOptionLabel={(vehicle) => 
                            `(${vehicle.license_plate}) ${vehicle.make}; ${vehicle.model}; ${vehicle.type}`}
                        renderInput={(params) => (
                            <TextField {...params} label="Vehicle" variant="outlined" sx={{ minWidth: '100%' }} />
                        )}
                        onChange={(event, newValue) => setVehicleID(newValue?.id ?? '')}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        value={vehicles?.find(vehicle => vehicle.id === vehicleId) || null} // Handle the selected value
                        />
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleRefuelReport(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Generate Report</Button>
                    </FormControl>
                </form>
            </Grid>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Monthly Refuels(የነዳጅ መቆጣጠርያ ቅጽ)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <EtDatePicker
                        label="From (ከ)"
                        onChange={(selectedDate) => {
                            setFrom(selectedDate);
                        }}
                        value={from}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <EtDatePicker
                        label="To (እስከ)"
                        onChange={(selectedDate) => {
                            setTo(selectedDate);
                        }}
                        value={from}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleRefuelAllReport(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Generate Report</Button>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
        </Grid>
    </>

}

export default GenerateDispatchReport;