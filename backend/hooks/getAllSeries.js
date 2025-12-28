import { jwtToPayload } from "../utils/Genral.js";
import UserSchema from "../models/User.js"

const getAllSeries = async (token) => {
    try {

        const { decoded } = jwtToPayload(token);
        const user = await UserSchema.findOne({ _id: decoded?._id }).populate({
            path: "adminData",
            select: "series",
        }).exec();

        if (!user)
            return null;
        return user?.adminData?.series

    } catch (error) {
        console.log("GETTING_ALL_SERIES_ERROR - getAllSeries.js:18");
        return null
    }
}

export default getAllSeries;