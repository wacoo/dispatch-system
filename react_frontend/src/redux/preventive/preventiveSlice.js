import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";
import { url } from "../url";

const initialState = {
    prevenetivesMaints: [],
    newPreventive: {},
    isLoading: false,
    error: undefined
}

// const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
// const headers = {
//     Authorization: `Bearer ${token}`,
// };

const full_url = `${url}maint/preventive_maint/`;
const fetchPrevenetivesMaints = createAsyncThunk('maint_request/fetchPreventiveMaints', async() => {
    try {
        const res = await axios.get(full_url, { headers: authHeader() });
        console.log(res.data.results);
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const createPrevenetivesMaints = createAsyncThunk('maint_request/createPrevenetivesMaints', async (data) => {
    // console.log('Data: ',data);
    try {
        const res = await axios.post(full_url, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const preventiveSlice = createSlice({
    name: 'departments',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(createPrevenetivesMaints.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createPrevenetivesMaints.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newPreventive = action.payload;
            // console.log(action.payload);
        })
        .addCase(createPrevenetivesMaints.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchPrevenetivesMaints.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchPrevenetivesMaints.fulfilled, (state, action) => {
            state.isLoading = false;
            state.prevenetivesMaints = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchPrevenetivesMaints.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createPrevenetivesMaints, fetchPrevenetivesMaints};
export default preventiveSlice.reducer;