import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";
import { url } from "../url";

const initialState = {
    maintRequests: [],
    newMaintRequest: {},
    isLoading: false,
    error: undefined
}

// const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
// const headers = {
//     Authorization: `Bearer ${token}`,
// };

const full_url = `${url}maint/maint_requests`;
const fetchMaintRequests = createAsyncThunk('maint_request/fetchMaintRequests', async() => {
    try {
        const res = await axios.get(full_url, { headers: authHeader() });
        // console.log(res.data);
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const createMaintRequest = createAsyncThunk('maint_request/createMaintRequest', async (data) => {
    // console.log('Data: ',data);
    try {
        const res = await axios.post(full_url, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const maintRequestSlice = createSlice({
    name: 'departments',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(createMaintRequest.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createMaintRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newMaintRequest = action.payload;
            // console.log(action.payload);
        })
        .addCase(createMaintRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchMaintRequests.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchMaintRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.departments = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchMaintRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createMaintRequest, fetchMaintRequests};
export default maintRequestSlice.reducer;