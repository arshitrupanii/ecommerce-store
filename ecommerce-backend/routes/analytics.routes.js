import express from "express"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailysaleDate } from "../controllers/analytics.controller.js";

const router = express.Router()


router.get("/", protectRoute, adminRoute, async function (req, res) {
    try {
        const analyticsData = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

        const DailySalesData = await getDailysaleDate(startDate, endDate);

        return res.status(200).json({
            analyticsData,
            DailySalesData
        })

    } catch (error) {
        console.log("error in get analytic data route : ", error);
        return res.status(500).json({ message: "Error in get analytic data." })
    }
})


export default router;