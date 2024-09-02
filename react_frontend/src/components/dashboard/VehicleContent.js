import { Alert, Autocomplete, Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import VehiclesTable from "./VehiclesTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMake, createVehicle, fetchMakes, fetchVehicles, updateVehicle } from "../../redux/vehicle/vehicleSlice";
import { fetchActivePPL } from "../../redux/refuel/refuelSlice";
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const VehicleContent = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [successUpdate, setSuccessUpdate] = useState(false);
    const [errorUpdate, setErrorUpdate] = useState('');
    const [successUpdateKMPL, setSuccessUpdateKMPL] = useState(false);
    const [errorUpdateKMPL, setErrorUpdateKMPL] = useState('');
    const [successMake, setSuccessMake] = useState(false);
    const [errorMake, setErrorMake] = useState('');
    const [update, setUpdate] = useState(false);
    const [updateKMPL, setUpdateKMPL] = useState(false);
    const [addMake, setAddMake] = useState(false);
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

    const [vehicleUpdateKMPL, setVehicleUpdateKMPL] = useState({
        km_per_liter: 0,
    })

    const [makeData, setMakeData] = useState({
        make: 'Toyota',
    })

    const vehicles = useSelector((state) => state.vehicles.vehicles) ?? [];
    const makes = useSelector((state) => state.vehicles.makes.results) ?? [];
    
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
            setErrorUpdate(error);
            console.log(error);
        });
    }

    const handleUpdateKMPL = (e) => {
        e.preventDefault();
        dispatch(updateVehicle({id: vehicleId, data: vehicleUpdateKMPL})).then((res) => {
            if (res.payload?.id) {
                setSuccessUpdateKMPL(true);
                dispatch(fetchVehicles());
            } else {
                setErrorUpdate(res.payload);
                console.log(res.payload);
            }
        }).catch((error) => {
            // Handle any errors from the first then block
            setErrorUpdateKMPL(error);
            console.log(error);
        });
    }

    const handleAddMake = (e) => {
        e.preventDefault();
        dispatch(createMake(makeData)).then((res) => {
            if (res.payload?.id) {
                setSuccessMake(true);
            } else {
                setErrorMake(res.payload);
                console.log(res.payload);
            }
        }).catch((error) => {
            // Handle any errors from the first then block
            setErrorMake(error);
            console.log(error);
        });
    }

    useEffect(() => {
        dispatch(fetchMakes());
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);
          setErrorUpdate('');
          setSuccessUpdate(false);
          setErrorUpdateKMPL('');
          setSuccessUpdateKMPL(false);
          setErrorMake('');
          setSuccessMake(false);
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [error, errorUpdate, success, successUpdate, successMake, errorMake, errorUpdateKMPL, successUpdateKMPL]);

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
            <Typography variant="h4"> Vehicle (ተሽከርካሪ)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <Autocomplete
                        options={makes}
                        getOptionLabel={(option) => option.make}
                        onChange={(event, value) => setVehicleData((prev) => ({ ...prev, make: value ? value.make : '' }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Vehicle Make"
                                variant="outlined"
                                sx={{ minWidth: '100%' }}
                            />
                        )}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Model (ሞዴል)" type="text" name="model" id="model" onChange={(e) => setVehicleData((prev) => ({...prev, model: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Year (የምርት ዓ/ም)" type="number" name="year" id="year" onChange={(e) => setVehicleData((prev) => ({...prev, year: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Type (አይነት)</InputLabel>
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
                    <TextField label="Current milage (የተጓዘበት ኪ/ሜ)" type="number" name="cmilage" id="cmilage" onChange={(e) => setVehicleData((prev) => ({...prev, current_milage: e.target.value}))}/>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="License plate (ሰሌዳ)" type="text" name="plate" id="plate" onChange={(e) => setVehicleData((prev) => ({...prev, license_plate: e.target.value}))}/>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Fuel level (የተሞላ ነዳጀ)" type="number" name="fuel_level" id="fuel_level" onChange={(e) => setVehicleData((prev) => ({...prev, fuel_level: e.target.value}))}/>
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
            <Grid item xs={12} marginTop={2}>
                <FormControlLabel control={<Switch />} label="Add vehicle make" onClick={() => setAddMake(!addMake)}/>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <FormControlLabel control={<Switch />} label="Change KM per liter" onClick={() => setUpdateKMPL(!updateKMPL)}/>
            </Grid>
        </Grid>

        { addMake && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">New vehicle make (አዲስ የመኪና ብራንድ)</Typography>
        </Grid> }
        { addMake && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Make (የመኪናዉ ብራንድ)" type="text" name="make" id="make" onChange={(e) => setMakeData((prev) => ({...prev, make: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e)=> handleAddMake(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Create (ፍጠር)</Button>
                    </FormControl>
                </form>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                {
                    successMake && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Vehicle updated successfully!
                    </Alert>
                }
                { errorMake && <Alert severity="error">{errorMake}</Alert>} 
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>}
        { update && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Update Vehicle Status (የመኪና ሁኔታ ቀይር)</Typography>
        </Grid> }
        { update && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Vehicle (ተሽከርካሪ)</InputLabel>
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
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Status (ያለበት ሁኔታ)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Make"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setUpdateVehicleData((prev) => ({...prev, vehicle_status: e.target.value}))}
                    >
                        <MenuItem value={'AVAILABLE'}>AVAILABLE (ዝግጁ)</MenuItem>
                        <MenuItem value={'IN_USE'}>IN USE (ስራ ላይ)</MenuItem>
                        <MenuItem value={'RESERVED'}>RESERVED (ተይዟል)</MenuItem>
                        <MenuItem value={'OUT_OF_SERVICE'}>OUT OF SERVICE (ብልሽት ላይ)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e)=> handleUpdate(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Update (ቀይር)</Button>
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

         { updateKMPL && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">KM per liter (በአንድ ሊትር ነዳጅ የሚጓዘዉ)</Typography>
        </Grid> }
        { updateKMPL && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Vehicle (ተሽከርካሪ)</InputLabel>
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
                    <TextField label="KM per liter (በ1 ሊትር ነዳጅ)" type="number" name="km_per_liter" id="km_per_liter" onChange={(e) => setVehicleUpdateKMPL((prev) => ({...prev, km_per_liter: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e)=> handleUpdateKMPL(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Update (ቀይር)</Button>
                    </FormControl>
                </form>
            </Grid>
            <Grid item xs={12} marginTop={2}>
                {
                    successUpdateKMPL && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Vehicle updated successfully!
                    </Alert>
                }
                { errorUpdateKMPL && <Alert severity="error">{errorUpdate}</Alert>} 
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