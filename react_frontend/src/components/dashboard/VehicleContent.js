import { Alert, Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import VehiclesTable from "./VehiclesTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createVehicle, fetchVehicles, updateVehicle } from "../../redux/vehicle/vehicleSlice";
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const VehicleContent = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [successUpdate, setSuccessUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState('');
    const [update, setUpdate] = useState(false);
    const [vehicleId, setVehicleId] = useState(null);
    const dispatch = useDispatch();
    const [vehicleData, setVehicleData] = useState({
        make: '',
        model: '',
        year: '',
        type: 'CAR',
        current_milage: '',
        license_plate: '',
        fuel_level: '',
        vehicle_status: 'AVAILABLE',
    })

    const [vehicleUpdateData, setUpdateVehicleData] = useState({
        vehicle_status: 'AVAILABLE',
    })

    const vehicles = useSelector((state) => state.vehicles.vehicles) ?? [];
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(vehicleData);
    //     dispatch(createVehicle(vehicleData));
    // }

    useEffect(() => {
        console.log(vehicleData);
    }, [dispatch]);

    const handleUpdate = (e) => {
        e.preventDefault();
        dispatch(updateVehicle({id: vehicleId, data: vehicleUpdateData})).then((res) => {
            if (res.payload?.id) {
                setSuccessUpdate(true);
                dispatch(fetchVehicles());
            } else {
                setErrorUpdate(res.payload);
                console.log(res.payload);
            }
        }).catch((error) => {
            // Handle any errors from the first then block
            setError(error);
            console.log(error);
        });
    }

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);
          setErrorUpdate('');
          setSuccessUpdate(false);
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [error, errorUpdate, success, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createVehicle(vehicleData)).then((res) => {
            if (res.payload?.id) {
                setSuccess(true);
                dispatch(fetchVehicles());
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
            <Typography variant="h4">New Vehicle</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Make</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Make"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setVehicleData((prev) => ({...prev, make: e.target.value}))}
                    >
                        <MenuItem value={'Toyota'}>Toyota</MenuItem>
                        <MenuItem value={'Ford'}>Ford</MenuItem>
                        <MenuItem value={'Fiat'}>Fiat</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Model" type="text" name="model" id="model" onChange={(e) => setVehicleData((prev) => ({...prev, model: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Year" type="number" name="year" id="year" onChange={(e) => setVehicleData((prev) => ({...prev, year: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Type</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Make"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setVehicleData((prev) => ({...prev, type: e.target.value}))}
                    >
                        <MenuItem value={'CAR'}>CAR</MenuItem>
                        <MenuItem value={'VAN'}>VAN</MenuItem>
                        <MenuItem value={'MINIVAN'}>MINIVAN</MenuItem>
                        <MenuItem value={'TRUCK'}>TRUCK</MenuItem>
                        <MenuItem value={'BIKE'}>BIKE</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Current milage" type="number" name="cmilage" id="cmilage" onChange={(e) => setVehicleData((prev) => ({...prev, current_milage: e.target.value}))}/>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="License plate" type="text" name="plate" id="plate" onChange={(e) => setVehicleData((prev) => ({...prev, license_plate: e.target.value}))}/>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Fuel level" type="number" name="fuel_level" id="fuel_level" onChange={(e) => setVehicleData((prev) => ({...prev, fuel_level: e.target.value}))}/>
                </FormControl>
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Vehicle Status</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Make"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setVehicleData((prev) => ({...prev, vehicle_status: e.target.value}))}
                    >
                        <MenuItem value={'AVAILABLE'}>AVAILABLE</MenuItem>
                        <MenuItem value={'IN_USE'}>IN USE</MenuItem>
                        <MenuItem value={'RESERVED'}>RESERVED</MenuItem>
                        <MenuItem value={'TRUCK'}>OUT OF SERVICE</MenuItem>
                    </Select>
                </FormControl>
            </Grid> */}
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e)=> handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Create</Button>
                    </FormControl>
                </form>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                {
                    success && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Vehicle created successfully!
                    </Alert>
                }
                { error && <Alert severity="error">{error}</Alert>} 
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <FormControlLabel control={<Switch />} label="Change vehicle status" onClick={() => setUpdate(!update)}/>
            </Grid>
        </Grid>

        { update && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Update Vehicle Status</Typography>
        </Grid> }
        { update && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Vehicle</InputLabel>
                    <Select
                        labelId="req_lbl"
                        id="user"
                        label="Vehicle"
                        sx={{ minWidth: '100%' }}
                        // Handle value, label, onChange
                        onChange={(e) => setVehicleId(e.target.value)}
                    >
                        {vehicles.map((vehicle) => (
                            <MenuItem key={vehicle.id} value={vehicle.id}>
                                {`(${vehicle.license_plate}) ${vehicle.make}, ${vehicle.model}, ${vehicle.type}`}
                            </MenuItem>
                        ))}
                        {/* <MenuItem value={20}>Ashenafi</MenuItem>
                        <MenuItem value={30}>Yonas</MenuItem> */}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Status</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Make"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setUpdateVehicleData((prev) => ({...prev, vehicle_status: e.target.value}))}
                    >
                        <MenuItem value={'AVAILABLE'}>AVAILABLE</MenuItem>
                        <MenuItem value={'IN_USE'}>IN USE</MenuItem>
                        <MenuItem value={'RESERVED'}>RESERVED</MenuItem>
                        <MenuItem value={'OUT_OF_SERVICE'}>OUT OF SERVICE</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e)=> handleUpdate(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Update</Button>
                    </FormControl>
                </form>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                {
                    successUpdate && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Vehicle updated successfully!
                    </Alert>
                }
                { errorUpdate && <Alert severity="error">{errorUpdate}</Alert>} 
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
         </Grid>}

        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <Typography variant="h4">Vehicles</Typography>
        </Grid>
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <VehiclesTable />
        </Grid>
    </>

}

export default VehicleContent;