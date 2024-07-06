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
import EtDatePicker from "mui-ethiopian-datepicker";


const RefuelContent = () => {
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [rrdate, setRRdate] = useState(null);
    const [rdate, setRdate] = useState(null);
    const vehicles = useSelector((state) => state.vehicles.vehicles.results) ?? [];
    const [refuelData, setRefuelData] = useState({
        vehicle: '1',
        refuel_request_date: '', 
        refuel_date: '', 
        nafta: '',
        benzine: '',        
        km_during_refuel: '',
        km_during_previous_refuel: '',
        km_per_liter: '',
        current_fuel_level: '',
        remark: '',
    });

    useEffect(() => {
        setRefuelData(prevState => ({
            ...prevState,
            refuel_request_date: new Date(rdate).toISOString().split('T')[0],
            refuel_date: new Date(rrdate).toISOString().split('T')[0]

        }));
    }, [rdate, rrdate]);

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
        dispatch(createRefuel(refuelData)).then((res) => {
            console.log(refuelData);
            if (res.payload?.id) {
                setSuccess(true);
                dispatch(fetchRefuels());
            } else {
                // setError(res.payload);
                console.log(res.payload);
            }
        }
    )}

    return <>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Refuel (ነዳጅ ሙሊት)</Typography>
        </Grid>

        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                        <Autocomplete
                            options={vehicles}
                            getOptionLabel={(option) => `${option.license_plate}; ${option.make} ${option.model}`}
                            onChange={(event, value) => setRefuelData((prev) => ({ ...prev, vehicle: value ? value.id : '' }))}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Vehicle (ተሽከርካሪ)"
                                variant="outlined"
                                sx={{ minWidth: '100%' }}
                                />
                            )}
                            />
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4} sx={{ mt: '1px' }}>
            <FormControl fullWidth>
                <EtDatePicker
                        label="Refuel date (የተሞላበት ቀን)"
                        onChange={(selectedDate) => {
                            setRRdate(selectedDate);
                        }}
                        value={rrdate}
                    />
            </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <EtDatePicker
                        label="Refuel date (የተሞላበት ቀን)"
                        onChange={(selectedDate) => {
                            setRdate(selectedDate);
                        }}
                        value={rdate}
                    />
            </FormControl>
        </Grid>


        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Nafta (ናፍጣ)" type="number" name="nafta" id="nafta" onChange={(e) => setRefuelData((prev) => ({ ...prev, nafta: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Benzine (ቤንዚን)" type="number" name="benzine" id="benzine" onChange={(e) => setRefuelData((prev) => ({ ...prev, benzine: e.target.value }))} />
            </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="KM during refuel (ኪ/ሜ በሙሊት ጊዜ)" type="number" name="fname" id="fname" onChange={(e) => setRefuelData((prev) => ({ ...prev, km_during_refuel: e.target.value }))} />
            </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="KM during previous refuel (ኪ/ሜ የበፊት ሙሊት ጊዜ)" type="number" name="fname" id="fname" onChange={(e) => setRefuelData((prev) => ({ ...prev, km_during_previous_refuel: e.target.value }))} />
            </FormControl>
        </Grid>


        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="KM per liter (በሊትር ኪ/ሜ)" type="number" name="fname" id="fname" onChange={(e) => setRefuelData((prev) => ({ ...prev, km_per_liter: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <FormControl fullWidth>
                <TextField label="Current fuel level (አሁን ያለዉ የነዳጅ መጠን)" type="number" name="fname" id="fname" onChange={(e) => setRefuelData((prev) => ({ ...prev, current_fuel_level: e.target.value }))} />
            </FormControl>
        </Grid>
        <Grid item xs={12}>
            <FormControl fullWidth>
                <TextField label="Remark (ማስታወሻ)" type="text" name="fname" id="fname" multiline onChange={(e) => setRefuelData((prev) => ({ ...prev, remark: e.target.value }))} />
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
                            Refuel created successfully!
                    </Alert>
                }
                { error && <Alert severity="error">{error}</Alert>} 
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Refuels</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <RefuelsTable />
        </Grid>
    </>

}

export default RefuelContent;