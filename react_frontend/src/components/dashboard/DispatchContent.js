import { Alert, Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import RequestsTable from "./RequestsTable";
import DispatchTable from "./DispatchTable";
import { createDispatch, fetchDispatchById, fetchDispatches, setDdateValue, setRdateValue } from "../../redux/dispatch/dispatchSlice";
import { useEffect, useState, useRef } from "react";
import { clearRequests, fetchApprovedRequests, fetchRequests, fetchRequestsByByDispatch, fetchRequestsByDispatch, updateRequest } from "../../redux/request/requestSlice";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import jsreport from 'jsreport-browser-client-dist'
import { DatePicker } from "@mui/x-date-pickers";
import {fetchDrivers } from "../../redux/driver/driverSlice";
import { fetchVehicles } from "../../redux/vehicle/vehicleSlice";
import { fetchUsers } from "../../redux/user/userSlice";
// import { Viewer } from '@grapecity/activereports-react';
import { addRequest } from '../../redux/request/requestSlice';
import EtDatePicker from "mui-ethiopian-datepicker";
import { times, convertTo24HourFormat, convertToEthiopianDateTime } from "../../functions/date";
// import DispatchReport from "../reports/DispatchReport";


const DispatchContent = () => {
    const [value, setValue] = useState(dayjs(getTodayAsString()));
    const [ddate, setDdate] = useState(null);
    const [rdate, setRdate] = useState(null);
    
    const [dtime, setDtime] = useState('12: 00 AM');
    const [rtime, setRtime] = useState('12: 00 AM');
    const ddateValue = useSelector((state) => state.dispatches.ddateValue);
    const rdateValue = useSelector((state) => state.dispatches.rdateValue);
    const [dispatchData, setDispatchData] = useState({
        assigned_driver: '',
        assigned_vehicle: '',
        assigned_date: new Date().toISOString(),
        departure_date: '',
        departure_time_est: '00:00:00',
        return_date_est: '',
        return_time_est: '00:00:00',
        dispatcher: '',
        refuel_liters: 0.0
    });

    const [dispatchRequests, setDispatchRequests] = useState([]);
    const [vehicleRequest, setVehicleRequest] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [id, setId] = useState('');
    const dispatch = useDispatch();
    const approved_requests = useSelector((state) => state.requests.approved_requests.results) ?? [];
    const drivers = useSelector((state) => state.driver.drivers.results) ?? [];
    const vehicles = useSelector((state) => state.vehicles.vehicles.results) ?? [];
    const dispatchers = useSelector((state) => state.users.users.results) ?? [];
    const isLoadingRequests = useSelector((state) => state.requests.isLoading);
    const isLoadingDrivers = useSelector((state) => state.driver.isLoading);
    const isLoadingVehicles = useSelector((state) => state.vehicles.isLoading);

    const vehicleRequests = useSelector((state) => state.requests.vahicleRequests) ?? [];
    useEffect(() => {
        dispatch(fetchApprovedRequests());
        dispatch(fetchDrivers());
        dispatch(fetchVehicles());
        dispatch(fetchUsers());
    }, []);

    useEffect(() => {
        setDispatchData((prev) => ({
            ...prev,
            departure_date: new Date(ddate).toISOString().split('T')[0],
            return_date_est: new Date(rdate).toISOString().split('T')[0]
        }));
    }, [ddate, rdate]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);          
          dispatch(fetchDispatchById({dispatchId: id})); 
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [error, success]);

    function getTodayAsString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    

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

      
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await dispatch(createDispatch(dispatchData));
    
            if (res.payload?.id) {
                const fetchRequests = [...vehicleRequests];
                dispatch(clearRequests());
                setId(res.payload?.id);
                setSuccess(true);
                
                let data = {...res.payload};
    
                data.vehicle_requests = fetchRequests?.map(req => ({ ...req }));
    
                if (data && data.vehicle_requests){                        
                    data.vehicle_requests.forEach(request => {
                        dispatch(updateRequest({id: request.id, status: 'ACTIVE', dispatch: data.id}));
                    });
                }
    
                data.request = data.vehicle_requests[0];
                data.assigned_date = convertToEthiopianDateTime(data.assigned_date.split('T')[0]);
                data.departure_date = convertToEthiopianDateTime(data.departure_date, data.departure_time_est);
                data.return_date_est = '';
                data.return_date_act = '';
                data.departure_milage = '';
                data.return_milage = '';
    
                if (Array.isArray(data.vehicle_requests)) {
                    data.vehicle_requests.forEach((req, idx) => {
                        req.no = idx + 1;
                    });
                } else {
                    console.error("data.vehicle_requests is not an array");
                }
    
                // Await the generateReport calls
                await generateReport('dispatch', data);
                // await generateReport('wage', {});
    
            } else {
                setSuccess(false);
                setError(res.payload);
            }
        } catch (error) {
            setError(error);
        }
    };

    const handleAddRequest = (e) => {
        e.preventDefault();
        dispatch(addRequest(vehicleRequest));
    }
    if (isLoadingRequests || isLoadingDrivers || isLoadingVehicles) {
        return <h1>Loading...</h1>
    }

    
    return <>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Vehicle Dispatch (የተሽከርካሪ ስምሪት)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
        <Typography variant="h5">Add requests (የተሽከርካሪ ጥያቄዎችን)</Typography>
        <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Request (ጥያቄ)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Select Request"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setVehicleRequest(e.target.value)}
                    >
                        {
                            approved_requests.map((request) => (
                                <MenuItem value={request}>{`(${request.id}) ${request.request_date.slice(0, 10)}; ${request.user.fname} ${request.user.mname}; ${request.user.department}; ${request.destination}`}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleAddRequest(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Add REQUEST</Button>
                    </FormControl>
                </form>
            </Grid>

            { vehicleRequests.length > 0 && <Table size="small" sx={{ margin: '12px', marginLeft: '24px'}}>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                        <TableCell>Requester</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Destination</TableCell>
                    </TableRow>
                </TableHead>
            <TableBody>
                {vehicleRequests.map((request) => (
                    <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{`${request.user.fname} ${request.user.mname}`}</TableCell>
                        <TableCell>{request.user.department}</TableCell>
                        <TableCell>{request.destination}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>}

        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Vehicle (ተሽከርካሪ)</InputLabel>
                    <Select
                        labelId="vehicle"
                        id="vehicle"
                        label="Select Vehicle"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchData((prev) => ({...prev, assigned_vehicle: e.target.value}))}
                    >
                        {
                            vehicles.map((vehicle) => (
                                <MenuItem value={vehicle.id}>{`(${vehicle.id}) ${vehicle.license_plate}; ${vehicle.make} ${vehicle.model}; ${vehicle.type}`}</MenuItem>
                            ))
                        
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Driver (ሹፌር)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Select Driver"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchData((prev) => ({...prev, assigned_driver: e.target.value}))}
                    >
                        {
                            drivers.map((driver) => (
                                <MenuItem value={driver.id}>{`(${driver.license_number}) ${driver.fname} ${driver.mname}`}</MenuItem>
                            ))
                        
                        }
                        
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                <EtDatePicker
                        label="Departure Date (መነሻ ቀን)"
                        onChange={(selectedDate) => {
                            setDdate(selectedDate);
                        }}
                        value={ddate}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Departure time (መነሻ ሰዓት)</InputLabel>
                    <Select
                        labelId="Depature time"
                        id="departure_time"
                        label="Select Vehicle"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchData((prev) => ({...prev, departure_time_est: convertTo24HourFormat(e.target.value)}))}
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
            
            <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                    <EtDatePicker
                            label="Return Date (መመለሻ ቀን)"
                            onChange={(selectedDate) => {
                                setRdate(selectedDate);
                            }}
                            value={rdate}
                        />
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Return time (መመለሻ ሰዓት)</InputLabel>
                    <Select
                        labelId="Return time"
                        id="return_time"
                        label="Return time"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchData((prev) => ({...prev, return_time_est: convertTo24HourFormat(e.target.value)}))}
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
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Dispatcher (ያሰማራዉ)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="user"
                        label="Department"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setDispatchData((prev) => ({ ...prev, dispatcher: e.target.value }))}
                    >
                        {dispatchers.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {`${user.fname} ${user.mname}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Create (ፍጠር)</Button>
                    </FormControl>
                </form>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                {
                    success && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Dispatch sent successfully!.
                    </Alert>
                }
                {error && <Alert severity="error">{error}</Alert>}
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

export default DispatchContent;