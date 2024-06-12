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
import { convertTo24HourFormat, convertToEthiopianDateTime } from "../../functions/date";
import DispatchTable from "./DispatchTable";
// import { createDispatchReport } from "../../redux/dispatch_report/dispatchReportSlice";


const DispatchReport = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [ddate, setDdate] = useState(null);
    const [rdate, setRdate] = useState(null);
    const [dtime, setDtime] = useState('12: 00 AM');
    const [rtime, setRtime] = useState('12: 00 AM');
    const dispatch = useDispatch();
    const dispatches = useSelector((state) => state.dispatches.dispatches) ?? [];
    const supervisors = useSelector((state) => state.users.users) ?? [];
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

    const times = [{'1:00 (ከጠዋቱ)': '7:00 AM'}, {'2:00 (ከጠዋቱ)': '2:00 AM'}, {'3:00 (ከጠዋቱ)': '9:00 AM'}, {'4:00 (ከረፋዱ)': '10:00 AM'}, {'5:00 (ከረፋዱ)': '11:00 AM'}, {'6:00 (ከቀኑ)': '12:00 AM'}, {'7:00 (ከቀኑ)': '1:00 PM'}, {'8:00 (ከቀኑ)': '2:00 PM'}, {'9:00 (ከቀኑ)': '3:00 PM'}, {'10:00 (ከቀኑ)': '4:00 PM'}, {'11:00 (ከአመሻሹ)': '5:00 PM'}, {'12:00 (ከአመሻሹ)': '6:00 PM'}, {'1:00 (ከምሽቱ)': '7:00 PM'}, {'2:00 (ከምሽቱ)': '8:00 PM'}, {'3:00 (ከምሽቱ)': '9:00 PM'}, {'4:00 (ከምሽቱ)': '10:00 PM'}, {'5:00 (ከምሽቱ)': '11:00 PM'}, {'6:00 (ከለሊቱ)': '12:00 PM'}, {'7:00 (ከለሊቱ)': '1:00 AM'}, {'8:00 (ከለሊቱ)': '2:00 AM'}, {'9:00 (ከለሊቱ)': '3:00 AM'}, {'10:00 (ከለሊቱ)': '4:00 AM'}, {'11:00 (ከለሊቱ)': '5:00 AM'}, {'12:00 (ክጥዋቱ)': '6:00 AM'}];
    
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
        //   dispatch(fetchDispatchById({dispatchId: id}));
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
      }, [error, success]);

      const generateReport = async (name, data) => {
        try {
            console.log(data);
        jsreport.serverUrl = 'http://localhost:4444';
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

    function isLeapYear(year) {
        // Leap year in Ethiopian calendar occurs every 4 years without exception
        return (year % 4) === 3;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateDispatch({ id: dispatchId, data: dispatchReportData })).then((res) => {
            // console.log(res.payload.fname);
            if (res.payload?.id) {
                setSuccess(true);                
                // dispatch(fetchRequestsByByDispatch({id: request, dispatch: res.payload?.id}));
                // dispatch(fetchDispatches());               
                // generateReport('wage', {});
                let data = { ...res.payload };
                console.log(res.payload);
    
                // Step 2: Create a deep copy of vehicle_requests
                data.vehicle_requests = res.payload.vehicle_requests.map(req => ({ ...req }));
    
                // Step 3: Assign the first vehicle request to data.request
                data.request = data.vehicle_requests[0];
                data.difference = data.return_milage - data.departure_milage;
                data.assigned_date = convertToEthiopianDateTime(data.assigned_date.split('T')[0]);
                data.departure_date = convertToEthiopianDateTime(data.departure_date, data.departure_time_act);
                data.return_date_est = convertToEthiopianDateTime(data.return_date_est, data.return_time_est);
                data.return_date_act = convertToEthiopianDateTime(data.return_date_act, data.return_time_act);
                console.log(data.assigned_date);
                // Step 4: Modify the deep copied vehicle_requests array
                if (Array.isArray(data.vehicle_requests)) {
                    data.vehicle_requests.forEach((req, idx) => {
                        req.no = idx + 1;
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

    // function convertTo24HourFormat(time12h) {
    //     var [time, period] = time12h.split(' ');
    //     var [hours, minutes] = time.split(':');
    //     var seconds = '00'; // Adding seconds part
        
    //     if (period === 'PM' && hours !== '12') {
    //         hours = String(Number(hours) + 12);
    //     } else if (period === 'AM' && hours === '12') {
    //         hours = '00';
    //     }
        
    //     return `${hours}:${minutes}:${seconds}`;
    // }

    return <>
        {/* Recent Orders */}
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">New Dispatch Report (የስምሪት መጠናቀቅ ማሳወቂያ ሰነድ)</Typography>
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
                                {`(${disp.id}) ${EthiopianDate.toEth(new Date(disp.assigned_date.split('T')[0])) + ''}; ${disp.vehicle.license_plate}; ${disp.vehicle.make} ${disp.vehicle.model}; ${disp.driver.fname} ${disp.driver.fname}`}
                            </MenuItem>
                        ))}
                        {/* <MenuItem value={20}>Ashenafi</MenuItem>
                        <MenuItem value={30}>Yonas</MenuItem> */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Departure milage (KM)" type="number" name="departure_milage" id="departure_milage" onChange={(e) => setDispatchReportData((prev) => ({...prev, departure_milage: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Departure time</InputLabel>
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
                    <TextField label="Return milage (KM)" type="number" name="return_milage" id="return_milage" onChange={(e) => setDispatchReportData((prev) => ({...prev, return_milage: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                    <EtDatePicker
                            label="Return Date"
                            onChange={(selectedDate) => {
                                setRdate(selectedDate);
                            }}
                            value={rdate}
                            // minDate={new Date("2023-08-20")}
                            // maxDate={new Date("2023-08-26")}

                            // other TextField props here, except InputProps
                        />
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Return time</InputLabel>
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
                    <TextField label="Refuel (Lts)" type="number" name="refuel" id="refuel" onChange={(e) => setDispatchReportData((prev) => ({...prev, refuel_liters: e.target.value}))}/>
                </FormControl>
            </Grid>
            
            {/*<Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Phone number" type="text" name="pnumber" id="pnumber" onChange={(e) => setDriverData((prev) => ({...prev, phone_number: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="License number" type="text" name="lnumber" id="lnumber" onChange={(e) => setDriverData((prev) => ({...prev, license_number: e.target.value}))}/>
                </FormControl>
            </Grid> */}

            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e)=> handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Create</Button>
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
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
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