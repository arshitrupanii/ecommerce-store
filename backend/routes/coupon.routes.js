import express from "express"
import { getCoupan, validateCoupan } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ok done
router.get("/", protectRoute, getCoupan)
router.get("/validate/:code", protectRoute, validateCoupan)


export default router