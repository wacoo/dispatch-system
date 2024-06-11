import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import VehiclesTable from "./VehiclesTable";
import DriversTable from "./DriversTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDriver, fetchDrivers } from "../../redux/driver/driverSlice";


const DriverContent = () => {
    // fname = models.CharField(max_length=50)
    // mname = models.CharField(max_length=50)
    // lname = models.CharField(max_length=50, blank=True, default='')
    // phone_number = models.CharField(max_length=20)
    // license_number = models.CharField(max_length=20)
    // created_at = models.DateTimeField(auto_now_add=True)
    // updated_at = models.DateTimeField(auto_now=True)
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const [driverData, setDriverData] = useState({
        fname: '',
        mname: '',
        lname: '',
        phone_number: '',
        license_number: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
      }, [error, success]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createDriver(driverData)).then((res) => {
            // console.log(res.payload.fname);
            if (res.payload?.id) {
                setSuccess(true);
                dispatch(fetchDrivers());
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
            <Typography variant="h4">New Driver</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="First name" type="text" name="fname" id="fname" onChange={(e) => setDriverData((prev) => ({...prev, fname: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Middle name" type="text" name="mname" id="mname" onChange={(e) => setDriverData((prev) => ({...prev, mname: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Last name" type="text" name="lname" id="lname" onChange={(e) => setDriverData((prev) => ({...prev, lname: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Phone number" type="text" name="pnumber" id="pnumber" onChange={(e) => setDriverData((prev) => ({...prev, phone_number: e.target.value}))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="License number" type="text" name="lnumber" id="lnumber" onChange={(e) => setDriverData((prev) => ({...prev, license_number: e.target.value}))}/>
                </FormControl>
            </Grid>

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
                            Driver created successfully!
                    </Alert>
                }
                { error && <Alert severity="error">{error}</Alert>} 
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <Typography variant="h4">Drivers</Typography>
        </Grid>
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <DriversTable />
        </Grid>
    </>

}

export default DriverContent;