import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authHeader from "./authHeader";

const initialState = {
    user: {},
    users: [],
    newUser: {},
    isLoading: false,
    error: undefined
};

// const API_URL = 'http://localhost:8000/api/';

// const signIn = (username, password) => {
//     return axios.post(API_URL + 'login/', { username, password })
//         .then((response) => {
//             if (response.data.access) {
//                 localStorage.setItem('user', JSON.stringify(response.data));
//             }
//             return response.data;
//         });
// };
const url = 'http://localhost:8000/api/';
const signIn = createAsyncThunk('user/signIn', async (data) => {
    try {
        const full_url = `${url}token/`;
        const res = await axios.post(full_url, data).then((response) => {
            if (response.data.access) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            console.log(response.data);
            return response.data;
        });    } catch (error) {
        console.log(error.message);
        return error.message;
    }
});


const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        const full_url = `${url}users/`;
        const res = await axios.get(full_url, { headers: authHeader() });
        return res.data;
    } catch (error) {
        return error.message;
    }
});

const signUp = createAsyncThunk('users/signUp', async (data) => {
    try {
        // console.log(headers.Authorization);
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
            });
    }
});

export { signIn, logout, getCurrentUser, signUp, fetchUsers };
export default userSlice.reducer;