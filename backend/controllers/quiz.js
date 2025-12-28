import CustomError from '../middleware/ErrorMiddleware.js';
import QuizSchema from "../models/Quiz.js";
import getUser from "../hooks/getUser.js";
import AdminDataSchema from "../models/AdminData.js";
import QuestionSchema from "../models/Question.js"
import SeriesSchema from "../models/Series.js"
import getAllQuizes from '../hooks/getAllQuizes.js';
import getAllQuestions from '../hooks/getAllQuestions.js';
import getAllSeries from '../hooks/getAllSeries.js';
import mongoose from 'mongoose';

export const CreateQuiz = async (req, res) => {
    try {
        const { name, quizType, visibility, seriesId } = req.body;
        const { token } = req.cookies;

        const { error, mess, user } = await getUser(token);
        if (error) {
            return res.status(400).json({ error: true, message: mess });
        }

        const quiz = new QuizSchema({ name, quizType, visibility });
        await quiz.save();

        let seriesAddOn = false;
        if (!user.adminData) {
            const adminData = new AdminDataSchema({ quizes: [quiz._id] });
            await adminData.save();

            user.adminData = adminData._id;
            await user.save();
        } else {
            if(seriesId) {
                const allSeries = await getAllSeries(token) ?? [];                
                if(allSeries?.includes(seriesId)) {
                    await SeriesSchema.findByIdAndUpdate(seriesId, 
                        { $push: { quizes: quiz?._id } }
                    );
                    seriesAddOn = true;
                }
            } else {
                await AdminDataSchema.findByIdAndUpdate(
                    user.adminData,
                    { $push: { quizes: quiz._id } },
                );
            }
        }

        return res.status(201).json({
            success: true,
            message: `Quiz created successfully${seriesAddOn ? " to series" : ""}!`,
            seriesAddOn,
            seriesId,
            quiz,
        });
    } catch (error) {
        CustomError(error, res);
    }
};

export const AddQuestion = async (req, res) => {
    try {

        const { quizId, question: { question, section, options, answers, type, images, marks } } = req.body;

        const { token } = req.cookies;
        const quizes = await getAllQuizes(token, true);
        
        const quizIds = quizes.map(q => (q._id ? q._id.toString() : q.toString()));
        if (!quizIds?.includes(quizId)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to add questions to this quiz.",
            });
        }

        const newQuestion = new QuestionSchema({ question, section, options, answers, type, images, marks });
        await newQuestion.save();

        await QuizSchema.findByIdAndUpdate(quizId, { $push: { questions: newQuestion._id } });

        return res.status(201).json({
            success: true,
            message: "Question added successfully!",
            question: newQuestion,
        });
    } catch (error) {
        CustomError(error, res);
    }
};

export const UpdateQuestion = async (req, res) => {
    try {

        const { quizId, questionId, question: { question, section, options, answers, type, images, marks } } = req.body;
        const { token } = req.cookies;
        const quizes = await getAllQuizes(token, true);

        const quizIds = quizes.map(q => (q._id ? q._id.toString() : q.toString()));
        if (!quizIds?.includes(quizId)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update a questions from this quiz.",
            });
        }

        const allQuestions = await getAllQuestions(quizId);
        if (!allQuestions || !allQuestions.includes(questionId)) {
            return res.status(404).json({
                success: false,
                message: "Question not found.",
            });
        }

        const update = await QuestionSchema.findByIdAndUpdate(questionId, {
            question, section: section?.length === 0 ? null : section?.trim(), options, answers, type, images, marks
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Question updated successfully!",
            update,
        });

    } catch (error) {
        CustomError(error, res)
    }
};

export const DeleteQuestion = async (req, res) => {
    try {

        const { quizId, questionId } = req.params;
        const { token } = req.cookies;
        const quizes = await getAllQuizes(token, true);

        const quizIds = quizes.map(q => (q._id ? q._id.toString() : q.toString()));
        if (!quizIds?.includes(quizId)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete questions from this quiz.",
            });
        }

        const allQuestions = await getAllQuestions(quizId);
        if (!allQuestions || !allQuestions.includes(questionId)) {
            return res.status(404).json({
                success: false,
                message: "Question not found.",
            });
        }

        await QuestionSchema.findByIdAndDelete(questionId);
        await QuizSchema.findByIdAndUpdate(quizId,
            { $pull: { questions: questionId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Question deleted successfully!",
        });

    } catch (error) {
        CustomError(error, res)
    }
};

export const DeleteQuiz = async (req, res) => {
    try {
        const { seriesId, quizId } = req.params;
        const { token } = req.cookies;
        const quizes = await getAllQuizes(token, true);

        const quizIds = quizes.map(q => (q._id ? q._id.toString() : q.toString()));
        if (!quizIds?.includes(quizId)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this quiz.",
            });
        }

        const quiz = await QuizSchema.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found.",
            });
        }

        // Delete all questions associated with the quiz
        await QuestionSchema.deleteMany({ _id: { $in: quiz.questions } });

        // Delete the quiz
        await QuizSchema.findByIdAndDelete(quizId);

        // Remove the quiz reference from the admin data
        if(seriesId.length > 0) {
            await SeriesSchema.findOneAndUpdate(
                { _id: seriesId },
                { $pull: { quizes: new mongoose.Types.ObjectId(quizId) } }
            );
        } else {
            await AdminDataSchema.findOneAndUpdate(
                { quizes: quizId },                
                { $pull: { quizes: quizId } }
            );
        }

        res.status(200).json({
            success: true,
            message: "Quiz and associated questions deleted successfully!",
            id: quiz?._id,
            seriesId: seriesId ?? null
        });
    } catch (error) {
        CustomError(error, res);
    }
};

export const UpdateQuiz = async (req, res) => {
    try {

        const { _id, name, quizType, visibility, publishOn, totalTime, expireOn, sectionSwitch } = req.body
        const { token } = req.cookies;
        const quizes = await getAllQuizes(token, true);
        
        const quizIds = quizes.map(q => (q._id ? q._id.toString() : q.toString()));
        if (!quizIds?.includes(_id)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this quiz.",
            });
        }

        const update = await QuizSchema.findByIdAndUpdate({ _id }, {
            $set: {
                name, quizType, visibility, publishOn, totalTime, expireOn, sectionSwitch
            }
        }, { new: true })

        return res.json({
            success: true,
            message: "Quiz has been updated with latest chnages!",
            update
        })

    } catch (error) {
        CustomError(error, res)
    }
};

export const GetAllQuiz = async (req, res) => {
    try {
        const { token } = req.cookies;
        const quizIds = await getAllQuizes(token);

        if (!quizIds || quizIds.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No quizzes found.",
            });
        }

        const quizzes = await QuizSchema.find({ _id: { $in: quizIds } })

        return res.status(200).json({
            success: true,
            quizzes,
        });
    } catch (error) {
        CustomError(error, res);
    }
};

export const GetQuizDetails = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { token } = req.cookies;

        // Step 1: Get all accessible quizzes
        const quizes = await getAllQuizes(token, true);

        // Ensure we only have IDs (strings) for permission checking
        const quizIds = quizes.map(q => (q._id ? q._id.toString() : q.toString()));

        // Step 2: Permission check
        if (!quizIds.includes(quizId)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to view this quiz.",
            });
        }

        // Step 3: Fetch quiz details
        const quiz = await QuizSchema.findById(quizId)
            .populate("questions")
            .populate("register")
            .populate("enquiry");

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found.",
            });
        }

        // Step 4: Send response
        return res.status(200).json({
            success: true,
            quiz,
        });
    } catch (error) {
        CustomError(error, res);
    }
};