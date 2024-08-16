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
import { createMonthlyPlan, createRefuel, fetchActivePPL, fetchMonthlyPlan, fetchRefuels } from "../../redux/refuel/refuelSlice";
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
    const ppls = useSelector((state) => state.refuels.activePPLs.results) ?? [];
    const [monthlyPlanData, setMonthlyPlanData] = useState({
        vehicle: '',
        month: '',
        benzine: 0, 
        nafta: 0,
        benzine_cost: 0,
        nafta_cost: 0,
        oil_lts: 0,
        oil_cost: 0,
        tire_maint_cnt: 0,
        tire_maint_cost: 0
    });

    const months = ['መስከረም (September)', 'ጥቅምት (October)', 'ህዳር (November)', 'ታህሳስ (December)', 'ጥር (January)', 'የካቲት (February)', 'መጋቢት (March)', 'ሚያዚያ (April)', 'ግንቦት (May)', 'ሰኔ (June)', 'ህምሌ (July)', 'ነሃሴ (August)'];
    useEffect(() => {
        dispatch(fetchVehicles());
        dispatch(fetchActivePPL());
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [error, success]);

    useEffect(() => {
        setMonthlyPlanData(prevData => {
            const lastPpl = ppls.length > 0 ? ppls[ppls.length - 1] : 0;
            return {
                ...prevData,
                nafta_cost: (prevData.nafta * lastPpl.nafta),
                benzine_cost: (prevData.benzine * lastPpl.benzine)
            };
        });
    }, [monthlyPlanData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('X', monthlyPlanData, ppls);
        console.log('X', monthlyPlanData, ppls);
        dispatch(createMonthlyPlan(monthlyPlanData)).then((res) => {
            if (res.payload?.id) {
                setSuccess(true);
                dispatch(fetchMonthlyPlan());
            } else {
                setError(res.payload);
                console.log(res.payload);
            }
        }
    )
}

    return <>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Monthly plan (ወርሃዊ እቅድ)</Typography>
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
                        onChange={(event, newValue) => setMonthlyPlanData((prev) => ({ ...prev, vehicle: newValue.id }))}
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

        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Benzine (ቤንዚን)" type="number" name="benzine" id="benzine" onChange={(e) => setMonthlyPlanData((prev) => ({ ...prev, benzine: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Nafta (ናፍታ)" type="number" name="nafta" id="nafta" onChange={(e) => setMonthlyPlanData((prev) => ({ ...prev, nafta: e.target.value }))} />
            </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Oil in lts (ዘይት በሊትር)" type="number" name="oil" id="oil" onChange={(e) => setMonthlyPlanData((prev) => ({ ...prev, oil_lts: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Oil total cost (አጠቃላይ ዋጋ)" type="number" name="oil_cost" id="oil_cost" onChange={(e) => setMonthlyPlanData((prev) => ({ ...prev, oil_cost: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Tire maint. (የጎማ ጥገና ቁጥር)" type="number" name="tire_maint" id="tire_maint" onChange={(e) => setMonthlyPlanData((prev) => ({ ...prev, tire_maint_cnt: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Tire maint. cost (አጠቃላይ ዋጋ)" type="number" name="tire_maint_cost" id="tire_maint_cost" onChange={(e) => setMonthlyPlanData((prev) => ({ ...prev, tire_maint_cost: e.target.value }))} />
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
                        Plan created successfully!
                </Alert>
            }
            { error && <Alert severity="error">{error}</Alert>} 
            {/* <Alert severity="info">This is an info Alert.</Alert>
            <Alert severity="warning">This is a warning Alert.</Alert> */}
        </Grid>
        </Grid>
    </>

}

export default MonthlyPlan;