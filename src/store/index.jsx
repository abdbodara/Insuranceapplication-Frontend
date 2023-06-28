import { configureStore } from "@reduxjs/toolkit";
import { insuranceApi } from "./api/insuranceApi";
const store = configureStore({
  reducer: {
    [insuranceApi.reducerPath]: insuranceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      insuranceApi.middleware,
    ),
});

export default store;
