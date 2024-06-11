import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";

const initialState = {
    user: {},
    vehicles: [],
    newVehicle: {},
    updateVehicle: {},
    isLoading: false,
    error: undefined
}

const url = 'http://localhost:8000/api/';

// const user = localStorage.getItem('user');
// let token = '';
// if (user) {
// 	token = JSON.parse(user).token;
// } else {
// 	token = '';
// }

// const headers = {
//     Authorization: `Bearer ${token}`,
// };
const full_url = `${url}vehicles/`;
const fetchVehicles = createAsyncThunk('vehicles/fetchVehicles', async() => {
    try {
        const res = await axios.get(full_url, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const createVehicle = createAsyncThunk('vehicles/createVehicle', async (data) => {
    // console.log('Token: ',token);
    try {
        const res = await axios.post(full_url, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const updateVehicle = createAsyncThunk('vehicles/updateVehicle', async ({id, data}) => {
    console.log(`${full_url}${id}/`);
    try {
        const res = await axios.put(`${full_url}${id}/`, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});


const vehicleSlice = createSlice({
    name: 'vehicles',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(createVehicle.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createVehicle.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newVehicle = action.payload;
            console.log(action.payload);
        })
        .addCase(createVehicle.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(updateVehicle.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(updateVehicle.fulfilled, (state, action) => {
            state.isLoading = false;
            state.updatedVehicle = action.payload;
            console.log(action.payload);
        })
        .addCase(updateVehicle.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchVehicles.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchVehicles.fulfilled, (state, action) => {
            state.isLoading = false;
            state.vehicles = action.payload;
            console.log(action.payload);
        })
        .addCase(fetchVehicles.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createVehicle, fetchVehicles, updateVehicle };
export default vehicleSlice.reducer;