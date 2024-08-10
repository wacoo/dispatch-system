import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "../user/authHeader";
import { url } from "../url";

const initialState = {
    user: {},
    vehicles: [],
    newVehicle: {},
    updateVehicle: {},
    makes: [],
    newMake: {},
    oilUses: [],
    newOilUse: {},
    maintenaces: [],
    newMaintenance: {},
    isLoading: false,
    error: undefined
}


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
    // console.log(`${full_url}${id}/`);
    try {
        const res = await axios.put(`${full_url}${id}/`, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});


const createMake = createAsyncThunk('vehicles/createMake', async (data) => {
    try {
        const full_url2 = `${url}make/`;
        const res = await axios.post(full_url2, data, { headers: authHeader() });

        return res.data;
    } catch (error ) {
        return error.message;
    }
});

//Oil Use
const createOilUse = createAsyncThunk('vehicles/createOilUse', async (data) => {
    const full_url2 = `${url}oil_use/`;
    try {
        const res = await axios.post(full_url2, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
});

const fetchOilUses = createAsyncThunk('vehicles/fetchOilUses', async() => {
    // try {
    //     const full_url2 = `${url}oil_use/`;
    //     const res = await axios.get(full_url2, { headers: authHeader() });
    //     console.log(res.data.results[0].make);
    //     return res.data;
    // } catch(error) {
    //     return error.message;
    // }

    try {
        let allOilUse = [];
        let nextUrl = `${url}oil_use/`;
        
        // Loop until nextUrl is null (no more pages)
        while (nextUrl) {
            const res = await axios.get(nextUrl, { headers: authHeader() });
            allOilUse = [...allOilUse, ...res.data.results]; // Assuming 'results' contains your data
            nextUrl = res.data.next; // 'next' will be null if no more pages
        }
        console.log(allOilUse);
        return allOilUse;
    } catch (error) {
        return error.message;
    }
});


//Maintenance

const createMaintenance = createAsyncThunk('vehicles/createMaintenance', async (data) => {
    const full_url2 = `${url}maintenance/`;
    try {
        const res = await axios.post(full_url2, data, { headers: authHeader() });
        return res.data;
    } catch (error ) {
        return error.message;
    }
    
});

const fetchMaintenance = createAsyncThunk('vehicles/fetchMaintenance', async() => {
    // try {
    //     const full_url2 = `${url}maintenance/`;
    //     const res = await axios.get(full_url2, { headers: authHeader() });
    //     console.log(res.data.results[0].make);
    //     return res.data;
    // } catch(error) {
    //     return error.message;
    // }

    try {
        let allMaint = [];
        let nextUrl = `${url}maintenance/`;
        
        // Loop until nextUrl is null (no more pages)
        while (nextUrl) {
            const res = await axios.get(nextUrl, { headers: authHeader() });
            allMaint = [...allMaint, ...res.data.results]; // Assuming 'results' contains your data
            nextUrl = res.data.next; // 'next' will be null if no more pages
        }
        console.log(allMaint);
        return allMaint;
    } catch (error) {
        return error.message;
    }
});


const fetchMakes = createAsyncThunk('vehicles/fetchMakes', async() => {
    try {
        const full_url2 = `${url}make/`;
        console.log(`${url}make/`);
        const res = await axios.get(full_url2, { headers: authHeader() });
        console.log(res.data.results[0].make);
        return res.data;
    } catch(error) {
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
            // console.log(action.payload);
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
            // console.log(action.payload);
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
            // console.log(action.payload);
        })
        .addCase(fetchVehicles.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchMakes.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchMakes.fulfilled, (state, action) => {
            state.isLoading = false;
            state.makes = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchMakes.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })

        .addCase(createMake.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createMake.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newMake = action.payload;
            // console.log(action.payload);
        })
        .addCase(createMake.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchOilUses.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchOilUses.fulfilled, (state, action) => {
            state.isLoading = false;
            state.oilUses = action.payload;
            // console.log(action.payload);
        })
        .addCase(fetchOilUses.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(createOilUse.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createOilUse.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newOilUse = action.payload;
            // console.log(action.payload);
        })
        .addCase(createOilUse.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(fetchMaintenance.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(fetchMaintenance.fulfilled, (state, action) => {
            state.isLoading = false;
            state.maintenaces = action.payload;
            console.log(action.payload);
        })
        .addCase(fetchMaintenance.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
        .addCase(createMaintenance.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(createMaintenance.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newMaintenance = action.payload;
            // console.log(action.payload);
        })
        .addCase(createMaintenance.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        })
    }
})

export {createVehicle, fetchVehicles, updateVehicle, fetchMakes, createMake, fetchOilUses, createOilUse, fetchMaintenance, createMaintenance };
export default vehicleSlice.reducer;