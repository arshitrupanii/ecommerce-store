import { Router } from "express";
import { getProfile, loginController, logoutController, refreshToken, signupController } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router()

// all tested
router.post("/signup", signupController)
router.post("/login", loginController)
router.post("/logout", logoutController)
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

export default router