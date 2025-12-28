import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteSeries } from "./series";

const backend = import.meta.env.VITE_BACKEND;

export const fetchQuizDetails = createAsyncThunk(
  "adminQuizDetails/fetch",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backend}/api/admin/quiz/${quizId}`, {
        withCredentials: true,
      });

      return response.data?.quiz;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch quizzes"
      );
    }
  }
);

export const questionAPICall = createAsyncThunk(
  "adminQuiz/createUpdateQuestion",
  async (
    { quizId, question: { questionId, editMode = null, section, ...question } },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios({
        method: editMode === true ? "PUT" : "POST",
        url: `${backend}/api/admin/quiz/question`,
        withCredentials: true,
        data: {
          questionId: editMode === true ? questionId : "",
          quizId,
          question,
          section: section ?? "",
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "adminQuiz/deleteQuestion",
  async ({ quizId, questionId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backend}/api/admin/quiz/question/${quizId}/${questionId}`,
        { withCredentials: true }
      );
      return { quizId, questionId, ...response.data };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete question"
      );
    }
  }
);

const Details = createSlice({
  name: "adminQuizDetails",
  initialState: {
    loading: false,
    data: [],
    error: "",
  },
  extraReducers: (builder) => {
    builder
      // fetch quiz details
      .addCase(fetchQuizDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizDetails.fulfilled, (state, action) => {
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
      .addCase(fetchQuizDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // add/update question to a quiz
      .addCase(questionAPICall.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(questionAPICall.fulfilled, (state, action) => {
        state.loading = false;
        const { quizId, question } = action.meta.arg;
        const newQuestion = action.payload?.question || question;

        const quizIndex = state.data.findIndex(
          (q) => q._id.toString() === quizId.toString()
        );
        if (quizIndex !== -1) {
          const questions = state.data[quizIndex].questions;
          const questionIndex = questions.findIndex(
            (q) => q._id?.toString() === newQuestion._id?.toString()
          );

          if (questionIndex !== -1) {
            questions[questionIndex] = newQuestion;
          } else {
            questions.push(newQuestion);
          }
        }
      })
      .addCase(questionAPICall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete a question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        const { quizId, questionId } = action.payload;
        const quiz = state.data.find((q) => q._id === quizId);
        if (quiz) {
          quiz.questions = quiz.questions.filter((q) => q._id !== questionId);
        }
      })

      // delete series effect
      .addCase(deleteSeries.fulfilled, (state, action) => {
        state.loading = false;
        const removed = action?.payload?.quizes || []
        state.data = state.data.filter(q => !removed.includes(q?._id))
        state.loading = true;
      });
  },
});

// ===================================== Custom selectors =====================================
export const getQuizDetails = (quizId) =>
  createSelector([(state) => state.adminQuizDetails], (quizDetails) => {
    const data = quizDetails?.data?.find(
      (quiz) => quiz?._id?.toString() === quizId.toString()
    );
    return data;
  });

export default Details.reducer;
