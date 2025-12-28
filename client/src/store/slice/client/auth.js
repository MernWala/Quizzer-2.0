import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND;

export const attemptAuth = createAsyncThunk(
  "auth/attemptAuth",
  async ({ varient, formData }, { rejectWithValue }) => {
    try {
      const endpoint = varient === "LOGIN" ? "signin" : "register";
      const response = await axios.post(
        `${BACKEND}/api/common/auth/manual/${endpoint}`,
        formData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND}/api/common/auth/manual/logout`,
        {},
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND}/api/common/auth/manual/password-reset/send`,
        formData
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, pass }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND}/api/common/auth/manual/password-reset/reset?token=${token}`,
        { pass }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const verifyAccount = createAsyncThunk(
  "auth/verifyAccount",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BACKEND}/api/common/auth/manual/verify?token=${token}`
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: "",
    user: null,
    role: null,
    isAuthenticated: false,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action?.payload?.user;
      state.role = action?.payload?.user?.role;
      state.isAuthenticated = action?.payload?.isAuthenticated
    },
  },
  extraReducers: (builder) => {
    builder
      // Login & register handles
      .addCase(attemptAuth.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(attemptAuth.fulfilled, (state, action) => {
        const { user } = action?.payload;
        state.user = user;
        state.role = user?.role;
        state.isAuthenticated = action?.payload?.isAuthenticated;
        state.loading = false;
      })
      .addCase(attemptAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })

      // Logout handles
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.loading = false;
        state.isAuthenticated = false;
      })

      // Password reset request handles
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })

      // Update Password handles
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      });
  },
});

export const { checkAuth, setUserDetails, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
