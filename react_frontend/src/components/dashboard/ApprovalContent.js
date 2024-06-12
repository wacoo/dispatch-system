import {
    Alert,
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createApproval, fetchApprovals } from "../../redux/approval/approvalSlice";
import { fetchPendingRequests } from "../../redux/request/requestSlice";
import { fetchUsers } from "../../redux/user/userSlice";
import ApprovalTable from "./ApprovalTable";
import dayjs from "dayjs";
import moment from 'moment';
import EtDatePicker from "mui-ethiopian-datepicker";

const ApprovalContent = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState(dayjs());
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [ddate, setDdate] = useState(null);
    const formattedDate = moment().format('YYYY-MM-DD');
    const [approvalData, setApprovalData] = useState({
        request: '',
        manager: '',
        approval_date: formattedDate,
    });

    const requests = useSelector((state) => state.requests.pending_requests.results) ?? [];
    const managers = useSelector((state) => state.users.users.results) ?? [];

    useEffect(() => {
        setApprovalData((prev) => ({
            ...prev,
            approval_date: new Date(ddate).toISOString().split('T')[0],
        }));
    }, [ddate ]);

    useEffect(() => {
        dispatch(fetchPendingRequests());
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [error, success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createApproval(approvalData))
            .then((res) => {
                if (res.payload?.id) {
                    setSuccess(true);
                    console.log(success);
                    dispatch(fetchApprovals());
                } else {
                    setError(res.payload);
                    // setSuccess(false);
                }
            })
        }

    return (
        <>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
                <Typography variant="h4">New Approval</Typography>
            </Grid>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
                <Grid item xs={12} md={6} lg={4}>
                    <FormControl fullWidth>
                        <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Request</InputLabel>
                        <Select
                            labelId="dept_lbl"
                            id="demo-simple-select"
                            label="Request"
                            sx={{ minWidth: '100%' }}
                            onChange={(e) => setApprovalData((prev) => ({ ...prev, request: e.target.value }))}
                        >
                            {requests.map((request) => (
                                <MenuItem key={request.id} value={request.id}>
                                    {` (${request.id}) ${request.request_date.slice(0, 10)}; ${request.user.fname} ${request.user.mname}; ${request.requested_vehicle_type}; ${request.destination}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <FormControl fullWidth>
                        <InputLabel id="manager_lbl" sx={{ marginBottom: '8px' }}>Manager</InputLabel>
                        <Select
                            labelId="manager_lbl"
                            id="manager-select"
                            label="Manager"
                            sx={{ minWidth: '100%' }}
                            onChange={(e) => setApprovalData((prev) => ({ ...prev, manager: e.target.value }))}
                        >
                            {managers.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {`${manager.fname} ${manager.mname}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                    <FormControl fullWidth>
                    <EtDatePicker
                            label="Approval Date"
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
                <Grid item xs={12} marginTop={2}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <Button variant="outlined" type="submit">Approve</Button>
                        </FormControl>
                    </form>
                </Grid>
                <Grid item xs={12} marginTop={2}>
                    {success && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Request approved successfully!
                    </Alert>}
                    {error && <Alert severity="error">{error}</Alert>}
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
                <Typography variant="h4">Approvals</Typography>
            </Grid>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
                <ApprovalTable />
            </Grid>
        </>
    );
};

export default ApprovalContent;