import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import VehiclesTable from "./VehiclesTable";
import DriversTable from "./DriversTable";
import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ApprovalTable from "./ApprovalTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createApproval, fetchApprovals } from "../../redux/approval/approvalSlice";
import { fetchPendingRequests, fetchRequests } from "../../redux/request/requestSlice";
import { fetchUsers } from "../../redux/user/userSlice";
import dayjs from "dayjs";
import { updateRequest } from "../../redux/request/requestSlice";
import moment from 'moment';
const ApprovalContent = () => {
    const [value, setValue] = useState(dayjs('2022-04-17'));
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const formattedDate = moment().format('YYYY-MM-DD');
    const [approvalData, setApprovalData] = useState({
        request: '',
        manager: '',
        approval_date: formattedDate,
    });
    
    const requests = useSelector((state) => state.requests.pending_requests) ?? [];
    const managers = useSelector((state) => state.users.users) ?? [];
    useEffect(() => {
        dispatch(fetchPendingRequests());
        dispatch(fetchUsers());
    }, []);

    useEffect(() => {
        console.log(requests);
        // console.log(managers);
    }, [requests, managers]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [error, success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createApproval(approvalData)).then((res) => {
            // console.log(res.payload.fname);
            if (res.payload?.id) {
                setSuccess(true);
                dispatch(fetchApprovals());
            } else {
                setError(res.payload);
                console.log(res.payload);
            }
        }).catch((error) => {
            // Handle any errors from the first then block
            setError(error);
            console.log(error);
        });     
    }
    return <>
        {/* Recent Orders */}
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">New Approval</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Request</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Department"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setApprovalData((prev) => ({...prev, request: e.target.value}))}
                    >
                        {
                            requests.map((request) => (
                                <MenuItem value={request.id}>{` (${request.id}) ${request.request_date.slice(0, 10)}; ${request.user.fname} ${request.user.mname}; ${request.requested_vehicle_type}; ${request.destination}`}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}  md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Manager</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Department"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setApprovalData((prev) => ({...prev, manager: e.target.value}))}
                    >
                        {
                            managers.map((manager) => (
                                <MenuItem value={manager.id}>{`${manager.fname} ${manager.mname}`}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            label='Approval date'
                            value={value}
                            // onChange={(newValue) => setValue(newValue)}
                        />
                        </DemoContainer>
                    </LocalizationProvider>
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Approve</Button>
                    </FormControl>
                </form>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                {
                    success && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Request approved successfully!
                    </Alert>
                }
                { error && <Alert severity="error">{error}</Alert>} 
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <Typography variant="h4">Approvals</Typography>
        </Grid>
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <ApprovalTable />
        </Grid>
    </>

}

export default ApprovalContent;