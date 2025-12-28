import CustomError from '../middleware/ErrorMiddleware.js'
import { jwtToPayload } from '../utils/Genral.js'
import UserSchema from '../models/User.js'

const GetUserId = (token) => {
    try {
        if (!token) {
            return { error: true, status: 404, message: "Authentication token not found!" }
        }

        const { valid, decoded, error, expired } = jwtToPayload(token);
        if (!valid || error || expired) {
            return { error: true, status: 400, message: expired ? "Token has expired! Please try to register again." : "Invalid token!" }
        }

        return { error: false, status: 200, _id: decoded?._id }
    } catch (error) {
        return { error: true, status: 500, message: "Internal server error!" }
    }
}

export const ClientAuthorityCheck = async (req, res, next) => {
    try {

        const { error, status, message, _id } = GetUserId(req?.cookies?.token);
        if (error) {
            return res.status(status).json({ error, message })
        }

        const user = await UserSchema.findById({ _id });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found!"
            })
        }

        if (user?.role === "client") {
            if(user?.deactivate === true) {
                return res.status(403).json({
                    error: true,
                    message: "Account is deactivated!"
                })
            } else {
                req.user = user
                next();
            }
        } else {
            return res.status(503).json({
                error: true,
                message: "Service unavailable!"
            })
        }

    } catch (error) {
        CustomError(error, res)
    }
}

export const AdminAuthorityCheck = async (req, res, next) => {
    try {

        const { error, status, message, _id } = GetUserId(req?.cookies?.token);
        if (error) {
            return res.status(status).json({ error, message, isAuthenticated: false })
        }

        const user = await UserSchema.findById({ _id });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found!"
            })
        }

        if (user?.role === "admin" || user?.role === "super_admin") {
            if(user?.deactivate === true) {
                return res.status(403).json({
                    error: true,
                    message: "Account is deactivated!"
                })
            } else {
                req.user = user
                next();
            }
        } else {
            return res.status(503).json({
                error: true,
                message: "Service unavailable!"
            })
        }

    } catch (error) {
        CustomError(error, res)
    }
}
