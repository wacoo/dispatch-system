import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";
import { url } from "../url";

const initialState = {
    dispatches: [],
    dispatchById: {},
    newDispatch: {},
    updateRes: {},
    ddateValue: '',
    rdateValue: '',
    isLoading: false,
    error: undefined
}

const full_url = `${url}dispatches/`;
const fetchDispatches = createAsyncThunk('dispatches/fetchDispatches', async() => {
    try {
        const res = await axios.get(full_url, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const fetchDispatchById = createAsyncThunk('dispatches/fetchDispatch', async({dispatchId}) => {
    // console.log(`${full_url}${dispatchId}/`);
    try {
        const res = await axios.get(`${full_url}${dispatchId}/`, { headers: authHeader() });
        // console.log(res.data);
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const createDispatch = createAsyncThunk('dispatches/createDispatch', async (data) => {
    // console.log(full_url);
    try {
        
        // console.log(data);
        const res = await axios.post(full_url, data, { headers: authHeader() });
        // console.log(data);
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const updateDispatch = createAsyncThunk('dispatches/updateDispatch', async ({id, data}) => {
    // console.log(id, data, `${url}dispatches/${id}/`);
    try {
        const full_url2 = `${url}dispatches/${id}/`; 
        // console.log(full_url2);
        const res = await axios.put(full_url2, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});
const dispatchSlice = createSlice({
    name: 'dispatches',
    initialState,
    reducers: {
        setDdateValue: (state, action) => {
            console.log(action.payload);
            state.ddateValue = action.payload;
        },
        clearDdateValue: (state) => {
            state.ddateValue = '';
        },
        setRdateValue: (state, action) => {
            console.log(action.payload);
            state.rdateValue = action.payload;
        },
        clearRdateValue: (state) => {
            state.rdateValue = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createDispatch.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createDispatch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newDispatch = action.payload;
            console.log(action.payload);
        })
        .addCase(createDispatch.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchDispatches.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchDispatches.fulfilled, (state, action) => {
            state.isLoading = false;
            state.dispatches = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchDispatches.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchDispatchById.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchDispatchById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.dispatchById = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchDispatchById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(updateDispatch.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(updateDispatch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.updateRes = action.payload;
            // console.log(action.payload);
        })
        .addCase(updateDispatch.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createDispatch, fetchDispatches, updateDispatch, fetchDispatchById };
export const {setDdateValue, clearDdateValue, setRdateValue, clearRdateValue} = dispatchSlice.actions;
export default dispatchSlice.reducer;