import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography, Autocomplete } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import Chart from "./Chart"
import Deposits from "./Deposits"
import Orders from "./Orders"
import Input from '@mui/joy/Input';
import UsersTable from "./UsersTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signUp } from "../../redux/user/userSlice";
import { fetchDepartments } from "../../redux/department/departmentSlice";

const UserContent = () => {
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState({
        fname: '',
        mname: '',
        lname: '',
        department: '',
        username: '',
        password: '',
        confirm: '',
        access_level: '',
        phone_number: '',
        dispatcher: '',
        is_staff: false,
        is_superuser: false,
    });

    const departments = useSelector((state) => state.departments.departments) ?? [];
    useEffect(() => {
        const timer = setTimeout(() => {
          setError('');
          setSuccess(false);
        }, 5000);
    
        // Remember to clean up the timer when the component unmounts
        return () => clearTimeout(timer);
      }, [error, success]);

      
    useEffect(() => {
        dispatch(fetchDepartments());
    }, []);

    useEffect(() => {
        console.log(departments);
    }, [departments]);
    //username=None, fname=None, mname=None, lname=None, access_level=None, password=None
    //fields = ('id', 'username', 'fname', 'mname', 'lname', 'department', 'access_level', 'password', 'is_staff', 'is_superuser')
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userData);
        if(userData.access_level === 2) {
            setUserData((prev) => ({ ...prev, is_staff: true, is_superuser: true }));
            console.log('Here');
        } else {
            setUserData((prev) => ({ ...prev, is_staff: false, is_superuser: false }));
            console.log('Here2');
        }
        dispatch(signUp(userData)).then((res) => {
            // console.log(res.payload.fname);
            if (res.payload?.id) {
                setSuccess(true);
                // dispatch(getUsers);
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
            <Typography variant="h4">New User</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2 }}>
            {/* First name, Middle name, Last name in a row (3 on large, 2 on medium, 1 on small) */}
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="First name" type="text" name="fname" id="fname" onChange={(e) => setUserData((prev) => ({ ...prev, fname: e.target.value }))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Middle name" type="text" name="mname" id="mname" onChange={(e) => setUserData((prev) => ({ ...prev, mname: e.target.value }))}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Last name" type="text" name="lname" id="lname" onChange={(e) => setUserData((prev) => ({ ...prev, lname: e.target.value }))}/>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Username" type="text" name="uname" id="uname" onChange={(e) => setUserData((prev) => ({ ...prev, username: e.target.value }))}/>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Password" type="password" name="pword" id="pword" onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}/>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <FormControl fullWidth>
                    <TextField label="Confirm password" type="password" name="confirm" id="confirm" onChange={(e) => setUserData((prev) => ({ ...prev, confirm: e.target.value }))}/>
                </FormControl>
            </Grid>

            {/* Department Select (full width on all screen sizes) */}
            <Grid item xs={12}>
                <FormControl fullWidth>
                    {/* <InputLabel id="dept_lbl" sx={{ marginBottom: '8px' }}>Department</InputLabel> */}
                    <Autocomplete
                        options={departments}
                        getOptionLabel={(option) => option.dept_name}
                        onChange={(event, value) => setUserData((prev) => ({ ...prev, department: value ? value.dept_name : '' }))}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Department"
                            variant="outlined"
                            sx={{ minWidth: '100%' }} // Ensure select is full width
                            />
                        )}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="role_lbl" sx={{ marginBottom: '8px' }}>Role</InputLabel>
                    <Select
                        labelId="role_lbl"
                        id="role"
                        label="Role"
                        sx={{ minWidth: '100%' }} // Ensure select is full width
                        // Handle value, label, onChange
                        onChange={(e) => setUserData((prev) => ({ ...prev, access_level: e.target.value }))}
                    >
                        <MenuItem value={0}>User</MenuItem>
                        <MenuItem value={1}>Approver</MenuItem>
                        <MenuItem value={2}>Dispatcher</MenuItem>
                        <MenuItem value={3}>Administrator</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <TextField sx={{ minWidth: '100%' }} label="Phone number" type="text" name="pnumber" id="pnumber" onChange={(e) => setUserData((prev) => ({ ...prev, phone_number: e.target.value }))} />
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
                            User created successfully!
                    </Alert>
                }
                { error && <Alert severity="error">{error}</Alert>} 
                {/* <Alert severity="info">This is an info Alert.</Alert>
                <Alert severity="warning">This is a warning Alert.</Alert> */}
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <Typography variant="h4">Users</Typography>
        </Grid>
        <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', backgroundColor: 'background.paper', pr: '12px', pb: '12px', borderRadius: 4, boxShadow: 3, padding: 2, my: '30px'}}>
            <UsersTable />
        </Grid>
    </>

}

export default UserContent;