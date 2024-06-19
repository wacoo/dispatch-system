import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";

const initialState = {
    user: {},
    requests: [],
    pending_requests: [],
    approved_requests: [],
    newRequest: {},
    dispatchIdUpdate: {},
    updatedRequest: {},
    requestsByDispatchId: [],
    vahicleRequests: [],
    isLoading: false,
    error: undefined
}

const url = 'http://localhost:8000/api/';
let full_url = `${url}requests/`;
const fetchRequests = createAsyncThunk('requests/fetchRequests', async() => {
    const full_url = `${url}requests/`;
    try {
        const res = await axios.get(full_url, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const fetchRequestsByByDispatch= createAsyncThunk('requests/fetchRequestsByDispatch', async({id, dispatch}) => {
    const full_url = `${url}requests/`;
    try {
        // console.log('Here:', dispatch);
        const res = await axios.put(`${full_url}${id}/`, {dispatch: dispatch}, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const fetchPendingRequests = createAsyncThunk('requests/fetchPendingRequests', async() => {
    try {
        const full_url = `${url}pending_requests/`;
        // console.log(full_url);
        const res = await axios.get(full_url, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const fetchApprovedRequests = createAsyncThunk('requests/fetchApprovedRequests', async() => {
    // console.log(`${url}approved_requests/`);
    try {
        const full_url = `${url}approved_requests/`;
        // console.log(full_url);
        const res = await axios.get(full_url, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const fetchRequestsByDispatch = createAsyncThunk('requests/fetchRequestsByDispatch', async({dispatchId}) => {
    // console.log(`${url}approved_requests/`);
    try {
        const full_url = `${url}requests_by_id/`;
        // console.log(full_url);
        const res = await axios.get(full_url, {
            params: {
            dispatch_id: dispatchId
          }
        }, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const createRequest = createAsyncThunk('requests/createRequest', async (data) => {
    // console.log('Token: ',token);
    try {
        const full_url = `${url}requests/`;
        const res = await axios.post(full_url, data, { headers: authHeader() });
        console.log(data);
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const updateRequest = createAsyncThunk('requests/updateRequest', async ({ id, status, dispatch }, { rejectWithValue }) => {
    try {
        
        // console.log('Data: ', id, status);
        const full_url = `${url}requests/${id}/`;
        const res = null;
        if (dispatch) {
            res = await axios.put(full_url, {status, dispatch}, { headers: authHeader() });
        } else {
            res = await axios.put(full_url, {status}, { headers: authHeader() });
        }
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        addRequest: (state, action) => {
            state.vahicleRequests.push(action.payload);
        },
        clearRequests: (state) => {
            state.vahicleRequests = [];
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createRequest.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newRequest = action.payload;
            // console.log(action.payload);
        })
        .addCase(createRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchRequests.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.requests = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchPendingRequests.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchPendingRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.pending_requests = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchPendingRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchApprovedRequests.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchApprovedRequests.fulfilled, (state, action) => {
            state.isLoading = false;
            state.approved_requests = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchApprovedRequests.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(updateRequest.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(updateRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.updatedRequest = action.payload;
            // console.log(action.payload);
        })
        .addCase(updateRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchRequestsByByDispatch.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchRequestsByByDispatch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.dispatchIdUpdate = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchRequestsByByDispatch.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createRequest, fetchRequests, fetchPendingRequests, fetchApprovedRequests, updateRequest, fetchRequestsByByDispatch };
export const {addRequest, clearRequests} = requestSlice.actions;
export default requestSlice.reducer;