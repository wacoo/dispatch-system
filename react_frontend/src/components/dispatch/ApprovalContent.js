import {
    Alert,
    Autocomplete,
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
import { fetchApprovers, fetchUsers } from "../../redux/user/userSlice";
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
    const managers = useSelector((state) => state.users.approvers) ?? [];

    useEffect(() => {
        setApprovalData((prev) => ({
            ...prev,
            approval_date: new Date(ddate).toISOString().split('T')[0],
        }));
    }, [ddate ]);

    useEffect(() => {
        dispatch(fetchPendingRequests());
        dispatch(fetchApprovers());
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
                    dispatch(fetchApprovals());
                    dispatch(fetchPendingRequests());
                } else {
                    setError(res.payload);
                    // setSuccess(false);
                }
            })
        }

    return (
        <>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
                <Typography variant="h4">Approval (የሃላፊ ፍቃድ)</Typography>
            </Grid>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
                <Grid item xs={12} md={6} lg={4}>
                    <FormControl fullWidth>
                    <Autocomplete
                            options={requests}
                            getOptionLabel={(request) => ` (${request.id}) ${request.request_date.slice(0, 10)}; ${request.user.fname} ${request.user.mname}; ${request.requested_vehicle_type}; ${request.destination}`}
                            onChange={(event, value) => setApprovalData((prev) => ({ ...prev, request: value ? value.id : '' }))}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Request (የመኪና ጥያቄ)"
                                variant="outlined"
                                sx={{ minWidth: '100%' }}
                                />
                            )}
                        />                        
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <FormControl fullWidth>
                        <Autocomplete
                            options={managers}
                            getOptionLabel={(manager) => `(${manager.username}) ${manager.fname} ${manager.mname}`}
                            onChange={(event, value) => setApprovalData((prev) => ({ ...prev, manager: value ? value.id : '' }))}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Approver (ፍቃድ ሰጪ)"
                                variant="outlined"
                                sx={{ minWidth: '100%' }}
                                />
                            )}
                        /> 
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                    <FormControl fullWidth>
                    <EtDatePicker
                            label="Approval Date (ቀን)"
                            onChange={(selectedDate) => {
                                setDdate(selectedDate);
                            }}
                            value={ddate}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} marginTop={2}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <Button variant="outlined" type="submit">Approve (ፍቀድ)</Button>
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