// Redux store configuration
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tasksReducer from "./tasksSlice";

// Combines multiple reducers into a single store:
//   auth: handles user authentication state
//   tasks: manages task-related state
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});
