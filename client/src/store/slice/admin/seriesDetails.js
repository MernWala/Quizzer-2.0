import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { deleteSeries } from "./series";

const backend = import.meta.env.VITE_BACKEND;

export const fetchSeriesDetails = createAsyncThunk(
  "adminSeriesDetails/fetch",
  async (seriesId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backend}/api/admin/series/${seriesId}`,
        {
          withCredentials: true,
        }
      );

      return response.data?.series;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch quizzes"
      );
    }
  }
);

export const createQuiz = createAsyncThunk(
  "adminSeriesDetails/createQuiz",
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backend}/api/admin/quiz/`,
        quizData,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "adminSdminQuiz/deleteQuiz",
  async ({ seriesId, quizId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backend}/api/admin/quiz/${seriesId}/${quizId}`,
        { withCredentials: true }
      );
      return response?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const SeriesDetails = createSlice({
  name: "quiz",
  initialState: {
    loading: false,
    data: [],
    error: "",
  },
  extraReducers: (builder) => {
    builder
      // fetch quiz details
      .addCase(fetchSeriesDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSeriesDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(
          (quiz) => quiz._id.toString() === action.payload._id.toString()
        );

        if (index === -1) {
          state.data.push(action.payload);
        } else {
          state.data[index] = action.payload;
        }
      })
      .addCase(fetchSeriesDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // create quiz
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((series) => {
          if (series?._id === action?.payload?.seriesId) {
            return {
              ...series,
              quizes: [...series.quizes, action.payload.quiz],
            };
          }
          return series;
        });
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete quiz
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = true;
        state.data = state.data.map((series) => {
          if (series?._id === action?.payload?.seriesId) {
            return {
              ...series,
              quizes: series.quizes.filter(
                (quiz) => quiz?._id !== action?.payload?.id
              ),
            };
          }
          return series;
        });
        state.loading = false;
      })

      // delete series effect
      .addCase(deleteSeries.fulfilled, (state, action) => {
        state.data = state.data.filter((s) => s?._id !== action.payload?.seriesId);
      })
  },
});

// ===================================== Custom selectors =====================================
export const getSeriesDetails = (seriesId) =>
  createSelector([(state) => state.adminSeriesDetails], (seriesDetails) => {
    const data = seriesDetails?.data?.find(
      (series) => series?._id?.toString() === seriesId.toString()
    );
    return data;
  });

export default SeriesDetails.reducer;
