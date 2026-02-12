import { Router } from "express";
import { getProfile, login, logout, refreshToken, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { LoginSchema, SignupSchema } from "../schema/validator.schema.js";
import { validate } from "../validators/auth.validator.js";
import rateLimit from "express-rate-limit";

const router = Router()

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: {
        status: 429,
        message: "Too many authentication attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});


// all tested
router.post("/signup", authLimiter, validate(SignupSchema), signup)
router.post("/login", authLimiter, validate(LoginSchema), login)

router.post("/logout", logout)
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

export default router