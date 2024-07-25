import { Alert, Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
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


const MonthlyPlan = () => {
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [rrdate, setRRdate] = useState(dayjs('2022-04-17'));
    const [rdate, setRdate] = useState(dayjs('2022-04-17'));
    const [vehicleId, setVehicleId] = useState(null);
    const vehicles = useSelector((state) => state.vehicles.vehicles.results) ?? [];
    const [monthlyPlanData, setMonthlyPlanData] = useState({
        vehicle: '',
        month: '',
        km: '', 
        liters: ''
    });

    const months = ['መስከረም (September)', 'ጥቅምት (October)', 'ህዳር (November)', 'ታህሳስ (December)', 'ጥር (January)', 'የካቲት (February)', 'መጋቢት (March)', 'ሚያዚያ (April)', 'ግንቦት (May)', 'ሰኔ (June)', 'ህምሌ (July)', 'ነሃሴ (August)'];
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
        // dispatch(createMonthlyPlan(monthlyPlanData)).then((res) => {
        //     if (res.payload?.id) {
        //         setSuccess(true);
        //         dispatch(fetchMonthlyPlans());
        //     } else {
        //         setError(res.payload);
        //         console.log(res.payload);
        //     }
        // }
    //)
}

    return <>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Plan (ክፍል)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    {/* <InputLabel id="vehicle" sx={{ marginBottom: '8px' }}>Vehicle (ተሽከርካሪ)</InputLabel> */}
                    <Autocomplete
                        options={vehicles}
                        getOptionLabel={(vehicle) => 
                            `(${vehicle.license_plate}) ${vehicle.make}; ${vehicle.model}; ${vehicle.type}`}
                        renderInput={(params) => (
                            <TextField {...params} label="Vehicle" variant="outlined" sx={{ minWidth: '100%' }} />
                        )}
                        onChange={(event, newValue) => setMonthlyPlanData((prev) => ({ ...prev, vehicle: newValue }))}
                        isOptionEqualToValue={(option, value) => option.id === value}

                        />
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <Autocomplete
                    options={months} // Assuming 'months' is an array of month objects or strings
                    getOptionLabel={(month) => month} // If months is an array of strings
                    renderInput={(params) => (
                        <TextField {...params} label="Month (ወር)" variant="outlined" sx={{ minWidth: '100%' }} />
                    )}
                    onChange={(event, newValue) => setMonthlyPlanData((prev) => ({ ...prev, month: newValue }))}
                    isOptionEqualToValue={(option, value) => option === value}
                    />
                </FormControl>
            </Grid>

        {/* <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Extension (ኤክስቴንሽን)" type="text" name="extension" id="extension" onChange={(e) => setDepartmentData((prev) => ({ ...prev, extension: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Phone no. (ስልክ)" type="text" name="pnumber" id="pnumber" onChange={(e) => setDepartmentData((prev) => ({ ...prev, phone_number: e.target.value }))} />
            </FormControl>
        </Grid> */}
        
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

export default MonthlyPlan;