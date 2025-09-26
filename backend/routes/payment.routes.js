import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";


const router = express.Router();


router.post("create-chckout-session", protectRoute, createCheckoutSession)

// pending
router.post("chckout-success", protectRoute, createCheckoutSession)


export default router;