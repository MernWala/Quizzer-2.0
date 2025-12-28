import express from 'express';
import { AddQuestion, CreateQuiz, DeleteQuestion, DeleteQuiz, GetAllQuiz, GetQuizDetails, UpdateQuestion, UpdateQuiz } from '../../controllers/quiz.js';
import { validateBoolean, validateLongString, validateMongoId, validateName, validateNumber, validateStringArray } from '../../validation/bodyValidation.js';
import { validateQuizType, validateQuestionType, validateQuestionSection, validateQuestionUrlArray, validateDate, validateTotalTime } from "../../validation/question.js"
import ExpressValidator from '../../middleware/ExpressValidator.js'
import { validateMongoIdParam } from '../../validation/paramValidation.js';

const router = express.Router();

// Route 1: Creating new quiz
router.post("/",
    [
        validateName("name"), validateQuizType("quizType"), validateBoolean("visibility"),
        validateDate("publishOn"), validateTotalTime("totalTime"), validateDate("expireOn"),
        validateBoolean("sectionSwitch")
    ],
    ExpressValidator, CreateQuiz
);

// Route 2: Get all quiz short-details
router.get("/", GetAllQuiz);

// Route 3: Update a quiz
router.put("/",
    [
        validateMongoId("_id"), validateName("name"), validateQuizType("quizType"),
        validateBoolean("visibility"), validateTotalTime("totalTime"), validateBoolean("sectionSwitch"),
    ],
    ExpressValidator, UpdateQuiz
);

// Route 4: Deleting a quiz
router.delete("/:quizId",
    [validateMongoIdParam("quizId")],
    ExpressValidator, DeleteQuiz
);

// Route 4**: Deleting a quiz
router.delete("/:seriesId/:quizId",
    [validateMongoIdParam("seriesId"), validateMongoIdParam("quizId")],
    ExpressValidator, DeleteQuiz
);

// Router 5: Get particular quiz with full details
router.get("/:quizId",
    [validateMongoIdParam("quizId")], 
    ExpressValidator, GetQuizDetails
);

// Route 6: Adding questions to the quiz
router.post("/question",
    [
        validateMongoId("quizId"), validateLongString("question.question"), validateQuestionSection("question.section"),
        validateStringArray("question.options"), validateStringArray("question.answers"), validateQuestionType("question.type"),
        validateQuestionUrlArray("question.images"), validateNumber("question.marks")
    ],
    ExpressValidator, AddQuestion
);

// Route 7: Updating questions in the quiz
router.put("/question",
    [
        validateMongoId("quizId"), validateMongoId("questionId"), validateLongString("question.question"),
        validateQuestionSection("question.section"), validateStringArray("question.options"), validateQuestionUrlArray("question.images"),
        validateStringArray("question.answers"), validateQuestionType("question.type"), validateNumber("question.marks")
    ],
    ExpressValidator, UpdateQuestion
);

// Route 8: Deleting questions from the quiz
router.delete("/question/:quizId/:questionId",
    [validateMongoIdParam("quizId"), validateMongoIdParam("questionId")],
    ExpressValidator, DeleteQuestion
);

export default router;