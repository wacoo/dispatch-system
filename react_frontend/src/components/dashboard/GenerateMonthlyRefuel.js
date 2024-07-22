import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
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
import { convertTo24HourFormat, convertToEthiopianDateTime, times } from "../../functions/date";
import DispatchTable from "./DispatchTable";
import { fetchRefuels, fetchRefuelsById } from "../../redux/refuel/refuelSlice";
import { fetchVehicles } from "../../redux/vehicle/vehicleSlice";
// import { createDispatchReport } from "../../redux/dispatch_report/dispatchReportSlice";
import { generateReport } from "../../functions/report";

const GenerateDispatchReport = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [ddate, setDdate] = useState(null);
    const [rdate, setRdate] = useState(null);
    const [dtime, setDtime] = useState('12: 00 AM');
    const [rtime, setRtime] = useState('12: 00 AM');
    const dispatch = useDispatch();
    const dispatches = useSelector((state) => state.dispatches.dispatches.results) ?? [];
    const refuels = useSelector((state) => state.refuels.refuels.results) ?? [];
    // const supervisors = useSelector((state) => state.users.users.results) ?? [];
    const vehicles = useSelector((state) => state.vehicles.vehicles.results) ?? [];
    const [dispatchId, setDispatchID] = useState('');
    const [vehicleId, setVehicleID] = useState('');

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
        // You can initialize dispatchID here if necessary, for example:
        if (dispatches.length > 0) {
          setDispatchID(dispatches[1]?.id);
        }
      }, [dispatches]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchRefuels()).then((res) => {
            console.log(res.payload);
            if (res.payload) {
                // let data = { ...res.payload };
                // data.request = data.vehicle_requests[0];
                // data.difference = data.return_milage - data.departure_milage;
                // data.assigned_date = convertToEthiopianDateTime(data.assigned_date.split('T')[0]);
                // data.departure_date = convertToEthiopianDateTime(data.departure_date, data.departure_time_act);
                // data.return_date_est = convertToEthiopianDateTime(data.return_date_est, data.return_time_est);
                // data.return_date_act = convertToEthiopianDateTime(data.return_date_act, data.return_time_act);
                const monthly = calculateRefuelData(refuelData, startDate, endDate, benzinePricePerLiter, naftaPricePerLiter);
                generateReport('monthly', refuels);
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
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Dispatch (ስምሪት)</InputLabel>
                    <Select
                        labelId="req_lbl"
                        id="dispatch"
                        label="Dispatch"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchID(e.target.value)}
                    >
                        {dispatches.map((disp) => (
                            <MenuItem key={disp.id} value={disp.id}>
                                {`(${disp.id}) ${convertToEthiopianDateTime(disp.assigned_date.split('T')[0]) + ''}; ${disp.vehicle.license_plate}; ${disp.vehicle.make} ${disp.vehicle.model}; ${disp.driver.fname} ${disp.driver.fname}`}
                            </MenuItem>
                        ))}
                        {/* <MenuItem value={20}>Ashenafi</MenuItem>
                            <MenuItem value={30}>Yonas</MenuItem> */}
                    </Select>
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
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Dispatch (ስምሪት)</InputLabel>
                    <Select
                        labelId="req_lbl"
                        id="dispatch"
                        label="Dispatch"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchID(e.target.value)}
                    >
                        {dispatches.map((disp) => (
                            <MenuItem key={disp.id} value={disp.id}>
                                {`(${disp.id}) ${convertToEthiopianDateTime(disp.assigned_date.split('T')[0]) + ''}; ${disp.vehicle.license_plate}; ${disp.vehicle.make} ${disp.vehicle.model}; ${disp.driver.fname} ${disp.driver.fname}`}
                            </MenuItem>
                        ))}
                        {/* <MenuItem value={20}>Ashenafi</MenuItem>
                        <MenuItem value={30}>Yonas</MenuItem> */}
                    </Select>
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
                    <Select
                        labelId="req_lbl"
                        id="dispatch"
                        label="Dispatch"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchID(e.target.value)}
                    >
                        {dispatches.map((disp) => (
                            <MenuItem key={disp.id} value={disp.id}>
                                {`(${disp.id}) ${convertToEthiopianDateTime(disp.assigned_date.split('T')[0]) + ''}; ${disp.vehicle.license_plate}; ${disp.vehicle.make} ${disp.vehicle.model}; ${disp.driver.fname} ${disp.driver.fname}`}
                            </MenuItem>
                        ))}
                        {/* <MenuItem value={20}>Ashenafi</MenuItem>
                        <MenuItem value={30}>Yonas</MenuItem> */}
                    </Select>
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
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Vehicle (ተሽከርካሪ)</InputLabel>
                    <Select
                        labelId="req_lbl"
                        id="vehicle"
                        label="vehicle"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setVehicleID(e.target.value)}
                    >
                        {vehicles.map((vehicle) => (
                            <MenuItem key={vehicle.id} value={vehicle.id}>
                                {`(${vehicle.license_plate}) ${vehicle.make}; ${vehicle.model}; ${vehicle.type}`}
                            </MenuItem>
                        ))}
                        {/* <MenuItem value={20}>Ashenafi</MenuItem>
                        <MenuItem value={30}>Yonas</MenuItem> */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleRefuelReport(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Generate Report</Button>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    </>

}

export default GenerateDispatchReport;