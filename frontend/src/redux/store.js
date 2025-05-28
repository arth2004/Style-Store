import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "./feauture/auth/authSlice.js";
import favouritesReducer from "./feauture/favourites/favouriteSlice.js";
import cartSliceReducer from "./feauture/cart/cartSlice.js";
import shopReducer from "./feauture/shop/shopSlice.js";
import { getFavouritesFromLocalStorage } from "../Utils/localstorage.js";
import { apiSlice } from "./api/apiSlice.js";

const initialFavourites = getFavouritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favourites: favouritesReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },
  preloadedState: {
    favourites: initialFavourites,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export default store;
