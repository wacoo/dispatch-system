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
import { createDispatch, fetchDispatchById, fetchDispatches, updateDispatch } from "../../redux/dispatch/dispatchSlice";
import { EthiopianDate } from "mui-ethiopian-datepicker/dist/util/EthiopianDateUtils";
import EtDatePicker from "mui-ethiopian-datepicker";
import { fetchUsers } from "../../redux/user/userSlice";
import jsreport from 'jsreport-browser-client-dist';
import { convertTo24HourFormat, convertToEthiopianDateTime, times } from "../../functions/date";
import DispatchTable from "./DispatchTable";
import { fetchRefuels, fetchRefuelsById } from "../../redux/refuel/refuelSlice";
import { createMaintenance, createOilUse, fetchMaintenance, fetchOilUses, fetchVehicles } from "../../redux/vehicle/vehicleSlice";
// import { createDispatchReport } from "../../redux/dispatch_report/dispatchReportSlice";
import { generateReport } from "../../functions/report";
import DepartmentsTable from "./DepartmentsTable";

const OilAndMaintenace = () => {
    const dispatch = useDispatch();
    const [successOil, setSuccessOil] = useState(false);
    const [errorOil, setErrorOil] = useState('');
    const [successMaint, setSuccessMaint] = useState(false);
    const [errorMaint, setErrorMaint] = useState('');
    const vehicles = useSelector((state) => state.vehicles.vehicles.results) ?? [];
    const [oilData, setOilData] = useState({
        liters: '',
        cost: ''
    });

    const [maintData, setMaintData] = useState({
        count: '',
        cost: ''
    });

    useEffect(() => {
        // dispatch(fetchVehicles());
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setErrorOil('');
            setErrorMaint('');
            setSuccessOil(false);
            setSuccessMaint(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [errorOil, errorMaint, successOil, successMaint]);
    const handleSubmitOil = (e) => {
        e.preventDefault();
        dispatch(createOilUse(oilData)).then((res) => {
            if (res.payload?.id) {
                setSuccessOil(true);
                dispatch(fetchOilUses());
            } else {
                setErrorOil(res.payload);
                console.log(res.payload);
            }
        }
        )
    }

    const handleSubmitMaint = (e) => {
        e.preventDefault();
        console.log(maintData);
        dispatch(createMaintenance(maintData)).then((res) => {
            if (res.payload?.id) {
                setSuccessMaint(true);
                dispatch(fetchMaintenance());
            } else {
                setErrorMaint(res.payload);
                console.log(res.payload);
            }
        }
        )
    }

    return <>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Oil use (ዘይት አጠቃቀም)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Oil in Lts (ዘይት በሊትር)" type="text" name="dname" id="oil" onChange={(e) => setOilData((prev) => ({ ...prev, liters: e.target.value }))} />
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Cost (ዋጋ በብር)" type="text" name="cost" id="cost" onChange={(e) => setOilData((prev) => ({ ...prev, cost: e.target.value }))} />
                </FormControl>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleSubmitOil(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Create (ፍጠር)</Button>
                    </FormControl>
                </form>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                {
                    successOil && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Oil use created successfully!
                    </Alert>
                }
                {errorOil && <Alert severity="error">{errorOil}</Alert>}
                {/* <Alert severity="info">This is an info Alert.</Alert>
            <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Tire maintenance (ጎማ ጥገና)</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Count (ጥገና በቁጥር)" type="text" name="dname" id="oil" onChange={(e) => setMaintData((prev) => ({ ...prev, count: e.target.value }))} />
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Cost (ዋጋ በብር)" type="text" name="cost" id="cost" onChange={(e) => setMaintData((prev) => ({ ...prev, cost: e.target.value }))} />
                </FormControl>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                <form onSubmit={(e) => handleSubmitMaint(e)}>
                    <FormControl fullWidth>
                        <Button variant="outlined" type="submit">Create (ፍጠር)</Button>
                    </FormControl>
                </form>
            </Grid>

            <Grid item xs={12} marginTop={2}>
                {
                    successMaint && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Maintenance created successfully!
                    </Alert>
                }
                {errorMaint && <Alert severity="error">{errorMaint}</Alert>}
                {/* <Alert severity="info">This is an info Alert.</Alert>
            <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px' }}>
            <Typography variant="h4">Departments</Typography>
        </Grid>
    </>

}

export default OilAndMaintenace;