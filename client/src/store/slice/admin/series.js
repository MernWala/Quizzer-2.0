import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createQuiz, deleteQuiz } from "./seriesDetails";

const backend = import.meta.env.VITE_BACKEND;

// Fetch All Series
export const fetchAllSeries = createAsyncThunk(
  "adminSeries/fetchAllSeries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backend}/api/admin/series`, {
        withCredentials: true,
      });
      return response.data?.series || [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch series"
      );
    }
  }
);

// Create Series
export const createSeries = createAsyncThunk(
  "adminSeries/createSeries",
  async (seriesData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backend}/api/admin/series`,
        seriesData,
        {
          withCredentials: true,
        }
      );
      return response.data?.series; // return created series object
    } catch (err) {
      return rejectWithValue(err?.response?.data?.error);
    }
  }
);

// Update Series
export const updateSeries = createAsyncThunk(
  "adminSeries/updateSeries",
  async ({ totalTime, ...restPayload }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${backend}/api/admin/series`,
        { ...restPayload, totalTime: totalTime ? totalTime : 0 },
        {
          withCredentials: true,
        }
      );
      return response.data; // return updated series object
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Failed to update series");
    }
  }
);

// Delete Series
export const deleteSeries = createAsyncThunk(
  "adminSeries/deleteSeries",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${backend}/api/admin/series/${id}`, {
        withCredentials: true,
      });
      return response?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete series"
      );
    }
  }
);

const SeriesReducer = createSlice({
  name: "adminSeries",
  initialState: {
    loading: false,
    data: [], // all series
    selectedSeries: null, // one series with quizzes
    error: "",
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchAllSeries.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create series
      .addCase(createSeries.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(createSeries.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update series
      .addCase(updateSeries.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSeries.fulfilled, (state, action) => {
        state.data = state.data.map((se) => {
          if (se?._id === action?.payload?.update?._id)
            return action?.payload?.update;
          return se;
        });
        state.loading = false;
      })
      .addCase(updateSeries.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false
      })

      // delete series
      .addCase(deleteSeries.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSeries.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (s) => s._id !== action.payload?.seriesId
        );
        state.loading = false;
      })
      .addCase(deleteSeries.rejected, (state, action) => {
        state.error = action.payload?.message || "Error while deleteing series";
      })

      // Add quiz reflaction in series details
      .addCase(createQuiz.fulfilled, (state, action) => {
        const { seriesId, success, quiz } = action.payload;
        if (success) {
          const series = state.data.find((s) => s._id === seriesId);
          if (series) {
            series.quizes = [...series.quizes, quiz?._id];
          }
        }
      })

      // remove quiz reflaction in series details
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        const { seriesId, success, id } = action.payload;
        if (success) {
          const series = state.data.find((s) => s._id === seriesId);
          if (series) {
            series.quizes = series.quizes.filter((q) => q !== id);
          }
        }
      });
  },
});

export default SeriesReducer.reducer;
