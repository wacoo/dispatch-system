import { Alert, Autocomplete, Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signUp } from "../../redux/user/userSlice";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import RefuelsTable from "./RefuelsTable";
import { createPPL, createRefuel, fetchActivePPL, fetchRefuels, updatePPL } from "../../redux/refuel/refuelSlice";
import { fetchVehicles } from "../../redux/vehicle/vehicleSlice";
import EtDatePicker from "mui-ethiopian-datepicker";


const PreventiveMaintContent = () => {
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [successAdd, setSuccessAdd] = useState(false);
    const [error, setError] = useState('');
    const [errorAdd, setErrorAdd] = useState('');
    const [sdate, setSdate] = useState(null);
    const [addPPL, setAddPPL] = useState(false);
    const vehicles = useSelector((state) => state.vehicles.vehicles) ?? [];
    const ppls = useSelector((state) => state.refuels.activePPLs.results) ?? [];
    const [prevMaintData, setPrevMaintData] = useState({
        vehicle: '',
        scheduled_date: '',
        round: '',
        status: '',
        remark: ''
    });


    /*
        Notes:
        - holidays in another table and page.
        - Two tabs, one for generating schedule: that includes vehicle to be seleted and generates dates,
        - Second, to view and follow and update status, vehilce to be selected and complete date to be ticked.     
    */
    useEffect(() => {
        setPrevMaintData(prevState => ({
            ...prevState,
            scheduled_date: new Date(sdate).toISOString().split('T')[0]

        }));
    }, [sdate]);

    // useEffect(() => {

    // }, [PPLData]);

    useEffect(() => {
        dispatch(fetchVehicles());
        dispatch(fetchActivePPL());
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setErrorAdd('');
            setSuccess(false);
            setSuccessAdd(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [error, success, errorAdd, successAdd]);

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
        )
    }


    const handleAddPPL = async (e) => {
        e.preventDefault();

        // console.log(PPLData.nafta);

        dispatch(createPPL(PPLData)).then((res) => {
            if (res.payload?.id) {
                dispatch(fetchActivePPL());
                setSuccessAdd(true);
                ppls.forEach((ppl) => {
                    if (ppl.nafta_active == true || ppl.benzine_active == true) {
                        dispatch(updatePPL({ id: ppl.id, benzine_active: false, nafta_active: false }));
                    }
                });
            } else {
                setErrorAdd(res.payload);
                console.log(res.payload);
            }
        }).catch((error) => {
            // Handle any errors from the first then block
            setErrorAdd(error);
            console.log(error);
        });
    };


    const handlePriceChange = (e, gas) => {
        const val = e.target.value;
        if (gas === "nafta") {
            if (val > 0) {
                setPPLData(prevState => ({
                    ...prevState,
                    nafta_active: true
                }))
            } else {
                setPPLData(prevState => ({
                    ...prevState,
                    nafta_active: false
                }))
            }
            setPPLData((prev) => ({ ...prev, nafta: val }))
        }
        if (gas === "benzine") {
            if (val > 0) {
                setPPLData(prevState => ({
                    ...prevState,
                    benzine_active: true
                }))
            } else {
                setPPLData(prevState => ({
                    ...prevState,
                    benzine_active: false
                }))
            }
            setPPLData((prev) => ({ ...prev, benzine: val }))
        }
    }

    return <>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Preventive Maintenance (ሴርቪስ)</Typography>
        </Grid>

        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <Autocomplete
                        options={vehicles}
                        getOptionLabel={(option) => `${option.license_plate}; ${option.make} ${option.model}`}
                        onChange={(event, value) => setPrevMaintData((prev) => ({ ...prev, vehicle: value ? value.id : '' }))}
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
            
            <Grid item xs={12} md={6} lg={4} sx={{mt: '-7px'}}>
                <FormControl fullWidth>
                <EtDatePicker
                        label="Maintenance date (የጥገና ቀን)"
                        onChange={(selectedDate) => {
                            setSdate(selectedDate);
                        }}
                        value={sdate}
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Round (ዙር)" type="text" name="round" id="round" onChange={(e) => setPrevMaintData((prev) => ({ ...prev, round: e.target.value }))} />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Status (ያለበት ሁኔታ)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Severity"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setPrevMaintData((prev) => ({ ...prev, status: e.target.value }))}
                    >
                        <MenuItem value={0}>Pending (ገና)</MenuItem>
                        <MenuItem value={1}>On maintenance (በጥገና ላይ)</MenuItem>
                        <MenuItem value={2}>Complete (ተጠናቋል)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Remark" type="text" name="remark" id="remark" onChange={(e) => setPrevMaintData((prev) => ({ ...prev, remark: e.target.value }))} />
                </FormControl>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Update (ለዉጥ)</Button>
                    </FormControl>
                </form>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                {
                    success && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Schedule created successfully!
                    </Alert>
                }
                {error && <Alert severity="error">{error}</Alert>}
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>

            <Grid item xs={12} marginTop={2}>
                <FormControlLabel control={<Switch />} label="Generate schedule" onClick={() => setAddPPL(!addPPL)} />
            </Grid>
        </Grid>

        {addPPL && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Generate Schedule (መርሃ ግብር ፍጠር)</Typography>
        </Grid>}
        {addPPL && <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <Autocomplete
                        options={vehicles}
                        getOptionLabel={(option) => `${option.license_plate}; ${option.make} ${option.model}`}
                        onChange={(event, value) => setPrevMaintData((prev) => ({ ...prev, vehicle: value ? value.id : '' }))}
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
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Status (ያለበት ሁኔታ)</InputLabel>
                    <Select
                        labelId="dept_lbl"
                        id="demo-simple-select"
                        label="Severity"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setPrevMaintData((prev) => ({ ...prev, status: e.target.value }))}
                    >
                        <MenuItem value={0}>Pending (ገና)</MenuItem>
                        <MenuItem value={1}>On maintenance (በጥገና ላይ)</MenuItem>
                        <MenuItem value={2}>Complete (ተጠናቋል)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Remark" type="text" name="remark" id="remark" onChange={(e) => setPrevMaintData((prev) => ({ ...prev, remark: e.target.value }))} />
                </FormControl>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Update (ለዉጥ)</Button>
                    </FormControl>
                </form>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                {
                    success && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Schedule created successfully!
                    </Alert>
                }
                {error && <Alert severity="error">{error}</Alert>}
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>}
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Preventive maintenances</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            {/* <RefuelsTable /> */}
        </Grid>
    </>

}

export default PreventiveMaintContent;