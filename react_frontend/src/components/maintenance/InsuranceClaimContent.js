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

const InsuranceClaimContent = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [vehicleId, setVehicleId] = useState(null);
    const [sdate, setSdate] = useState(null);
    const dispatch = useDispatch();
    const [insClaimData, setInsClaimData] = useState({
        vehicle: '',
        date_submitted: '',
        reason_for_claim: '',
        status: '',
        remark: ''
    })

    useEffect(() => {
        setInsClaimData((prev) => ({
            ...prev,
            date_submitted: new Date(sdate).toISOString().split('T')[0],
        }));
    }, [sdate]);
    

    const vehicles = useSelector((state) => state.vehicles.vehicles) ?? [];
    
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
        // console.log(maintRequestData);
        // dispatch(createMaintRequest(maintRequestData)).then((res) => {
        //     if (res.payload?.id) {
        //         setSuccess(true);
        //         dispatch(fetchVehicles());
        //     } else {
        //         setError(res.payload);
        //         console.log(res.payload);
        //     }
        // }).catch((error) => {
        //     // Handle any errors from the first then block
        //     setError(error);
        //     console.log(error);
        // });
    }
    return <>
        {/* Recent Orders */}
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4"> Insurance Claim (የኢንሹራንስ ክሌይም)</Typography>
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
                        onChange={(e) => setInsClaimData((prev) => ({...prev, vehicle: e.target.value}))}
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
                        label="Date submitted (የገባበት ቀን)"
                        onChange={(selectedDate) => {
                            setSdate(selectedDate);
                        }}
                        value={sdate}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Reason for claim (የተጠየቀበት ምክንያት)" type="text" name="reason" id="reason" onChange={(e) => setInsClaimData((prev) => ({...prev, reason_for_claim: e.target.value}))}/>
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
                        onChange={(e) => setInsClaimData((prev) => ({...prev, status: e.target.value}))}
                    >
                        <MenuItem value={0}>Pending (ጥበቃ ላይ)</MenuItem>
                        <MenuItem value={1}>On progress (ጥገና ላይ)</MenuItem>
                        <MenuItem value={2}>Complete (ተጥናቋል)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Remark" type="remark" name="remark" id="remark" onChange={(e) => setInsClaimData((prev) => ({...prev, remark: e.target.value}))}/>
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
                            Insurance claim created successfully!
                    </Alert>
                }
                { error && <Alert severity="error">{error}</Alert>} 
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <Typography variant="h4">Insurance Claim</Typography>
        </Grid>
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            {/* <MaintRequestTable /> */}
        </Grid>
    </>

}

export default InsuranceClaimContent;