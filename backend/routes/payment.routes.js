import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();


router.post("create-chckout-session", protectRoute, createCheckoutSession)
// pending still work
router.post("chckout-success", protectRoute, checkoutSuccess)


export default router;