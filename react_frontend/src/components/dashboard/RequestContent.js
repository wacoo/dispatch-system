import { Alert, Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import RequestsTable from "./RequestsTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearDateValue, createRequest, fetchRequests } from "../../redux/request/requestSlice";
import { fetchUsers } from "../../redux/user/userSlice";
import dayjs from "dayjs";
import EtDatePicker from "mui-ethiopian-datepicker";
import { convertTo24HourFormat, times } from "../../functions/date";


const RequestContent = () => {
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');
    //Eth Date   
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    
    const [requestData, setRequestData] = useState({
        user: '',
        request_date: new Date().toISOString(),
        description: '',
        requested_vehicle_type: '',
        destination: '',
        duration_from: fromValue,
        duration_time_from: fromValue,
        duration_to: toValue,
        duration_time_to: toValue,
        status: 'PENDING',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users.results) ?? [];
    const isLoading = useSelector((state) => state.users.isLoading);

    useEffect(() => {
        setRequestData(prevData => ({
            ...prevData,
            duration_from: new Date(from).toISOString(),
            duration_to: new Date(to).toISOString()
        }));
    }, [from, to]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [error, success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(requestData);
        dispatch(createRequest(requestData)).then((res) => {
            if (res.payload?.id) {
                setSuccess(true);
                console.log(res.payload);
                dispatch(fetchRequests());
            } else {
                setError(res.payload);
                console.log(res.payload);
            }
        }).catch((error) => {
            setError(error);
            console.log(error);
        });
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }
    return <>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Vehicle Request (የተሽከርካሪ ጥያቄ)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <Autocomplete
                            options={users}
                            getOptionLabel={(option) => `${option.fname} ${option.mname}`}
                            onChange={(event, value) => setRequestData((prev) => ({ ...prev, user: value ? value.id : '' }))}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Requester (ጠያቂ)"
                                variant="outlined"
                                sx={{ minWidth: '100%' }}
                                />
                            )}
                        />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Vehicle type (የተሽከርካሪ አይነት)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Vehicle type"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setRequestData((prev) => ({ ...prev, requested_vehicle_type: e.target.value }))}
                    >
                        <MenuItem value={'BIKE'}>MOTOR BIKE (ሞተር)</MenuItem>
                        <MenuItem value={'CAR'}>CAR (መኪና)</MenuItem>
                        <MenuItem value={'VAN'}>VAN (ቫን)</MenuItem>
                        <MenuItem value={'MINIBUS'}>MINIBUS (ሚኒባስ)</MenuItem>
                        <MenuItem value={'BUS'}>BUS (ባስ)</MenuItem>
                        <MenuItem value={'TRUCK'}>TRUCK (የጭነት)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Destination (መድረሻ)" type="text" name="dest" id="dest" onChange={(e) => setRequestData((prev) => ({ ...prev, destination: e.target.value }))} />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <EtDatePicker
                        label="Duration from (ቆይታ ከ)"
                        onChange={(selectedDate) => {
                            setFrom(selectedDate);
                        }}
                        value={from}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Time (ሰዓት)</InputLabel>
                    <Select
                        labelId="Time"
                        id="time"
                        label="time"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setRequestData((prev) => ({...prev, duration_time_from: convertTo24HourFormat(e.target.value)}))}
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
                    <EtDatePicker
                        label="Duration to (ቆይታ እስከ)"
                        onChange={(selectedDate) => {
                            setTo(selectedDate);
                        }}
                        value={to}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Time (ሰዓት)</InputLabel>
                    <Select
                        labelId="Time"
                        id="time"
                        label="time"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setRequestData((prev) => ({...prev, duration_time_to: convertTo24HourFormat(e.target.value)}))}
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
           
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <TextField label="Description (ማብራርያ)" type="text" name="desc" id="desc" multiline onChange={(e) => setRequestData((prev) => ({ ...prev, description: e.target.value }))} />
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
                        Request sent successfully, please wait for approval.
                    </Alert>
                }
                {error && <Alert severity="error">{error}</Alert>}
            </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Requests</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <RequestsTable />
        </Grid>
    </>

}

export default RequestContent;