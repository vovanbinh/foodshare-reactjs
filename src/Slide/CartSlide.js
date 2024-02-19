import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartApi from "../Api/cartApi";
export const addToCart = createAsyncThunk(
    '/addtoCart',
    async (payload) => {
        try {
            const response = await cartApi.addToCartAPI(payload);
            return response;
        } catch (error) {
            throw error;
        }
    } 
);
export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
    },
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.cartItems = action.payload.total;
        });
    },
});
const {actions, reducer} = cartSlice;
export const {setQuantity, removeFromCart} = actions;
export default reducer;
