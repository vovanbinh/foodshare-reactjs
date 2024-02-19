import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StorageKey from "../Constants/storage-keys";
import userApi from "../Api/userApi";
import { enqueueSnackbar } from "notistack";


export const verification = createAsyncThunk(
    'users/verification',
    async (payload) => {
        try {
            const data = await userApi.verification(payload);
            if (data.errors) {
                return data.errors;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
);
export const forgotPassword = createAsyncThunk(
    'users/forgotPassword',
    async (payload) => {
        try {
            const data = await userApi.forgotPassword(payload);
            if (data.errors) {
                return data.errors;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
);
export const NewPasswordForgotApi = createAsyncThunk(
    'users/NewPasswordForgotApi',
    async (payload) => {
        try {
            const data = await userApi.NewPasswordForgotApi(payload);
            if (data.errors) {
                return data.errors;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
);
export const verificationForgot = createAsyncThunk(
    'users/verificationForgot',
    async (payload) => {
        try {
            const data = await userApi.verificationForgot(payload);
            if (data.errors) {
                return data.errors;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
);

export const loginGoogle = createAsyncThunk(
    'users/loginGoogle',
    async (payload) => {
        try {
            const response = await userApi.loginGoogle(payload);
            if (response.errors) {
                return response.errors;
            } else {
                localStorage.setItem(StorageKey.token, response.authorization.token);
                localStorage.setItem(StorageKey.user, JSON.stringify(response.user));
                return response.user;
            }
        } catch (error) {
            throw error;
        }
    }
);
export const loginFacebook = createAsyncThunk(
    'users/loginFacebook',
    async (payload) => {
        try {
            const response = await userApi.loginFacebook(payload);
            if (response.errors) {
                return response.errors;
            } else {
                localStorage.setItem(StorageKey.token, response.authorization.token);
                localStorage.setItem(StorageKey.user, JSON.stringify(response.user));
                return response.user;
            }
        } catch (error) {
            throw error;
        }
    }
);
export const login = createAsyncThunk(
    'users/login',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await userApi.login(payload);
            if (response.unVerification) {
                return response.unVerification;
            } else {
                localStorage.setItem(StorageKey.token, response.authorization.token);
                localStorage.setItem(StorageKey.user, JSON.stringify(response.user));
                return response.user;
            }
        } catch (error) {
            return rejectWithValue(error.errors);
        }
    }
);


const initialState = {
    current: JSON.parse(localStorage.getItem(StorageKey.user)) || {},
    settings: {},
    errorMessage: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            localStorage.removeItem(StorageKey.user);
            localStorage.removeItem(StorageKey.token);
            state.current = {};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.current = action.payload;
        });
        builder.addCase(loginGoogle.fulfilled, (state, action) => {
            state.current = action.payload;
        });
        builder.addCase(loginFacebook.fulfilled, (state, action) => {
            state.current = action.payload;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.errorMessage = action.payload;
        });

    },
});

const { actions, reducer } = userSlice;
export const { logout } = actions;
export default reducer;
