import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

export const createQuiz = createAsyncThunk(
  "adminQuiz/createQuiz",
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

export const fetchAllQuizzes = createAsyncThunk(
  "adminQuiz/fetchAllQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backend}/api/admin/quiz`, {
        withCredentials: true,
      });
      return response.data?.quizzes || [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch quizzes"
      );
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "adminQuiz/deleteQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backend}/api/admin/quiz/${quizId}`,
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

export const updateQuiz = createAsyncThunk(
  "adminQuiz/updateQuiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${backend}/api/admin/quiz/`,
        { ...data, totalTime: 0 },
        {
          withCredentials: true,
        }
      );
      return response?.data?.update;
    } catch (err) {
      return rejectWithValue(err?.response?.data || "Something went wrong");
    }
  }
);

const QuizSlice = createSlice({
  name: "adminQuiz",
  initialState: {
    loading: false,
    data: [],
    error: "",
  },
  extraReducers: (builder) => {
    builder
      // create quiz
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload?.seriesAddOn) {
          state.data.push(action.payload?.quiz);
        }
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch all quizes
      .addCase(fetchAllQuizzes.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete quiz
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.data = state.data.filter((q) => q?._id !== action?.payload?.id);
      })

      // Update quiz
      .addCase(updateQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.data = state.data.map((q) => {
          if (q?._id === action?.payload?._id) return action?.payload;
          return quiz;
        });
        state.loading = false;
      });
  },
});

// ============================================== Custom Selectors ==============================================
export const getQuiz = (quizId) =>
  createSelector([(state) => state.adminQuiz], (quiz) => {
    const data = quiz?.data?.find(
      (quiz) => quiz?._id?.toString() === quizId.toString()
    );
    return data;
  });

export default QuizSlice.reducer;
