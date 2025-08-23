import express from "express";
import quizRoutes from "./quiz.js";
import seriesRotes from "./series.js";
import formRoutes from "./form.js";
import { AdminAuthorityCheck } from "../../validation/authorityCheck.js";
import { CheckIsAuthenticated } from "../../controllers/auth.js";

const router = express.Router();

// Middleware pass for admin authority check
router.use(AdminAuthorityCheck);

// Route* : It will check isAuthenticated and return {isAuthenticated: boolean, user: Object}
router.get("/check-is-admin", CheckIsAuthenticated);

// Route 1: All quiz routes
router.use("/quiz", quizRoutes);

// Route 2: All series routes
router.use("/series", seriesRotes);

// Route 2: Forms - Google form clone
router.use("/form", formRoutes);

export default router;
