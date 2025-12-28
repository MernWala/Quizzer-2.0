import express from "express";
import {
  CreateSeries,
  GetAllSeries,
  GetParticularSeries,
  DeleteSeries,
  UpdateSeries,
} from "../../controllers/series.js";
import {
  validateBoolean,
  validateMongoId,
  validateName,
  validateNumber,
} from "../../validation/bodyValidation.js";
import { validateDate, validateQuizType } from "../../validation/question.js";
import ExpressValidator from "../../middleware/ExpressValidator.js";
import { GetQuizDetails } from "../../controllers/quiz.js";
import { validateMongoIdParam } from "../../validation/paramValidation.js";

const router = express.Router();

// NOTE: For quiz operation (CRUD) => All operation mergerd with quiz controller and routes

// Route 1: Create new series
router.post(
  "/",
  [
    validateName("name"),
    validateQuizType("type"),
    validateBoolean("visibility"),
  ],
  ExpressValidator,
  CreateSeries
);

// Route 2: Get all series
router.get("/", GetAllSeries);

// Route 3: Get particular series with full details
router.get(
  "/:seriesId",
  [validateMongoIdParam("seriesId")],
  ExpressValidator,
  GetParticularSeries
);

// Route 4: Get quiz-details from series
router.get(
  "/:seriesId/:quizId",
  [validateMongoIdParam("seriesId"), validateMongoIdParam("quizId")],
  ExpressValidator,
  GetQuizDetails
);

// Route 5: Delete entire series
router.delete(
  "/:seriesId",
  [validateMongoIdParam("seriesId")],
  ExpressValidator,
  DeleteSeries
);

// Route 6: Update series details
router.put(
  "/",
  [
    validateMongoId("_id"),
    validateName("name"),
    validateQuizType("type"),
    validateBoolean("visibility"),
    validateNumber("totalTime"),
    validateBoolean("continuous"),
    // TODO: needs to be consider when form.js completed
    // registered
    // enquiry
  ],
  ExpressValidator,
  UpdateSeries
);

export default router;
