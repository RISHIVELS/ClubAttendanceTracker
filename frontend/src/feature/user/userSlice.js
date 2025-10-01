import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  try {
    const user = localStorage.getItem("user");
    if (user && user !== "null") {
      const parsedUser = JSON.parse(user);
      return {
        user: parsedUser,
        isAuthenticated: !!parsedUser,
      };
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  return {
    user: null,
    isAuthenticated: false,
  };
};

const userSlice = createSlice({
  name: "user",
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;

      // Store in localStorage
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
