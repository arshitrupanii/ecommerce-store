import Product from "../schema/product.schema.js";
import User from "../schema/user.schema.js"
import Order from "../schema/order.schema.js"

export const getAnalyticsData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProduct = await Product.countDocuments();

        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null, // it group all doc together
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "totalAmount" }
                }
            }
        ])

        const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 }

        return {
            users: totalUsers,
            products: totalProduct,
            totalSales,
            totalRevenue
        }

    } catch (error) {
        console.log("error in get analytic data : ", error);
    }
}

export const getDailysaleDate = async (startDate, endDate) => {
    try {
        const DailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "totalAmount" }
                }
            },
            { $sort: { _id: 1 } }
        ])

        const dateArray = getDateInRange(startDate, endDate);

        return dateArray.map(date => {
            const foundDate = DailySalesData.find(item => item._id === date);

            return {
                date,
                sales : foundDate?.sales || 0,
                revenue : foundDate?.revenue || 0,
            }
        })

    } catch (error) {
        console.log("error in get daily sale data.");
    }
}


async function getDateInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while(currentDate <= endDate){
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}