
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        role: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { token, role } = action.payload;
            state.token = token;
            state.role = role;
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
