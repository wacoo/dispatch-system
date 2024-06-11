import { Alert, Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material"
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
import { convertToEthiopianDateTime } from "../../functions/date";
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
    const approved_requests = useSelector((state) => state.requests.approved_requests) ?? [];
    const drivers = useSelector((state) => state.driver.drivers) ?? [];
    const vehicles = useSelector((state) => state.vehicles.vehicles) ?? [];
    const dispatchers = useSelector((state) => state.users.users) ?? [];
    const isLoadingRequests = useSelector((state) => state.requests.isLoading);
    const isLoadingDrivers = useSelector((state) => state.driver.isLoading);
    const isLoadingVehicles = useSelector((state) => state.vehicles.isLoading);

    const vehicleRequests = useSelector((state) => state.requests.vahicleRequests) ?? [];
    // const requestsByDispatch = useSelector((state) => state.dispatches.requestsByDispatchId) ?? [];
    const disp = useSelector((state) => state.dispatches.dispatchById) ?? {};
    // const prevDisp = usePrevious(disp);

    useEffect(() => {
        dispatch(fetchApprovedRequests());
        dispatch(fetchDrivers());
        dispatch(fetchVehicles());
        dispatch(fetchUsers());
    }, []);

    // function usePrevious(value) {
    //     const ref = useRef();
    //     useEffect(() => {
    //         ref.current = value;
    //     }, [value]);
    //     return ref.current;
    // }


    // useEffect(() => {
    //     console.log(approved_requests);
    //     console.log(drivers);
    //     console.log(vehicles);
    //     console.log(dispatchers);
    //     console.log(vehicleRequests);
    // }, [approved_requests, drivers, vehicles, dispatchers, vehicleRequests]);

    useEffect(() => {
        setDispatchData((prev) => ({
            ...prev,
            departure_date: new Date(ddate).toISOString().split('T')[0],
            return_date_est: new Date(rdate).toISOString().split('T')[0]
        }));
    }, [ddate, rdate]);

    // useEffect(() => {
    //     dispatch(setRdateValue(new Date(rdate).toISOString()));
    // }, [rdate]);

    // useEffect(() => {
    //     console.log(ddateValue);
    //     console.log(rdateValue);
    // }, [ddateValue, rdateValue]);


    useEffect(() => {
        // console.log(isLoading);
        // console.log(users);
        console.log(ddateValue);
        console.log(rdateValue);
    }, [ddateValue, rdateValue]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);          
          dispatch(fetchDispatchById({dispatchId: id})); 
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [error, success]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getTodayAsString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function convertTo24HourFormat(time12h) {
        var [time, period] = time12h.split(' ');
        var [hours, minutes] = time.split(':');
        var seconds = '00'; // Adding seconds part
        
        if (period === 'PM' && hours !== '12') {
            hours = String(Number(hours) + 12);
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }
        
        return `${hours}:${minutes}:${seconds}`;
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

      
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(dispatchData);
        dispatch(createDispatch(dispatchData)).then((res) => {
            // console.log(res.payload.fname);
            if (res.payload?.id) {
                // vehicleRequests.forEach((request) => {
                //     dispatch(fetchRequestsByByDispatch({id: request, dispatch: res.payload?.id})).then((reslt) => {

                //     });
                //     dispatch(clearRequests());
                // })
                const fetchRequests = vehicleRequests.map((request) =>
                    dispatch(fetchRequestsByByDispatch({ id: request, dispatch: res.payload?.id }))
                );
                
                console.log(fetchRequests);
                Promise.all(fetchRequests).then((results) => {
                    // All fetchRequestsByByDispatch actions have completed
                    dispatch(clearRequests());
                    //dispatch(fetchRequestsByDispatch({dispatchId: res.payload.id}));
                    setId(res.payload?.id);
                    setSuccess(true);              
                    //generateReport('wage', {});
                    console.log(res.payload);
                    //generateReport('dispatch', res.payload);
                    let data = {...res.payload};
        
                    // Step 2: Create a deep copy of vehicle_requests
                    data.vehicle_requests = disp.vehicle_requests?.map(req => ({ ...req }));
        
                    // if (data && data.vehicle_requests){                        
                    //     data.vehicle_requests.forEach(request => {
                    //         dispatch(updateRequest({id: request.id, status: 'ACTIVE'}));
                    //     });
                    // }
                    // Step 3: Assign the first vehicle request to data.request
                    data.request = data.vehicle_requests[0];
                    data.assigned_date = convertToEthiopianDateTime(data.assigned_date.split('T')[0]);
                    data.departure_date = convertToEthiopianDateTime(data.departure_date, data.departure_time_est);
                    data.return_date_est = '';
                    data.return_date_act = '';
                    data.departure_milage = '';
                    data.return_milage = '';
        
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
                }).catch((error) => {
                    // Handle any errors if necessary
                    console.error('Error fetching requests:', error);
                });
                
            } else {
                setSuccess(false);
                setError(res.payload);
                console.log(res.payload);
            }
        }).catch((error) => {
            // Handle any errors from the first then block
            setError(error);
            console.log(error);
        });
    }

    const handleAddRequest = (e) => {
        e.preventDefault();
        dispatch(addRequest(vehicleRequest));
    }
    if (isLoadingRequests || isLoadingDrivers || isLoadingVehicles) {
        return <h1>Loading...</h1>
    }

    const times = [{'1:00 (ከጠዋቱ)': '7:00 AM'}, {'2:00 (ከጠዋቱ)': '2:00 AM'}, {'3:00 (ከጠዋቱ)': '9:00 AM'}, {'4:00 (ከረፋዱ)': '10:00 AM'}, {'5:00 (ከረፋዱ)': '11:00 AM'}, {'6:00 (ከቀኑ)': '12:00 AM'}, {'7:00 (ከቀኑ)': '1:00 PM'}, {'8:00 (ከቀኑ)': '2:00 PM'}, {'9:00 (ከቀኑ)': '3:00 PM'}, {'10:00 (ከቀኑ)': '4:00 PM'}, {'11:00 (ከአመሻሹ)': '5:00 PM'}, {'12:00 (ከአመሻሹ)': '6:00 PM'}, {'1:00 (ከምሽቱ)': '7:00 PM'}, {'2:00 (ከምሽቱ)': '8:00 PM'}, {'3:00 (ከምሽቱ)': '9:00 PM'}, {'4:00 (ከምሽቱ)': '10:00 PM'}, {'5:00 (ከምሽቱ)': '11:00 PM'}, {'6:00 (ከለሊቱ)': '12:00 PM'}, {'7:00 (ከለሊቱ)': '1:00 AM'}, {'8:00 (ከለሊቱ)': '2:00 AM'}, {'9:00 (ከለሊቱ)': '3:00 AM'}, {'10:00 (ከለሊቱ)': '4:00 AM'}, {'11:00 (ከለሊቱ)': '5:00 AM'}, {'12:00 (ክጥዋቱ)': '6:00 AM'}];
    
    return <>
        {/* Recent Orders */}

        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">New Vehicle Dispatch</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
        <Typography variant="h5">Add requests</Typography>
        <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Request</InputLabel>
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
                                <MenuItem value={request.id}>{`(${request.id}) ${request.request_date.slice(0, 10)}; ${request.user.fname} ${request.user.mname}; ${request.user.department}; ${request.destination}`}</MenuItem>
                            ))
                        }
                    </Select>
                    {/* <Autocomplete
                            options={approved_requests}
                            getOptionLabel={(option) => `(${option.id}) ${option.request_date.slice(0, 10)}; ${option.user.fname} ${option.user.mname}; ${option.user.department}; ${option.destination}`}
                            onChange={(event, value) => setVehicleRequest(value ? value.id : '' )}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Request"
                                variant="outlined"
                                sx={{ minWidth: '100%' }} // Ensure select is full width
                                />
                            )}
                    /> */}
                </FormControl>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleAddRequest(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Add REQUEST</Button>
                    </FormControl>
                </form>
            </Grid>

        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Vehicle</InputLabel>
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
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Driver</InputLabel>
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
                        {/* <MenuItem value={20}>Dinberu</MenuItem>
                        <MenuItem value={30}>Negessie</MenuItem> */}
                    </Select>
                </FormControl>
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']}>
                        <DatePicker
                        label='Assigned date'
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                        />
                        </DemoContainer>
                    </LocalizationProvider>
                </FormControl>
            </Grid> */}
            <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                <EtDatePicker
                        label="Departure Date"
                        onChange={(selectedDate) => {
                            setDdate(selectedDate);
                        }}
                        value={ddate}
                        // minDate={new Date("2023-08-20")}
                        // maxDate={new Date("2023-08-26")}

                        // other TextField props here, except InputProps
                    />
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
            {/* <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Departure milage" type="number" name="dmilage" id="dmilage" onChange={(e) => setDispatchData((prev) => ({...prev, departure_milage: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Departure fuel level" type="number" name="dfuel" id="dfuel" onChange={(e) => setDispatchData((prev) => ({...prev, departure_fuel_level: e.target.value}))}/>
                </FormControl>
            </Grid> */}
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
            {/* <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Return milage" type="number" name="rmilage" id="rmilage" onChange={(e) => setDispatchData((prev) => ({...prev, return_milage: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Return fuel level" type="number" name="rfuel" id="rfuel" onChange={(e) => setDispatchData((prev) => ({...prev, return_fuel_level: e.target.value}))}/>
                </FormControl>
            </Grid> */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Dispatcher</InputLabel>
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
                        {/* <MenuItem value={20}>Ashenafi</MenuItem>
                        <MenuItem value={30}>Yonas</MenuItem> */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Create</Button>
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

export default DispatchContent;