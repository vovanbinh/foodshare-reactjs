import { configureStore } from '@reduxjs/toolkit'; // Correct the import statement
import useReducer from '../Slide/userSlide';
import cartReducer from '../Slide/CartSlide';
import noticeReducer from '../Slide/NoticeSlide';

const rootReducer = {
  user: useReducer,
  cart: cartReducer,
  notice: noticeReducer
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
