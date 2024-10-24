import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signUp } from "../../redux/user/userSlice";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RefuelsTable from "./RefuelsTable";
import { createRefuel, fetchRefuels } from "../../redux/refuel/refuelSlice";
import { fetchVehicles } from "../../redux/vehicle/vehicleSlice";
import { createDepartment, fetchDepartments } from "../../redux/department/departmentSlice";
import DepartmentsTable from "./DepartmentsTable";


const DepartmentContent = () => {
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [rrdate, setRRdate] = useState(dayjs('2022-04-17'));
    const [rdate, setRdate] = useState(dayjs('2022-04-17'));
    const vehicles = useSelector((state) => state.vehicles.vehicles) ?? [];
    const [departmentData, setDepartmentData] = useState({
        dept_name: '',
        location: '',
        extension: '', 
        phone_number: ''
    });

    useEffect(() => {
        dispatch(fetchVehicles());
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
        dispatch(createDepartment(departmentData)).then((res) => {
            if (res.payload?.id) {
                setSuccess(true);
                dispatch(fetchDepartments());
            } else {
                setError(res.payload);
                console.log(res.payload);
            }
        }
    )}

    return <>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Department (ክፍል)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Name (የክፍሉ ስም)" type="text" name="dname" id="dname" onChange={(e) => setDepartmentData((prev) => ({ ...prev, dept_name: e.target.value }))} />
            </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Location (አድራሻ)" type="text" name="location" id="location" onChange={(e) => setDepartmentData((prev) => ({ ...prev, location: e.target.value }))} />
            </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Extension (ኤክስቴንሽን)" type="text" name="extension" id="extension" onChange={(e) => setDepartmentData((prev) => ({ ...prev, extension: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Phone no. (ስልክ)" type="text" name="pnumber" id="pnumber" onChange={(e) => setDepartmentData((prev) => ({ ...prev, phone_number: e.target.value }))} />
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
                        Department created successfully!
                </Alert>
            }
            { error && <Alert severity="error">{error}</Alert>} 
            {/* <Alert severity="info">This is an info Alert.</Alert>
            <Alert severity="warning">This is a warning Alert.</Alert> */}
        </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Departments</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <DepartmentsTable />
        </Grid>
    </>

}

export default DepartmentContent;