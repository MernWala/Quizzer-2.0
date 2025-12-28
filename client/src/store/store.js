import { configureStore } from "@reduxjs/toolkit";

import Auth from "./slice/client/auth";
import QuizReducer from "./slice/admin/quiz";
import SeriesReducer from "./slice/admin/series";
import AdminQuizDetailsReducer from "./slice/admin/quizDetails";
import AdminSeriesDetailsReducer from "./slice/admin/seriesDetails";

export const store = configureStore({
  reducer: {
    auth: Auth,
    adminQuiz: QuizReducer,
    adminQuizDetails: AdminQuizDetailsReducer,
    adminSeries: SeriesReducer,
    adminSeriesDetails: AdminSeriesDetailsReducer,
  },
});
