import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";
import { url } from "../url";

const initialState = {
    user: {},
    refuels: [],
    refuelsById: [],
    newRefuel: {},
    isLoading: false,
    error: undefined
}

// const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
// const headers = {
//     Authorization: `Bearer ${token}`,
// };

const full_url = `${url}refuels/`;
const fetchRefuels = createAsyncThunk('refuels/fetchRefuels', async() => {
    try {
        const res = await axios.get(full_url, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const fetchRefuelsById = createAsyncThunk('refuels/fetchRefuelsById', async({vehicleId}) => {
    try {
        const res = await axios.get(`${full_url}vehicle/${vehicleId}/`, { headers: authHeader() });
        console.log(res.data);
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const createRefuel = createAsyncThunk('refuels/createRefuel', async (data) => {
    // console.log('Data: ',data);
    try {
        const res = await axios.post(full_url, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const refuelSlice = createSlice({
    name: 'refuels',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(createRefuel.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createRefuel.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newRefuel = action.payload;
            // console.log(action.payload);
        })
        .addCase(createRefuel.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchRefuels.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchRefuels.fulfilled, (state, action) => {
            state.isLoading = false;
            state.refuels = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchRefuels.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchRefuelsById.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchRefuelsById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.refuelsById = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchRefuelsById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createRefuel, fetchRefuels, fetchRefuelsById};
export default refuelSlice.reducer;