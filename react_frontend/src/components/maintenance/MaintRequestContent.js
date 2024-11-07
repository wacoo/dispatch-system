import { Alert, Autocomplete, Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMake, createVehicle, fetchMakes, fetchVehicles, updateVehicle } from "../../redux/vehicle/vehicleSlice";
import { fetchActivePPL } from "../../redux/refuel/refuelSlice";
import MaintRequestTable from "./MaintRequestTable";
import { createMaintRequest } from "../../redux/maintenance_request/maintRequestSlice";
import EtDatePicker from "mui-ethiopian-datepicker";
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const MaintRequestContent = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    // const [successUpdate, setSuccessUpdate] = useState(false);
    // const [errorUpdate, setErrorUpdate] = useState('');
    // const [successUpdateKMPL, setSuccessUpdateKMPL] = useState(false);
    // const [errorUpdateKMPL, setErrorUpdateKMPL] = useState('');
    // const [successMake, setSuccessMake] = useState(false);
    // const [errorMake, setErrorMake] = useState('');
    // const [update, setUpdate] = useState(false);
    // const [updateKMPL, setUpdateKMPL] = useState(false);
    // const [addMake, setAddMake] = useState(false);
    const [vehicleId, setVehicleId] = useState(null);
    const [rdate, setRdate] = useState(null);
    const dispatch = useDispatch();
    const [maintRequestData, setMaintRequestData] = useState({
        vehicle: '',
        registration_date: '',
        damages: '',
        reason_for_maint: '',
        priority_level: '',
        status: '',
        remark: '',
    })

    useEffect(() => {
        setMaintRequestData((prev) => ({
            ...prev,
            registration_date: new Date(rdate).toISOString().split('T')[0],
        }));
    }, [rdate]);
    

    const vehicles = useSelector((state) => state.vehicles.vehicles) ?? [];
    
    // const handleUpdate = (e) => {
    //     e.preventDefault();
    //     dispatch(updateVehicle({id: vehicleId, data: vehicleUpdateData})).then((res) => {
    //         if (res.payload?.id) {
    //             setSuccessUpdate(true);
    //             dispatch(fetchVehicles());
    //         } else {
    //             setErrorUpdate(res.payload);
    //             console.log(res.payload);
    //         }
    //     }).catch((error) => {
    //         // Handle any errors from the first then block
    //         setErrorUpdate(error);
    //         console.log(error);
    //     });
    // }

    // const handleUpdateKMPL = (e) => {
    //     e.preventDefault();
    //     dispatch(updateVehicle({id: vehicleId, data: vehicleUpdateKMPL})).then((res) => {
    //         if (res.payload?.id) {
    //             setSuccessUpdateKMPL(true);
    //             dispatch(fetchVehicles());
    //         } else {
    //             setErrorUpdate(res.payload);
    //             console.log(res.payload);
    //         }
    //     }).catch((error) => {
    //         // Handle any errors from the first then block
    //         setErrorUpdateKMPL(error);
    //         console.log(error);
    //     });
    // }

    // const handleAddMake = (e) => {
    //     e.preventDefault();
    //     dispatch(createMake(makeData)).then((res) => {
    //         if (res.payload?.id) {
    //             setSuccessMake(true);
    //         } else {
    //             setErrorMake(res.payload);
    //             console.log(res.payload);
    //         }
    //     }).catch((error) => {
    //         // Handle any errors from the first then block
    //         setErrorMake(error);
    //         console.log(error);
    //     });
    // }

    useEffect(() => {
        dispatch(fetchMakes());
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [error,  success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createMaintRequest(maintRequestData)).then((res) => {
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
            <Typography variant="h4"> Vehicle Maintenance Request (ተሽከርካሪ ጥገና ጥያቄ)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
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
                        {Array.isArray(vehicles) && vehicles.map((vehicle) => (
                            <MenuItem key={vehicle.id} value={vehicle.id}>
                                {`(${vehicle.license_plate}) ${vehicle.make}, ${vehicle.model}, ${vehicle.type}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                <EtDatePicker
                        label="Registration Date (የምዝገባ ቀን)"
                        onChange={(selectedDate) => {
                            setRdate(selectedDate);
                        }}
                        value={rdate}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Damages (ጉዳቶች)" type="text" name="damages" id="damages" onChange={(e) => setMaintRequestData((prev) => ({...prev, damages: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Reason for maintenance (የጥገና ምክንያት)" type="text" name="reason" id="reason" onChange={(e) => setMaintRequestData((prev) => ({...prev, reason_for_maint: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Severity level (የብሶት ደረጃ)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Severity"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setMaintRequestData((prev) => ({...prev, priority_level: e.target.value}))}
                    >
                        <MenuItem value={0}>Normal (ተራ)</MenuItem>
                        <MenuItem value={1}>High (አስችኳይ)</MenuItem>
                        <MenuItem value={2}>Etremely high (በጣም አስቸኳይ)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Status (የጥገና ሁኔታ)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Severity"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setMaintRequestData((prev) => ({...prev, status: e.target.value}))}
                    >
                        <MenuItem value={0}>Pending (ጥበቃ ላይ)</MenuItem>
                        <MenuItem value={1}>On Maintenance (ጥገና ላይ)</MenuItem>
                        <MenuItem value={2}>Complete (ተጥናቋል)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Remark" type="remark" name="remark" id="remark" onChange={(e) => setMaintRequestData((prev) => ({...prev, remark: e.target.value}))}/>
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
        </Grid>

        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <Typography variant="h4">Maintenance Requests</Typography>
        </Grid>
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <MaintRequestTable />
        </Grid>
    </>

}

export default MaintRequestContent;