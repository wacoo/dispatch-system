import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchPendingRequests } from "../request/requestSlice";
import { url } from "../url";

const initialState = {
    pending_requests: [],
    isLoading: false,
    error: undefined
}

// const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
// const headers = {
//     Authorization: `Bearer ${token}`,
// };

const full_url = `${url}pending_requests/`;
const fetchDepartments = createAsyncThunk('requests/fetchPendingReuests', async() => {
    try {
        const res = await axios.get(full_url);
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const createDepartment = createAsyncThunk('departments/createDepartment', async (data) => {
    // console.log('Data: ',data);
    try {
        const res = await axios.post(full_url, data);
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const dashboardSlice = createSlice({
    name: 'departments',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchPendingRequests.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchPendingRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.departments = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchPendingRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {fetchPendingRequests};
export default dashboardSlice.reducer;