import express from "express"
import { adminRoute, protectRoute } from "../middleware/auth.middleware";
import { getAnalyticsData } from "../controllers/analytics.controller";

const router = express.Router()


router.get("/", protectRoute, adminRoute, async function (req, res) {
    try {
        const analyticsData = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

        const DailySalesData = await getDailysaleDate(startDate, endDate);

        res.json({
            analyticsData,
            DailySalesData
        })

    } catch (error) {
        console.log("error in get analytic data route.");
        return res.status(200).json({ message: "error in get analytic data route.", error: error.message })
    }
})


export default router;