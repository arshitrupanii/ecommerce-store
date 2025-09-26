import { Router } from "express";
import { loginController, logoutController, signupController } from "../controllers/auth.controller.js";

const router = Router()

// all tested
router.post("/signup", signupController)
router.post("/login", loginController)
router.post("/logout", logoutController)


export default router