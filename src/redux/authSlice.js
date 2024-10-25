// Redux slice for managing authentication state
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

// Maintains user authentication state with relevant user details:
//   uid: unique user identifier
//   email: user's email address
//   displayName: user's display name
//   photoURL: user's profile picture URL
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Provides a setUser action to update the authentication state
    setUser: (state, action) => {
      if (action.payload) {
        state.user = {
          uid: action.payload.uid,
          email: action.payload.email,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
        };
      } else {
        // Returns null for user state when logged out
        state.user = null;
      }
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
