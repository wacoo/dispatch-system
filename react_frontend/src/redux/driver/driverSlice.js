import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";

const initialState = {
    user: {},
    driver: {},
    drivers: [],
    newDriver: {},
    isLoading: false,
    error: undefined
}

const url = 'http://localhost:8000/api/';

// const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
// const headers = {
//     Authorization: `Bearer ${token}`,
// };

const full_url = `${url}drivers/`;
const fetchDrivers = createAsyncThunk('drivers/fetchDrivers', async() => {
    try {
        const res = await axios.get(full_url, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const fetchDriver = createAsyncThunk('drivers/fetchDriver', async(id) => {
    try {
        const res = await axios.get(`${full_url}/${id}/`, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const createDriver = createAsyncThunk('drivers/createDriver', async (data) => {
    try {
        const res = await axios.post(full_url, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const driverSlice = createSlice({
    name: 'driver',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(createDriver.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createDriver.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newDriver = action.payload;
            // console.log(action.payload);
        })
        .addCase(createDriver.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchDrivers.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchDrivers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.drivers = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchDrivers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchDriver.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchDriver.fulfilled, (state, action) => {
            state.isLoading = false;
            state.driver = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchDriver.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createDriver, fetchDrivers, fetchDriver };
export default driverSlice.reducer;