import { jwtToPayload } from "../utils/Genral.js";
import UserSchema from "../models/User.js";
import SeriesSchema from "../models/Series.js";

const getAllQuizez = async (token, includeSeries = false) => {
    try {
        const { decoded } = jwtToPayload(token);
        const user = await UserSchema.findOne({ _id: decoded?._id })
            .populate({
                path: "adminData",
                select: "quizes series",
            })
            .lean();

        if (!user) return null;

        const quizzes = user?.adminData?.quizes || [];

        let seriesQuizzes = [];
        if (includeSeries && user?.adminData?.series?.length) {
            const seriesDocs = await SeriesSchema.find({
                _id: { $in: user.adminData.series }
            })
            .select("quizes")
            .lean();

            // Flatten quizes from all series
            seriesQuizzes = seriesDocs.flatMap(s => s.quizes || []);
        }

        return [...quizzes, ...seriesQuizzes];
    } catch (error) {
        console.error("GETTING_ALL_QUIZES_ERROR - getAllQuizez.js:", error);
        return null;
    }
};

export default getAllQuizez;
