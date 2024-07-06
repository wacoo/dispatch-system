import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "./authHeader";
import { url } from "../url";

const initialState = {
    user: {},
    users: [],
    approvers: [],
    dispatchers: [],
    newUser: {},
    isLoading: false,
    error: undefined
};

const signIn = createAsyncThunk('user/signIn', async (data) => {
    try {
      const full_url = `${url}token/`;
      const response = await axios.post(full_url, data);
  
      if (response.data.access) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
      }
  
      return response.data;
    } catch (error) {
      console.error('Sign-in failed:', error.message);
      throw error; 
    }
  });

const logout = () => {
    sessionStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(sessionStorage.getItem('user'));
};

const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        let allUsers = [];
        let nextUrl = `${url}users/`;
        
        // Loop until nextUrl is null (no more pages)
        while (nextUrl) {
            const res = await axios.get(nextUrl, { headers: authHeader() });
            allUsers = [...allUsers, ...res.data.results]; // Assuming 'results' contains your data
            nextUrl = res.data.next; // 'next' will be null if no more pages
        }
        console.log(allUsers);
        return allUsers;
    } catch (error) {
        return error.message;
    }
});

const fetchApprovers = createAsyncThunk('users/fetchApprovers', async () => {
    try {
        let allUsers = [];
        let nextUrl = `${url}approvers/`;
        
        // Loop until nextUrl is null (no more pages)
        while (nextUrl) {
            const res = await axios.get(nextUrl, { headers: authHeader() });
            allUsers = [...allUsers, ...res.data.results]; // Assuming 'results' contains your data
            nextUrl = res.data.next; // 'next' will be null if no more pages
        }
        return allUsers;
    } catch (error) {
        return error.message;
    }
});

const fetchDispatchers = createAsyncThunk('users/fetchDispatchers', async () => {
    try {
        let allUsers = [];
        let nextUrl = `${url}dispatchers/`;
        
        // Loop until nextUrl is null (no more pages)
        while (nextUrl) {
            const res = await axios.get(nextUrl, { headers: authHeader() });
            allUsers = [...allUsers, ...res.data.results]; // Assuming 'results' contains your data
            nextUrl = res.data.next; // 'next' will be null if no more pages
        }
        return allUsers;
    } catch (error) {
        return error.message;
    }
});

const signUp = createAsyncThunk('users/signUp', async (data) => {
    try {
        const full_url = `${url}users/`;
        const res = await axios.post(full_url, data, { headers: authHeader() });
        return res.data;
    } catch (error) {
        return error.message;
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getUser: (state, action) => {
            const u = sessionStorage.getItem('user');
            if (u) {                
                state.user = JSON.parse(sessionStorage.getItem('user'));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(signUp.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.newUser = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUsers.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchApprovers.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchApprovers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.approvers = action.payload;
            })
            .addCase(fetchApprovers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchDispatchers.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchDispatchers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dispatchers = action.payload;
            })
            .addCase(fetchDispatchers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    }
});

export { signIn, logout, getCurrentUser, signUp, fetchUsers, fetchApprovers, fetchDispatchers };
export const {getUser} = userSlice.actions;
export default userSlice.reducer;