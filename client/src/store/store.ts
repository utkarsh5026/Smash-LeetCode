import { configureStore } from "@reduxjs/toolkit";
import problemListSlice from "./leetcode/slice";
import problemSlice from "./leetcode/problemSlice";

export const store = configureStore({
  reducer: {
    problemList: problemListSlice,
    problem: problemSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
