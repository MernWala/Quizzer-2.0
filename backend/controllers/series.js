import CustomError from "../middleware/ErrorMiddleware.js";
import getUser from "../hooks/getUser.js";
import QuizSchema from "../models/Quiz.js";
import QuestionSchema from "../models/Question.js";
import SeriesSchema from "../models/Series.js";
import AdminDataSchema from "../models/AdminData.js";
import getAllSeries from "../hooks/getAllSeries.js";
import mongoose from "mongoose";

export const CreateSeries = async (req, res) => {
  try {
    const { name, type, visibility } = req.body;
    const { token } = req.cookies;

    const { error, mess, user } = await getUser(token);
    if (error) {
      return res.status(400).json({ error: true, message: mess });
    }

    const series = new SeriesSchema({ name, type, visibility });
    await series.save();

    if (!user.adminData) {
      const adminData = new AdminDataSchema({ series: [series._id] });
      await adminData.save();

      user.adminData = adminData._id;
      await user.save();
    } else {
      await AdminDataSchema.findByIdAndUpdate(user.adminData, {
        $push: { series: series._id },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Series created successfully!",
      series,
    });
  } catch (error) {
    CustomError(error, res);
  }
};

export const GetAllSeries = async (req, res) => {
  try {
    const { token } = req.cookies;
    const seriesIds = await getAllSeries(token);

    if (!seriesIds || seriesIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No series found.",
      });
    }

    const series = await SeriesSchema.find({ _id: { $in: seriesIds } });

    return res.status(200).json({
      success: true,
      series,
    });
  } catch (error) {
    CustomError(error, res);
  }
};

export const GetParticularSeries = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const { token } = req.cookies;

    const allSeries = await getAllSeries(token);
    if (!allSeries || !allSeries.includes(seriesId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this series.",
      });
    }

    const series = await SeriesSchema.findById(seriesId).populate("quizes");

    if (!series) {
      return res.status(404).json({
        success: false,
        message: "Series not found.",
      });
    }

    return res.status(200).json({
      success: true,
      series,
    });
  } catch (error) {
    CustomError(error, res);
  }
};

export const DeleteSeries = async (req, res) => {
  try {
    const { seriesId } = req.params;

    const responseData = { seriesId: seriesId, quizes: [], questions: [] };

    const series = await SeriesSchema.findById(seriesId);
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }

    const quizIds = series.quizes || [];
    if (quizIds.length > 0) {
      const quizzes = await QuizSchema.find({ _id: { $in: quizIds } });
      const allQuestionIds = quizzes.flatMap((q) => q.questions || []);

      responseData.quizes = quizzes.map((q) => q._id);
      responseData.questions = allQuestionIds;

      if (allQuestionIds.length > 0) {
        await QuestionSchema.deleteMany({ _id: { $in: allQuestionIds } });
      }

      await QuizSchema.deleteMany({ _id: { $in: quizIds } });
    }

    await SeriesSchema.findByIdAndDelete(seriesId);
    await AdminDataSchema.findOneAndDelete(
      { _id: seriesId },
      { $pull: { series: new mongoose.Types.ObjectId(seriesId) } }
    );

    return res.status(200).json({
      ...responseData,
      message: "Series, quizzes, and related questions deleted successfully",
    });
  } catch (error) {
    CustomError(error, res);
  }
};

export const UpdateSeries = async (req, res) => {
  try {
    const { _id, ...restData } = req.body;

    const updatedSeries = await SeriesSchema.findByIdAndUpdate(
      _id,
      { $set: restData },
      { new: true }
    );

    if (!updatedSeries) {
      return res.status(404).json({ message: "Series not found" });
    }

    return res.status(200).json({
      message: "Series deleted successfully",
      update: updatedSeries,
    });
  } catch (error) {
    CustomError(error, res);
  }
};
