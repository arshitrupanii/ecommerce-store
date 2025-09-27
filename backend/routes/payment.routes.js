import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { stripe } from "../lib/stripe.js";



const router = express.Router();


router.post("create-chckout-session", protectRoute, createCheckoutSession)

// pending still work
router.post("chckout-success", protectRoute, async function (req, res) {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === "paid"){

        }


    } catch (error) {

    }
})


export default router;