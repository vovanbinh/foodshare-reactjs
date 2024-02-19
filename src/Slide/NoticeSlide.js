import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import transactionsApi from "../Api/transaction";
export const viewedNotice = createAsyncThunk(
    '/notifi-viewed',
    async (payload) => {
        try {
            const response = await transactionsApi.notifiViewed(payload);
            return response;
        } catch (error) {
            throw error;
        }
    }
);
export const viewedNoticeDonatedFood = createAsyncThunk(
    '/notifi-viewed-donatedfood',
    async (payload) => {
        try {
            const response = await transactionsApi.viewedNoticeDonatedFood(payload);
            return response;
        } catch (error) {
            throw error;
        }
    }
);
export const noticeSlice = createSlice({
    name: 'notice',
    initialState: {
        noticeItems: 0,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(viewedNotice.fulfilled, (state, action) => {
            state.noticeItems = state.noticeItems + 1;
        });
        builder.addCase(viewedNoticeDonatedFood.fulfilled, (state, action) => {
            state.noticeItems = state.noticeItems + 1;
        });
    },
});
const { actions, reducer } = noticeSlice;
export default reducer;
