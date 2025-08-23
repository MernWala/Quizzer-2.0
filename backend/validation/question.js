import { body } from "express-validator"

export const validateQuizType = (key) => body(key)
    .exists()
    .withMessage(`${key} not found!`)
    .bail()
    .custom(value => {
        const valid = ["Free", "Premium", "Restricted"]
        if (valid.indexOf(value) >= 0)
            return true
        throw new Error("Invalid quiz-type!");
    });

export const validateQuestionType = (key) => body(key)
    .optional()
    .custom(val => {
        const valid = ["single_choice", "multi_choice", "short_answer", "long_answer"]
        if (valid.indexOf(val) >= 0)
            return true
        throw new Error("Invalid question type")
    });

export const validateQuestionSection = (key) => body(key)
    .optional()
    .isString()
    .withMessage(`${key} should be a string!`)

export const validateQuestionUrlArray = (key) => body(key)
    .optional()
    .isArray()
    .withMessage(`${key} should of array type!`)
    .bail()
    .isURL()
    .withMessage(`${key} is not a valid URL`);

export const validateDate = (key) => body(key)
    .optional()
    .isDate()
    .withMessage(`${key} is invalid date formate!`)

export const validateTotalTime = (key) => body(key)
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage(`${key} must be a non-negative integer representing time in seconds.`);
