import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";
import { url } from "../url";

const initialState = {
    user: {},
    refuels: [],
    refuelsById: [],
    activePPLs: [],
    monthlyPlans: [],
    newRefuel: {},
    newPPL: {},
    newMonthlyPlan: {},
    updatedPPL: {},
    isLoading: false,
    error: undefined
}

// const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
// const headers = {
//     Authorization: `Bearer ${token}`,
// };

const full_url = `${url}refuels/`;
// const fetchRefuels = createAsyncThunk('refuels/fetchRefuels', async() => {
//     try {
//         const res = await axios.get(full_url, { headers: authHeader() });
//         return res.data;
//     } catch(error) {
//         return error.message;
//     }
// });

const fetchRefuels = createAsyncThunk('refuels/fetchRefuels', async () => {
    try {
        let allRefuels = [];
        let nextUrl = `${url}refuels/`;
        
        // Loop until nextUrl is null (no more pages)
        while (nextUrl) {
            const res = await axios.get(nextUrl, { headers: authHeader() });
            allRefuels = [...allRefuels, ...res.data.results]; // Assuming 'results' contains your data
            nextUrl = res.data.next; // 'next' will be null if no more pages
        }
        console.log(allRefuels);
        return allRefuels;
    } catch (error) {
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

const createPPL = createAsyncThunk('refuels/createPPL', async (data) => {
    // console.log('Data: ',data);
    const fullURL = `${url}price_per_liter/`;
    console.log('Data: ',data);
    try {
        const res = await axios.post(fullURL, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const fetchActivePPL = createAsyncThunk('refuels/fetchActivePPL', async() => {
    try {
        const fullURL = `${url}price_per_liter/`;
        const res = await axios.get(fullURL, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});

const updatePPL = createAsyncThunk('refuels/updatePPL', async({id, nafta_active, benzine_active}) => {
    try {
        const fullURL = `${url}price_per_liter/${id}/`;
        const res = await axios.put(fullURL, {nafta_active, benzine_active}, { headers: authHeader() });
        return res.data;
    } catch(error) {
        return error.message;
    }
});


const createMonthlyPlan = createAsyncThunk('refuels/createMonthlyPlan', async (data) => {
    // console.log('Data: ',data);
    const fullURL = `${url}monthly-plans/`;
    console.log('Data: ',data);
    try {
        const res = await axios.post(fullURL, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});


const fetchMonthlyPlan = createAsyncThunk('refuels/fetchMonthlyPlan', async() => {
    // try {
    //     const fullURL = `${url}monthly-plans/`;
    //     const res = await axios.get(fullURL, { headers: authHeader() });
    //     return res.data;
    // } catch(error) {
    //     return error.message;
    // }

    try {
        let allMonthlyPlans = [];
        let nextUrl = `${url}monthly-plans/`;
        
        // Loop until nextUrl is null (no more pages)
        while (nextUrl) {
            const res = await axios.get(nextUrl, { headers: authHeader() });
            allMonthlyPlans = [...allMonthlyPlans, ...res.data.results]; // Assuming 'results' contains your data
            nextUrl = res.data.next; // 'next' will be null if no more pages
        }
        console.log(allMonthlyPlans);
        return allMonthlyPlans;
    } catch (error) {
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
        .addCase(createPPL.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createPPL.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newPPL = action.payload;
            console.log(action.payload);
        })
        .addCase(createPPL.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchActivePPL.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchActivePPL.fulfilled, (state, action) => {
            state.isLoading = false;
            state.activePPLs = action.payload;
            console.log(action.payload);
        })
        .addCase(fetchActivePPL.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(updatePPL.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(updatePPL.fulfilled, (state, action) => {
            state.isLoading = false;
            state.updatedPPL = action.payload;
            console.log(action.payload);
        })
        .addCase(updatePPL.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(createMonthlyPlan.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createMonthlyPlan.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newMonthlyPlan = action.payload;
            console.log(action.payload);
        })
        .addCase(createMonthlyPlan.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(fetchMonthlyPlan.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchMonthlyPlan.fulfilled, (state, action) => {
            state.isLoading = false;
            state.monthlyPlans = action.payload;
            console.log(action.payload);
        })
        .addCase(fetchMonthlyPlan.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createRefuel, fetchRefuels, fetchRefuelsById, createPPL, fetchActivePPL, updatePPL, createMonthlyPlan, fetchMonthlyPlan};
export default refuelSlice.reducer;