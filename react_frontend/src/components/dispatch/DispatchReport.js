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
// import { createDispatchReport } from "../../redux/dispatch_report/dispatchReportSlice";
import { generateReport } from "../../functions/report";

const DispatchReport = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [ddate, setDdate] = useState(null);
    const [rdate, setRdate] = useState(null);
    const [dtime, setDtime] = useState('12: 00 AM');
    const [rtime, setRtime] = useState('12: 00 AM');
    const dispatch = useDispatch();
    const dispatches = useSelector((state) => state.dispatches.dispatches.results) ?? [];
    const supervisors = useSelector((state) => state.users.users.results) ?? [];
    const [dispatchId, setDispatchID] = useState('');
    const [dispatchReportData, setDispatchReportData] = useState({
        "departure_milage": "",
        "departure_time_act": "00:00:00",
        "return_milage": 0,
        "return_date_act": "",
        "return_time_act": "00:00:00",
        "refuel_liters": 0.0,
        "refuel_liters": 0
    });

    useEffect(() => {
        setDispatchReportData((prev) => ({
            ...prev,
            return_date_act: new Date(rdate).toISOString().split('T')[0]
        }));
    }, [ddate, rdate]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
      }, [error, success]);

    //   const generateReport = async (name, data) => {
    //     try {
    //         console.log(data);
    //     jsreport.serverUrl = 'http://localhost:4444';
    //     const response = await jsreport.render({
    //         template: {
    //         name: name,
    //         },
    //         data: {
    //             cdispatch: data
    //         }
    //     });
    //     response.download('myreport.pdf');
    //     response.openInWindow({title: 'My Report'});
    //     } catch (error) {
    //         console.error('Error generating report:', error);
    //     }
    // };

    // function isLeapYear(year) {
    //     // Leap year in Ethiopian calendar occurs every 4 years without exception
    //     return (year % 4) === 3;
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateDispatch({ id: dispatchId, data: dispatchReportData })).then((res) => {
            if (res.payload?.id) {
                setSuccess(true);           
                let data = { ...res.payload };
                console.log(res.payload);
                // Step 2: Create a deep copy of vehicle_requests
                data.vehicle_requests = res.payload.vehicle_requests.map(req => ({ ...req }));
    
                // Step 3: Assign the first vehicle request to data.request
                data.request = data.vehicle_requests[0];
                data.difference = data.return_milage - data.departure_milage;
                data.assigned_date = convertToEthiopianDateTime(data.assigned_date.split('T')[0]);
				data.assigned_date_t = data.assigned_date;
                data.departure_date = convertToEthiopianDateTime(data.departure_date, null);
				data.departure_time_est = convertToEthiopianDateTime(null, data.departure_time_est);
				data.departure_time_act = convertToEthiopianDateTime(null, data.departure_time_act);
                data.return_date_est = convertToEthiopianDateTime(data.return_date_est, null);
				data.return_time_est = convertToEthiopianDateTime(null, data.return_time_est);
                data.return_date_act = convertToEthiopianDateTime(data.return_date_act, null);
				data.return_time_act = convertToEthiopianDateTime(null, data.return_time_act);
				data.departure_date_t = data.departure_date;
				data.departure_time_t = data.departure_time_act;
                data.return_time_act_t = data.return_time_act;
                // Step 4: Modify the deep copied vehicle_requests array
                if (Array.isArray(data.vehicle_requests)) {
                    data.vehicle_requests.forEach((req, idx) => {
                        req.no = idx + 1;
                        req.user = req.requester;
                    });
                } else {
                    console.error("data.vehicle_requests is not an array");
                }
                console.log(data);
                generateReport('dispatch', data);
            } else {
                setSuccess(false);
                setError(res.payload?.message || 'An unknown error occurred');  // Ensure error is a string
                console.log(res.payload);
            }
        }).catch((error) => {
            // Handle any errors from the first then block
            setError(error.message || 'An unknown error occurred');  // Ensure error is a string
            console.log(error);
        });
    }

    useEffect(() => {
        dispatch(fetchDispatches());
        dispatch(fetchUsers());
    }, []);

    return <>
        {/* Recent Orders */}
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4"> Complete Dispatch (የስምሪት ማጠናቀቅያ)</Typography>
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
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Departure milage (KM) (የተጓዘበት በኪ/ሜ)" type="number" name="departure_milage" id="departure_milage" onChange={(e) => setDispatchReportData((prev) => ({...prev, departure_milage: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Departure time (የተነሳበት ሰዓት)</InputLabel>
                    <Select
                        labelId="Depature time"
                        id="departure_time"
                        label="Select Vehicle"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchReportData((prev) => ({...prev, departure_time_act: convertTo24HourFormat(e.target.value)}))}
                    >
                        {
                            times.map((obj, index) => {
                                const [key, value] = Object.entries(obj)[0]; // Extract key-value pair
                                return (
                                    <MenuItem key={key} value={value}>{key}</MenuItem>
                                );
                            })
                        }                            
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Return milage (KM) (የተመለሰበት በኪሜ)" type="number" name="return_milage" id="return_milage" onChange={(e) => setDispatchReportData((prev) => ({...prev, return_milage: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                    <EtDatePicker
                            label="Return Date (የተመለሰበት ቀን)"
                            onChange={(selectedDate) => {
                                setRdate(selectedDate);
                            }}
                            value={rdate}
                        />
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Return time (የተመለሰበት ሰዓት)</InputLabel>
                    <Select
                        labelId="Return time"
                        id="return_time"
                        label="Return time"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchReportData((prev) => ({...prev, return_time_act: convertTo24HourFormat(e.target.value)}))}
                    >
                        {
                            times.map((obj, index) => {
                                const [key, value] = Object.entries(obj)[0]; // Extract key-value pair
                                return (
                                    <MenuItem key={key} value={value}>{key}</MenuItem>
                                );
                            })
                        }    
                            
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Refuel (Lts) (ነዳጀ ሙሊት በሊትር)" type="number" name="refuel" id="refuel" onChange={(e) => setDispatchReportData((prev) => ({...prev, refuel_liters: e.target.value}))}/>
                </FormControl>
            </Grid>
            
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e)=> handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Create (ፍጠር)</Button>
                    </FormControl>
                </form>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                {
                    success && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Dispatch report created successfully!
                    </Alert>
                }
                { error && <Alert severity="error">{error}</Alert>} 
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <Typography variant="h4">Dispatches</Typography>
        </Grid>
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <DispatchTable />
        </Grid>
    </>

}

export default DispatchReport;